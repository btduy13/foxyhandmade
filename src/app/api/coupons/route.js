export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.trim();

  if (code) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .limit(1);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.length ? [data[0]] : []);
  }

  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { data, error } = await supabase.from('coupons').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const body = await request.json();
  const normalizedCode = String(body.code || '').trim().toUpperCase();
  if (!normalizedCode) {
    return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
  }

  const { data: existing, error: existingError } = await supabase
    .from('coupons')
    .select('id')
    .eq('code', normalizedCode);

  if (existingError) return NextResponse.json({ error: existingError.message }, { status: 500 });
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
  }

  const newCoupon = {
    id: `coup_${Date.now()}`,
    code: normalizedCode,
    type: body.type || 'percent',
    value: Number(body.value),
    minOrder: Number(body.minOrder) || 0,
    active: body.active !== false,
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('coupons').insert([newCoupon]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { id, active } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing coupon id' }, { status: 400 });
  }

  const { data, error } = await supabase.from('coupons').update({ active }).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing coupon id' }, { status: 400 });
  }

  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
