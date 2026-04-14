"use client";
import { useState, useEffect, useCallback } from "react";

const EMPTY_PRODUCT = { name: "", price: "", categoryId: "", imageUrl: "", description: "", stock: "" };
const DEFAULT_HP = {
  announcementText: "",
  announcementColor: "#e85d74",
  heroTitle: "Bộ Sưu Tập Mùa Hè",
  heroSubtitle: "Khám phá những thiết kế mới nhất dành riêng cho bạn",
  heroCtaText: "Xem Ngay",
  heroBannerImage: "/images/hero_banner.png",
  heroBanner1Text: "Phụ Kiện Xinh Xắn",
  heroBanner1CategoryId: "",
  banner1Image: "/images/banner_earrings.png",
  heroBanner2Text: "Khuyên Tai Nhỏ Nhắn",
  heroBanner2CategoryId: "",
  banner2Image: "/images/banner_clips.png",
  featuredProductIds: [],
  newArrivalsIds: [],
  newArrivalsTitle: "Sản Phẩm Mới Trình Làng",
  newArrivalsTag: "🆕 Mới Nhất",
  bestSellersIds: [],
  bestSellersTitle: "Sản Phẩm Được Mua Nhiều Nhất",
  bestSellersTag: "🔥 Bán Chạy",
  promoStrip: [
    { icon: "🚚", title: "Freeship toàn quốc", subtitle: "Miễn phí vận chuyển cho đơn từ 300k" },
    { icon: "🎀", title: "Handmade 100%", subtitle: "Mỗi sản phẩm làm tay tỉ mỉ, không đại trà" },
    { icon: "💝", title: "Đổi trả trong 7 ngày", subtitle: "Cam kết chất lượng, đổi trả dễ dàng" }
  ],
  socialLinks: { facebook: "", instagram: "", tiktok: "" }
};

const StockBadge = ({ stock }) => {
  const count = Number(stock) || 0;
  let bg, color;
  if (count === 0) { bg = "#fee2e2"; color = "#b91c1c"; }
  else if (count <= 5) { bg = "#fef3c7"; color = "#92400e"; }
  else { bg = "#d1fae5"; color = "#065f46"; }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "2px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", background: bg, color }}>
      {count === 0 ? "⚠ Hết hàng" : count <= 5 ? `⚡ Còn ${count}` : `✓ Còn ${count}`}
    </span>
  );
};

// Multi-select product picker with checkboxes
function ProductPicker({ products, selectedIds, onChange, label, description }) {
  const styles = {
    wrap: { marginBottom: "24px" },
    label: { display: "block", fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.8)", marginBottom: "4px" },
    desc: { fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" },
    grid: { display: "flex", flexDirection: "column", gap: "8px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" },
    item: (selected) => ({
      display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
      borderRadius: "10px", cursor: "pointer", transition: "all 0.15s",
      background: selected ? "rgba(232,93,116,0.15)" : "rgba(255,255,255,0.04)",
      border: selected ? "1px solid rgba(232,93,116,0.4)" : "1px solid rgba(255,255,255,0.06)",
    }),
    img: { width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 },
    name: (selected) => ({ fontWeight: selected ? "700" : "500", color: selected ? "#f9a8b8" : "rgba(255,255,255,0.7)", fontSize: "14px" }),
    check: (selected) => ({
      width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, marginLeft: "auto",
      background: selected ? "linear-gradient(135deg,#e85d74,#c0392b)" : "rgba(255,255,255,0.1)",
      border: selected ? "none" : "1px solid rgba(255,255,255,0.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }),
  };

  const toggle = (id) => {
    if (selectedIds.includes(id)) onChange(selectedIds.filter(x => x !== id));
    else onChange([...selectedIds, id]);
  };

  return (
    <div style={styles.wrap}>
      <label style={styles.label}>{label}</label>
      {description && <p style={styles.desc}>{description}</p>}
      <div style={styles.grid}>
        {products.length === 0 && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>Chưa có sản phẩm.</div>}
        {products.map(p => {
          const selected = selectedIds.includes(p.id);
          return (
            <div key={p.id} style={styles.item(selected)} onClick={() => toggle(p.id)}>
              <img src={p.imageUrl} alt={p.name} style={styles.img} onError={e => e.target.src = "https://placehold.co/36x36/1e2a4a/666?text=?"} />
              <span style={styles.name(selected)}>{p.name}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginLeft: "8px" }}>{Number(p.price).toLocaleString("vi-VN")}đ</span>
              <div style={styles.check(selected)}>{selected && <span style={{ color: "#fff", fontSize: "11px", fontWeight: "800" }}>✓</span>}</div>
            </div>
          );
        })}
      </div>
      {selectedIds.length > 0 && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: "rgba(232,93,116,0.8)", fontWeight: "600" }}>
          ✓ Đã chọn {selectedIds.length} sản phẩm
          <button onClick={() => onChange([])} style={{ marginLeft: "12px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>
            Bỏ chọn tất cả
          </button>
        </div>
      )}
    </div>
  );
}

const ORDER_STATUSES = [
  { key: "pending",    label: "Chờ xử lý",   color: "#fef3c7", textColor: "#92400e", icon: "⏳" },
  { key: "processing", label: "Đang xử lý",  color: "#dbeafe", textColor: "#1e40af", icon: "🔄" },
  { key: "shipped",    label: "Đã giao ship", color: "#e0e7ff", textColor: "#4338ca", icon: "🚚" },
  { key: "done",       label: "Hoàn thành",  color: "#dcfce7", textColor: "#15803d", icon: "✅" },
  { key: "cancelled",  label: "Đã hủy",      color: "#fee2e2", textColor: "#b91c1c", icon: "❌" },
];

