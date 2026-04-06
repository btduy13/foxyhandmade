import fs from 'fs';
import path from 'path';
import { CartProvider } from "@/context/CartContext";
import ShopHeader from "@/components/ShopHeader";

export const metadata = {
  title: "Foxy Handmade — Phụ kiện thủ công handmade",
  description: "Khám phá bộ sưu tập phụ kiện thủ công xinh xắn, dễ thương từ Foxy Handmade.",
};

function getCategories() {
  const db = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8'));
  return db.categories || [];
}

export default function ShopLayout({ children }) {
  const categories = getCategories();
  return (
    <CartProvider>
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
            <a href="#">Chính sách mua hàng</a>
            <a href="#">Chính sách bảo mật</a>
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
            <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://shopee.vn" target="_blank" rel="noreferrer">🛍 Shopee</a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer">🎵 TikTok</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            Copyright © 2026 Foxy Handmade. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </CartProvider>
  );
}
