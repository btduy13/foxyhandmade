"use client";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQty, clearCart, totalPrice: subtotal } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [shippingFee, setShippingFee] = useState(30000);

  // Constants (should ideally fetch from /api/settings if we had one, but we use db.json defaults)
  const FREE_SHIPPING_THRESHOLD = 300000;
  const FLAT_RATE_SHIPPING = 30000;

  useEffect(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0) {
      setShippingFee(0);
    } else {
      setShippingFee(FLAT_RATE_SHIPPING);
    }
  }, [subtotal, items.length]);

  const discount = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.floor(subtotal * (appliedCoupon.value / 100));
    }
    return appliedCoupon.value;
  })();

  const finalTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode) return;

    try {
      const res = await fetch(`/api/coupons`);
      const coupons = await res.json();
      const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);

      if (!coupon) {
        setCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        setAppliedCoupon(null);
        return;
      }

      if (subtotal < (coupon.minOrder || 0)) {
        setCouponError(`Đơn hàng tối thiểu ${(coupon.minOrder).toLocaleString("vi-VN")}đ để sử dụng mã này.`);
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError("");
    } catch {
      setCouponError("Có lỗi xảy ra khi kiểm tra mã.");
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
          subtotal,
          shippingFee,
          discount,
          couponCode: appliedCoupon?.code || null,
          total: finalTotal,
          createdAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        clearCart();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
        <h2 style={{ fontSize: "28px", color: "var(--brand-red-dark)", marginBottom: "12px" }}>Đặt hàng thành công!</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>Cảm ơn bạn đã mua hàng tại Foxy Handmade.</p>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>Chúng tôi sẽ liên hệ với bạn qua số điện thoại <strong>{form.phone}</strong> sớm nhất!</p>
        <a href="/" className="btn">← Tiếp tục mua sắm</a>
      </div>
    );
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)",
    fontSize: "15px", fontFamily: "inherit", outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div className="container" style={{ padding: "40px 20px 80px" }}>
      <style>{`
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
          .cart-item { flex-wrap: wrap; }
          .cart-item-img { width: 64px !important; height: 64px !important; }
          .cart-item-right { flex-direction: row !important; align-items: center !important; width: 100%; justify-content: space-between; margin-top: 8px; }
        }
      `}</style>
      <div style={{ marginBottom: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
        <a href="/" style={{ color: "var(--text-muted)" }}>Trang chủ</a>
        <span style={{ margin: "0 8px" }}>›</span>
        <span>Giỏ hàng</span>
      </div>

      <h1 style={{ fontSize: "24px", fontWeight: "800", textTransform: "uppercase", marginBottom: "32px", color: "var(--text-primary)" }}>
        🛒 Giỏ hàng của bạn
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🛒</div>
          <p style={{ fontSize: "18px", marginBottom: "24px" }}>Giỏ hàng trống</p>
          <a href="/" className="btn">← Khám phá sản phẩm</a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(0, 420px)", gap: "40px", alignItems: "start" }} className="cart-layout">

          {/* Cart Items */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map(item => (
                <div key={item.id} className="cart-item" style={{
                  display: "flex", gap: "16px", padding: "16px",
                  border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)",
                  background: "white", alignItems: "center",
                }}>
                  <a href={`/products/${item.id}`}>
                    <img src={item.imageUrl} alt={item.name} className="cart-item-img" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                  </a>
                  <div style={{ flex: 1 }}>
                    <a href={`/products/${item.id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>{item.name}</h3>
                    </a>
                    <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--brand-red)", marginBottom: "12px" }}>
                      {Number(item.price).toLocaleString("vi-VN")}đ
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: "30px", height: "30px", border: "1px solid var(--border-color)", borderRadius: "6px", background: "var(--bg-color)", cursor: "pointer", fontWeight: "700", fontSize: "16px" }}>−</button>
                      <span style={{ minWidth: "28px", textAlign: "center", fontWeight: "700" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: "30px", height: "30px", border: "1px solid var(--border-color)", borderRadius: "6px", background: "var(--bg-color)", cursor: "pointer", fontWeight: "700", fontSize: "16px" }}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-right" style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontWeight: "700", color: "var(--brand-red-dark)", fontSize: "16px", marginBottom: "12px" }}>
                      {(Number(item.price) * item.qty).toLocaleString("vi-VN")}đ
                    </p>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "22px", lineHeight: "1" }} title="Xóa">×</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <a href="/" style={{ color: "var(--text-secondary)", fontSize: "14px" }}>← Tiếp tục mua sắm</a>
              <button onClick={clearCart} style={{ background: "none", border: "1px solid #ddd", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", color: "var(--text-secondary)", fontSize: "14px" }}>
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* Order Summary + Form */}
          <div>
            {/* Promo Code */}
            <div style={{ background: "white", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "20px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px" }}>Mã giảm giá</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  placeholder="Nhập mã..." 
                  style={{ ...inputStyle, flex: 1 }} 
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value)}
                />
                <button 
                  onClick={handleApplyCoupon} 
                  style={{ background: "var(--brand-primary)", color: "white", border: "none", padding: "0 16px", borderRadius: "var(--radius-sm)", fontWeight: "700", cursor: "pointer" }}
                >
                  Áp dụng
                </button>
              </div>
              {couponError && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>{couponError}</p>}
              {appliedCoupon && (
                <div style={{ marginTop: "12px", background: "#fdf2f2", padding: "8px 12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--brand-red-dark)", fontWeight: "700" }}>✓ {appliedCoupon.code}</span>
                  <button onClick={() => setAppliedCoupon(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: "700" }}>×</button>
                </div>
              )}
            </div>

            {/* Total Calculation */}
            <div style={{ background: "white", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>Tóm tắt đơn hàng</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "var(--text-secondary)" }}>
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "var(--text-secondary)" }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: shippingFee === 0 ? "#16a34a" : "inherit", fontWeight: shippingFee === 0 ? "700" : "normal" }}>
                    {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", color: "#16a34a", fontWeight: "600" }}>
                    <span>Giảm giá ({appliedCoupon?.code})</span>
                    <span>-{(discount).toLocaleString("vi-VN")}đ</span>
                  </div>
                )}
                <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "4px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "20px", color: "var(--brand-red-dark)" }}>
                  <span>Tổng cộng</span>
                  <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div style={{ marginTop: "16px", padding: "10px", background: "#fff9f2", borderRadius: "8px", border: "1px solid #ffe8cc", fontSize: "12px", color: "#d97706" }}>
                  💡 Mua thêm <strong>{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("vi-VN")}đ</strong> để được <strong>Miễn phí vận chuyển</strong>!
                </div>
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrder} style={{ background: "white", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px" }}>Thông tin đặt hàng</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Họ và tên *</label>
                  <input required style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Số điện thoại *</label>
                  <input required type="tel" style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0987 654 321" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Địa chỉ giao hàng *</label>
                  <input required style={inputStyle} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/TP" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Ghi chú</label>
                  <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Ghi chú cho shop (không bắt buộc)..." />
                </div>
                {status === "error" && (
                  <p style={{ color: "#ef4444", fontSize: "14px" }}>⚠ Có lỗi xảy ra, vui lòng thử lại.</p>
                )}
                <button
                  type="submit"
                  className="btn"
                  style={{ fontSize: "16px", padding: "14px", width: "100%", opacity: status === "loading" ? 0.7 : 1 }}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Đang gửi..." : "🛍 Đặt hàng ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
