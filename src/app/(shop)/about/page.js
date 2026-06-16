import Image from "next/image";
import Link from "next/link";
import AboutGalleryClient from "@/components/AboutGalleryClient";

export const metadata = {
  title: "Về Chúng Tôi — Foxy Handmade & Workshop",
  description:
    "Tìm hiểu câu chuyện về Foxy Handmade & Workshop — tiệm thủ công mỹ nghệ, lớp học workshop dạy làm đồ handmade tại TP.HCM.",
};

const values = [
  {
    icon: "🦊",
    title: "Độc bản & Dấu ấn riêng",
    desc: "Đồ handmade mang dấu ấn cá nhân, gần như không có hai sản phẩm nào giống hoàn toàn nhau.",
  },
  {
    icon: "⏳",
    title: "Công sức & Kỹ thuật",
    desc: "Mỗi món đồ nhỏ đều chứa đựng thời gian, công sức và kỹ năng thủ công tỉ mỉ của người làm.",
  },
  {
    icon: "🤍",
    title: "Giá trị cảm xúc cao",
    desc: "Được tạo ra với sự chăm chút và câu chuyện riêng biệt, mang lại cảm giác ấm áp, có tâm cho người nhận.",
  },
  {
    icon: "🎁",
    title: "Cá nhân hóa quà tặng",
    desc: "Nhiều sản phẩm có thể tùy chỉnh theo tên, màu sắc, sở thích hoặc kỷ niệm riêng của bạn.",
  },
  {
    icon: "🎨",
    title: "Nghệ thuật truyền thống",
    desc: "Góp phần lưu giữ nét đẹp nghệ thuật và kỹ năng thủ công qua việc chế tác bằng tay.",
  },
  {
    icon: "💎",
    title: "Giá trị độc bản",
    desc: "Đối với người sưu tầm, đồ handmade mang giá trị sưu tập cao và rất khó để thay thế.",
  },
];

