"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

function isPathActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="action-icon" aria-label="Giỏ hàng">
      {totalItems > 0 ? (
        <span className="action-badge" style={{ background: "var(--brand-accent)" }}>
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      ) : null}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="action-label">Giỏ hàng</span>
    </Link>
  );
}

function WishlistIcon() {
  const { items } = useWishlist();
  const count = items.length;

  return (
    <Link href="/wishlist" className="action-icon" aria-label="Yêu thích">
      {count > 0 ? (
        <span className="action-badge" style={{ background: "#e85d74" }}>
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="action-label">Yêu thích</span>
    </Link>
  );
}

export default function ShopHeader({ categories = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catRef = useRef(null);

  const [query, setQuery] = useState("");
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const catEmojis = ["🌸", "🎀", "🦊", "✨", "🎁", "💖", "🌷", "🍓"];

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/search?q=", label: "Khám phá" },
    { href: "/about", label: "Về Foxy" },
    { href: "/contact", label: "Liên hệ" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catRef.current && !catRef.current.contains(event.target)) {
        setShowCatMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowCatMenu(false);
  }, [pathname]);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) setMobileOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    const href = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search?q=";
    router.push(href);
  };

  return (
    <>
      <style>{`
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 420;
          display: ${mobileOpen ? "block" : "none"};
          background: rgba(20, 9, 4, 0.48);
          backdrop-filter: blur(6px);
        }

        .mobile-nav-drawer {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(340px, 88vw);
          padding: 20px 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          background:
            linear-gradient(180deg, rgba(107, 45, 31, 0.98) 0%, rgba(74, 31, 20, 0.98) 100%);
          color: #fff8f0;
          box-shadow: 0 22px 52px rgba(20, 9, 4, 0.26);
          transform: translateX(${mobileOpen ? "0" : "-110%"});
          transition: transform 0.24s ease;
        }

        .drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .drawer-brand-copy strong {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          line-height: 1;
        }

        .drawer-brand-copy span {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 248, 240, 0.72);
        }

        .drawer-close {
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }

        .drawer-search {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .drawer-search form {
          display: flex;
          gap: 10px;
        }

        .drawer-search .form-input {
          border: none;
          background: rgba(255, 255, 255, 0.92);
        }

        .drawer-search button {
          min-width: 46px;
          border: none;
          border-radius: 14px;
          background: var(--brand-accent);
          color: #fff;
          cursor: pointer;
        }

        .drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .drawer-nav-link,
        .drawer-category-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 16px;
          color: rgba(255, 248, 240, 0.88);
          font-size: 14px;
          font-weight: 800;
          transition: background 0.18s ease, color 0.18s ease;
        }

        .drawer-nav-link:hover,
        .drawer-category-link:hover,
        .drawer-nav-link.is-active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .drawer-section-label {
          margin: 6px 0 2px;
          color: rgba(255, 248, 240, 0.64);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .drawer-footer {
          margin-top: auto;
          padding: 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .drawer-footer strong {
          display: block;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .drawer-footer p {
          color: rgba(255, 248, 240, 0.76);
          font-size: 13px;
          line-height: 1.7;
        }

        .hamburger-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
        }

        @media (max-width: 920px) {
          .desktop-search,
          .desktop-secondary-nav {
            display: none !important;
          }

          .hamburger-btn {
            display: inline-flex;
          }
        }
      `}</style>

      <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)}>
        <aside className="mobile-nav-drawer" onClick={(event) => event.stopPropagation()}>
          <div className="drawer-top">
            <Link href="/" className="drawer-brand">
              <Image
                src="/logo.png"
                alt="Foxy Handmade"
                width={58}
                height={58}
                sizes="58px"
                style={{ borderRadius: "16px" }}
              />
              <div className="drawer-brand-copy">
                <strong>Foxy Handmade</strong>
                <span>Phụ kiện thủ công xinh xắn</span>
              </div>
            </Link>
            <button className="drawer-close" onClick={() => setMobileOpen(false)} aria-label="Đóng menu">
              ×
            </button>
          </div>

          <div className="drawer-search">
            <form onSubmit={handleSearch}>
              <input
                type="search"
                className="form-input"
                placeholder="Tìm sản phẩm yêu thích..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button type="submit" aria-label="Tìm kiếm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>
          </div>

          <nav className="drawer-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`drawer-nav-link ${isPathActive(pathname, link.href.split("?")[0]) ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            ))}

            <div className="drawer-section-label">Danh mục</div>
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="drawer-category-link"
              >
                <span>{catEmojis[index % catEmojis.length]}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </nav>

          <div className="drawer-footer">
            <strong>Đặt hàng nhanh qua hotline</strong>
            <p>
              Tư vấn phối quà, đóng gói xinh xắn và giao toàn quốc trong tuần.
            </p>
            <a href="tel:0987654321" style={{ display: "inline-flex", marginTop: "10px", fontWeight: "900" }}>
              0987.654.321
            </a>
          </div>
        </aside>
      </div>

      <header className="main-header">
        <div className="container header-content">
          <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Mở menu">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/" className="header-logo-link">
            <Image
              src="/logo.png"
              alt="Foxy Handmade"
              width={82}
              height={82}
              sizes="82px"
              priority
              style={{ borderRadius: "20px" }}
            />
            <div className="header-brand-copy">
              <span className="header-brand-title">Foxy Handmade</span>
              <span className="header-brand-tagline">Trang sức thủ công dịu dàng mỗi ngày</span>
            </div>
          </Link>

          <form className="search-bar-container desktop-search" onSubmit={handleSearch} style={{ flex: 1 }}>
            <input
              type="search"
              className="search-input"
              placeholder="Tìm kiếm khuyên tai, kẹp tóc, quà tặng handmade..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="search-btn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "4px" }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Tìm kiếm
            </button>
          </form>

          <div className="header-actions">
            <WishlistIcon />
            <CartIcon />
          </div>
        </div>
      </header>

      <nav className="secondary-nav desktop-secondary-nav">
        <div className="container">
          <div className="nav-menu">
            <div ref={catRef} style={{ position: "relative" }}>
              <button
                type="button"
                className={`nav-item category-toggle ${pathname.startsWith("/category/") ? "nav-item-active" : ""}`}
                style={{ userSelect: "none", border: "none" }}
                onClick={() => setShowCatMenu((open) => !open)}
                aria-expanded={showCatMenu}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                Tất cả danh mục
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  style={{ transform: showCatMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s ease" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {showCatMenu ? (
                <div className="category-menu">
                  {categories.length ? (
                    categories.map((category, index) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="category-menu-link"
                        onClick={() => setShowCatMenu(false)}
                      >
                        <span>{catEmojis[index % catEmojis.length]}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))
                  ) : (
                    <div style={{ padding: "18px", color: "var(--text-muted)", fontSize: "14px" }}>
                      Chưa có danh mục.
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {navLinks.map((link) => {
              const href = link.href.split("?")[0];
              const active = isPathActive(pathname, href);

              return (
                <Link key={link.href} href={link.href} className={`nav-item ${active ? "nav-item-active" : ""}`}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          <a href="tel:0987654321" className="hotline-text">
            <span>📞</span>
            <span>0987.654.321</span>
          </a>
        </div>
      </nav>
    </>
  );
}
