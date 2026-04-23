"use client";

import Link from "next/link";

import StoreProductCard from "@/components/StoreProductCard";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();

  return (
    <div className="container" style={{ paddingBottom: "84px" }}>
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Yêu thích</span>
      </div>

      <section className="listing-hero" style={{ marginBottom: "24px" }}>
        <span className="section-eyebrow">Danh sách lưu lại</span>
        <h1 className="listing-hero-title">Những món bạn muốn quay lại xem</h1>
        <p className="listing-hero-subtitle">
          Wishlist giúp bạn giữ lại các mẫu đang cân nhắc để so sánh hoặc chọn làm quà vào lúc thuận tiện hơn.
        </p>
        <div className="listing-hero-stats">
          <span className="listing-stat-pill">{items.length} sản phẩm đang lưu</span>
          <span className="listing-stat-pill">Chạm vào trái tim để bỏ khỏi danh sách</span>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="empty-state-card">
          <div style={{ fontSize: "54px", marginBottom: "10px" }}>🤍</div>
          <strong>Wishlist của bạn vẫn đang trống</strong>
          <p>
            Khi thấy một món ưng ý, hãy nhấn vào biểu tượng trái tim để giữ lại ở đây và so sánh sau.
          </p>
          <Link href="/search?q=" className="btn">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              priorityNote="Đã lưu"
              topAction={
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  title="Xóa khỏi yêu thích"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 10,
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.92)",
                    color: "#d14363",
                    boxShadow: "0 12px 24px rgba(45, 18, 8, 0.12)",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ❤
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
