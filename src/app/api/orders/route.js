export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

const FREE_SHIPPING_THRESHOLD = 300000;
const FLAT_RATE_SHIPPING = 30000;
const ALLOWED_ORDER_STATUSES = new Set(['pending', 'processing', 'shipped', 'done', 'cancelled']);

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      id: String(item?.id || '').trim(),
      qty: Math.max(0, Math.floor(Number(item?.qty) || 0)),
    }))
    .filter((item) => item.id && item.qty > 0);
}

async function getCouponDiscount(subtotal, couponCode) {
  const normalizedCode = String(couponCode || '').trim().toUpperCase();
  if (!normalizedCode) {
    return { code: null, discount: 0 };
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', normalizedCode)
    .eq('active', true)
    .limit(1);

  if (error) {
    throw error;
  }

  const coupon = data?.[0];
  if (!coupon) {
    return { error: 'Invalid coupon code' };
  }

  if (subtotal < (Number(coupon.minOrder) || 0)) {
    return { error: 'Order does not meet the coupon minimum' };
  }

  const discount = coupon.type === 'percent'
    ? Math.floor(subtotal * ((Number(coupon.value) || 0) / 100))
    : Number(coupon.value) || 0;

  return {
    code: coupon.code,
    discount: Math.max(0, discount),
  };
}

export async function GET() {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const order = await request.json();

  const name = String(order.name || '').trim();
  const phone = String(order.phone || '').trim();
  const address = String(order.address || '').trim();
  const note = String(order.note || '').trim();
  const requestedItems = normalizeItems(order.items);

  if (!name || !phone || !address || requestedItems.length === 0) {
    return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
  }

  const productIds = [...new Set(requestedItems.map((item) => item.id))];
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, price')
    .in('id', productIds);

  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }

  if (!products || products.length !== productIds.length) {
    return NextResponse.json({ error: 'One or more products could not be found' }, { status: 400 });
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const items = requestedItems.map((item) => {
    const product = productsById.get(item.id);
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      qty: item.qty,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE_SHIPPING;

  let couponCode = null;
  let discount = 0;

  try {
    const couponResult = await getCouponDiscount(subtotal, order.couponCode);
    if (couponResult?.error) {
      return NextResponse.json({ error: couponResult.error }, { status: 400 });
    }

    couponCode = couponResult.code;
    discount = Math.min(subtotal + shippingFee, couponResult.discount || 0);
  } catch (couponError) {
    return NextResponse.json({ error: couponError.message }, { status: 500 });
  }

  const createdAt = new Date().toISOString();
  const newOrder = {
    id: `order_${Date.now()}`,
    name,
    phone,
    address,
    note,
    items,
    customerInfo: { name, phone, address, note },
    subtotal,
    shippingFee,
    discount,
    couponCode,
    total: Math.max(0, subtotal + shippingFee - discount),
    status: 'pending',
    createdAt,
  };

  const { data, error } = await supabase.from('orders').insert([newOrder]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { id, status } = await request.json();
  if (!id || !ALLOWED_ORDER_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid order status update' }, { status: 400 });
  }

  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
  }

  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
