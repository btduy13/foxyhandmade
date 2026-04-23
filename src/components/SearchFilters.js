"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function buildSearchUrl(values, currentCategory) {
  const params = new URLSearchParams();

  if (values.q) params.set("q", values.q);
  if (values.sort && values.sort !== "newest") params.set("sort", values.sort);
  if (values.minPrice) params.set("minPrice", values.minPrice);
  if (values.maxPrice) params.set("maxPrice", values.maxPrice);
  if (!currentCategory && values.cat) params.set("cat", values.cat);

  const basePath = currentCategory ? `/category/${currentCategory}` : "/search";
  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export default function SearchFilters({ categories = [], currentCategory = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentValues = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      sort: searchParams.get("sort") || "newest",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      cat: searchParams.get("cat") || currentCategory || "",
    }),
    [currentCategory, searchParams]
  );

  const [draft, setDraft] = useState(currentValues);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setDraft(currentValues);
    setMobileOpen(false);
  }, [currentValues]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const activeCount = [
    currentValues.q,
    currentValues.sort !== "newest" ? currentValues.sort : "",
    currentValues.minPrice,
    currentValues.maxPrice,
    !currentCategory ? currentValues.cat : "",
  ].filter(Boolean).length;

  const applyFilters = ({ closeMobile = true } = {}) => {
    const href = buildSearchUrl(
      {
        ...draft,
        q: draft.q.trim(),
      },
      currentCategory
    );

    startTransition(() => {
      router.push(href);
    });

    if (closeMobile) setMobileOpen(false);
  };

  const clearFilters = () => {
    const reset = {
      q: "",
      sort: "newest",
      minPrice: "",
      maxPrice: "",
      cat: currentCategory || "",
    };

    setDraft(reset);
    startTransition(() => {
      router.push(currentCategory ? `/category/${currentCategory}` : "/search");
    });
    setMobileOpen(false);
  };

  const summaryText = currentValues.q
    ? `Đang lọc theo "${currentValues.q}"`
    : activeCount > 0
      ? "Có bộ lọc đang áp dụng"
      : "Chưa áp dụng bộ lọc";

  const renderCard = (extraClassName = "") => (
    <div className={`filters-card ${extraClassName}`.trim()}>
      <div className="filters-card-header">
        <div>
          <div className="filters-card-title">Tinh chỉnh lựa chọn</div>
          <p className="filters-card-subtitle">
            Lọc theo từ khóa, mức giá và kiểu sắp xếp để tìm món phù hợp nhanh hơn.
          </p>
        </div>
        <span className="filter-count-badge">{activeCount}</span>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-search">
          Từ khóa
        </label>
        <input
          id="filter-search"
          type="search"
          placeholder="Tên sản phẩm, kiểu dáng..."
          value={draft.q}
          onChange={(event) => setDraft((prev) => ({ ...prev, q: event.target.value }))}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-sort">
          Sắp xếp
        </label>
        <select
          id="filter-sort"
          value={draft.sort}
          onChange={(event) => setDraft((prev) => ({ ...prev, sort: event.target.value }))}
        >
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá từ thấp đến cao</option>
          <option value="price-desc">Giá từ cao đến thấp</option>
        </select>
      </div>

      {!currentCategory && categories.length > 0 ? (
        <div className="filter-group">
          <div className="filter-label">Danh mục</div>
          <div className="filter-chip-grid">
            <button
              type="button"
              className={`filter-choice ${draft.cat === "" ? "filter-choice-active" : ""}`}
              onClick={() => setDraft((prev) => ({ ...prev, cat: "" }))}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`filter-choice ${draft.cat === category.id ? "filter-choice-active" : ""}`}
                onClick={() => setDraft((prev) => ({ ...prev, cat: category.id }))}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="filter-group">
        <div className="filter-label">Khoảng giá</div>
        <div className="filter-range-row">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Từ"
            value={draft.minPrice}
            onChange={(event) => setDraft((prev) => ({ ...prev, minPrice: event.target.value }))}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder="Đến"
            value={draft.maxPrice}
            onChange={(event) => setDraft((prev) => ({ ...prev, maxPrice: event.target.value }))}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button type="button" className="btn" onClick={() => applyFilters()}>
          Áp dụng bộ lọc
        </button>
        <button type="button" className="filter-reset" onClick={clearFilters}>
          Xóa tất cả
        </button>
      </div>
    </div>
  );

  return (
    <div className="filters-shell">
      <style>{`
        .filters-overlay {
          position: fixed;
          inset: 0;
          z-index: 360;
          display: none;
          background: rgba(20, 9, 4, 0.42);
          backdrop-filter: blur(4px);
        }

        .filters-sheet {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 361;
          display: none;
          max-height: 86vh;
          padding: 18px 16px 20px;
          border-radius: 24px 24px 0 0;
          background: #fffaf6;
          box-shadow: 0 -20px 48px rgba(20, 9, 4, 0.2);
          overflow-y: auto;
        }

        .filters-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .filters-sheet-header strong {
          font-size: 18px;
          color: var(--text-primary);
        }

        .filters-sheet-header button {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 14px;
          background: rgba(107, 45, 31, 0.08);
          color: var(--brand-primary);
          font-size: 22px;
          cursor: pointer;
        }

        @media (max-width: 980px) {
          .filters-mobile-summary {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid rgba(107, 45, 31, 0.08);
            box-shadow: var(--shadow-sm);
          }

          .filters-mobile-summary strong {
            display: block;
            color: var(--text-primary);
            font-size: 14px;
            margin-bottom: 2px;
          }

          .filters-mobile-summary span {
            color: var(--text-muted);
            font-size: 12px;
          }

          .filters-mobile-toggle {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
            border-radius: 14px;
            background: var(--brand-primary);
            color: #fff;
            padding: 12px 14px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
          }

          .filters-card {
            display: none;
          }

          .filters-sheet .filters-card {
            display: flex;
            position: static;
            top: auto;
            padding: 0;
            border: none;
            box-shadow: none;
            background: transparent;
          }

          .filters-overlay,
          .filters-sheet {
            display: ${mobileOpen ? "block" : "none"};
          }
        }
      `}</style>

      <div className="filters-mobile-summary">
        <div>
          <strong>Bộ lọc sản phẩm</strong>
          <span>{summaryText}</span>
        </div>
        <button type="button" className="filters-mobile-toggle" onClick={() => setMobileOpen(true)}>
          Lọc
          {activeCount > 0 ? <span className="filter-count-badge">{activeCount}</span> : null}
        </button>
      </div>

      {renderCard()}

      <div className="filters-overlay" onClick={() => setMobileOpen(false)} />
      <div className="filters-sheet">
        <div className="filters-sheet-header">
          <strong>Bộ lọc tìm kiếm</strong>
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Đóng bộ lọc">
            ×
          </button>
        </div>
        {renderCard("filters-card-mobile")}
      </div>
    </div>
  );
}
