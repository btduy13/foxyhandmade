export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    const authResponse = await requireAdminSession();
    if (authResponse) return authResponse;
  }

  let query = supabase.from('reviews').select('*').order('createdAt', { ascending: false });
  if (productId) {
    query = query.eq('productId', productId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data || []);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.productId || !body.name || !body.rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    productId: body.productId,
    name: String(body.name).trim().slice(0, 50),
    rating: Math.min(5, Math.max(1, Number(body.rating))),
    comment: String(body.comment || '').trim().slice(0, 500),
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('reviews').insert([newReview]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}

export async function DELETE(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing review id' }, { status: 400 });
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
