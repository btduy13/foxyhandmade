"use client";
import { useState, useEffect, useCallback } from "react";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      setReviews(await res.json());
    } catch {}
    setLoading(false);
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productId }),
      });
      if (res.ok) {
        setForm({ name: "", rating: 5, comment: "" });
        setShowForm(false);
        fetchReviews();
      }
    } catch {}
    setSubmitting(false);
  };

  if (loading) return <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "20px 0" }}>Đang tải đánh giá...</div>;

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  return (
    <div style={{ marginTop: "48px", borderTop: "1px solid var(--border-light)", paddingTop: "48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "var(--text-primary)", marginBottom: "8px" }}>
            Đánh giá khách hàng
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ color: "var(--brand-accent)", fontSize: "18px", fontWeight: "800" }}>{avgRating} ★</div>
            <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>Dựa trên {reviews.length} đánh giá</div>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-outline" 
          style={{ padding: "10px 20px", fontSize: "14px" }}
        >
          {showForm ? "✕ Đóng" : "✍ Viết đánh giá"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "var(--bg-section)", borderRadius: "var(--radius-md)", padding: "28px", border: "1px solid var(--border-color)", marginBottom: "40px", animation: "slideIn 0.3s ease" }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>Gửi đánh giá của bạn</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>Tên của bạn *</label>
                  <input required style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border-color)", borderRadius: "8px", outline: "none" }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>Xếp hạng *</label>
                  <select style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border-color)", borderRadius: "8px", background: "white" }} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} ★ — {v === 5 ? "Rất hài lòng" : v === 4 ? "Hài lòng" : v === 3 ? "Bình thường" : "Không hài lòng"}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px", fontWeight: "600" }}>Bình luận *</label>
                <textarea required rows={4} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border-color)", borderRadius: "8px", resize: "vertical" }} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." />
              </div>
              <button type="submit" className="btn" disabled={submitting} style={{ background: "var(--brand-primary)", padding: "12px", fontSize: "14px" }}>
                {submitting ? "Đang gửi..." : "✈ Gửi đánh giá"}
              </button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "15px" }}>
          Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {sortedReviews.map(r => (
            <div key={r.id} style={{ display: "flex", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid var(--border-light)" }}>
              <div style={{ width: "48px", height: "48px", background: "var(--bg-section)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "800", color: "var(--brand-primary)", flexShrink: 0 }}>
                {r.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ fontWeight: "700", color: "var(--text-primary)" }}>{r.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(r.createdAt || Date.now()).toLocaleDateString("vi-VN")}</div>
                </div>
                <div style={{ color: "var(--brand-accent)", fontSize: "13px", marginBottom: "8px" }}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>{r.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
