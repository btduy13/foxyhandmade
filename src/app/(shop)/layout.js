import Link from "next/link";

import ShopHeader from "@/components/ShopHeader";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Foxy Handmade — Phụ kiện thủ công handmade",
  description: "Khám phá bộ sưu tập phụ kiện thủ công xinh xắn, dễ thương từ Foxy Handmade.",
};

async function getDb() {
  const [categoriesRes, homepageRes] = await Promise.all([
    supabase.from("categories").select("*"),
    supabase.from("homepage").select("data").eq("id", "default").single(),
  ]);

  return {
    categories: categoriesRes.data || [],
    homepage: homepageRes.data?.data || {},
  };
}

export default async function ShopLayout({ children }) {
  const db = await getDb();
  const categories = db.categories || [];
  const hp = db.homepage || {};
  const social = hp.socialLinks || {};

  const socials = [
    { href: social.facebook || "https://facebook.com", label: "Facebook" },
    { href: social.instagram || "https://instagram.com", label: "Instagram" },
    { href: social.tiktok || "https://tiktok.com", label: "TikTok" },
  ];

  return (
    <CartProvider>
      <WishlistProvider>
        {hp.announcementText ? (
          <div
            className="announcement-bar"
            style={{ background: hp.announcementColor || "#e85d74" }}
          >
            <div className="container announcement-inner">
              <span className="announcement-label">Ưu đãi hôm nay</span>
              <div className="announcement-marquee">
                <div className="marquee-content">{hp.announcementText}</div>
              </div>
            </div>
          </div>
        ) : null}

        <ShopHeader categories={categories} />

        <main style={{ minHeight: "60vh" }}>{children}</main>

        <footer className="footer">
          <div className="container footer-top">
            <div>
              <h3>Foxy Handmade</h3>
              <p>
                Những món phụ kiện dịu dàng, được làm tay cẩn thận để bạn dễ dàng chọn một
                món quà nhỏ cho chính mình hoặc cho người thương.
              </p>
              <address style={{ marginTop: "18px" }}>
                <div>123 Đường X, Quận Y, TP.HCM</div>
                <div>0987.654.321</div>
                <div>hello@foxyhandmade.com</div>
              </address>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "18px" }}>
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3>Khám phá</h3>
              <Link href="/">Trang chủ</Link>
              <Link href="/search?q=">Tất cả sản phẩm</Link>
              <Link href="/wishlist">Danh sách yêu thích</Link>
              <Link href="/cart">Giỏ hàng của bạn</Link>
            </div>

            <div>
              <h3>Danh mục nổi bật</h3>
              {categories.slice(0, 6).map((category) => (
                <Link key={category.id} href={`/category/${category.id}`}>
                  {category.name}
                </Link>
              ))}
            </div>

            <div>
              <h3>Hỗ trợ</h3>
              <Link href="/about">Về chúng tôi</Link>
              <Link href="/contact">Liên hệ</Link>
              <a href="tel:0987654321">Gọi tư vấn nhanh</a>
              <a href="mailto:hello@foxyhandmade.com">Email hỗ trợ</a>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container">
              Copyright © 2026 Foxy Handmade. Tất cả quyền được bảo lưu.
            </div>
          </div>
        </footer>
      </WishlistProvider>
    </CartProvider>
  );
}
