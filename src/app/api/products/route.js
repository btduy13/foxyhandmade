export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const product = await request.json();
  const newProduct = { 
    ...product, 
    id: `prod_${Date.now()}`, 
    stock: Number(product.stock) || 0,
    price: Number(product.price) || 0
  };
  
  const { data, error } = await supabase.from('products').insert([newProduct]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const updatedProduct = await request.json();
  
  const payload = {
    ...updatedProduct,
    price: Number(updatedProduct.price) || 0,
    stock: Number(updatedProduct.stock) || 0,
  };
  delete payload.id; // don't update primary key
  
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', updatedProduct.id)
    .select();
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
