import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Về Chúng Tôi — Foxy Handmade",
  description:
    "Câu chuyện về Foxy Handmade — thương hiệu phụ kiện thủ công handmade với tình yêu và tâm huyết.",
};

const values = [
  {
    icon: "🎨",
    title: "Thiết kế có cá tính",
    desc: "Mỗi mẫu được lên ý tưởng riêng để bạn đeo hằng ngày vẫn thấy có điểm nhấn rất Foxy.",
  },
  {
    icon: "💎",
    title: "Chọn chất liệu kỹ",
    desc: "Tụi mình ưu tiên nguyên liệu bền, nhẹ và đủ an toàn để món phụ kiện dùng lâu vẫn đẹp.",
  },
  {
    icon: "🌱",
    title: "Tử tế với môi trường",
    desc: "Bao bì và cách đóng gói được tiết chế để vừa xinh vừa hạn chế lãng phí không cần thiết.",
  },
  {
    icon: "🧵",
    title: "Làm tay tỉ mỉ",
    desc: "Không làm hàng loạt. Mỗi sản phẩm đều được hoàn thiện cẩn thận qua từng công đoạn nhỏ.",
  },
  {
    icon: "🚚",
    title: "Gửi đi chỉn chu",
    desc: "Đóng gói đẹp như quà tặng và hỗ trợ giao toàn quốc để bạn yên tâm đặt cho mình hay cho người thương.",
  },
  {
    icon: "🤍",
    title: "Hỗ trợ thật lòng",
    desc: "Nếu bạn phân vân quà tặng hay cần chọn mẫu phù hợp, shop luôn sẵn sàng tư vấn nhanh gọn.",
  },
];

const stats = [
  { num: "500+", label: "Khách hàng hài lòng" },
  { num: "1000+", label: "Sản phẩm đã được chọn" },
  { num: "50+", label: "Mẫu thiết kế riêng" },
];

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingBottom: "84px" }}>
      <div className="breadcrumb">
        <Link href="/">Trang chủ</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Về chúng tôi</span>
      </div>

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

          <span className="hero-kicker">Câu chuyện của Foxy Handmade</span>
        </div>
        <h1 className="about-hero-title">Những món đồ nhỏ xinh được làm bằng tay và bằng cả sự dịu dàng</h1>
        <p className="about-hero-text">
          Foxy Handmade bắt đầu từ mong muốn tạo ra những món phụ kiện dễ thương nhưng vẫn đủ tinh
          tế để bạn dùng mỗi ngày, tặng ai đó, hoặc giữ lại như một niềm vui nho nhỏ cho chính mình.
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

      <section className="section-shell-alt">
        <div className="about-story-grid">
          <div className="section-copy">
            <span className="section-eyebrow">Bắt đầu từ niềm đam mê thủ công</span>
            <h2>Foxy tin rằng một món phụ kiện nhỏ cũng có thể kể câu chuyện riêng của người đeo</h2>
            <p>
              Tụi mình bắt đầu từ tình yêu với những món đồ handmade xinh xắn. Không chỉ là vật trang
              trí, mỗi chiếc khuyên tai hay chiếc kẹp tóc còn là cách bạn thể hiện tâm trạng, gu thẩm
              mỹ và sự chăm chút dành cho bản thân.
            </p>
            <p>
              Vì vậy Foxy chọn đi chậm ở những đoạn quan trọng: lên mẫu kỹ hơn, làm tay cẩn thận hơn,
              đóng gói chỉn chu hơn và ưu tiên cảm giác “nhận được một món quà nhỏ” khi khách mở hộp.
            </p>
          </div>

          <div className="about-quote-card">
            <div className="about-quote-logo">
              <Image src="/logo.png" alt="Foxy Handmade" width={72} height={72} sizes="72px" />
            </div>
            <p>
              "Chúng tôi không làm hàng loạt. Chúng tôi làm từng sản phẩm với tất cả tình yêu."
            </p>
            <span>Người sáng lập Foxy Handmade</span>
          </div>
        </div>
      </section>

      <section className="section-shell-alt">
        <div className="section-intro">
          <div className="section-copy">
            <span className="section-eyebrow">Giá trị cốt lõi</span>
            <h2>Những điều tụi mình giữ lại trong từng thiết kế</h2>
            <p>
              Dù là một món quà nhỏ hay phụ kiện cho ngày thường, Foxy vẫn muốn người nhận cảm thấy có
              sự chăm chút, dịu dàng và khác biệt vừa đủ.
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

      <section className="about-stats-shell">
        {stats.map((item) => (
          <div key={item.label} className="about-stat-card">
            <strong>{item.num}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="listing-hero about-cta">
        <span className="section-eyebrow">Sẵn sàng khám phá?</span>
        <h2 className="listing-hero-title">Những mẫu phụ kiện handmade xinh xắn đang chờ bạn</h2>
        <p className="listing-hero-subtitle">
          Nếu bạn muốn xem các thiết kế mới nhất hoặc cần chọn quà thật nhanh, tụi mình đã sắp sẵn mọi
          thứ ở trang chủ và trang khám phá.
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