const stats = [
  { num: "100%", label: "Làm bằng tay (Handmade)" },
  { num: "500+", label: "Học viên Workshop" },
  { num: "2025+", label: "Hợp tác thương hiệu lớn" },
];

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingBottom: "84px" }}>
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Về chúng tôi</span>
      </div>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-header">
          <div className="about-hero-mark">
            <Image
              src="/logo.png"
              alt="Logo Foxy Handmade"
              width={120}
              height={120}
              sizes="120px"
              priority
            />
          </div>
          <span className="hero-kicker">Câu chuyện của Foxy Handmade & Workshop</span>
        </div>
        <h1 className="about-hero-title">Đồ thủ công làm bằng tay, đong đầy cảm xúc và dấu ấn riêng</h1>
        <p className="about-hero-text">
          Sản phẩm thủ công của Foxy Handmade được hoàn thiện hoàn toàn bằng tay từ nhiều chất liệu độc đáo:
          đất sét tự khô, vải, keo epoxy, vỏ sò... Mỗi sản phẩm tạo ra đều là duy nhất và mang một câu chuyện của riêng nó.
        </p>

        <div className="hero-stat-grid">
          {stats.map((item) => (
            <div key={item.label} className="hero-stat-card">
              <strong>{item.num}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="section-shell-alt">
        <div className="about-story-grid">
          <div className="section-copy">
            <span className="section-eyebrow">Sứ mệnh của chúng tôi</span>
            <h2>Mang nghệ thuật thủ công mỹ nghệ và workshop trải nghiệm đến gần bạn hơn</h2>
            <p>
              Được sáng lập bởi <strong>chị Ri Mỹ Quyên</strong>, Foxy Handmade & Workshop hoạt động
              trong lĩnh vực Thủ công Mỹ nghệ với mong muốn mang lại niềm vui, sự thư giãn và cảm xúc trọn vẹn
              qua từng món quà nhỏ hay các lớp học trải nghiệm.
            </p>
            <p>
              Tụi mình tin rằng việc làm đồ thủ công không chỉ là tạo ra sản phẩm, mà còn là hành trình
              chữa lành, lưu giữ nét đẹp truyền thống và gắn kết mọi người thông qua các buổi workshop sáng tạo.
            </p>
          </div>

          <div className="about-quote-card">
            <div className="about-quote-logo">
              <Image src="/logo.png" alt="Foxy Handmade" width={72} height={72} sizes="72px" />
            </div>
            <p>
              "Sản phẩm thủ công của cửa hàng hoàn toàn được làm bằng tay, mỗi tác phẩm là độc nhất và mang một dấu ấn riêng."
            </p>
            <span>Ri Mỹ Quyên — Sáng lập Foxy Handmade & Workshop</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-shell-alt" style={{ padding: "60px 0" }}>
        <div className="section-intro" style={{ marginBottom: "40px" }}>
          <div className="section-copy">
            <span className="section-eyebrow">Hoạt động tại Foxy</span>
            <h2>Dịch vụ & Lĩnh vực hoạt động</h2>
            <p>
              Chúng tôi tự hào cung cấp các sản phẩm làm tay tinh xảo và các buổi workshop trải nghiệm bổ ích.
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
          {[
            { icon: "🛍️", title: "Bán lẻ Mỹ nghệ", desc: "Trưng bày và bán các mặt hàng phụ kiện, trang trí thủ công làm tay tinh xảo, độc bản." },
            { icon: "📐", title: "Làm theo yêu cầu", desc: "Nhận đặt làm sản phẩm thủ công được thiết kế và cá nhân hóa theo ý tưởng riêng." },
            { icon: "🏫", title: "Workshop Cá Nhân", desc: "Tổ chức các buổi dạy làm đồ thủ công cá nhân, nơi bạn tự tay tạo nên tác phẩm của mình." },
            { icon: "🏢", title: "Workshop Sự Kiện", desc: "Tổ chức workshop thủ công gắn kết tập thể cho các sự kiện, doanh nghiệp và tổ chức." }
          ].map((s, idx) => (
            <div key={idx} className="about-value-card" style={{ padding: "30px 24px", background: "white", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>{s.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px", color: "var(--text-primary)" }}>{s.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.5" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="section-shell-alt">
        <div className="section-intro">
          <div className="section-copy">
            <span className="section-eyebrow">Giá trị cốt lõi</span>
            <h2>Tại sao nên lựa chọn sản phẩm Handmade?</h2>
            <p>
              Một món quà làm tay không chỉ là vật chất, mà còn là thông điệp yêu thương, sự trân trọng
              và thời gian quý báu mà người làm đã gửi gắm.
            </p>
          </div>
        </div>

        <div className="about-values-grid">
          {values.map((value) => (
            <article key={value.title} className="about-value-card">
              <div className="about-value-icon">{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="section-shell-alt" style={{ padding: "60px 0" }}>
        <div className="section-intro" style={{ marginBottom: "40px" }}>
          <div className="section-copy">
            <span className="section-eyebrow">Hợp tác & Thành tựu</span>
            <h2>Dấu ấn & Hợp tác 2025 - 2026</h2>
            <p>
              Chúng tôi tự hào khi nhận được sự đồng hành từ các cơ quan truyền thông lớn và các đối tác uy tín.
            </p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {/* Media */}
          <div style={{ background: "white", padding: "30px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
            <h3 style={{ fontSize: "18px", color: "var(--brand-red-dark)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span>📺</span> Truyền thông Quốc gia
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
              <li style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ color: "var(--text-primary)", fontSize: "15px" }}>VTV9</strong>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Đồng hành trong chương trình "Việt Nam ơi! Mình cùng đi"</span>
              </li>
              <li style={{ display: "flex", flexDirection: "column" }}>
                <strong style={{ color: "var(--text-primary)", fontSize: "15px" }}>HTV1</strong>
                <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Xuất hiện giới thiệu trong chương trình "Vươn Khơi"</span>
              </li>
            </ul>
          </div>

          {/* Corporate workshops */}
          <div style={{ background: "white", padding: "30px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
            <h3 style={{ fontSize: "18px", color: "var(--brand-red-dark)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span>🏢</span> Đối Tác Workshop & Sự Kiện
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                "Mercure Vũng Tàu",
                "Ibis Styles Vũng Tàu",
                "Trường Nga Vietso",
                "California Fitness"
              ].map((partner, idx) => (
                <div key={idx} style={{ padding: "12px", background: "var(--bg-section)", borderRadius: "var(--radius-sm)", fontSize: "14px", fontWeight: "600", textAlign: "center", color: "var(--text-primary)" }}>
                  {partner}
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div style={{ background: "white", padding: "30px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
            <h3 style={{ fontSize: "18px", color: "var(--brand-red-dark)", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span>🏆</span> Giải thưởng nổi bật
            </h3>
            <div style={{ marginBottom: "12px" }}>
              <strong style={{ display: "block", color: "var(--text-primary)", fontSize: "15px" }}>The Grand Ho Tram Strip & Casino</strong>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-secondary)" }}>🎈 Lantern making contest</span>
                <strong style={{ color: "var(--brand-red-dark)" }}>Giải Ba</strong>
              </li>
              <li style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--text-secondary)" }}>🎄 Christmas decoration contest</span>
                <strong style={{ color: "var(--brand-red-dark)" }}>Giải Ba</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-shell-alt">
        <div className="section-intro">
          <div className="section-copy" style={{ textAlign: "center", margin: "0 auto 24px" }}>
            <span className="section-eyebrow">Thư viện ảnh</span>
            <h2>Góc nhỏ Foxy Handmade</h2>
            <p style={{ maxWidth: "600px", margin: "0 auto" }}>
              Những hình ảnh chân thực về các dòng sản phẩm phụ kiện làm tay xinh xắn, 
              không gian trưng bày và tình yêu được gửi gắm trọn vẹn trong từng chi tiết.
            </p>
          </div>
        </div>

        <AboutGalleryClient />
      </section>

      {/* CTA Section */}
      <section className="listing-hero about-cta">
        <span className="section-eyebrow">Sẵn sàng khám phá?</span>
        <h2 className="listing-hero-title">Những mẫu phụ kiện handmade xinh xắn đang chờ bạn</h2>
        <p className="listing-hero-subtitle">
          Nếu bạn muốn xem các thiết kế mới nhất hoặc cần đặt làm mẫu theo yêu cầu riêng, 
          hãy kết nối ngay với Foxy!
        </p>
        <div className="about-cta-actions">
          <Link href="/" className="btn">
            Khám phá sản phẩm
          </Link>
          <Link href="/contact" className="btn btn-outline">
            Liên hệ với Foxy
          </Link>
        </div>
      </section>
    </div>
  );
}
