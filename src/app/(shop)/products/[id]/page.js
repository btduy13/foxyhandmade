import Link from "next/link";

import AddToCartSection from "@/components/AddToCartSection";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductReviews from "@/components/ProductReviews";
import StoreProductCard from "@/components/StoreProductCard";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getDb() {
  const [categoriesRes, productsRes, reviewsRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("products").select("*"),
    supabase.from("reviews").select("*"),
  ]);

  return {
    categories: categoriesRes.data || [],
    products: productsRes.data || [],
    reviews: reviewsRes.data || [],
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find((item) => item.id === id);

  if (!product) return { title: "Sản phẩm không tồn tại" };
  return { title: `${product.name} — Foxy Handmade`, description: product.description };
}

export default async function ProductDetails({ params }) {
  const { id } = await params;
  const db = await getDb();
  const product = db.products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>😢</div>
        <h2 style={{ fontSize: "24px", marginBottom: "12px" }}>Sản phẩm không tìm thấy</h2>
        <Link href="/" className="btn" style={{ display: "inline-flex", marginTop: "16px" }}>
          Về trang chủ
        </Link>
      </div>
    );
  }

  const category = db.categories.find((item) => item.id === product.categoryId);
  const productReviews = db.reviews.filter((review) => review.productId === product.id);
  const reviewCount = productReviews.length;
  const averageRating = reviewCount
    ? (productReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviewCount).toFixed(1)
    : null;

  const outOfStock = !product.stock || Number(product.stock) === 0;
  const lowStock = Number(product.stock) > 0 && Number(product.stock) <= 5;
  const relatedProducts = db.products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 5);

  const stockPill = outOfStock
    ? { label: "Tạm hết hàng", className: "product-soft-pill is-red" }
    : lowStock
      ? { label: `Còn ${product.stock} sản phẩm`, className: "product-soft-pill is-amber" }
      : { label: "Sẵn hàng để giao", className: "product-soft-pill is-green" };

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb-sep">›</span>
        {category ? (
          <>
            <Link href={`/category/${category.id}`}>{category.name}</Link>
            <span className="breadcrumb-sep">›</span>
          </>
        ) : null}
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="product-detail-layout">
        <div className="product-gallery-column">
          <ProductImageGallery imageUrl={product.imageUrl} images={product.images || []} />
        </div>

        <div className="product-info-column">
          <section className="product-summary-card">
            <div className="product-eyebrow">
              {category ? <Link href={`/category/${category.id}`}>{category.name}</Link> : <span>Foxy Handmade</span>}
            </div>

            <div className="product-rating-row">
              {averageRating ? (
                <>
                  <span className="product-rating-stars">★ {averageRating}</span>
                  <a href="#reviews" className="product-review-link">
                    Dựa trên {reviewCount} đánh giá
                  </a>
                </>
              ) : (
                <span className="product-review-link">Chưa có đánh giá nào, bạn có thể là người đầu tiên.</span>
              )}
            </div>

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "40px", lineHeight: 1.08, marginBottom: "14px" }}>
              {product.name}
            </h1>

            <div className="product-price-row">
              <div style={{ fontSize: "38px", fontWeight: "900", color: "var(--brand-accent)" }}>
                {Number(product.price).toLocaleString("vi-VN")}đ
              </div>
              <span className="product-soft-pill is-brown">Đóng gói đẹp mắt, phù hợp làm quà</span>
            </div>

            <div className="product-pill-row">
              <span className={stockPill.className}>{stockPill.label}</span>
              <span className="product-soft-pill is-brown">Handmade 100%</span>
              <span className="product-soft-pill is-brown">Freeship từ 300k</span>
            </div>

            <p className="product-intro">
              {product.description ||
                "Một thiết kế nhỏ xinh được hoàn thiện thủ công để bạn dễ phối đồ hằng ngày hoặc chọn làm món quà tinh tế cho người thương."}
            </p>

            <div style={{ marginTop: "22px" }}>
              <AddToCartSection product={product} />
            </div>
          </section>

          <section className="product-support-card">
            <div className="section-eyebrow">Vì sao khách yên tâm chọn món này</div>
            <div className="product-promise-grid">
              {[
                ["🎀", "Làm tay tỉ mỉ", "Từng chi tiết được hoàn thiện thủ công thay vì sản xuất đại trà."],
                ["🚚", "Giao toàn quốc", "Shop hỗ trợ lên đơn nhanh và đóng gói cẩn thận trước khi gửi đi."],
                ["🔁", "Đổi trả 7 ngày", "Nếu sản phẩm có vấn đề hoặc chưa đúng mô tả, bạn có thể đổi lại dễ dàng."],
                ["💌", "Hỗ trợ tặng quà", "Nhắn shop nếu bạn cần gợi ý phối quà hoặc chọn món phù hợp dịp đặc biệt."],
              ].map(([icon, title, description]) => (
                <div key={title} className="product-meta-card">
                  <div style={{ fontSize: "22px", marginBottom: "10px" }}>{icon}</div>
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="product-story-card">
            <div className="section-eyebrow">Thông tin nhanh</div>
            <div className="product-meta-grid">
              <div className="product-meta-card">
                <strong>Danh mục</strong>
                <span>{category?.name || "Phụ kiện handmade"}</span>
              </div>
              <div className="product-meta-card">
                <strong>Phù hợp khi</strong>
                <span>Đi học, đi làm, gặp bạn bè hoặc chọn làm quà nhỏ xinh.</span>
              </div>
              <div className="product-meta-card">
                <strong>Tình trạng</strong>
                <span>{outOfStock ? "Hiện chưa có sẵn" : `Còn ${product.stock || "nhiều"} sản phẩm trong kho`}</span>
              </div>
              <div className="product-meta-card">
                <strong>Gợi ý tiếp theo</strong>
                <span>
                  {category ? (
                    <Link href={`/category/${category.id}`} style={{ textDecoration: "underline" }}>
                      Xem thêm sản phẩm cùng danh mục
                    </Link>
                  ) : (
                    "Khám phá thêm các mẫu cùng phong cách ở trang sản phẩm."
                  )}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section id="reviews">
        <ProductReviews productId={product.id} />
      </section>

      {relatedProducts.length ? (
        <section className="section-shell-alt" style={{ marginBottom: "84px" }}>
          <div className="section-intro">
            <div className="section-copy">
              <span className="section-eyebrow">Có thể bạn cũng thích</span>
              <h2>Những mẫu cùng gu với món bạn đang xem</h2>
              <p>
                Nếu bạn đang chọn một set quà hoặc muốn phối cùng phong cách, đây là các thiết kế ở
                cùng danh mục được khách thường xem tiếp.
              </p>
            </div>
            {category ? (
              <Link href={`/category/${category.id}`} className="view-all-link">
                Xem cả danh mục
              </Link>
            ) : null}
          </div>

          <div className="product-grid">
            {relatedProducts.map((item) => (
              <StoreProductCard
                key={item.id}
                product={item}
                categoryName={category?.name || ""}
                priorityNote="Cùng phong cách"
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
