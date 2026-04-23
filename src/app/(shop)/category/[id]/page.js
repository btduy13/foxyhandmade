import Link from "next/link";

import SearchFilters from "@/components/SearchFilters";
import StoreProductCard from "@/components/StoreProductCard";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getDb() {
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("products").select("*"),
  ]);

  return {
    categories: categoriesRes.data || [],
    products: productsRes.data || [],
  };
}

function buildCategoryHref(categoryId, values) {
  const params = new URLSearchParams();

  if (values.q) params.set("q", values.q);
  if (values.sort && values.sort !== "newest") params.set("sort", values.sort);
  if (values.minPrice) params.set("minPrice", values.minPrice);
  if (values.maxPrice) params.set("maxPrice", values.maxPrice);
  if (values.page && values.page !== 1) params.set("page", String(values.page));

  const query = params.toString();
  return query ? `/category/${categoryId}?${query}` : `/category/${categoryId}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = await getDb();
  const category = db.categories.find((item) => item.id === id);
  return { title: category ? `${category.name} — Foxy Handmade` : "Danh mục — Foxy Handmade" };
}

export default async function CategoryPage({ params, searchParams }) {
  const { id } = await params;
  const queryParams = await searchParams;
  const q = (queryParams.q || "").trim().toLowerCase();
  const sort = queryParams.sort || "newest";
  const minPrice = Number(queryParams.minPrice) || 0;
  const maxPrice = Number(queryParams.maxPrice) || Infinity;
  const page = Number(queryParams.page) || 1;
  const PAGE_SIZE = 12;

  const db = await getDb();
  const category = db.categories.find((item) => item.id === id);

  let results = db.products.filter((product) => product.categoryId === id);

  if (q) {
    results = results.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q))
    );
  }

  results = results.filter((product) => product.price >= minPrice && product.price <= maxPrice);

  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  else results.reverse();

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const otherCategories = db.categories.filter((item) => item.id !== id).slice(0, 6);

  const activeFilters = [
    q
      ? {
          label: `Từ khóa: ${queryParams.q}`,
          href: buildCategoryHref(id, {
            sort,
            minPrice: queryParams.minPrice || "",
            maxPrice: queryParams.maxPrice || "",
          }),
        }
      : null,
    queryParams.minPrice
      ? {
          label: `Từ ${Number(queryParams.minPrice).toLocaleString("vi-VN")}đ`,
          href: buildCategoryHref(id, {
            q: queryParams.q || "",
            sort,
            maxPrice: queryParams.maxPrice || "",
          }),
        }
      : null,
    queryParams.maxPrice
      ? {
          label: `Đến ${Number(queryParams.maxPrice).toLocaleString("vi-VN")}đ`,
          href: buildCategoryHref(id, {
            q: queryParams.q || "",
            sort,
            minPrice: queryParams.minPrice || "",
          }),
        }
      : null,
    sort !== "newest"
      ? {
          label: sort === "price-asc" ? "Giá tăng dần" : "Giá giảm dần",
          href: buildCategoryHref(id, {
            q: queryParams.q || "",
            minPrice: queryParams.minPrice || "",
            maxPrice: queryParams.maxPrice || "",
          }),
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{category?.name || "Danh mục"}</span>
      </div>

      <section className="listing-hero">
        <span className="section-eyebrow">Duyệt theo danh mục</span>
        <h1 className="listing-hero-title">{category?.name || "Danh mục sản phẩm"}</h1>
        <p className="listing-hero-subtitle">
          {q
            ? `Foxy đã lọc riêng những mẫu thuộc danh mục này và khớp với từ khóa “${queryParams.q}”.`
            : `Những thiết kế thuộc nhóm ${category?.name || "này"} đang được sắp xếp gọn để bạn chọn nhanh món phù hợp.`}
        </p>

        <div className="listing-hero-stats">
          <span className="listing-stat-pill">{totalItems} sản phẩm trong danh mục</span>
          <span className="listing-stat-pill">
            {sort === "newest" ? "Ưu tiên mẫu mới" : sort === "price-asc" ? "Giá tăng dần" : "Giá giảm dần"}
          </span>
          {otherCategories[0] ? <span className="listing-stat-pill">Có thêm {otherCategories.length} danh mục liên quan</span> : null}
        </div>
      </section>

      <div className="listing-layout">
        <aside className="listing-sidebar">
          <SearchFilters categories={db.categories} currentCategory={id} />
          {otherCategories.length ? (
            <div className="section-note-card" style={{ maxWidth: "100%" }}>
              Muốn đổi phong cách nhanh? Thử xem thêm các danh mục lân cận ở cuối trang để so sánh.
            </div>
          ) : null}
        </aside>

        <div className="listing-main">
          <div className="listing-toolbar">
            <div className="listing-toolbar-meta">
              <h2>{category?.name || "Danh mục"}</h2>
              <p>
                {totalItems
                  ? `Trang ${page}/${totalPages || 1} · ${Math.min(PAGE_SIZE, paginatedResults.length)} sản phẩm đang hiển thị`
                  : "Danh mục này chưa có sản phẩm khớp bộ lọc hiện tại."}
              </p>
            </div>
            <Link href={`/category/${id}`} className="view-all-link">
              Xem trọn danh mục
            </Link>
          </div>

          {activeFilters.length ? (
            <div className="active-chip-row">
              {activeFilters.map((filter) => (
                <Link key={filter.label} href={filter.href} className="active-chip">
                  {filter.label}
                  <span className="active-chip-clear">×</span>
                </Link>
              ))}
            </div>
          ) : null}

          {paginatedResults.length === 0 ? (
            <div className="empty-state-card">
              <div style={{ fontSize: "54px", marginBottom: "10px" }}>🛍️</div>
              <strong>Danh mục này đang cần nới bộ lọc một chút</strong>
              <p>
                Hãy thử bỏ bớt từ khóa hoặc mở rộng khoảng giá để xem thêm các mẫu gần với lựa chọn
                ban đầu của bạn.
              </p>
              <Link href={`/category/${id}`} className="btn">
                Xem toàn bộ danh mục
              </Link>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {paginatedResults.map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                    categoryName={category?.name || ""}
                    priorityNote={q ? "Khớp lọc" : "Trong danh mục"}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="pagination-nav">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <Link
                        key={pageNumber}
                        href={buildCategoryHref(id, {
                          q: queryParams.q || "",
                          sort,
                          minPrice: queryParams.minPrice || "",
                          maxPrice: queryParams.maxPrice || "",
                          page: pageNumber,
                        })}
                        className={`pagination-link ${pageNumber === page ? "pagination-link-active" : ""}`}
                      >
                        {pageNumber}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </>
          )}

          {otherCategories.length ? (
            <section className="section-shell-alt" style={{ marginTop: "8px" }}>
              <div className="section-intro" style={{ marginBottom: "0" }}>
                <div className="section-copy">
                  <span className="section-eyebrow">Khám phá thêm</span>
                  <h2>Xem tiếp các danh mục khác</h2>
                  <p>
                    Nếu bạn đang phân vân giữa vài kiểu khác nhau, đây là những nhóm sản phẩm kế bên
                    để so sánh nhanh mà không cần quay lại trang chủ.
                  </p>
                </div>
              </div>

              <div className="active-chip-row" style={{ marginTop: "12px" }}>
                {otherCategories.map((item) => (
                  <Link key={item.id} href={`/category/${item.id}`} className="active-chip">
                    {item.name}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
