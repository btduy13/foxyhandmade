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

function buildSearchHref(values) {
  const params = new URLSearchParams();

  if (values.q) params.set("q", values.q);
  if (values.sort && values.sort !== "newest") params.set("sort", values.sort);
  if (values.minPrice) params.set("minPrice", values.minPrice);
  if (values.maxPrice) params.set("maxPrice", values.maxPrice);
  if (values.cat) params.set("cat", values.cat);
  if (values.page && values.page !== 1) params.set("page", String(values.page));

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const q = params.q || "";
  return { title: q ? `Tìm "${q}" — Foxy Handmade` : "Tìm kiếm — Foxy Handmade" };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = (params.q || "").trim().toLowerCase();
  const sort = params.sort || "newest";
  const cat = params.cat || "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || Infinity;
  const page = Number(params.page) || 1;
  const PAGE_SIZE = 12;

  const db = await getDb();
  let results = [...db.products];

  if (q) {
    results = results.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q))
    );
  }

  if (cat) {
    results = results.filter((product) => product.categoryId === cat);
  }

  results = results.filter((product) => product.price >= minPrice && product.price <= maxPrice);

  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  else results.reverse();

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const currentCategory = db.categories.find((category) => category.id === cat);

  const activeFilters = [
    q
      ? {
          label: `Từ khóa: ${params.q}`,
          href: buildSearchHref({ sort, minPrice: params.minPrice || "", maxPrice: params.maxPrice || "", cat }),
        }
      : null,
    cat
      ? {
          label: `Danh mục: ${currentCategory?.name || "Đã chọn"}`,
          href: buildSearchHref({
            q: params.q || "",
            sort,
            minPrice: params.minPrice || "",
            maxPrice: params.maxPrice || "",
          }),
        }
      : null,
    params.minPrice
      ? {
          label: `Từ ${Number(params.minPrice).toLocaleString("vi-VN")}đ`,
          href: buildSearchHref({
            q: params.q || "",
            sort,
            maxPrice: params.maxPrice || "",
            cat,
          }),
        }
      : null,
    params.maxPrice
      ? {
          label: `Đến ${Number(params.maxPrice).toLocaleString("vi-VN")}đ`,
          href: buildSearchHref({
            q: params.q || "",
            sort,
            minPrice: params.minPrice || "",
            cat,
          }),
        }
      : null,
    sort !== "newest"
      ? {
          label: sort === "price-asc" ? "Giá tăng dần" : "Giá giảm dần",
          href: buildSearchHref({
            q: params.q || "",
            minPrice: params.minPrice || "",
            maxPrice: params.maxPrice || "",
            cat,
          }),
        }
      : null,
  ].filter(Boolean);

  const heroTitle = q ? `Kết quả cho “${params.q}”` : "Khám phá toàn bộ sản phẩm";
  const heroText = q
    ? "Foxy đã gom lại những mẫu gần nhất với từ khóa của bạn để việc chọn quà hoặc phối đồ nhanh và dễ hơn."
    : "Duyệt tất cả sản phẩm, rồi dùng bộ lọc để thu hẹp theo khoảng giá, danh mục hoặc kiểu sắp xếp phù hợp.";

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Tìm kiếm</span>
      </div>

      <section className="listing-hero">
        <span className="section-eyebrow">Tìm sản phẩm phù hợp thật nhanh</span>
        <h1 className="listing-hero-title">{heroTitle}</h1>
        <p className="listing-hero-subtitle">{heroText}</p>

        <div className="listing-hero-stats">
          <span className="listing-stat-pill">{totalItems} sản phẩm phù hợp</span>
          {currentCategory ? <span className="listing-stat-pill">Trong {currentCategory.name}</span> : null}
          <span className="listing-stat-pill">
            {sort === "newest" ? "Ưu tiên mẫu mới" : sort === "price-asc" ? "Giá tăng dần" : "Giá giảm dần"}
          </span>
        </div>
      </section>

      <div className="listing-layout">
        <aside className="listing-sidebar">
          <SearchFilters categories={db.categories} />
          <div className="section-note-card" style={{ maxWidth: "100%" }}>
            Mẹo nhỏ: nếu đang chọn quà, hãy lọc theo mức giá trước rồi xem nhóm bán chạy để tiết kiệm thời gian.
          </div>
        </aside>

        <div className="listing-main">
          <div className="listing-toolbar">
            <div className="listing-toolbar-meta">
              <h2>{q ? `Gợi ý cho "${params.q}"` : "Tất cả thiết kế đang có sẵn"}</h2>
              <p>
                {totalItems
                  ? `Trang ${page}/${totalPages || 1} · ${Math.min(PAGE_SIZE, paginatedResults.length)} sản phẩm đang hiển thị`
                  : "Thử điều chỉnh bộ lọc để mở rộng thêm lựa chọn."}
              </p>
            </div>
            {activeFilters.length ? (
              <Link href="/search" className="view-all-link">
                Xóa bộ lọc
              </Link>
            ) : (
              <Link href="/wishlist" className="view-all-link">
                Xem wishlist
              </Link>
            )}
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
              <div style={{ fontSize: "54px", marginBottom: "10px" }}>🔎</div>
              <strong>Chưa thấy sản phẩm phù hợp</strong>
              <p>
                Từ khóa hoặc khoảng giá hiện tại có thể đang hơi hẹp. Thử xóa một vài bộ lọc để xem
                thêm các mẫu gần với nhu cầu của bạn.
              </p>
              <Link href="/search" className="btn">
                Xem tất cả sản phẩm
              </Link>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {paginatedResults.map((product) => (
                  <StoreProductCard
                    key={product.id}
                    product={product}
                    categoryName={db.categories.find((category) => category.id === product.categoryId)?.name || ""}
                    priorityNote={q ? "Khớp tìm kiếm" : null}
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
                        href={buildSearchHref({
                          q: params.q || "",
                          sort,
                          minPrice: params.minPrice || "",
                          maxPrice: params.maxPrice || "",
                          cat,
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
        </div>
      </div>
    </div>
  );
}
