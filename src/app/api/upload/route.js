export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { requireAdminSession } from '@/lib/admin-route';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const authResponse = await requireAdminSession();
  if (authResponse) return authResponse;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop().toLowerCase();
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl, filename });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
