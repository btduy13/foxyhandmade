import { supabase } from '@/lib/supabase';
import { QuickAddBtn } from "@/components/AddToCartBtn";

export const dynamic = 'force-dynamic';

async function getDb() {
  const [categoriesRes, productsRes, homepageRes] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('products').select('*'),
    supabase.from('homepage').select('data').eq('id', 'default').single()
  ]);

  return {
    categories: categoriesRes.data || [],
    products: productsRes.data || [],
    homepage: homepageRes.data?.data || {}
  };
}

function ProductCard({ p, catName, badge, featured }) {
  const outOfStock = !p.stock || Number(p.stock) === 0;
  const lowStock = Number(p.stock) > 0 && Number(p.stock) <= 5;
  return (
    <div className="product-card">
      {featured && <div className="featured-ribbon">⭐ Nổi bật</div>}
      <a href={`/products/${p.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div className="product-image-wrap">
          {badge && !outOfStock && <span className="product-badge">{badge}</span>}
          {outOfStock ? (
            <div className="out-of-stock-overlay"><span className="out-of-stock-label">Hết hàng</span></div>
          ) : lowStock ? (
            <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "var(--brand-accent)", color: "#fff", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "var(--radius-pill)", zIndex: 3 }}>Còn {p.stock}</div>
          ) : null}
          <img src={p.imageUrl} alt={p.name} className="product-image" />
          <div className="product-cart-overlay">
            <QuickAddBtn product={p} />
          </div>
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
}

export default async function Home() {
  const db = await getDb();
  const { categories, products } = db;
  const hp = db.homepage || {};

  const featuredIds = hp.featuredProductIds || [];
  const newArrivalsIds = hp.newArrivalsIds || [];
  const bestSellersIds = hp.bestSellersIds || [];

  const newArrivals = newArrivalsIds.length > 0
    ? newArrivalsIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    : products;

  const bestSellers = bestSellersIds.length > 0
    ? bestSellersIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    : [...products].reverse().slice(0, 10);

  const getCatName = (id) => categories.find(c => c.id === id)?.name || "";

  // Hero config
  const heroTitle = hp.heroTitle || "Bộ Sưu Tập Mùa Hè";
  const heroSubtitle = hp.heroSubtitle || "Khám phá những thiết kế mới nhất dành riêng cho bạn";
  const heroCtaText = hp.heroCtaText || "Xem Ngay";
  const banner1Text = hp.heroBanner1Text || "Phụ Kiện Xinh Xắn";
  const banner1Cat = hp.heroBanner1CategoryId ? `/category/${hp.heroBanner1CategoryId}` : "/search?q=";
  const banner2Text = hp.heroBanner2Text || "Khuyên Tai Nhỏ Nhắn";
  const banner2Cat = hp.heroBanner2CategoryId ? `/category/${hp.heroBanner2CategoryId}` : "/search?q=";

  // Banner images from config or default
  const heroBannerImg = hp.heroBannerImage || "/images/hero_banner.png";
  const banner1Img = hp.banner1Image || "/images/banner_earrings.png";
  const banner2Img = hp.banner2Image || "/images/banner_clips.png";

  // Promo strip & section customization
  const promoStrip = hp.promoStrip && hp.promoStrip.length === 3 ? hp.promoStrip : [
    { icon: "🚚", title: "Freeship toàn quốc", subtitle: "Miễn phí vận chuyển cho đơn từ 300k" },
    { icon: "🎀", title: "Handmade 100%", subtitle: "Mỗi sản phẩm làm tay tỉ mỉ, không đại trà" },
    { icon: "💝", title: "Đổi trả trong 7 ngày", subtitle: "Cam kết chất lượng, đổi trả dễ dàng" }
  ];

  const newArrivalsTitle = hp.newArrivalsTitle || "Sản Phẩm Mới Trình Làng";
  const newArrivalsTag = hp.newArrivalsTag || "🆕 Mới Nhất";
  const bestSellersTitle = hp.bestSellersTitle || "Sản Phẩm Được Mua Nhiều Nhất";
  const bestSellersTag = hp.bestSellersTag || "🔥 Bán Chạy";

  const catEmojis = ["🌸", "🎀", "🦊", "✨", "🎁", "💖", "🌷", "🍓"];

  return (
    <div className="container">

      {/* ===== HERO ===== */}
      <div id="hero" className="hero-section">
        <div className="hero-main">
          <img src={heroBannerImg} alt="Foxy Handmade — Bộ sưu tập mới" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div className="hero-overlay">
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
            <a href="#san-pham" className="btn btn-white">{heroCtaText} →</a>
          </div>
        </div>
        <div className="hero-side">
          <a href={banner1Cat} className="hero-banner">
            <img src={banner1Img} alt={banner1Text} />
            <div className="hero-banner-overlay">
              <h3>{banner1Text}</h3>
              <span style={{ fontSize: "12px", opacity: 0.85, marginTop: "4px" }}>Xem ngay →</span>
            </div>
          </div>
          <a href={banner2Cat} className="hero-banner">
            <img src={banner2Img} alt={banner2Text} />
            <div className="hero-banner-overlay">
              <h3>{banner2Text}</h3>
              <span style={{ fontSize: "12px", opacity: 0.85, marginTop: "4px" }}>Xem ngay →</span>
            </div>
          </a>
        </div>
      </div>

      {/* ===== CATEGORY CIRCLES ===== */}
      <div className="category-circles">
        {categories.map((c, i) => (
          <a key={c.id} href={`/category/${c.id}`} className="category-circle-item">
            <div className="circle-icon">{catEmojis[i % catEmojis.length]}</div>
            <div className="circle-text">{c.name}</div>
          </a>
        ))}
      </div>

      {/* ===== PROMO STRIP ===== */}
      <div className="promo-grid">
        {promoStrip.map((item, i) => (
          <div key={i} className="promo-card">
            <div className="icon">{item.icon}</div>
            <div><h4>{item.title}</h4><p>{item.subtitle}</p></div>
          </div>
        ))}
      </div>

      {/* ===== FEATURED (if any) ===== */}
      {featuredIds.length > 0 && (() => {
        const featuredProducts = featuredIds.map(id => products.find(p => p.id === id)).filter(Boolean);
        if (!featuredProducts.length) return null;
        return (
          <div className="section-wrapper">
            <div className="section-title">
              <h2><span className="section-tag">⭐ Nổi Bật</span> Sản Phẩm Được Yêu Thích</h2>
              <a href="/search?q=" className="view-all-link">Xem tất cả →</a>
            </div>
            <div className="product-grid">
              {featuredProducts.map(p => (
                <ProductCard key={p.id + "_ft"} p={p} catName={getCatName(p.categoryId)} badge={null} featured={true} />
              ))}
            </div>
          </div>
        );
      })()}

      {/* ===== NEW ARRIVALS ===== */}
      <div id="san-pham" className="section-wrapper">
        <div className="section-title">
          <h2><span className="section-tag">{newArrivalsTag}</span> {newArrivalsTitle}</h2>
          <a href="/search?q=" className="view-all-link">Xem tất cả →</a>
        </div>
        <div className="product-grid">
          {newArrivals.map((p, i) => {
            const featured = featuredIds.includes(p.id);
            const badge = !featured ? (i === 0 ? "NEW" : i === 1 ? "HOT" : null) : null;
            return <ProductCard key={p.id} p={p} catName={getCatName(p.categoryId)} badge={badge} featured={featured} />;
          })}
        </div>
      </div>

      {/* ===== BEST SELLERS ===== */}
      <div id="ban-chay" className="section-wrapper" style={{ paddingBottom: "60px" }}>
        <div className="section-title">
          <h2><span className="section-tag">{bestSellersTag}</span> {bestSellersTitle}</h2>
          <a href="/search?q=" className="view-all-link">Xem tất cả →</a>
        </div>
        <div className="product-grid">
          {bestSellers.map(p => (
            <ProductCard key={p.id + "_bc"} p={p} catName={getCatName(p.categoryId)} badge={null} featured={featuredIds.includes(p.id)} />
          ))}
        </div>
      </div>

    </div>
  );
}
