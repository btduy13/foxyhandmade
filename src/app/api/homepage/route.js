import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');
const readDb = () => JSON.parse(fs.readFileSync(getDbPath(), 'utf-8'));
const writeDb = (data) => fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');

const DEFAULT_HOMEPAGE = {
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

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.homepage || DEFAULT_HOMEPAGE);
}

export async function PUT(request) {
  const config = await request.json();
  const db = readDb();
  db.homepage = { ...(db.homepage || DEFAULT_HOMEPAGE), ...config };
  writeDb(db);
  return NextResponse.json(db.homepage);
}
