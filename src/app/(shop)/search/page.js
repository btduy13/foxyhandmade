import { supabase } from '@/lib/supabase';
import { QuickAddBtn } from "@/components/AddToCartBtn";
import SearchFilters from "@/components/SearchFilters";

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

export async function generateMetadata({ searchParams }) {
  const p = await searchParams;
  const q = p.q || "";
  return { title: q ? `Tìm "${q}" — Foxy Handmade` : "Tìm kiếm — Foxy Handmade" };
}

export default async function SearchPage({ searchParams }) {
  const p = await searchParams;
  const q = (p.q || "").trim().toLowerCase();
  const sort = p.sort || "newest";
  const cat = p.cat || "";
  const minPrice = Number(p.minPrice) || 0;
  const maxPrice = Number(p.maxPrice) || Infinity;
  const page = Number(p.page) || 1;
  const PAGE_SIZE = 12;

  const db = await getDb();
  let results = [...db.products];

  // Search filter
  if (q) {
    results = results.filter(prod => 
      prod.name.toLowerCase().includes(q) || 
      (prod.description && prod.description.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (cat) {
    results = results.filter(prod => prod.categoryId === cat);
  }

  // Price range filter
  results = results.filter(prod => prod.price >= minPrice && prod.price <= maxPrice);

  // Sorting
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  else results.reverse(); // newest by default (assuming original order is oldest first)

  // Pagination
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{q ? `Tìm "${q}"` : "Sản phẩm"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" }}>
        {/* Sidebar Filters */}
        <aside>
          <SearchFilters categories={db.categories} />
        </aside>

        {/* Main Content */}
        <div>
          <div style={{ background: "var(--bg-section)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "2px" }}>
                {q ? `Kết quả tìm kiếm "${q}"` : "Khám phá tất cả sản phẩm"}
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Tìm thấy {totalItems} sản phẩm</p>
            </div>
          </div>

          {paginatedResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontSize: "18px", color: "var(--text-muted)", marginBottom: "24px" }}>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
              <button 
                onClick={() => {}} // This should be handled by clearing SearchFilters
                className="btn"
              >← Xem tất cả sản phẩm</button>
            </div>
          ) : (
            <>
              <div className="product-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {paginatedResults.map(p => {
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

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div style={{ marginTop: "48px", display: "flex", justifyContent: "center", gap: "8px" }}>
                  {[...Array(totalPages)].map((_, i) => {
                    const pNum = i + 1;
                    const isActive = page === pNum;
                    return (
                      <a 
                        key={pNum} 
                        href={`/search?q=${q}&cat=${cat}&sort=${sort}&minPrice=${p.minPrice || ""}&maxPrice=${p.maxPrice || ""}&page=${pNum}`}
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
        </div>
      </div>
    </div>
  );
}
