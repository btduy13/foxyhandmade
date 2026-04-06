import fs from 'fs';
import path from 'path';
import { QuickAddBtn } from "@/components/AddToCartBtn";

function getDb() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8'));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = getDb();
  const cat = db.categories.find(c => c.id === id);
  return { title: cat ? `${cat.name} — Foxy Handmade` : "Danh mục — Foxy Handmade" };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const db = getDb();
  const cat = db.categories.find(c => c.id === id);
  const products = db.products.filter(p => p.categoryId === id);
  const otherCats = db.categories.filter(c => c.id !== id);

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{cat?.name || "Danh mục"}</span>
      </div>

      {/* Header */}
      <div style={{ background: "var(--bg-section)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>{cat?.name || "Danh mục"}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{products.length} sản phẩm</p>
        </div>
        <span className="section-tag">🏷 Danh mục</span>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🛍</div>
          <p style={{ fontSize: "18px", marginBottom: "24px" }}>Chưa có sản phẩm nào trong danh mục này.</p>
          <a href="/" className="btn">← Về trang chủ</a>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(p => {
            const outOfStock = !p.stock || Number(p.stock) === 0;
            const lowStock = Number(p.stock) > 0 && Number(p.stock) <= 5;
            return (
              <div key={p.id} className="product-card">
                <a href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                  <div className="product-image-wrap">
                    {outOfStock ? <div className="out-of-stock-overlay"><span className="out-of-stock-label">Hết hàng</span></div>
                      : lowStock ? <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "var(--brand-accent)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "var(--radius-pill)", zIndex: 3 }}>Còn {p.stock}</div>
                      : null}
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

      {/* Other categories */}
      {otherCats.length > 0 && (
        <div style={{ marginTop: "48px" }}>
          <div className="section-title">
            <h2 style={{ fontSize: "18px" }}>🗂 Danh mục khác</h2>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
            {otherCats.map(c => (
              <a key={c.id} href={`/category/${c.id}`} style={{ display: "inline-flex", padding: "8px 20px", borderRadius: "var(--radius-pill)", border: "1.5px solid var(--brand-primary)", color: "var(--brand-primary)", fontWeight: "700", fontSize: "14px", transition: "all 0.2s", textDecoration: "none" }}
                onMouseEnter={undefined}
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
