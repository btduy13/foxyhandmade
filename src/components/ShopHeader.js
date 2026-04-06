"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

function CartIcon() {
  const { totalItems } = useCart();
  return (
    <a href="/cart" className="action-icon" style={{ flexDirection: "column", alignItems: "center", gap: "2px", color: "rgba(255,255,255,0.9)", textDecoration: "none", position: "relative" }}>
      {totalItems > 0 && (
        <span style={{ position: "absolute", top: "-8px", right: "-10px", background: "var(--brand-accent)", color: "#fff", fontSize: "10px", fontWeight: "800", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="action-label">Giỏ hàng</span>
    </a>
  );
}

export default function ShopHeader({ categories = [] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showCatMenu, setShowCatMenu] = useState(false);
  const catRef = useRef(null);

  // Close cat menu when clicking outside
  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setShowCatMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push("/search?q=");
  };

  return (
    <>
      {/* Tier 1 — Announcement */}
      <div className="announcement-bar">
        🦊 Freeship toàn quốc đơn từ 300k &nbsp;|&nbsp; Handmade 100% với tình yêu &nbsp;|&nbsp; Đổi trả trong 7 ngày 🎀
      </div>

      {/* Tier 2 — Main header */}
      <header className="main-header">
        <div className="container header-content">
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", flexShrink: 0 }}>
            <span className="logo-emoji">🦊</span>
            <span className="logo-text">FOXY HANDMADE</span>
          </a>

          <form className="search-bar-container" onSubmit={handleSearch} style={{ flex: 1, maxWidth: "560px" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm trang sức, phụ kiện handmade..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              Tìm kiếm
            </button>
          </form>

          <div className="header-actions">
            <a href="#" className="action-icon" style={{ flexDirection: "column", alignItems: "center", gap: "2px", color: "rgba(255,255,255,0.9)", textDecoration: "none" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span className="action-label">Tài khoản</span>
            </a>
            <CartIcon />
          </div>
        </div>
      </header>

      {/* Tier 3 — Secondary nav */}
      <nav className="secondary-nav">
        <div className="container">
          <div className="nav-menu">
            {/* Category dropdown */}
            <div ref={catRef} style={{ position: "relative" }}>
              <div
                className="nav-item category-toggle"
                onClick={() => setShowCatMenu(v => !v)}
                style={{ userSelect: "none" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                Tất cả danh mục
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transition: "transform 0.2s", transform: showCatMenu ? "rotate(180deg)" : "rotate(0deg)" }}><polyline points="6 9 12 15 18 9" /></svg>
              </div>
              {showCatMenu && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, zIndex: 300, minWidth: "220px",
                  background: "#fff", border: "1px solid var(--border-color)", borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                  boxShadow: "var(--shadow-md)", overflow: "hidden",
                }}>
                  {categories.map(c => (
                    <a key={c.id} href={`/category/${c.id}`} onClick={() => setShowCatMenu(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 20px", fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-light)", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-page)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span>🏷</span> {c.name}
                    </a>
                  ))}
                  {categories.length === 0 && <div style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>Chưa có danh mục</div>}
                </div>
              )}
            </div>
            <a href="/#san-pham" className="nav-item">🆕 Sản phẩm mới</a>
            <a href="/#ban-chay" className="nav-item">🔥 Bán chạy</a>
            <a href="/cart" className="nav-item">🛒 Giỏ hàng</a>
          </div>
          <span className="hotline-text">📞 0987.654.321</span>
        </div>
      </nav>
    </>
  );
}
