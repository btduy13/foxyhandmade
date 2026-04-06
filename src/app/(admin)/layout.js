// Layout dành cho trang quản trị — không có header/footer của shop.
// <html> và <body> được quản lý bởi src/app/layout.js (root layout).
export const metadata = {
  title: "Admin — Foxy Handmade",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    }}>
      {children}
    </div>
  );
}
