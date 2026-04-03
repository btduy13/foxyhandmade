import fs from 'fs';
import path from 'path';

function getDb() {
  const fileData = fs.readFileSync(path.join(process.cwd(), 'src/data/db.json'), 'utf-8');
  return JSON.parse(fileData);
}

export default async function ProductDetails({ params }) {
  const { id } = await params;
  const db = getDb();
  const product = db.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 20px", textAlign: "center" }}>
        <h2>Product not found (404)</h2>
        <a href="/" className="btn" style={{ marginTop: "16px" }}>Go back home</a>
      </div>
    );
  }

  const category = db.categories.find(c => c.id === product.categoryId);

  return (
    <main className="container" style={{ padding: "60px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* Product Image */}
        <div style={{ backgroundColor: "var(--bg-color)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }} 
          />
        </div>

        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: "8px", fontWeight: "600", color: "var(--pastel-red)", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>
            {category ? category.name : "Uncategorized"}
          </div>
          <h1 style={{ fontSize: "36px", color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.2 }}>
            {product.name}
          </h1>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--pastel-red-dark)", marginBottom: "24px" }}>
            {product.price.toLocaleString()}đ
          </div>

          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px", lineHeight: 1.8 }}>
            {product.description}
          </p>

          <div style={{ display: "flex", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "32px" }}>
            <input type="number" defaultValue="1" min="1" className="form-input" style={{ width: "100px", fontSize: "16px", textAlign: "center" }} />
            <button className="btn" style={{ flex: 1, fontSize: "18px" }}>Add to Cart 🛒</button>
          </div>

          <div style={{ marginTop: "32px", padding: "20px", backgroundColor: "#fff9fa", borderRadius: "var(--radius-sm)", border: "1px dashed var(--pastel-red-dark)" }}>
            <h4 style={{ color: "var(--pastel-red-dark)", marginBottom: "8px" }}>🦊 Handmade Quality Guarantee</h4>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              Every item is crafted with love. Due to the handmade nature, slight imperfections or variations may occur, making your piece completely unique!
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
