export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { data, error } = await supabase.from('contacts').select('*').order('createdAt', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const msg = {
    id: `msg_${Date.now()}`,
    name: String(body.name).trim(),
    email: String(body.email || '').trim(),
    phone: String(body.phone || '').trim(),
    message: String(body.message).trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('contacts').insert([msg]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data[0], { status: 201 });
}

export async function PUT(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing contact id' }, { status: 400 });
  }

  const { error } = await supabase.from('contacts').update({ read: true }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing contact id' }, { status: 400 });
  }

  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
