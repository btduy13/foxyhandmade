"use client";

import Link from "next/link";
import { useState } from "react";

import { WishlistBtn } from "@/components/AddToCartBtn";
import { useCart } from "@/context/CartContext";

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

  return (
    <div className="cart-cta-shell">
      <div className="qty-label-row">
        <p>Số lượng</p>
        <span>{outOfStock ? "Tạm hết hàng" : "Có thể điều chỉnh sau trong giỏ hàng"}</span>
      </div>

      <div className="qty-stepper">
        <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} disabled={outOfStock}>
          −
        </button>
        <span className="qty-stepper-value">{qty}</span>
        <button type="button" onClick={() => setQty((value) => value + 1)} disabled={outOfStock}>
          +
        </button>
      </div>

      <div className="cart-cta-row">
        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn btn-accent"
          style={{
            flex: 1,
            minHeight: "52px",
            opacity: outOfStock ? 0.58 : 1,
            cursor: outOfStock ? "not-allowed" : "pointer",
          }}
        >
          {outOfStock ? "Hết hàng" : added ? `Đã thêm ${qty} sản phẩm` : "Thêm vào giỏ"}
        </button>

        <Link href="/cart" className="btn btn-outline buy-now-link">
          Mua ngay
        </Link>

        <WishlistBtn
          product={product}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background: "#fff",
            border: "1px solid rgba(107, 45, 31, 0.12)",
            boxShadow: "none",
          }}
        />
      </div>

      <div className="cart-cta-note">
        <span>Giao toàn quốc từ 2–5 ngày</span>
        <span>Đóng gói đẹp như quà tặng</span>
        <span>Hỗ trợ đổi trả trong 7 ngày</span>
      </div>

      {added ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "12px 14px",
            borderRadius: "16px",
            background: "#dcfce7",
            color: "#166534",
            fontSize: "13px",
            fontWeight: "800",
          }}
        >
          <span>Đã thêm {qty} sản phẩm vào giỏ hàng của bạn.</span>
          <Link href="/cart" style={{ textDecoration: "underline" }}>
            Xem giỏ
          </Link>
        </div>
      ) : null}
    </div>
  );
}
