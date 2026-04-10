export const metadata = {
  title: "Về Chúng Tôi — Foxy Handmade",
  description: "Câu chuyện về Foxy Handmade — thương hiệu phụ kiện thủ công handmade với tình yêu và tâm huyết.",
};

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingBottom: "80px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Trang chủ</a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Về chúng tôi</span>
      </div>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-red-dark) 100%)",
        borderRadius: "var(--radius-lg)", padding: "60px 40px", textAlign: "center",
        marginBottom: "56px", color: "#fff", position: "relative", overflow: "hidden",
      }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🦊</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: "700", marginBottom: "16px" }}>
          Foxy Handmade
        </h1>
        <p style={{ fontSize: "18px", opacity: 0.9, maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
          Mỗi sản phẩm là một câu chuyện — được tạo ra từ đôi tay và trái tim.
        </p>
      </div>

      {/* Story */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", marginBottom: "64px" }}>
        <div>
          <span className="section-tag" style={{ marginBottom: "16px", display: "inline-block" }}>✨ Câu chuyện của chúng tôi</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "var(--text-primary)", marginBottom: "20px", lineHeight: 1.3 }}>
            Bắt đầu từ niềm đam mê thủ công
          </h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, fontSize: "15px", marginBottom: "16px" }}>
            Foxy Handmade ra đời từ tình yêu đặc biệt với những món đồ handmade xinh xắn. 
            Chúng tôi tin rằng mỗi phụ kiện không chỉ là vật trang trí — mà còn là cách bạn 
            thể hiện cá tính và phong cách của mình.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.9, fontSize: "15px" }}>
            Từng chiếc khuyên tai, từng chiếc kẹp tóc đều được làm thủ công tỉ mỉ, 
            với nguyên liệu được chọn lọc kỹ càng để đảm bảo chất lượng và độ bền tốt nhất.
          </p>
        </div>
        <div style={{
          background: "var(--bg-section)", borderRadius: "var(--radius-lg)",
          padding: "40px", border: "1px solid var(--border-light)", textAlign: "center",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎀</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.6 }}>
            "Chúng tôi không làm hàng loạt. Chúng tôi làm từng sản phẩm với tất cả tình yêu."
          </p>
          <p style={{ color: "var(--text-muted)", marginTop: "16px", fontSize: "14px" }}>— Người sáng lập Foxy Handmade</p>
        </div>
      </div>

      {/* Values */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="section-tag" style={{ marginBottom: "12px", display: "inline-block" }}>💝 Giá trị cốt lõi</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "var(--text-primary)" }}>
            Tại sao chọn Foxy?
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { icon: "🎨", title: "Thiết kế độc đáo", desc: "Mỗi mẫu được thiết kế riêng, không đại trà, không hàng loạt. Bạn sẽ có phụ kiện thực sự độc nhất." },
            { icon: "💎", title: "Chất liệu cao cấp", desc: "Chúng tôi chỉ dùng nguyên liệu được kiểm định kỹ về độ an toàn và chất lượng lâu dài." },
            { icon: "🌱", title: "Thân thiện môi trường", desc: "Ưu tiên vật liệu tái chế và bao bì thân thiện với môi trường trong mọi sản phẩm." },
            { icon: "🤍", title: "Làm bằng tay", desc: "100% handmade — từng đường kim mũi chỉ đều mang dấu ấn và tình yêu của người thợ." },
            { icon: "🚚", title: "Giao hàng tận nơi", desc: "Freeship cho đơn từ 300k, đóng gói cẩn thận và đẹp như quà tặng cho người thân yêu." },
            { icon: "🔄", title: "Đổi trả dễ dàng", desc: "7 ngày đổi trả nếu sản phẩm không đúng mô tả. Cam kết hoàn tiền 100% nếu có lỗi từ shop." },
          ].map(v => (
            <div key={v.title} style={{
              background: "white", border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)", padding: "28px 24px",
              textAlign: "center", transition: "box-shadow 0.2s",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "14px" }}>{v.icon}</div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "10px" }}>{v.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        background: "var(--bg-section)", borderRadius: "var(--radius-lg)",
        padding: "40px", border: "1px solid var(--border-light)", marginBottom: "56px",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {[
            { num: "500+", label: "Khách hàng hài lòng" },
            { num: "1000+", label: "Sản phẩm đã bán" },
            { num: "50+", label: "Mẫu thiết kế độc quyền" },
            { num: "5★", label: "Đánh giá trung bình" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: "36px", fontWeight: "900", color: "var(--brand-primary)", marginBottom: "6px" }}>{s.num}</div>
              <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "var(--text-primary)", marginBottom: "16px" }}>
          Sẵn sàng khám phá?
        </h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "15px" }}>
          Hàng trăm mẫu phụ kiện handmade xinh xắn đang chờ bạn
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <a href="/" className="btn">🛍 Khám phá sản phẩm</a>
          <a href="/contact" className="btn btn-outline">💬 Liên hệ chúng tôi</a>
        </div>
      </div>
    </div>
  );
}
