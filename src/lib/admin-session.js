import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "foxy_admin_session";
export const LEGACY_ADMIN_COOKIE = "foxy_admin_token";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24;

const SESSION_SCOPE = "foxy-admin-session-v1";
const ADMIN_AUTH_NOT_CONFIGURED = "Admin authentication is not configured.";

function getAdminAuthConfig() {
  return {
    password: process.env.ADMIN_PASSWORD?.trim() || "",
    sessionSecret: process.env.ADMIN_SESSION_SECRET?.trim() || "",
  };
}

export function getAdminAuthErrorMessage() {
  const { password, sessionSecret } = getAdminAuthConfig();
  if (!password || !sessionSecret) {
    return ADMIN_AUTH_NOT_CONFIGURED;
  }

  return null;
}

export function isAdminAuthConfigured() {
  return getAdminAuthErrorMessage() === null;
}

export function isValidAdminPassword(password) {
  const { password: adminPassword } = getAdminAuthConfig();
  return Boolean(adminPassword) && password === adminPassword;
}

function signSession(expiresAt) {
  const { sessionSecret } = getAdminAuthConfig();

  return createHmac("sha256", sessionSecret)
    .update(`${SESSION_SCOPE}:${expiresAt}`)
    .digest("base64url");
}

function safeEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") {
    return false;
  }

  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createAdminSessionToken() {
  if (!isAdminAuthConfigured()) {
    return null;
  }

  const expiresAt = String(Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS);
  return `${expiresAt}.${signSession(expiresAt)}`;
}

export function verifyAdminSessionToken(token) {
  if (!isAdminAuthConfigured() || typeof token !== "string") {
    return false;
  }

  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0) {
    return false;
  }

  const expiry = Number(expiresAt);
  if (!Number.isInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  return safeEqual(signature, signSession(expiresAt));
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
    priority: "high",
  };
}

export function clearAdminSession(response) {
  const expiredCookieOptions = {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  };

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    ...expiredCookieOptions,
  });

  response.cookies.set({
    name: LEGACY_ADMIN_COOKIE,
    value: "",
    ...expiredCookieOptions,
  });

  return response;
}
