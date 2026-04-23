export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

const DEFAULT_HOMEPAGE = {
  heroTitle: 'Bo Suu Tap Mua He',
  heroSubtitle: 'Kham pha nhung thiet ke moi nhat danh rieng cho ban',
  heroCtaText: 'Xem Ngay',
  heroBannerImage: '/images/hero_banner.png',
  heroBanner1Text: 'Phu Kien Xinh Xan',
  heroBanner1CategoryId: '',
  banner1Image: '/images/banner_earrings.png',
  heroBanner2Text: 'Khuyen Tai Nho Nhan',
  heroBanner2CategoryId: '',
  banner2Image: '/images/banner_clips.png',
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
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const config = await request.json();
  const { data: existing } = await supabase.from('homepage').select('data').eq('id', 'default').single();
  const merged = { ...(existing?.data || DEFAULT_HOMEPAGE), ...config };

  const { data, error } = await supabase
    .from('homepage')
    .upsert({ id: 'default', data: merged })
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0].data);
}
