import fs from 'fs';
import path from 'path';
import { QuickAddBtn } from "@/components/AddToCartBtn";

function getDb() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8'));
}

export async function generateMetadata({ searchParams }) {
  const q = (await searchParams).q || "";
  return { title: q ? `Tìm "${q}" — Foxy Handmade` : "Tìm kiếm — Foxy Handmade" };
}

export default async function SearchPage({ searchParams }) {
  const q = ((await searchParams).q || "").trim().toLowerCase();
  const db = getDb();

  const results = q
    ? db.products.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)))
    : db.products;

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{q ? `Kết quả cho "${q}"` : "Tất cả sản phẩm"}</span>
      </div>

      <div style={{ background: "var(--bg-section)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "24px 32px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
            {q ? `Kết quả tìm kiếm "${q}"` : "Tất cả sản phẩm"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{results.length} sản phẩm</p>
        </div>
        <span className="section-tag">🔍 Tìm kiếm</span>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
          <p style={{ fontSize: "18px", color: "var(--text-muted)", marginBottom: "24px" }}>Không tìm thấy sản phẩm nào cho <strong>"{q}"</strong></p>
          <a href="/" className="btn">← Về trang chủ</a>
        </div>
      ) : (
        <div className="product-grid">
          {results.map(p => {
            const catName = db.categories.find(c => c.id === p.categoryId)?.name || "—";
            const outOfStock = !p.stock || Number(p.stock) === 0;
            return (
              <div key={p.id} className="product-card">
                <a href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
                  <div className="product-image-wrap">
                    {outOfStock && <div className="out-of-stock-overlay"><span className="out-of-stock-label">Hết hàng</span></div>}
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
      )}
    </div>
  );
}
