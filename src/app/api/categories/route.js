export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const category = await request.json();
  const name = String(category.name || '').trim();
  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  const newCategory = {
    id: `cat_${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  };

  const { data, error } = await supabase.from('categories').insert([newCategory]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { id, name } = await request.json();
  const trimmedName = String(name || '').trim();
  if (!id || !trimmedName) {
    return NextResponse.json({ error: 'Missing category fields' }, { status: 400 });
  }

  const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const { data, error } = await supabase
    .from('categories')
    .update({ name: trimmedName, slug })
    .eq('id', id)
    .select();

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
    return NextResponse.json({ error: 'Missing category id' }, { status: 400 });
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