function ImageUpload({ onUpload, label, currentUrl }) {
  const [uploading, setUploading] = useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) onUpload(data.url);
    } catch { alert("Lỗi khi upload ảnh!"); }
    setUploading(false);
  };
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>{label}</label>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {currentUrl && <img src={currentUrl} style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", background: "rgba(255,255,255,0.1)" }} alt="Preview" />}
        <div style={{ position: "relative", flex: 1 }}>
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: "absolute", opacity: 0, width: "100%", height: "100%", cursor: "pointer", zIndex: 2 }} title="Chọn ảnh" />
          <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.08)", border: "1px dashed rgba(255,255,255,0.3)", borderRadius: "10px", textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            {uploading ? "⏳ Đang tải lên..." : currentUrl ? "📁 Đổi ảnh khác" : "📁 Chọn ảnh từ máy"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [formProduct, setFormProduct] = useState(EMPTY_PRODUCT);
  const [editingId, setEditingId] = useState(null);

  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");

  // Homepage config state
  const [hp, setHp] = useState(DEFAULT_HP);
  const [hpLoading, setHpLoading] = useState(true);
  const [hpSaving, setHpSaving] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);

  // Contacts/Messages state
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([fetch("/api/products"), fetch("/api/categories")]);
      setProducts(await prodRes.json());
      setCategories(await catRes.json());
    } catch { showToast("Lỗi tải dữ liệu!", "error"); }
    setLoading(false);
  }, []);

  const fetchHomepage = useCallback(async () => {
    setHpLoading(true);
    try {
      const res = await fetch("/api/homepage");
      setHp({ ...DEFAULT_HP, ...(await res.json()) });
    } catch {}
    setHpLoading(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      setOrders(await res.json());
    } catch {}
    setOrdersLoading(false);
  }, []);

  const fetchCoupons = useCallback(async () => {
    setCouponsLoading(true);
    try {
      const res = await fetch("/api/coupons");
      setCoupons(await res.json());
    } catch {}
    setCouponsLoading(false);
  }, []);

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
    try {
      const res = await fetch("/api/contact");
      setContacts(await res.json());
    } catch {}
    setContactsLoading(false);
  }, []);

  useEffect(() => { 
    fetchData(); 
    fetchHomepage(); 
    fetchOrders(); 
    fetchCoupons();
    fetchContacts();
  }, [fetchData, fetchHomepage, fetchOrders, fetchCoupons, fetchContacts]);

  /* ---- Category handlers ---- */
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSaving(true);
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCategoryName.trim() }) });
    setNewCategoryName("");
    await fetchData();
    setSaving(false);
    showToast("Đã thêm danh mục!");
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Xóa danh mục này?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    await fetchData();
    showToast("Đã xóa danh mục!");
  };

  /* ---- Product handlers ---- */
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...formProduct, id: editingId, price: Number(formProduct.price), stock: Number(formProduct.stock) } : { ...formProduct, price: Number(formProduct.price), stock: Number(formProduct.stock) };
    await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    showToast(editingId ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm!");
    setEditingId(null);
    setFormProduct(EMPTY_PRODUCT);
    await fetchData();
    setSaving(false);
  };

  const handleEditProduct = (p) => {
    setEditingId(p.id);
    setFormProduct({ name: p.name, price: String(p.price), categoryId: p.categoryId, imageUrl: p.imageUrl, description: p.description, stock: String(p.stock ?? 0), images: p.images || [] });
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => { setEditingId(null); setFormProduct(EMPTY_PRODUCT); };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    await fetchData();
    showToast("Đã xóa sản phẩm!");
  };

  const handleUpdateStock = async (p, delta) => {
    const newStock = Math.max(0, (Number(p.stock) || 0) + delta);
    await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, stock: newStock }) });
    await fetchData();
  };

  const handleRenameCategory = async (id, newName) => {
    if (!newName.trim()) return;
    await fetch("/api/categories", { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ id, name: newName.trim() }) 
    });
    await fetchData();
    showToast("Đã đổi tên danh mục!");
  };

  /* ---- Coupon handlers ---- */
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const newCoupon = {
      code: data.code.toUpperCase(),
      type: data.type,
      value: Number(data.value),
      minOrder: Number(data.minOrder) || 0,
      active: true
    };
    await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCoupon) });
    showToast("Đã thêm mã giảm giá!");
    fetchCoupons();
    e.target.reset();
  };

  const handleDeleteCoupon = async (id) => {
    if (!confirm("Xóa mã giảm giá này?")) return;
    await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
    showToast("Đã xóa mã!");
    fetchCoupons();
  };

  const toggleCouponStatus = async (coupon) => {
    await fetch("/api/coupons", { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ ...coupon, active: !coupon.active }) 
    });
    fetchCoupons();
  };

  /* ---- Contact handlers ---- */
  const handleMarkContactRead = async (id) => {
    await fetch("/api/contact", { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ id, read: true }) 
    });
    fetchContacts();
  };

  const handleDeleteContact = async (id) => {
    if (!confirm("Xóa tin nhắn này?")) return;
    await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
    showToast("Đã xóa tin nhắn!");
    fetchContacts();
  };

  /* ---- Order handlers ---- */
  const handleUpdateOrderStatus = async (id, status) => {
    await fetch("/api/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selectedOrder?.id === id) setSelectedOrder(prev => ({ ...prev, status }));
    showToast(`✅ Cập nhật trạng thái đơn hàng!`);
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm("Xóa đơn hàng này?")) return;
    await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
    setOrders(prev => prev.filter(o => o.id !== id));
    if (selectedOrder?.id === id) setSelectedOrder(null);
    showToast("Đã xóa đơn hàng!");
  };

  /* ---- Homepage config handlers ---- */
  const handleSaveHomepage = async () => {
    setHpSaving(true);
    await fetch("/api/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(hp) });
    setHpSaving(false);
    showToast("✅ Đã lưu cấu hình trang chủ!");
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const getCatName = (id) => categories.find(c => c.id === id)?.name ?? "—";

  /* ---- Styles ---- */
  const S = {
    page: { minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "0" },
    header: { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
    logo: { fontSize: "24px", fontWeight: "800", color: "#fff", display: "flex", alignItems: "center", gap: "12px" },
    badge: { background: "linear-gradient(135deg, #e85d74, #c0392b)", color: "#fff", fontSize: "11px", padding: "3px 8px", borderRadius: "6px", fontWeight: "600" },
    tabs: { display: "flex", gap: "4px", background: "rgba(255,255,255,0.08)", padding: "4px", borderRadius: "12px" },
    tab: (active) => ({ padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px", transition: "all 0.2s", background: active ? "linear-gradient(135deg, #e85d74, #c0392b)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)" }),
    body: { maxWidth: "1400px", margin: "0 auto", padding: "32px 40px" },
    grid: { display: "grid", gridTemplateColumns: "380px 1fr", gap: "32px", alignItems: "start" },
    card: { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "28px", color: "#fff" },
    cardTitle: { fontSize: "18px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#fff" },
    label: { display: "block", fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "6px" },
    input: { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
    select: { width: "100%", background: "#1e2a4a", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" },
    btnPrimary: { width: "100%", padding: "12px", background: "linear-gradient(135deg, #e85d74, #c0392b)", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "15px", cursor: "pointer", transition: "opacity 0.2s, transform 0.1s" },
    btnOutline: { padding: "6px 12px", background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontWeight: "600", fontSize: "12px", cursor: "pointer" },
    btnDanger: { padding: "6px 12px", background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", fontWeight: "600", fontSize: "12px", cursor: "pointer" },
    btnEdit: { padding: "6px 12px", background: "rgba(96,165,250,0.15)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.3)", borderRadius: "8px", fontWeight: "600", fontSize: "12px", cursor: "pointer" },
    productRow: { display: "flex", gap: "16px", padding: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", alignItems: "center", transition: "background 0.2s" },
    toast: (type) => ({ position: "fixed", bottom: "32px", right: "32px", background: type === "error" ? "linear-gradient(135deg, #ef4444, #b91c1c)" : "linear-gradient(135deg, #22c55e, #15803d)", color: "#fff", padding: "14px 24px", borderRadius: "14px", fontWeight: "600", fontSize: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)", zIndex: 9999, animation: "slideUp 0.3s ease" }),
    divider: { borderTop: "1px solid rgba(255,255,255,0.08)", margin: "24px 0" },
    sectionLabel: { fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "16px" },
  };

  if (loading) return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#fff", fontSize: "20px", fontWeight: "600" }}>⏳ Đang tải dữ liệu...</div>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
        input:focus, textarea:focus, select:focus { border-color: rgba(232,93,116,0.6) !important; box-shadow: 0 0 0 3px rgba(232,93,116,0.15); }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .product-row:hover { background: rgba(255,255,255,0.07) !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.logo}>🦊 FoxyHandmade <span style={S.badge}>ADMIN</span></div>
        <div style={S.tabs}>
          {[
            { key: "analytics", label: "📈 Thống kê" },
            { key: "products", label: "📦 Sản phẩm" },
            { key: "inventory", label: "📊 Kho hàng" },
            { key: "categories", label: "🗂 Danh mục" },
            { key: "homepage", label: "🎨 Trang chủ" },
            { key: "orders", label: `🧾 Đơn hàng${orders.length > 0 ? ` (${orders.filter(o=>o.status==="pending").length} chờ)` : ""}` },
            { key: "coupons", label: "🎟 Mã giảm giá" },
            { key: "contacts", label: `💬 Tin nhắn${contacts.filter(c => !c.read).length > 0 ? ` (${contacts.filter(c => !c.read).length})` : ""}` },
          ].map(t => (
            <button key={t.key} style={S.tab(activeTab === t.key)} onClick={() => { 
              setActiveTab(t.key); 
              if (t.key === "orders") fetchOrders(); 
              if (t.key === "coupons") fetchCoupons();
              if (t.key === "contacts") fetchContacts();
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>← Về trang chủ</a>
          <button 
            onClick={async () => {
              if (!confirm("Bạn có chắc muốn đăng xuất?")) return;
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "6px 14px",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div style={S.body}>

        {/* ===== PRODUCTS ===== */}
        {activeTab === "products" && (
          <div style={S.grid}>
            <div>
              <div style={S.card}>
                <div style={S.cardTitle}>{editingId ? "✏️ Chỉnh sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</div>
                {editingId && <div style={{ padding: "10px 14px", background: "rgba(96,165,250,0.1)", borderRadius: "10px", color: "#93c5fd", fontSize: "13px", fontWeight: "600", marginBottom: "20px", border: "1px solid rgba(96,165,250,0.2)" }}>📝 Đang chỉnh sửa — ID: {editingId}</div>}
                <form onSubmit={handleSubmitProduct}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div><label style={S.label}>Tên sản phẩm *</label><input required style={S.input} value={formProduct.name} onChange={e => setFormProduct({ ...formProduct, name: e.target.value })} placeholder="Ví dụ: Khuyên tai Cáo Đỏ" /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div><label style={S.label}>Giá (VND) *</label><input required type="number" min="0" style={S.input} value={formProduct.price} onChange={e => setFormProduct({ ...formProduct, price: e.target.value })} placeholder="85000" /></div>
                      <div><label style={S.label}>Tồn kho *</label><input required type="number" min="0" style={S.input} value={formProduct.stock} onChange={e => setFormProduct({ ...formProduct, stock: e.target.value })} placeholder="0" /></div>
                    </div>
                    <div><label style={S.label}>Danh mục *</label><select required style={S.select} value={formProduct.categoryId} onChange={e => setFormProduct({ ...formProduct, categoryId: e.target.value })}><option value="">-- Chọn danh mục --</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <ImageUpload label="Hình ảnh chính *" currentUrl={formProduct.imageUrl} onUpload={url => setFormProduct({ ...formProduct, imageUrl: url })} />
                    
                    <div style={{ marginBottom: "16px" }}>
                      <label style={S.label}>Hình ảnh bổ sung (Gallery)</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "12px" }}>
                        {(formProduct.images || []).map((img, idx) => (
                          <div key={idx} style={{ position: "relative", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button type="button" onClick={() => setFormProduct({ ...formProduct, images: formProduct.images.filter((_, i) => i !== idx) })} style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(255,0,0,0.7)", color: "white", border: "none", borderRadius: "4px", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                      <ImageUpload label="Thêm ảnh gallery" onUpload={url => setFormProduct({ ...formProduct, images: [...(formProduct.images || []), url] })} />
                    </div>

                    <div><label style={S.label}>Mô tả *</label><textarea required rows={3} style={S.textarea} value={formProduct.description} onChange={e => setFormProduct({ ...formProduct, description: e.target.value })} placeholder="Mô tả ngắn về sản phẩm..." /></div>
                    <button type="submit" className="btn-primary" style={S.btnPrimary} disabled={saving}>{saving ? "Đang lưu..." : editingId ? "💾 Lưu thay đổi" : "➕ Thêm sản phẩm"}</button>
                    {editingId && <button type="button" onClick={handleCancelEdit} style={{ ...S.btnOutline, width: "100%", padding: "10px", fontSize: "14px" }}>✕ Hủy chỉnh sửa</button>}
                  </div>
                </form>
              </div>
              <div style={{ ...S.card, marginTop: "20px" }}>
                <div style={S.cardTitle}>📈 Tổng quan</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Tổng sản phẩm", value: products.length, icon: "📦" },
                    { label: "Danh mục", value: categories.length, icon: "🗂" },
                    { label: "Hết hàng", value: products.filter(p => !p.stock || p.stock === 0).length, icon: "⚠️" },
                    { label: "Còn ít (≤5)", value: products.filter(p => p.stock > 0 && p.stock <= 5).length, icon: "⚡" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "24px" }}>{s.icon}</div>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>{s.value}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={S.card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={S.cardTitle}>📋 Danh sách sản phẩm ({products.length})</div>
                <input style={{ ...S.input, width: "220px" }} placeholder="🔍 Tìm sản phẩm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {filteredProducts.length === 0 && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "40px" }}>Không tìm thấy sản phẩm nào.</div>}
                {filteredProducts.map(p => (
                  <div key={p.id} className="product-row" style={S.productRow}>
                    <img src={p.imageUrl} alt={p.name} onError={e => e.target.src = "https://placehold.co/60x60/1e2a4a/666?text=?"} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "700", fontSize: "15px", color: "#fff", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>{getCatName(p.categoryId)} · {Number(p.price).toLocaleString("vi-VN")}đ</div>
                      <StockBadge stock={p.stock} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end", flexShrink: 0 }}>
                      <button style={S.btnEdit} onClick={() => handleEditProduct(p)}>✏️ Sửa</button>
                      <button style={S.btnDanger} onClick={() => handleDeleteProduct(p.id)}>🗑 Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== INVENTORY ===== */}
        {activeTab === "inventory" && (
          <div style={S.card}>
            <div style={S.cardTitle}>📊 Quản lý tồn kho</div>
            <div style={{ marginBottom: "20px" }}><input style={{ ...S.input, maxWidth: "300px" }} placeholder="🔍 Tìm sản phẩm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{["Sản phẩm", "Danh mục", "Giá", "Tồn kho", "Điều chỉnh"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{h}</th>)}</tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "14px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: "12px" }}><img src={p.imageUrl} alt={p.name} onError={e => e.target.src = "https://placehold.co/40x40/1e2a4a/666?text=?"} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }} /><span style={{ fontWeight: "600", color: "#fff", fontSize: "14px" }}>{p.name}</span></div></td>
                      <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>{getCatName(p.categoryId)}</td>
                      <td style={{ padding: "14px 16px", color: "#e85d74", fontWeight: "700", fontSize: "14px" }}>{Number(p.price).toLocaleString("vi-VN")}đ</td>
                      <td style={{ padding: "14px 16px" }}><StockBadge stock={p.stock} /></td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button onClick={() => handleUpdateStock(p, -1)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "rgba(239,68,68,0.2)", color: "#f87171", fontWeight: "700", fontSize: "18px", cursor: "pointer", lineHeight: "1" }}>−</button>
                          <span style={{ minWidth: "36px", textAlign: "center", fontWeight: "700", color: "#fff", fontSize: "16px" }}>{Number(p.stock) || 0}</span>
                          <button onClick={() => handleUpdateStock(p, +1)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "rgba(34,197,94,0.2)", color: "#4ade80", fontWeight: "700", fontSize: "18px", cursor: "pointer", lineHeight: "1" }}>+</button>
                          <button onClick={() => handleUpdateStock(p, +10)} style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "12px", border: "none", background: "rgba(96,165,250,0.15)", color: "#93c5fd", fontWeight: "600", cursor: "pointer" }}>+10</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== CATEGORIES ===== */}
        {activeTab === "categories" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={S.card}>
              <div style={S.cardTitle}>🗂 Quản lý danh mục</div>
              <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                <input style={S.input} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Tên danh mục mới..." />
                <button type="submit" className="btn-primary" style={{ ...S.btnPrimary, width: "auto", padding: "10px 24px", whiteSpace: "nowrap" }} disabled={saving}>+ Thêm</button>
              </form>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {categories.length === 0 && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "32px" }}>Chưa có danh mục nào.</div>}
                {categories.map(c => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ flex: 1, marginRight: "12px" }}>
                      <input 
                        style={{ ...S.input, background: "transparent", border: "none", padding: "0", fontSize: "15px", fontWeight: "700" }} 
                        value={c.name} 
                        onChange={e => handleRenameCategory(c.id, e.target.value)} 
                        onBlur={fetchData}
                        title="Nhấn để đổi tên"
                      />
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{products.filter(p => p.categoryId === c.id).length} sản phẩm</div>
                    </div>
                    <button style={S.btnDanger} onClick={() => handleDeleteCategory(c.id)}>🗑 Xóa</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== HOMEPAGE EDITOR ===== */}
        {activeTab === "homepage" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", alignItems: "start" }}>

            {/* Left column: Basic info & Hero */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Header & Announcement */}
              <div style={S.card}>
                <div style={S.cardTitle}>📣 Thanh thông báo & Social</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={S.label}>Nội dung thông báo (đầu trang)</label>
                    <input style={S.input} value={hp.announcementText || ""} onChange={e => setHp({ ...hp, announcementText: e.target.value })} placeholder="Chào tháng 4 - Ưu đãi ngập tràn! 🦊" />
                  </div>
                  <div>
                    <label style={S.label}>Màu nền thanh thông báo</label>
                    <input type="color" style={{ ...S.input, height: "40px", padding: "4px" }} value={hp.announcementColor || "#e85d74"} onChange={e => setHp({ ...hp, announcementColor: e.target.value })} />
                  </div>
                  <div style={S.divider} />
                  <div>
                    <label style={S.label}>Facebook URL</label>
                    <input style={S.input} value={hp.socialLinks?.facebook || ""} onChange={e => setHp({ ...hp, socialLinks: { ...hp.socialLinks, facebook: e.target.value } })} placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label style={S.label}>Instagram URL</label>
                    <input style={S.input} value={hp.socialLinks?.instagram || ""} onChange={e => setHp({ ...hp, socialLinks: { ...hp.socialLinks, instagram: e.target.value } })} placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label style={S.label}>TikTok URL</label>
                    <input style={S.input} value={hp.socialLinks?.tiktok || ""} onChange={e => setHp({ ...hp, socialLinks: { ...hp.socialLinks, tiktok: e.target.value } })} placeholder="https://tiktok.com/@..." />
                  </div>
                </div>
              </div>

              {/* Hero Banner */}
              <div style={S.card}>
                <div style={S.cardTitle}>🖼 Hero Banner</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>Phần banner lớn trên đầu trang chủ</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={S.label}>Tiêu đề lớn</label>
                    <input style={S.input} value={hp.heroTitle} onChange={e => setHp({ ...hp, heroTitle: e.target.value })} placeholder="Bộ Sưu Tập Mùa Hè" />
                  </div>
                  <div>
                    <label style={S.label}>Phụ đề</label>
                    <input style={S.input} value={hp.heroSubtitle} onChange={e => setHp({ ...hp, heroSubtitle: e.target.value })} placeholder="Khám phá những thiết kế mới nhất..." />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={S.label}>URL Ảnh Hero</label>
                      <input style={S.input} value={hp.heroBannerImage} onChange={e => setHp({ ...hp, heroBannerImage: e.target.value })} placeholder="/images/hero_banner.png" />
                    </div>
                    <div>
                      <label style={S.label}>Nút CTA (kêu gọi hành động)</label>
                      <input style={S.input} value={hp.heroCtaText} onChange={e => setHp({ ...hp, heroCtaText: e.target.value })} placeholder="Xem Ngay" />
                    </div>
                  </div>

                  <div style={S.divider} />
                  <div style={S.sectionLabel}>Banner phụ bên phải</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={S.label}>Banner 1 — Tên</label>
                      <input style={S.input} value={hp.heroBanner1Text} onChange={e => setHp({ ...hp, heroBanner1Text: e.target.value })} placeholder="Phụ Kiện Xinh Xắn" />
                    </div>
                    <div>
                      <ImageUpload label="Banner 1 — Ảnh" currentUrl={hp.banner1Image} onUpload={url => setHp({ ...hp, banner1Image: url })} />
                      <input style={S.input} value={hp.banner1Image} onChange={e => setHp({ ...hp, banner1Image: e.target.value })} placeholder="/images/banner...png" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={S.label}>Banner 1 — Danh mục link</label>
                      <select style={S.select} value={hp.heroBanner1CategoryId} onChange={e => setHp({ ...hp, heroBanner1CategoryId: e.target.value })}>
                        <option value="">— Không chọn —</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div style={{ gridColumn: "1 / -1", ...S.divider, margin: "12px 0" }} />

                    <div>
                      <label style={S.label}>Banner 2 — Tên</label>
                      <input style={S.input} value={hp.heroBanner2Text} onChange={e => setHp({ ...hp, heroBanner2Text: e.target.value })} placeholder="Khuyên Tai Nhỏ Nhắn" />
                    </div>
                    <div>
                      <ImageUpload label="Banner 2 — Ảnh" currentUrl={hp.banner2Image} onUpload={url => setHp({ ...hp, banner2Image: url })} />
                      <input style={S.input} value={hp.banner2Image} onChange={e => setHp({ ...hp, banner2Image: e.target.value })} placeholder="/images/banner...png" />
                    </div>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={S.label}>Banner 2 — Danh mục link</label>
                      <select style={S.select} value={hp.heroBanner2CategoryId} onChange={e => setHp({ ...hp, heroBanner2CategoryId: e.target.value })}>
                        <option value="">— Không chọn —</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Products */}
              <div style={S.card}>
                <div style={S.cardTitle}>⭐ Sản phẩm nổi bật (Featured)</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", lineHeight: "1.6" }}>
                  Sản phẩm được chọn sẽ hiển thị với badge <span style={{ background: "rgba(232,93,116,0.3)", color: "#f9a8b8", padding: "1px 6px", borderRadius: "4px" }}>★ NỔI BẬT</span> và xuất hiện đầu tiên trên trang chủ.
                </div>
                <ProductPicker
                  products={products}
                  selectedIds={hp.featuredProductIds || []}
                  onChange={ids => setHp({ ...hp, featuredProductIds: ids })}
                  label=""
                  description=""
                />
              </div>
            </div>

            {/* Right column: Section pickers */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* New Arrivals */}
              <div style={S.card}>
                <div style={S.cardTitle}>🆕 Section "Sản phẩm mới"</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", lineHeight: "1.6" }}>
                  Chọn sản phẩm xuất hiện trong phần "Sản Phẩm Mới Trình Làng".<br />
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>Nếu không chọn → hiển thị tất cả sản phẩm.</span>
                </div>
                <ProductPicker
                  products={products}
                  selectedIds={hp.newArrivalsIds || []}
                  onChange={ids => setHp({ ...hp, newArrivalsIds: ids })}
                  label="Chọn sản phẩm cụ thể"
                  description=""
                />
              </div>

              {/* Best Sellers */}
              <div style={S.card}>
                <div style={S.cardTitle}>🔥 Section "Bán chạy"</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", lineHeight: "1.6" }}>
                  Chọn sản phẩm xuất hiện trong phần "Sản Phẩm Bán Chạy".<br />
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>Nếu không chọn → hiển thị tất cả (đảo ngược).</span>
                </div>
                <ProductPicker
                  products={products}
                  selectedIds={hp.bestSellersIds || []}
                  onChange={ids => setHp({ ...hp, bestSellersIds: ids })}
                  label="Chọn sản phẩm cụ thể"
                  description=""
                />
              </div>

              {/* Custom Titles & Tags */}
              <div style={S.card}>
                <div style={S.cardTitle}>✍️ Tùy chỉnh tiêu đề Section</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={S.label}>"Sản phẩm mới" - Tiêu đề</label>
                      <input style={S.input} value={hp.newArrivalsTitle || ""} onChange={e => setHp({ ...hp, newArrivalsTitle: e.target.value })} />
                    </div>
                    <div>
                      <label style={S.label}>"Sản phẩm mới" - Tag</label>
                      <input style={S.input} value={hp.newArrivalsTag || ""} onChange={e => setHp({ ...hp, newArrivalsTag: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={S.label}>"Bán chạy" - Tiêu đề</label>
                      <input style={S.input} value={hp.bestSellersTitle || ""} onChange={e => setHp({ ...hp, bestSellersTitle: e.target.value })} />
                    </div>
                    <div>
                      <label style={S.label}>"Bán chạy" - Tag</label>
                      <input style={S.input} value={hp.bestSellersTag || ""} onChange={e => setHp({ ...hp, bestSellersTag: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Strip Editor */}
              <div style={S.card}>
                <div style={S.cardTitle}>🎫 Promo Strip (3 cam kết)</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {(hp.promoStrip || [{},{},{}]).map((item, idx) => (
                    <div key={idx} style={{ padding: "16px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontWeight: "700", marginBottom: "12px", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>CARD #{idx + 1}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "12px", marginBottom: "10px" }}>
                        <div>
                          <label style={S.label}>Icon</label>
                          <input style={{ ...S.input, textAlign: "center", fontSize: "20px" }} value={item.icon || ""} onChange={e => {
                            const newStrip = [...(hp.promoStrip || [{},{},{}])];
                            newStrip[idx] = { ...newStrip[idx], icon: e.target.value };
                            setHp({ ...hp, promoStrip: newStrip });
                          }} placeholder="🚚" />
                        </div>
                        <div>
                          <label style={S.label}>Tiêu đề</label>
                          <input style={S.input} value={item.title || ""} onChange={e => {
                            const newStrip = [...(hp.promoStrip || [{},{},{}])];
                            newStrip[idx] = { ...newStrip[idx], title: e.target.value };
                            setHp({ ...hp, promoStrip: newStrip });
                          }} placeholder="Freeship toàn quốc" />
                        </div>
                      </div>
                      <div>
                        <label style={S.label}>Mô tả dài</label>
                        <input style={S.input} value={item.subtitle || ""} onChange={e => {
                          const newStrip = [...(hp.promoStrip || [{},{},{}])];
                          newStrip[idx] = { ...newStrip[idx], subtitle: e.target.value };
                          setHp({ ...hp, promoStrip: newStrip });
                        }} placeholder="Miễn phí vận chuyển cho đơn từ 300k" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live preview hint + Save */}

              <div style={{ ...S.card, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "20px", lineHeight: "1.8" }}>
                  💡 Sau khi lưu, truy cập <a href="/" target="_blank" style={{ color: "#4ade80", fontWeight: "700" }}>trang chủ</a> để xem thay đổi ngay lập tức.
                </div>
                <button
                  onClick={handleSaveHomepage}
                  disabled={hpSaving}
                  className="btn-primary"
                  style={{ ...S.btnPrimary, fontSize: "16px", padding: "14px", background: hpSaving ? "rgba(34,197,94,0.4)" : "linear-gradient(135deg, #22c55e, #15803d)" }}
                >
                  {hpSaving ? "⏳ Đang lưu..." : "💾 Lưu cấu hình trang chủ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === "orders" && (() => {
          const statusInfo = (s) => ORDER_STATUSES.find(x => x.key === s) || { label: s, color: "#f3f4f6", textColor: "#374151", icon: "•" };
          const filtered = orders.filter(o => {
            const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
            const matchSearch = orderSearch === "" || o.name?.toLowerCase().includes(orderSearch.toLowerCase()) || o.phone?.includes(orderSearch) || o.id?.includes(orderSearch);
            return matchStatus && matchSearch;
          });
          const stats = ORDER_STATUSES.map(s => ({ ...s, count: orders.filter(o => o.status === s.key).length }));

          return (
            <div>
              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "24px" }}>
                {stats.map(s => (
                  <div key={s.key} onClick={() => setOrderStatusFilter(orderStatusFilter === s.key ? "all" : s.key)}
                    style={{ background: orderStatusFilter === s.key ? "rgba(232,93,116,0.15)" : "rgba(255,255,255,0.05)", border: orderStatusFilter === s.key ? "1px solid rgba(232,93,116,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: "#fff" }}>{s.count}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: selectedOrder ? "1fr 380px" : "1fr", gap: "24px", alignItems: "start" }}>

                {/* Orders list */}
                <div style={S.card}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                    <div style={S.cardTitle}>🧾 Danh sách đơn hàng ({filtered.length})</div>
                    <input
                      style={{ ...S.input, flex: 1, minWidth: "180px" }}
                      placeholder="🔍 Tìm theo tên, SĐT, mã đơn..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                    />
                    <select style={{ ...S.select, width: "auto", minWidth: "160px" }} value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}>
                      <option value="all">— Tất cả trạng thái —</option>
                      {ORDER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
                    </select>
                  </div>

                  {ordersLoading ? (
                    <div style={{ textAlign: "center", padding: "48px", color: "rgba(255,255,255,0.4)" }}>⏳ Đang tải đơn hàng...</div>
                  ) : filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px" }}>
                      <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>Không có đơn hàng nào</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {filtered.map(o => {
                        const si = statusInfo(o.status);
                        const isSelected = selectedOrder?.id === o.id;
                        return (
                          <div key={o.id}
                            onClick={() => setSelectedOrder(isSelected ? null : o)}
                            style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", borderRadius: "14px", cursor: "pointer", transition: "all 0.15s", background: isSelected ? "rgba(232,93,116,0.12)" : "rgba(255,255,255,0.04)", border: isSelected ? "1px solid rgba(232,93,116,0.4)" : "1px solid rgba(255,255,255,0.07)" }}>
                            {/* Status dot */}
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: si.color, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: "700", color: "#fff", fontSize: "14px", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {o.name} — {o.phone}
                              </div>
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {o.address}
                              </div>
                              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                                {o.items?.length || 0} sản phẩm · {new Date(o.createdAt).toLocaleString("vi-VN")}
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontWeight: "800", color: "#e85d74", fontSize: "15px", marginBottom: "4px" }}>
                                {Number(o.total).toLocaleString("vi-VN")}đ
                              </div>
                              <div style={{ background: si.color, color: si.textColor, fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "999px", display: "inline-block" }}>
                                {si.icon} {si.label}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Order detail panel */}
                {selectedOrder && (() => {
                  const si = statusInfo(selectedOrder.status);
                  const nextStatuses = ORDER_STATUSES.filter(s => s.key !== selectedOrder.status);
                  return (
                    <div style={{ ...S.card, position: "sticky", top: "90px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <div style={S.cardTitle}>📋 Chi tiết đơn</div>
                        <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
                      </div>

                      {/* Status badge */}
                      <div style={{ background: si.color, color: si.textColor, fontWeight: "800", fontSize: "14px", padding: "8px 16px", borderRadius: "10px", textAlign: "center", marginBottom: "20px" }}>
                        {si.icon} {si.label}
                      </div>

                      {/* Customer info */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                        {[
                          ["👤 Khách hàng", selectedOrder.name],
                          ["📞 Điện thoại", selectedOrder.phone],
                          ["📍 Địa chỉ", selectedOrder.address],
                          ["📅 Đặt lúc", new Date(selectedOrder.createdAt).toLocaleString("vi-VN")],
                          ["🆔 Mã đơn", selectedOrder.id],
                        ].map(([label, val]) => (
                          <div key={label} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", minWidth: "110px", flexShrink: 0 }}>{label}</span>
                            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", fontWeight: "600", wordBreak: "break-all" }}>{val || "—"}</span>
                          </div>
                        ))}
                        {selectedOrder.note && (
                          <div style={{ marginTop: "4px", padding: "10px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
                            📝 {selectedOrder.note}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "14px", marginBottom: "16px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Sản phẩm đặt</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {(selectedOrder.items || []).map((item, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                              <span style={{ color: "rgba(255,255,255,0.75)" }}>{item.name} <span style={{ color: "rgba(255,255,255,0.35)" }}>×{item.qty}</span></span>
                              <span style={{ color: "#e85d74", fontWeight: "700" }}>{(Number(item.price) * item.qty).toLocaleString("vi-VN")}đ</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "10px", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: "800", color: "#fff", fontSize: "16px" }}>
                          <span>Tổng cộng</span>
                          <span style={{ color: "#e85d74" }}>{Number(selectedOrder.total).toLocaleString("vi-VN")}đ</span>
                        </div>
                      </div>

                      {/* Change status */}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "14px", marginBottom: "14px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Cập nhật trạng thái</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                          {nextStatuses.map(ns => (
                            <button key={ns.key}
                              onClick={() => handleUpdateOrderStatus(selectedOrder.id, ns.key)}
                              style={{ padding: "9px 14px", borderRadius: "9px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: "13px", fontWeight: "600", textAlign: "left", transition: "background 0.15s" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                            >
                              {ns.icon} Chuyển → {ns.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                        style={{ width: "100%", padding: "9px", borderRadius: "9px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.1)", color: "#f87171", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}
                      >
                        🗑 Xóa đơn hàng này
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}

        {/* ===== ANALYTICS ===== */}
        {activeTab === "analytics" && (() => {
          const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((acc, o) => acc + Number(o.total || 0), 0);
          const totalOrders = orders.length;
          const pendingOrders = orders.filter(o => o.status === "pending").length;
          const totalMessages = contacts.length;
          const unreadMessages = contacts.filter(c => !c.read).length;

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                {[
                  { label: "Doanh thu tổng", value: `${totalRevenue.toLocaleString("vi-VN")}đ`, icon: "💰", color: "#4ade80" },
                  { label: "Tổng đơn hàng", value: totalOrders, icon: "📦", color: "#60a5fa" },
                  { label: "Đơn chờ xử lý", value: pendingOrders, icon: "⏳", color: "#fbbf24" },
                  { label: "Tin nhắn khách", value: totalMessages, icon: "💬", color: "#f472b6" },
                ].map(s => (
                  <div key={s.label} style={{ ...S.card, textAlign: "center", borderLeft: `4px solid ${s.color}` }}>
                    <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
                    <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{s.value}</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={S.cardTitle}>📈 Lịch sử tăng trưởng (Đang cập nhật...)</div>
                <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", color: "rgba(255,255,255,0.3)" }}>
                  Biểu đồ doanh thu theo thời gian sẽ xuất hiện tại đây.
                </div>
              </div>
            </div>
          );
        })()}

        {/* ===== COUPONS ===== */}
        {activeTab === "coupons" && (
          <div style={S.grid}>
            <div style={S.card}>
              <div style={S.cardTitle}>🎟 Thêm mã giảm giá</div>
              <form onSubmit={handleAddCoupon}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={S.label}>Mã (viết liền, không dấu)</label>
                    <input name="code" required style={S.input} placeholder="FOXY2026" />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={S.label}>Loại</label>
                      <select name="type" style={S.select}>
                        <option value="fixed">Số tiền cố định (đ)</option>
                        <option value="percent">Phần trăm (%)</option>
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>Giá trị</label>
                      <input name="value" type="number" required style={S.input} placeholder="20000" />
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Đơn hàng tối thiểu (đ)</label>
                    <input name="minOrder" type="number" style={S.input} placeholder="100000" />
                  </div>
                  <button type="submit" className="btn-primary" style={S.btnPrimary}>➕ Tạo mã</button>
                </div>
              </form>
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>📋 Danh sách mã ({coupons.length})</div>
              {couponsLoading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>⏳ Đang tải...</div>
              ) : coupons.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>Chưa có mã giảm giá.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {coupons.map(c => (
                    <div key={c.id} style={{ ...S.productRow, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ fontSize: "24px" }}>🎟</div>
                        <div>
                          <div style={{ fontWeight: "800", color: "#e85d74", fontSize: "16px" }}>{c.code}</div>
                          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
                            {c.type === "percent" ? `Giảm ${c.value}%` : `Giảm ${Number(c.value).toLocaleString("vi-VN")}đ`} 
                            {c.minOrder > 0 && ` · Đơn ≥ ${Number(c.minOrder).toLocaleString("vi-VN")}đ`}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button onClick={() => toggleCouponStatus(c)} style={{ ...S.btnOutline, color: c.active ? "#4ade80" : "#fbbf24", borderColor: c.active ? "#4ade8055" : "#fbbf2455" }}>
                          {c.active ? "● Đang hoạt động" : "○ Đã tắt"}
                        </button>
                        <button style={S.btnDanger} onClick={() => handleDeleteCoupon(c.id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== CONTACTS ===== */}
        {activeTab === "contacts" && (
          <div style={S.card}>
            <div style={S.cardTitle}>💬 Tin nhắn từ khách hàng ({contacts.length})</div>
            {contactsLoading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>⏳ Đang tải...</div>
            ) : contacts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.4)" }}>Chưa có tin nhắn nào.</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                {contacts.sort((a,b) => b.id - a.id).map(c => (
                  <div key={c.id} style={{ ...S.productRow, padding: "20px", flexDirection: "column", alignItems: "start", background: c.read ? "rgba(255,255,255,0.02)" : "rgba(232,93,116,0.06)", border: c.read ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(232,93,116,0.3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "12px" }}>
                      <div>
                        <span style={{ fontWeight: "800", fontSize: "16px", color: "#fff", marginRight: "12px" }}>{c.name}</span>
                        <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{c.phone} · {c.email}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>{c.createdAt ? new Date(c.createdAt).toLocaleString("vi-VN") : "—"}</div>
                    </div>
                    <div style={{ background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "10px", width: "100%", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
                      {c.message}
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {!c.read && <button onClick={() => handleMarkContactRead(c.id)} style={{ ...S.btnEdit, background: "#16a34a33", color: "#4ade80", borderColor: "#4ade8055" }}>✓ Đã đọc</button>}
                      <button onClick={() => handleDeleteContact(c.id)} style={S.btnDanger}>🗑 Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


      {/* Toast */}
      {toast && <div style={S.toast(toast.type)}>{toast.msg}</div>}
      </div>
    </div>
  );
}
