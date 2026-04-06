"use client";
import { useState, useEffect, useCallback } from "react";

const EMPTY_PRODUCT = { name: "", price: "", categoryId: "", imageUrl: "", description: "", stock: "" };
const DEFAULT_HP = {
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
  bestSellersIds: [],
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

  useEffect(() => { fetchData(); fetchHomepage(); }, [fetchData, fetchHomepage]);

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
    if (editingId) {
      await fetch("/api/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formProduct, id: editingId, price: Number(formProduct.price), stock: Number(formProduct.stock) }) });
      showToast("Đã cập nhật sản phẩm!");
      setEditingId(null);
    } else {
      await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formProduct, price: Number(formProduct.price), stock: Number(formProduct.stock) }) });
      showToast("Đã thêm sản phẩm!");
    }
    setFormProduct(EMPTY_PRODUCT);
    await fetchData();
    setSaving(false);
  };

  const handleEditProduct = (p) => {
    setEditingId(p.id);
    setFormProduct({ name: p.name, price: String(p.price), categoryId: p.categoryId, imageUrl: p.imageUrl, description: p.description, stock: String(p.stock ?? 0) });
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
            { key: "products", label: "📦 Sản phẩm" },
            { key: "inventory", label: "📊 Kho hàng" },
            { key: "categories", label: "🗂 Danh mục" },
            { key: "homepage", label: "🎨 Trang chủ" },
          ].map(t => (
            <button key={t.key} style={S.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </div>
        <a href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", textDecoration: "none", fontWeight: "600" }}>← Về trang chủ</a>
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
                    <div><label style={S.label}>URL hình ảnh *</label><input required style={S.input} value={formProduct.imageUrl} onChange={e => setFormProduct({ ...formProduct, imageUrl: e.target.value })} placeholder="https://... hoặc /images/example.png" /></div>
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
                    <div>
                      <div style={{ fontWeight: "700", color: "#fff", fontSize: "15px" }}>{c.name}</div>
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

            {/* Left column: Hero + Featured */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

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
                      <label style={S.label}>Banner 1 — URL Ảnh</label>
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
                      <label style={S.label}>Banner 2 — URL Ảnh</label>
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

      </div>

      {/* Toast */}
      {toast && <div style={S.toast(toast.type)}>{toast.msg}</div>}
    </div>
  );
}
