"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartSection({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = !product.stock || Number(product.stock) === 0;

  const handleAdd = () => {
    if (outOfStock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const counterStyle = {
    display: "flex",
    alignItems: "center",
    border: "1.5px solid var(--border-color)",
    borderRadius: "var(--radius-pill)",
    overflow: "hidden",
    width: "fit-content",
    marginBottom: "20px",
  };

  return (
    <div>
      {/* Quantity */}
      <p style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Số lượng</p>
      <div style={counterStyle}>
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          disabled={outOfStock}
          style={{ padding: "10px 18px", border: "none", background: "var(--bg-section)", cursor: "pointer", fontSize: "18px", fontWeight: "700", color: "var(--text-secondary)", transition: "background 0.15s" }}
        >−</button>
        <span style={{ padding: "10px 20px", fontWeight: "800", fontSize: "16px", color: "var(--text-primary)", minWidth: "50px", textAlign: "center" }}>{qty}</span>
        <button
          onClick={() => setQty(q => q + 1)}
          disabled={outOfStock}
          style={{ padding: "10px 18px", border: "none", background: "var(--bg-section)", cursor: "pointer", fontSize: "18px", fontWeight: "700", color: "var(--text-secondary)", transition: "background 0.15s" }}
        >+</button>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn btn-outline"
          style={{ flex: 1, padding: "13px", fontSize: "15px", opacity: outOfStock ? 0.5 : 1, cursor: outOfStock ? "not-allowed" : "pointer" }}
        >
          {outOfStock ? "😢 Hết hàng" : added ? "✓ Đã thêm vào giỏ!" : "🛒 Thêm vào giỏ"}
        </button>
        <a href="/cart" className="btn btn-accent" style={{ flex: 1, padding: "13px", fontSize: "15px", textAlign: "center" }}>
          Mua ngay →
        </a>
      </div>

      {added && (
        <div style={{ background: "#dcfce7", color: "#15803d", padding: "10px 16px", borderRadius: "var(--radius-sm)", fontSize: "13px", fontWeight: "600", display: "flex", gap: "10px", alignItems: "center" }}>
          <span>✓ Đã thêm {qty} sản phẩm vào giỏ hàng!</span>
          <a href="/cart" style={{ color: "#15803d", fontWeight: "800", textDecoration: "underline", marginLeft: "auto" }}>Xem giỏ →</a>
        </div>
      )}
    </div>
  );
}
