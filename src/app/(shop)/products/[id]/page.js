import { supabase } from '@/lib/supabase';
import AddToCartSection from "@/components/AddToCartSection";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviews from "@/components/ProductReviews";
import { QuickAddBtn } from "@/components/AddToCartBtn";

export const dynamic = 'force-dynamic';

async function getDb() {
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('products').select('*')
  ]);
  return {
    categories: categoriesRes.data || [],
    products: productsRes.data || []
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find(p => p.id === id);
  if (!product) return { title: "Sản phẩm không tồn tại" };
  return { title: `${product.name} — Foxy Handmade`, description: product.description };
}

export default async function ProductDetails({ params }) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>😢</div>
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Sản phẩm không tìm thấy</h2>
        <a href="/" className="btn" style={{ display: "inline-flex", marginTop: "16px" }}>← Về trang chủ</a>
      </div>
    );
  }

  const category = db.categories.find(c => c.id === product.categoryId);
  const outOfStock = !product.stock || Number(product.stock) === 0;
  const lowStock = Number(product.stock) > 0 && Number(product.stock) <= 5;
  const related = db.products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 5);

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        {category && <><a href={`/category/${category.id}`}>{category.name}</a><span className="breadcrumb-sep">›</span></>}
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px", alignItems: "start" }}>

        {/* Product Image Gallery */}
        <div style={{ position: "sticky", top: "130px" }}>
          <ProductImageGallery imageUrl={product.imageUrl} images={product.images || []} />
          {outOfStock && (
            <div style={{ position: "absolute", top: "20px", left: "20px", background: "rgba(0,0,0,0.6)", color: "white", padding: "8px 16px", borderRadius: "8px", fontWeight: "700", zIndex: 10 }}>Tạm hết hàng</div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            {category ? <a href={`/category/${category.id}`} style={{ color: "var(--brand-primary)" }}>{category.name}</a> : "Uncategorized"}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "700", color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "16px" }}>
            {product.name}
          </h1>

          <div style={{ fontSize: "34px", fontWeight: "900", color: "var(--brand-accent)", marginBottom: "16px" }}>
            {Number(product.price).toLocaleString("vi-VN")}đ
          </div>

          {/* Stock status */}
          <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            {outOfStock ? (
              <span style={{ background: "#fee2e2", color: "#b91c1c", fontWeight: "700", fontSize: "13px", padding: "4px 12px", borderRadius: "var(--radius-pill)" }}>😢 Tạm hết hàng</span>
            ) : lowStock ? (
              <span style={{ background: "#fef3c7", color: "#92400e", fontWeight: "700", fontSize: "13px", padding: "4px 12px", borderRadius: "var(--radius-pill)" }}>⚡ Còn {product.stock} sản phẩm — Đặt ngay!</span>
            ) : (
              <span style={{ background: "#dcfce7", color: "#15803d", fontWeight: "700", fontSize: "13px", padding: "4px 12px", borderRadius: "var(--radius-pill)" }}>✓ Còn hàng</span>
            )}
          </div>

          <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: "32px" }}>
            {product.description}
          </p>

          <AddToCartSection product={product} />

          {/* Trust badges */}
          <div style={{ marginTop: "28px", padding: "20px 24px", background: "var(--bg-section)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              {[
                ["🎀", "Handmade 100%", "Làm tay tỉ mỉ, không hàng loạt"],
                ["🚚", "Freeship từ 300k", "Giao hàng toàn quốc"],
                ["🔄", "Đổi trả 7 ngày", "Không hài lòng, hoàn tiền"],
                ["💝", "Đóng gói xinh xắn", "Hộp quà cẩn thận"],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "13px", color: "var(--text-primary)" }}>{title}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: "64px" }}>
          <div className="section-title">
            <h2><span className="section-tag">💝 Có thể thích</span> Sản Phẩm Tương Tự</h2>
          </div>
          <div className="product-grid">
            {related.map(p => {
              const outOS = !p.stock || Number(p.stock) === 0;
              const catName = db.categories.find(c => c.id === p.categoryId)?.name || "";
              return (
                <div key={p.id} className="product-card">
                  <a href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                    <div className="product-image-wrap">
                      {outOS && <div className="out-of-stock-overlay"><span className="out-of-stock-label">Hết hàng</span></div>}
                      <img src={p.imageUrl} alt={p.name} className="product-image" />
                      <div className="product-cart-overlay"><QuickAddBtn product={p} /></div>
                    </div>
                    <div className="product-info">
                      <div className="product-category-tag">{catName}</div>
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
        </div>
      )}
    </div>
  );
}
