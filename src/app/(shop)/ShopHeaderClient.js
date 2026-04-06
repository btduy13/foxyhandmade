"use client";
// Client Component chứa các phần tương tác của header
export default function ShopHeaderClient() {
  return (
    <>
      <input type="text" className="search-input" placeholder="Tìm kiếm sản phẩm..." />
      <button className="search-btn">Tìm kiếm</button>
    </>
  );
}
