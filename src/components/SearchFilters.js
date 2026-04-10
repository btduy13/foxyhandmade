"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchFilters({ categories = [], currentCategory = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    cat: searchParams.get("cat") || currentCategory || ""
  });

  const updateFilters = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    const params = new URLSearchParams();
    if (updated.q) params.set("q", updated.q);
    if (updated.sort) params.set("sort", updated.sort);
    if (updated.minPrice) params.set("minPrice", updated.minPrice);
    if (updated.maxPrice) params.set("maxPrice", updated.maxPrice);
    if (updated.cat && !currentCategory) params.set("cat", updated.cat);

    router.push(`${currentCategory ? `/category/${currentCategory}` : "/search"}?${params.toString()}`);
  };

  return (
    <div style={{ background: "white", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", position: "sticky", top: "130px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "20px", textTransform: "uppercase", color: "var(--text-primary)" }}>Bộ lọc tìm kiếm</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Search */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--text-secondary)" }}>Tìm kiếm</label>
          <input 
            style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border-color)", borderRadius: "8px", outline: "none" }}
            placeholder="Nhập tên sản phẩm..."
            value={filters.q}
            onChange={(e) => updateFilters({ q: e.target.value })}
          />
        </div>

        {/* Sort */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--text-secondary)" }}>Sắp xếp theo</label>
          <select 
            style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border-color)", borderRadius: "8px", background: "white" }}
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
          >
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        {/* Category (if not on a specific category page) */}
        {!currentCategory && categories.length > 0 && (
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--text-secondary)" }}>Danh mục</label>
            <select 
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--border-color)", borderRadius: "8px", background: "white" }}
              value={filters.cat}
              onChange={(e) => updateFilters({ cat: e.target.value })}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "var(--text-secondary)" }}>Khoảng giá (đ)</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input 
              type="number"
              style={{ width: "100%", padding: "10px 10px", border: "1.5px solid var(--border-color)", borderRadius: "8px", fontSize: "13px" }}
              placeholder="Từ"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            />
            <span style={{ color: "var(--text-muted)" }}>–</span>
            <input 
              type="number"
              style={{ width: "100%", padding: "10px 10px", border: "1.5px solid var(--border-color)", borderRadius: "8px", fontSize: "13px" }}
              placeholder="Đến"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            />
          </div>
        </div>

        <button 
          onClick={() => {
            setFilters({ q: "", sort: "newest", minPrice: "", maxPrice: "", cat: "" });
            router.push(currentCategory ? `/category/${currentCategory}` : "/search");
          }}
          style={{ background: "none", border: "none", color: "var(--brand-primary)", fontWeight: "700", fontSize: "13px", cursor: "pointer", padding: "10px 0", textAlign: "left" }}
        >
          ✕ Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}
