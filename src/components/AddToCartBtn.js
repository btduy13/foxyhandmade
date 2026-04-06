"use client";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

// Used on product cards (small icon button)
export default function AddToCartBtn({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = !product.stock || Number(product.stock) === 0;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={outOfStock}
      title={outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
      style={{
        background: outOfStock ? "var(--border-color)" : added ? "#16a34a" : "var(--brand-accent)",
        color: "#fff",
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: outOfStock ? "not-allowed" : "pointer",
        transition: "background 0.25s, transform 0.15s",
        flexShrink: 0,
        boxShadow: outOfStock ? "none" : "0 2px 8px rgba(224,80,26,0.35)",
      }}
      onMouseEnter={e => { if (!outOfStock && !added) e.currentTarget.style.transform = "scale(1.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {added ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      )}
    </button>
  );
}

// Used on product cards as overlay "Chọn mua" button (hover reveal)
export function QuickAddBtn({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = !product.stock || Number(product.stock) === 0;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button onClick={handleClick} disabled={outOfStock} className="quick-add-btn">
      {added ? (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Đã thêm!</>
      ) : outOfStock ? (
        "Hết hàng"
      ) : (
        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> Chọn mua</>
      )}
    </button>
  );
}
