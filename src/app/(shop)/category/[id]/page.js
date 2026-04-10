import fs from 'fs';
import path from 'path';
import { QuickAddBtn } from "@/components/AddToCartBtn";
import SearchFilters from "@/components/SearchFilters";

function getDb() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8'));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = getDb();
  const cat = db.categories.find(c => c.id === id);
  return { title: cat ? `${cat.name} — Foxy Handmade` : "Danh mục — Foxy Handmade" };
}

export default async function CategoryPage({ params, searchParams }) {
  const { id } = await params;
  const p = await searchParams;
  const q = (p.q || "").trim().toLowerCase();
  const sort = p.sort || "newest";
  const minPrice = Number(p.minPrice) || 0;
  const maxPrice = Number(p.maxPrice) || Infinity;
  const page = Number(p.page) || 1;
  const PAGE_SIZE = 12;

  const db = getDb();
  const cat = db.categories.find(c => c.id === id);
  let results = db.products.filter(prod => prod.categoryId === id);

  // Search filter within category
  if (q) {
    results = results.filter(prod => 
      prod.name.toLowerCase().includes(q) || 
      (prod.description && prod.description.toLowerCase().includes(q))
    );
  }

  // Price range filter
  results = results.filter(prod => prod.price >= minPrice && prod.price <= maxPrice);

  // Sorting
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  else results.reverse();

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const otherCats = db.categories.filter(c => c.id !== id);

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{cat?.name || "Danh mục"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
        {/* Sidebar Filters */}
        <aside>
          <SearchFilters categories={db.categories} currentCategory={id} />
        </aside>

        {/* Main Content */}
        <div>
          <div style={{ background: "var(--bg-section)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "24px 32px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "4px" }}>
                {cat?.name || "Danh mục"}
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{totalItems} sản phẩm</p>
            </div>
            <span className="section-tag">🏷 Danh mục</span>
          </div>

          {paginatedResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>🛍</div>
              <p style={{ fontSize: "18px", marginBottom: "24px" }}>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
              <a href={`/category/${id}`} className="btn">← Xem toàn bộ danh mục</a>
            </div>
          ) : (
            <>
              <div className="product-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {paginatedResults.map(prod => {
                  const outOfStock = !prod.stock || Number(prod.stock) === 0;
                  const lowStock = Number(prod.stock) > 0 && Number(prod.stock) <= 5;
                  return (
                    <div key={prod.id} className="product-card">
                      <a href={`/products/${prod.id}`} style={{ textDecoration: "none" }}>
                        <div className="product-image-wrap">
                          {outOfStock ? <div className="out-of-stock-overlay"><span className="out-of-stock-label">Hết hàng</span></div>
                            : lowStock ? <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "var(--brand-accent)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "var(--radius-pill)", zIndex: 3 }}>Còn {prod.stock}</div>
                            : null}
                          <img src={prod.imageUrl} alt={prod.name} className="product-image" />
                          <div className="product-cart-overlay"><QuickAddBtn product={prod} /></div>
                        </div>
                        <div className="product-info">
                          <h3 className="product-title">{prod.name}</h3>
                          <div className="product-bottom">
                            <span className="product-price">{Number(prod.price).toLocaleString("vi-VN")}đ</span>
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "8px" }}>
                  {[...Array(totalPages)].map((_, i) => {
                    const pNum = i + 1;
                    const isActive = page === pNum;
                    return (
                      <a 
                        key={pNum} 
                        href={`/category/${id}?q=${q}&sort=${sort}&minPrice=${p.minPrice || ""}&maxPrice=${p.maxPrice || ""}&page=${pNum}`}
                        style={{
                          width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: "8px", border: "1px solid var(--border-color)",
                          background: isActive ? "var(--brand-primary)" : "white",
                          color: isActive ? "white" : "var(--text-primary)",
                          textDecoration: "none", fontWeight: "700",
                          transition: "all 0.2s"
                        }}
                      >
                        {pNum}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Other categories */}
          {otherCats.length > 0 && (
            <div style={{ marginTop: "64px", borderTop: "1px solid var(--border-light)", paddingTop: "48px" }}>
              <div className="section-title">
                <h2 style={{ fontSize: "18px" }}>🗂 Danh mục khác</h2>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                {otherCats.map(c => (
                  <a key={c.id} href={`/category/${c.id}`} style={{ display: "inline-flex", padding: "8px 20px", borderRadius: "var(--radius-pill)", border: "1.5px solid var(--border-color)", color: "var(--text-secondary)", fontWeight: "600", fontSize: "14px", transition: "all 0.2s", textDecoration: "none" }}>
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
