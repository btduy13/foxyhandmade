import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('⚠️ CẢNH BÁO: Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL. Hãy thêm vào Vercel Environment Variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
