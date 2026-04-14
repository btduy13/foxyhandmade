export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const order = await request.json();
  const newOrder = { 
    id: `order_${Date.now()}`,
    items: order.items || [],
    customerInfo: order.customerInfo || {},
    total: Number(order.total) || 0,
    status: order.status || 'pending'
  };
  
  const { data, error } = await supabase.from('orders').insert([newOrder]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const { id, status } = await request.json();
  
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
