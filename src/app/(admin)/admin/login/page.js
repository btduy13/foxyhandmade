"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Mật khẩu không đúng. Vui lòng thử lại.");
      }
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');`}</style>
      <div style={{
        background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px",
        padding: "48px 40px", width: "100%", maxWidth: "420px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🦊</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "4px" }}>
            FoxyHandmade Admin
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}>
            Nhập mật khẩu để truy cập bảng điều khiển
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoFocus
              style={{
                width: "100%", padding: "12px 16px",
                background: "rgba(255,255,255,0.08)",
                border: `1px solid ${error ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.15)"}`,
                borderRadius: "12px", color: "#fff", fontSize: "15px",
                outline: "none", boxSizing: "border-box", letterSpacing: "2px",
              }}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
              color: "#f87171", fontSize: "13px", fontWeight: "600",
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? "rgba(232,93,116,0.5)" : "linear-gradient(135deg, #e85d74, #c0392b)",
              color: "#fff", border: "none", borderRadius: "12px",
              fontWeight: "700", fontSize: "16px", cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Đang kiểm tra..." : "🔓 Đăng nhập"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none" }}>
            ← Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
