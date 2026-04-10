"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: "1.5px solid var(--border-color)", borderRadius: "var(--radius-sm)",
    fontSize: "15px", fontFamily: "inherit", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Liên hệ</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span className="section-tag" style={{ display: "inline-block", marginBottom: "14px" }}>💬 Liên hệ</span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "var(--text-primary)", marginBottom: "12px" }}>
          Chúng tôi luôn lắng nghe bạn
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "560px", margin: "0 auto" }}>
          Có câu hỏi, góp ý hoặc muốn đặt hàng số lượng lớn? Hãy nhắn cho chúng tôi!
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "48px", alignItems: "start" }}>
        {/* Info */}
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { icon: "📍", title: "Địa chỉ", lines: ["123 Đường X, Quận Y, TP.HCM"] },
              { icon: "📞", title: "Điện thoại", lines: ["0987.654.321", "(Thứ 2 – Thứ 7, 9:00–21:00)"] },
              { icon: "✉️", title: "Email", lines: ["hello@foxyhandmade.com"] },
              { icon: "📘", title: "Facebook", lines: ["facebook.com/foxyhandmade"] },
            ].map(info => (
              <div key={info.title} style={{
                display: "flex", gap: "16px", alignItems: "flex-start",
                padding: "20px", background: "white",
                border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "var(--radius-sm)",
                  background: "var(--bg-section)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "22px", flexShrink: 0,
                }}>
                  {info.icon}
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>{info.title}</div>
                  {info.lines.map(l => (
                    <div key={l} style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: "white", border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)", padding: "36px",
        }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
              <h3 style={{ fontSize: "22px", color: "var(--brand-red-dark)", marginBottom: "10px" }}>Gửi thành công!</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
                Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.
              </p>
              <button onClick={() => setStatus(null)} className="btn">Gửi thêm tin nhắn</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "24px", color: "var(--text-primary)" }}>
                Gửi tin nhắn cho chúng tôi
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Họ và tên *
                    </label>
                    <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                      Số điện thoại
                    </label>
                    <input type="tel" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0987 654 321" />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                    Email
                  </label>
                  <input type="email" style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>
                    Nội dung *
                  </label>
                  <textarea
                    required rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Nhập câu hỏi hoặc tin nhắn của bạn..."
                  />
                </div>
                {status === "error" && (
                  <p style={{ color: "#ef4444", fontSize: "14px" }}>⚠ Có lỗi xảy ra, vui lòng thử lại.</p>
                )}
                <button type="submit" className="btn" disabled={status === "loading"}
                  style={{ fontSize: "16px", padding: "14px", opacity: status === "loading" ? 0.7 : 1 }}>
                  {status === "loading" ? "Đang gửi..." : "💬 Gửi tin nhắn"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
