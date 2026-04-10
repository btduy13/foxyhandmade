import fs from 'fs';
import path from 'path';
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ShopHeader from "@/components/ShopHeader";

export const metadata = {
  title: "Foxy Handmade — Phụ kiện thủ công handmade",
  description: "Khám phá bộ sưu tập phụ kiện thủ công xinh xắn, dễ thương từ Foxy Handmade.",
};

function getDb() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8'));
}

export default function ShopLayout({ children }) {
  const db = getDb();
  const categories = db.categories || [];
  const hp = db.homepage || {};
  const social = hp.socialLinks || {};

  return (
    <CartProvider>
      <WishlistProvider>
      {hp.announcementText && (
        <div style={{ background: hp.announcementColor || "#e85d74", color: "#fff", padding: "8px 20px", textAlign: "center", fontSize: "13px", fontWeight: "700", letterSpacing: "0.5px" }}>
          {hp.announcementText}
        </div>
      )}
      <ShopHeader categories={categories} />
      <main style={{ minHeight: "60vh" }}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-top">
          <div>
            <h3>🦊 Foxy Handmade</h3>
            <p>
              Thương hiệu phụ kiện thủ công mang phong cách dễ thương, nhẹ nhàng.
              Mỗi sản phẩm được làm tỉ mỉ bằng tay với tình yêu và sự tâm huyết.
            </p>
            <address style={{ marginTop: "16px" }}>
              <div>📍 123 Đường X, Quận Y, TP.HCM</div>
              <div>📞 0987.654.321</div>
              <div>✉️ hello@foxyhandmade.com</div>
            </address>
          </div>
          <div>
            <h3>Chính Sách</h3>
            <a href="/about">Về chúng tôi</a>
            <a href="/contact">Liên hệ</a>
            <a href="#">Chính sách đổi trả</a>
            <a href="#">Hướng dẫn đặt hàng</a>
          </div>
          <div>
            <h3>Danh Mục</h3>
            {categories.slice(0, 6).map(c => (
              <a key={c.id} href={`/category/${c.id}`}>{c.name}</a>
            ))}
          </div>
          <div>
            <h3>Kết Nối</h3>
            <a href={social.facebook || "https://facebook.com"} target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href={social.instagram || "https://instagram.com"} target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://shopee.vn" target="_blank" rel="noreferrer">🛍 Shopee</a>
            <a href={social.tiktok || "https://tiktok.com"} target="_blank" rel="noreferrer">🎵 TikTok</a>
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
