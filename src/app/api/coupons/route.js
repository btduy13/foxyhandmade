export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (code) {
    const { data } = await supabase.from('coupons').select('*').ilike('code', code).single();
    if (data) return NextResponse.json([data]);
    return NextResponse.json([]);
  }

  const { data, error } = await supabase.from('coupons').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const body = await request.json();
  
  // Validate code uniqueness
  const { data: existing } = await supabase.from('coupons').select('id').eq('code', body.code.toUpperCase());
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 400 });
  }
  
  const newCoupon = {
    id: `coup_${Date.now()}`,
    code: body.code.toUpperCase().trim(),
    type: body.type || 'percent', 
    value: Number(body.value),
    minOrder: Number(body.minOrder) || 0,
    active: body.active !== false,
  };
  
  const { data, error } = await supabase.from('coupons').insert([newCoupon]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const { id, active } = await request.json();
  
  const { data, error } = await supabase.from('coupons').update({ active }).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
