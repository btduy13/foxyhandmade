"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh(); // Force refresh to apply auth state
      } else {
        setError(data.message || "Mật khẩu không đúng!");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#faf5ef", // Using existing --bg-page
      fontFamily: "'Nunito', sans-serif"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 40px rgba(107,45,31,0.1)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>🦊</div>
          <h1 style={{ color: "#6b2d1f", fontSize: "24px", fontWeight: "800", margin: "0 0 8px 0" }}>
            Quản Trị Viên
          </h1>
          <p style={{ color: "#9c6e57", fontSize: "14px", margin: 0 }}>
            Vui lòng nhập mật khẩu để vào thiết lập hệ thống.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                border: "2px solid #f0e4d8",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "#6b2d1f"}
              onBlur={(e) => e.target.style.borderColor = "#f0e4d8"}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ color: "#d9534f", fontSize: "13px", fontWeight: "700" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "16px",
              background: "#6b2d1f",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              fontFamily: "inherit",
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => !loading && (e.target.style.background = "#4a1f14")}
            onMouseOut={(e) => !loading && (e.target.style.background = "#6b2d1f")}
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>

        <div style={{ marginTop: "24px", fontSize: "12px", color: "#9c6e57" }}>
          <a href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: "600" }}>
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
