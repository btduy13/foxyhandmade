import Link from "next/link";

import StoreProductCard from "@/components/StoreProductCard";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getDb() {
  const [categoriesRes, productsRes, homepageRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("products").select("*"),
    supabase.from("homepage").select("data").eq("id", "default").single(),
  ]);

  return {
    categories: categoriesRes.data || [],
    products: productsRes.data || [],
    homepage: homepageRes.data?.data || {},
  };
}

export default async function Home() {
  const db = await getDb();
  const { categories, products } = db;
  const hp = db.homepage || {};

  const featuredIds = hp.featuredProductIds || [];
  const newArrivalsIds = hp.newArrivalsIds || [];
  const bestSellersIds = hp.bestSellersIds || [];

  const featuredProducts = featuredIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const newArrivals = newArrivalsIds.length
    ? newArrivalsIds.map((id) => products.find((product) => product.id === id)).filter(Boolean)
    : products.slice(0, 10);

  const bestSellers = bestSellersIds.length
    ? bestSellersIds.map((id) => products.find((product) => product.id === id)).filter(Boolean)
    : [...products].reverse().slice(0, 10);

  const getCategoryName = (id) => categories.find((category) => category.id === id)?.name || "";

  const heroTitle = hp.heroTitle || "Bộ sưu tập mùa này dành cho những ngày muốn thật xinh";
  const heroSubtitle =
    hp.heroSubtitle ||
    "Những món phụ kiện handmade được chọn lọc để bạn dễ phối đồ, dễ tặng quà và luôn có cảm giác đặc biệt khi mở hộp.";
  const heroCtaText = hp.heroCtaText || "Khám phá bộ sưu tập";

  const banner1Text = hp.heroBanner1Text || "Phụ kiện xinh xắn";
  const banner2Text = hp.heroBanner2Text || "Khuyên tai nhỏ nhắn";
  const banner1Cat = hp.heroBanner1CategoryId ? `/category/${hp.heroBanner1CategoryId}` : "/search?q=";
  const banner2Cat = hp.heroBanner2CategoryId ? `/category/${hp.heroBanner2CategoryId}` : "/search?q=";

  const heroBannerImg = hp.heroBannerImage || "/images/hero_banner.png";
  const banner1Img = hp.banner1Image || "/images/banner_earrings.png";
  const banner2Img = hp.banner2Image || "/images/banner_clips.png";

  const promoStrip =
    hp.promoStrip && hp.promoStrip.length === 3
      ? hp.promoStrip
      : [
          { icon: "🚚", title: "Freeship toàn quốc", subtitle: "Miễn phí vận chuyển cho đơn từ 300k." },
          { icon: "🎁", title: "Gói quà chỉn chu", subtitle: "Đóng gói đẹp mắt để bạn tặng ngay không cần sửa soạn." },
          { icon: "💝", title: "Đổi trả 7 ngày", subtitle: "Dễ dàng đổi mẫu nếu món đồ chưa đúng như mong đợi." },
        ];

  const newArrivalsTitle = hp.newArrivalsTitle || "Mới lên kệ";
  const bestSellersTitle = hp.bestSellersTitle || "Được khách chọn nhiều";
  const catEmojis = ["🌸", "🎀", "🦊", "✨", "🎁", "💖", "🌷", "🍓"];

  return (
    <div className="container" style={{ paddingBottom: "84px" }}>
      <section className="home-hero-grid">
        <div className="home-hero-main">
          <img src={heroBannerImg} alt="Foxy Handmade" />

          <div className="home-hero-copy">
            <div className="hero-copy-block">
              <span className="hero-kicker">Bộ sưu tập tuyển chọn</span>
              <h1 className="hero-copy-title">{heroTitle}</h1>
              <p className="hero-copy-text">{heroSubtitle}</p>

              <div className="hero-actions">
                <Link href="/#new-arrivals" className="btn btn-white">
                  {heroCtaText}
                </Link>
                <Link href={featuredProducts.length ? "/#featured-products" : "/search?q="} className="btn btn-outline">
                  Xem sản phẩm nổi bật
                </Link>
              </div>
            </div>

            <div className="hero-stat-grid">
              <div className="hero-stat-card">
                <strong>{products.length}+</strong>
                <span>Thiết kế đang có sẵn để bạn phối đồ hằng ngày.</span>
              </div>
              <div className="hero-stat-card">
                <strong>{categories.length}</strong>
                <span>Danh mục nhỏ xinh để tìm nhanh theo phong cách.</span>
              </div>
              <div className="hero-stat-card">
                <strong>7 ngày</strong>
                <span>Đổi trả dễ dàng nếu món quà chưa thật vừa ý.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="home-hero-side">
          <Link href={banner1Cat} className="hero-side-card">
            <img src={banner1Img} alt={banner1Text} />
            <span className="hero-side-tag">Gợi ý phối nhanh</span>
            <h2 className="hero-side-title">{banner1Text}</h2>
            <p className="hero-side-text">
              Những mẫu nhẹ nhàng, dễ đeo và phù hợp để làm quà tặng nhỏ đầy tinh tế.
            </p>
            <span className="hero-side-link">Xem ngay</span>
          </Link>

          <Link href={banner2Cat} className="hero-side-card">
            <img src={banner2Img} alt={banner2Text} />
            <span className="hero-side-tag">Best pick tuần này</span>
            <h2 className="hero-side-title">{banner2Text}</h2>
            <p className="hero-side-text">
              Thiết kế xinh, dễ phối và vừa đủ nổi bật để hoàn thiện một bộ đồ đơn giản.
            </p>
            <span className="hero-side-link">Khám phá danh mục</span>
          </Link>
        </div>
      </section>

      <section className="category-showcase">
        <div className="category-showcase-header">
          <div>
            <span className="section-eyebrow">Mua theo cảm hứng</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", lineHeight: 1.15 }}>
              Chọn nhanh đúng kiểu bạn đang tìm
            </h2>
          </div>
          <Link href="/search?q=" className="view-all-link">
            Xem toàn bộ sản phẩm
          </Link>
        </div>

        <div className="category-circles">
          {categories.map((category, index) => (
            <Link key={category.id} href={`/category/${category.id}`} className="category-circle-item">
              <div className="circle-icon">{catEmojis[index % catEmojis.length]}</div>
              <div className="circle-text">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="promo-grid">
        {promoStrip.map((item) => (
          <div key={item.title} className="promo-card">
            <div className="icon">{item.icon}</div>
            <div>
              <h4>{item.title}</h4>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {featuredProducts.length ? (
        <section id="featured-products" className="section-shell-alt">
          <div className="section-intro">
            <div className="section-copy">
              <span className="section-eyebrow">Bộ sưu tập được yêu thích</span>
              <h2>Những món khách chọn nhiều khi muốn “đeo là xinh ngay”</h2>
              <p>
                Đây là nhóm sản phẩm phù hợp để bắt đầu nếu bạn muốn chọn nhanh một món dễ dùng,
                dễ tặng và luôn tạo cảm giác được chăm chút.
              </p>
            </div>
            <div className="section-note-card">
              Shop đang ưu tiên các mẫu có form dễ phối và lên hình đẹp để bạn tìm quà nhanh hơn.
            </div>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <StoreProductCard
                key={`featured-${product.id}`}
                product={product}
                categoryName={getCategoryName(product.categoryId)}
                featured={true}
                priorityNote="Khách yêu thích"
              />
            ))}
          </div>
        </section>
      ) : null}

      <section id="new-arrivals" className="section-wrapper">
        <div className="section-intro">
          <div className="section-copy">
            <span className="section-eyebrow">Vừa cập nhật</span>
            <h2>{newArrivalsTitle}</h2>
            <p>
              Các mẫu mới nhất được đưa lên để bạn xem nhanh trong một chỗ, phù hợp cho những
              lần ghé shop muốn tìm điều gì đó mới mẻ hơn thường ngày.
            </p>
          </div>
          <Link href="/search?q=" className="view-all-link">
            Xem tất cả
          </Link>
        </div>

        <div className="product-grid">
          {newArrivals.map((product, index) => {
            const badge = index === 0 ? "Mới về" : index === 1 ? "Hot" : null;
            return (
              <StoreProductCard
                key={product.id}
                product={product}
                categoryName={getCategoryName(product.categoryId)}
                badge={featuredIds.includes(product.id) ? null : badge}
                featured={featuredIds.includes(product.id)}
                priorityNote={index < 3 ? "Lên kệ gần đây" : null}
              />
            );
          })}
        </div>
      </section>

      <section className="section-shell-alt">
        <div className="section-intro">
          <div className="section-copy">
            <span className="section-eyebrow">Khách quay lại nhiều nhất</span>
            <h2>{bestSellersTitle}</h2>
            <p>
              Những thiết kế này thường được chọn vì vừa xinh, vừa “an toàn” để mua tặng, nên rất
              hợp nếu bạn đang muốn tìm một món quà tinh tế mà không mất nhiều thời gian.
            </p>
          </div>
          <div className="section-note-card">
            Nếu chưa biết bắt đầu từ đâu, hãy ưu tiên nhóm bán chạy vì tỷ lệ khách hài lòng rất cao.
          </div>
        </div>

        <div className="product-grid">
          {bestSellers.map((product) => (
            <StoreProductCard
              key={`best-${product.id}`}
              product={product}
              categoryName={getCategoryName(product.categoryId)}
              featured={featuredIds.includes(product.id)}
              priorityNote="Được chọn nhiều"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
