import fs from 'fs';
import path from 'path';

// Local storage helper for Server Components
function getDb() {
  const fileData = fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8');
  return JSON.parse(fileData);
}

export default async function Home() {
  const db = getDb();
  const { categories, products } = db;

  return (
    <>
      {/* Hero Section Container */}
      <section className="container">
        <div className="hero-section">
          <div className="hero-main" style={{ 
            display: "flex", alignItems: "center", justifyContent: "center", 
            background: "linear-gradient(135deg, var(--brand-red) 0%, var(--brand-red-light) 100%)",
            color: "white", padding: "40px"
          }}>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "40px", marginBottom: "16px", fontWeight: "800" }}>Bộ Sưu Tập Mùa Hè</h2>
              <p style={{ fontSize: "18px", marginBottom: "24px", opacity: "0.9" }}>Khám phá những thiết kế mới nhất dành riêng cho bạn</p>
              <button className="btn" style={{ backgroundColor: "white", color: "var(--brand-red)" }}>Xem Ngay</button>
            </div>
          </div>
          <div className="hero-side">
            <div className="hero-banner" style={{ 
              display: "flex", alignItems: "center", justifyContent: "center", 
              background: "#ebd1cc", padding: "20px", color: "var(--brand-red-dark)"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Phụ Kiện Xinh xắn</h3>
            </div>
            <div className="hero-banner" style={{ 
              display: "flex", alignItems: "center", justifyContent: "center", 
              background: "#f4e4e1", padding: "20px", color: "var(--brand-red-dark)"
            }}>
              <h3 style={{ fontSize: "20px", fontWeight: "700" }}>Khuyên Tai Nhỏ Nhắn</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Category Circles */}
      <section className="container">
        <div className="category-circles">
          {categories.map((c, index) => {
            const emojis = ["🌸", "🎀", "🦊", "✨", "🎁", "💖"];
            const emoji = emojis[index % emojis.length];
            return (
              <div key={c.id} className="category-circle-item">
                <div className="circle-icon">
                  {emoji}
                </div>
                <div className="circle-text">{c.name}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Grids */}
      <section className="container" style={{ paddingBottom: "60px" }}>
        <div className="section-title">
          <h2>Sản Phẩm Mới Trình Làng</h2>
          <a href="#" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Xem tất cả →</a>
        </div>
        
        <div className="product-grid">
          {products.map((p, i) => {
             const catName = categories.find(c => c.id === p.categoryId)?.name || "Uncategorized";
             const isNew = i < 2;
             const isHot = i >= 2 && i < 4;
             
             return (
              <a href={`/products/${p.id}`} key={p.id} className="product-card">
                <div className="product-image-wrap">
                  {isNew && <span className="product-badge">NEW</span>}
                  {isHot && <span className="product-badge" style={{ backgroundColor: "#ff5e00" }}>HOT</span>}
                  {/* We are continuing to use p.imageUrl which are placeholders currently */}
                  <img src={p.imageUrl} alt={p.name} className="product-image" />
                </div>
                <div className="product-info">
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    {catName}
                  </div>
                  <h3 className="product-title">{p.name}</h3>
                  <div className="product-bottom">
                    <span className="product-price">{p.price.toLocaleString()}đ</span>
                    <button className="add-cart-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: "80px" }}>
        <div className="section-title">
          <h2>Sản Phẩm Bán Chạy</h2>
          <a href="#" style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Xem tất cả →</a>
        </div>
        
        <div className="product-grid">
          {/* Re-using same products for demo purpose, reversed */}
          {[...products].reverse().slice(0, 5).map((p, i) => {
             const catName = categories.find(c => c.id === p.categoryId)?.name || "Uncategorized";
             return (
              <a href={`/products/${p.id}`} key={p.id + "_best"} className="product-card">
                <div className="product-image-wrap">
                  <img src={p.imageUrl} alt={p.name} className="product-image" />
                </div>
                <div className="product-info">
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    {catName}
                  </div>
                  <h3 className="product-title">{p.name}</h3>
                  <div className="product-bottom">
                    <span className="product-price">{p.price.toLocaleString()}đ</span>
                    <button className="add-cart-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
