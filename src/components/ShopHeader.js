"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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

function WishlistIcon() {
  const { items } = useWishlist();
  const count = items.length;
  return (
    <a href="/wishlist" className="action-icon" style={{ flexDirection: "column", alignItems: "center", gap: "2px", color: "rgba(255,255,255,0.9)", textDecoration: "none", position: "relative" }}>
      {count > 0 && (
        <span style={{ position: "absolute", top: "-8px", right: "-10px", background: "#e85d74", color: "#fff", fontSize: "10px", fontWeight: "800", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
          {count > 99 ? "99+" : count}
        </span>
      )}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="action-label">Yêu thích</span>
    </a>
  );
}

export default function ShopHeader({ categories = [] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catRef = useRef(null);

  // Close cat menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setShowCatMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setMobileOpen(false);
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
    else router.push("/search?q=");
  };

  const catEmojis = ["🌸", "🎀", "🦊", "✨", "🎁", "💖", "🌷", "🍓"];

  return (
    <>
      <style>{`
        .mobile-nav-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 400;
          animation: fadeIn 0.2s ease;
        }
        .mobile-nav-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 300px;
          background: #fff;
          z-index: 401;
          overflow-y: auto;
          animation: slideInLeft 0.25s ease;
          display: flex;
          flex-direction: column;
        }
        .mobile-nav-drawer .drawer-header {
          background: var(--brand-primary);
          color: #fff;
          padding: 20px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mobile-nav-drawer .drawer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
        }
        .mobile-nav-drawer .drawer-close {
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
        }
        .drawer-search {
          padding: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .drawer-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-light);
          text-decoration: none;
          transition: background 0.15s;
        }
        .drawer-nav-item:hover { background: var(--bg-page); }
        .drawer-cat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px 12px 40px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-light);
          text-decoration: none;
          transition: background 0.15s;
        }
        .drawer-cat-item:hover { background: var(--bg-page); }
        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: #fff;
          flex-shrink: 0;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @media (max-width: 768px) {
          .hamburger-btn { display: flex !important; }
          .desktop-search { display: none !important; }
          .desktop-nav-actions { gap: 12px !important; }
          .desktop-secondary-nav { display: none !important; }
          .action-label { display: none !important; }
          .mobile-nav-overlay { display: block; }
        }
        @media (min-width: 769px) {
          .mobile-nav-overlay { display: none !important; }
          .mobile-nav-drawer { display: none !important; }
        }
      `}</style>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <img src="/logo.png" alt="Foxy Handmade Logo" style={{ height: "50px", objectFit: "contain", borderRadius: "4px" }} />
              <button className="drawer-close" onClick={() => setMobileOpen(false)}>✕</button>
            </div>

            {/* Search in drawer */}
            <div className="drawer-search">
              <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Tìm sản phẩm..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ flex: 1, fontSize: "14px" }}
                />
                <button type="submit" className="btn btn-accent" style={{ padding: "8px 14px", fontSize: "13px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </button>
              </form>
            </div>

            {/* Navigation links */}
            <a href="/" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>🏠 Trang chủ</a>

            {/* Categories */}
            <div style={{ padding: "12px 20px", fontSize: "12px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", background: "var(--bg-section)" }}>
              Danh mục
            </div>
            {categories.map((c, i) => (
              <a key={c.id} href={`/category/${c.id}`} className="drawer-cat-item" onClick={() => setMobileOpen(false)}>
                {catEmojis[i % catEmojis.length]} {c.name}
              </a>
            ))}

            <a href="/#san-pham" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>🆕 Sản phẩm mới</a>
            <a href="/#ban-chay" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>🔥 Bán chạy nhất</a>
            <a href="/wishlist" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>❤️ Yêu thích</a>
            <a href="/cart" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>🛒 Giỏ hàng</a>
            <a href="/about" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>ℹ️ Về chúng tôi</a>
            <a href="/contact" className="drawer-nav-item" onClick={() => setMobileOpen(false)}>📞 Liên hệ</a>

            <div style={{ padding: "20px", marginTop: "auto", fontSize: "13px", color: "var(--text-muted)", borderTop: "1px solid var(--border-light)" }}>
              📞 <a href="tel:0987654321" style={{ color: "var(--brand-accent)", fontWeight: "700" }}>0987.654.321</a>
            </div>
          </div>
        </div>
      )}

      {/* Tier 2 — Main header */}
      <header className="main-header">
        <div className="container header-content">
          {/* Hamburger (mobile only) */}
          <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Mở menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <img src="/logo.png" alt="Foxy Handmade Logo" style={{ height: "80px", objectFit: "contain", borderRadius: "8px" }} />
          </a>

          <form className="search-bar-container desktop-search" onSubmit={handleSearch} style={{ flex: 1, maxWidth: "560px" }}>
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

          <div className="header-actions desktop-nav-actions" style={{ display: "flex", alignItems: "center", gap: "20px", color: "var(--text-on-dark)", flexShrink: 0 }}>
            <WishlistIcon />
            <CartIcon />
          </div>
        </div>
      </header>

      {/* Tier 3 — Secondary nav (desktop only) */}
      <nav className="secondary-nav desktop-secondary-nav">
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
                  {categories.map((c, i) => (
                    <a key={c.id} href={`/category/${c.id}`} onClick={() => setShowCatMenu(false)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 20px", fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)", borderBottom: "1px solid var(--border-light)", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg-page)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span>{catEmojis[i % catEmojis.length]}</span> {c.name}
                    </a>
                  ))}
                  {categories.length === 0 && <div style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>Chưa có danh mục</div>}
                </div>
              )}
            </div>
            <a href="/#san-pham" className="nav-item">🆕 Sản phẩm mới</a>
            <a href="/#ban-chay" className="nav-item">🔥 Bán chạy</a>
            <a href="/about" className="nav-item">ℹ️ Về chúng tôi</a>
            <a href="/contact" className="nav-item">📞 Liên hệ</a>
          </div>
          <a href="tel:0987654321" className="hotline-text">📞 0987.654.321</a>
        </div>
      </nav>
    </>
  );
}
