import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Root layout — duy nhất chứa <html> và <body>.
// Header/footer được xử lý ở từng route group layout bên dưới:
//   (shop)/layout.js  — trang khách hàng (có header, nav, footer)
//   (admin)/layout.js — trang quản trị (không có header/footer shop)
export const metadata = {
  title: "Foxy Handmade",
  description: "Phụ kiện thủ công handmade dễ thương",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}

