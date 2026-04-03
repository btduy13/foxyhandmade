"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    categoryId: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories")
      ]);
      setProducts(await prodRes.json());
      setCategories(await catRes.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return;
    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: newCategoryName }),
    });
    setNewCategoryName("");
    fetchData();
  };

  const handleDeleteCategory = async (id) => {
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ ...newProduct, price: Number(newProduct.price) }),
    });
    setNewProduct({ name: "", price: "", categoryId: "", imageUrl: "", description: "" });
    fetchData();
  };

  const handleDeleteProduct = async (id) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="container" style={{ padding: '40px 0' }}><h3>Loading Dashboard...</h3></div>;

  return (
    <div className="container" style={{ padding: "40px 0" }}>
      <h1 style={{ marginBottom: "24px", color: "var(--pastel-red-dark)" }}>foxOS - Master Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
        
        {/* Categories Section */}
        <div className="card" style={{ padding: "24px" }}>
          <h2>Categories</h2>
          <hr style={{ margin: "16px 0", borderTop: "1px solid var(--border-color)" }} />
          
          <form onSubmit={handleAddCategory} className="form-group">
            <label className="form-label">New Category Name</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input 
                className="form-input" 
                value={newCategoryName} 
                onChange={e => setNewCategoryName(e.target.value)} 
                placeholder="e.g. Necklaces"
              />
              <button type="submit" className="btn">Add</button>
            </div>
          </form>

          <ul style={{ listStyle: "none", marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {categories.map(c => (
              <li key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px", background: "var(--bg-color)", borderRadius: "var(--radius-sm)" }}>
                {c.name}
                <button className="btn btn-outline" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => handleDeleteCategory(c.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Section */}
        <div className="card" style={{ padding: "24px" }}>
          <h2>Products</h2>
          <hr style={{ margin: "16px 0", borderTop: "1px solid var(--border-color)" }} />
          
          <form onSubmit={handleAddProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input required className="form-input" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price (VND)</label>
              <input required type="number" className="form-input" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select required className="form-select" value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input required className="form-input" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} placeholder="https://..." />
            </div>

            <div className="form-group" style={{ gridColumn: "span 2" }}>
              <label className="form-label">Description</label>
              <textarea required className="form-textarea" rows="3" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
            </div>

            <button type="submit" className="btn" style={{ gridColumn: "span 2" }}>Add Product</button>
          </form>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {products.map(p => (
              <div key={p.id} style={{ display: "flex", gap: "12px", padding: "12px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px" }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: "14px" }}>{p.name}</h4>
                  <p style={{ margin: "4px 0", color: "var(--pastel-red)", fontWeight: "600", fontSize: "14px" }}>{p.price.toLocaleString()}đ</p>
                  <button className="btn btn-outline" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
