export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
  const { data, error } = await supabase.from('homepage').select('data').eq('id', 'default').single();
  if (error || !data) return NextResponse.json(DEFAULT_HOMEPAGE);
  return NextResponse.json(data.data || DEFAULT_HOMEPAGE);
}

export async function PUT(request) {
  const config = await request.json();
  
  // fetch existing first to merge
  const { data: existing } = await supabase.from('homepage').select('data').eq('id', 'default').single();
  const merged = { ...(existing?.data || DEFAULT_HOMEPAGE), ...config };
  
  const { data, error } = await supabase
    .from('homepage')
    .upsert({ id: 'default', data: merged })
    .select();
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data[0].data);
}
