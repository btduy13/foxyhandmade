import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Foxy Handmade",
  description: "Handmade pastel accessories and merch.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        
        {/* Announcement Bar */}
        <div className="announcement-bar">
          ✨ Freeship toàn quốc cho đơn hàng từ 300k ✨
        </div>

        {/* Main Header */}
        <header className="main-header">
          <div className="container header-content">
            <a href="/" className="logo-container">
              <span className="logo-text">FOXY HANDMADE</span>
            </a>
            
            <div className="search-bar-container">
              <input type="text" className="search-input" placeholder="Tìm kiếm sản phẩm..." />
              <button className="search-btn">Tìm kiếm</button>
            </div>

            <div className="header-actions">
              <div className="action-icon">
                {/* User SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div className="action-icon">
                <span className="action-badge">2</span>
                {/* Cart SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              </div>
            </div>
          </div>
        </header>

        {/* Secondary Nav */}
        <nav className="secondary-nav">
          <div className="container">
            <div className="nav-menu">
              <div className="nav-item category-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                Danh mục
              </div>
              <a href="#" className="nav-item">Sản phẩm khuyến mãi</a>
              <a href="#" className="nav-item">Về chúng tôi</a>
              <a href="/admin" className="nav-item">Admin Dashboard</a>
            </div>
            <div className="nav-item" style={{ color: "var(--brand-red)", fontWeight: "700" }}>
              Hotline: 0987.654.321
            </div>
          </div>
        </nav>

        <main>
          {children}
        </main>

        <footer className="footer">
          <div className="container footer-grid">
            <div>
              <h3>FOXY HANDMADE</h3>
              <p>Thương hiệu phụ kiện thủ công mang phong cách dễ thương, nhẹ nhàng. Ra đời từ 2014, chúng tôi luôn mang tâm huyết vào từng sản phẩm.</p>
              <br/>
              <p>📍 Địa chỉ: 123 Đường X, Quận Y, TP.HCM</p>
              <p>📞 Điện thoại: 0987.654.321</p>
              <p>✉️ Email: hello@foxyhandmade.com</p>
            </div>
            <div>
              <h3>Chính Sách</h3>
              <a href="#">Chính sách mua hàng</a>
              <a href="#">Chính sách bảo mật</a>
              <a href="#">Chính sách đổi trả</a>
              <a href="#">Điều khoản sử dụng</a>
            </div>
            <div>
              <h3>Liên kết</h3>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Shopee</a>
              <a href="#">Lazada</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>Copyright © 2026 Foxy Handmade. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
