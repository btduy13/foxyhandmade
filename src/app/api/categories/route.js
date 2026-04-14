export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const category = await request.json();
  const newCategory = { 
    id: `cat_${Date.now()}`,
    name: category.name,
    slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  
  const { data, error } = await supabase.from('categories').insert([newCategory]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const { id, name } = await request.json();
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.trim(), slug })
    .eq('id', id)
    .select();
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}
