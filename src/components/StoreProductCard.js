import Link from "next/link";

import { QuickAddBtn } from "@/components/AddToCartBtn";

export default function StoreProductCard({
  product,
  categoryName = "",
  badge = null,
  featured = false,
  topAction = null,
  priorityNote = null,
}) {
  const outOfStock = !product.stock || Number(product.stock) === 0;
  const lowStock = Number(product.stock) > 0 && Number(product.stock) <= 5;

  return (
    <article className="product-card">
      {featured && <div className="featured-ribbon">Nổi bật</div>}
      {topAction}

      <div className="product-image-wrap">
        {badge && !outOfStock && <span className="product-badge">{badge}</span>}
        {outOfStock ? (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-label">Hết hàng</span>
          </div>
        ) : lowStock ? (
          <div className="product-stock-pill">Còn {product.stock}</div>
        ) : null}

        <Link
          href={`/products/${product.id}`}
          className="product-media-link"
          aria-label={`Xem chi tiết ${product.name}`}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            loading="lazy"
            decoding="async"
          />
        </Link>

        <div className="product-cart-overlay">
          <QuickAddBtn product={product} />
        </div>
      </div>

      <Link href={`/products/${product.id}`} className="product-content-link">
        <div className="product-info">
          <div className="product-info-top">
            {categoryName ? <div className="product-category-tag">{categoryName}</div> : null}
            {priorityNote ? <div className="product-priority-note">{priorityNote}</div> : null}
          </div>

          <h3 className="product-title">{product.name}</h3>

          <div className="product-bottom">
            <span className="product-price">
              {Number(product.price).toLocaleString("vi-VN")}đ
            </span>
            <span className="product-card-link">Xem chi tiết</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
