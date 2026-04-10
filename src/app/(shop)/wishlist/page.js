"use client";
import { useWishlist } from "@/context/WishlistContext";
import { QuickAddBtn } from "@/components/AddToCartBtn";

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist();

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Yêu thích</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "800", textTransform: "uppercase", color: "var(--text-primary)" }}>
          ❤️ Sản phẩm yêu thích ({items.length})
        </h1>
        {items.length > 0 && (
          <a href="/" style={{ color: "var(--text-muted)", fontSize: "14px" }}>← Tiếp tục mua sắm</a>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🤍</div>
          <h2 style={{ fontSize: "22px", color: "var(--text-muted)", marginBottom: "12px" }}>Chưa có sản phẩm yêu thích</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "28px", fontSize: "15px" }}>
            Nhấn biểu tượng ❤️ trên bất kỳ sản phẩm nào để thêm vào đây.
          </p>
          <a href="/" className="btn">← Khám phá sản phẩm</a>
        </div>
      ) : (
        <div className="product-grid">
          {items.map(p => {
            const outOfStock = !p.stock || Number(p.stock) === 0;
            return (
              <div key={p.id} className="product-card" style={{ position: "relative" }}>
                {/* Remove from wishlist */}
                <button
                  onClick={() => toggleWishlist(p)}
                  title="Xóa khỏi yêu thích"
                  style={{
                    position: "absolute", top: "10px", right: "10px", zIndex: 10,
                    width: "32px", height: "32px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)", border: "none",
                    cursor: "pointer", fontSize: "16px", display: "flex",
                    alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  ❤️
                </button>
                <a href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                  <div className="product-image-wrap">
                    {outOfStock && <div className="out-of-stock-overlay"><span className="out-of-stock-label">Hết hàng</span></div>}
                    <img src={p.imageUrl} alt={p.name} className="product-image" />
                    <div className="product-cart-overlay"><QuickAddBtn product={p} /></div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{p.name}</h3>
                    <div className="product-bottom">
                      <span className="product-price">{Number(p.price).toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
