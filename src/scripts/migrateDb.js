require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Thiáº¿u cáº¥u hÃ¬nh Supabase trong .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dbPath = path.join(__dirname, '..', 'data', 'db.json');
const dbRaw = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbRaw);

async function migrate() {
  console.log('Báº¯t Ä‘áº§u migrate...');

  // 1. Categories
  if (db.categories?.length) {
    const { error } = await supabase.from('categories').upsert(db.categories);
    if (error) console.error('Lá»—i Categories:', error);
    else console.log('âœ” Categories OK');
  }

  // 2. Products
  if (db.products?.length) {
    const productsToUpload = db.products.map(p => ({
      ...p,
      stock: Number(p.stock) || 0,
      price: Number(p.price) || 0,
    }));
    const { error } = await supabase.from('products').upsert(productsToUpload);
    if (error) console.error('Lá»—i Products:', error);
    else console.log('âœ” Products OK');
  }

  // 3. Homepage
  if (db.homepage) {
    const { error } = await supabase.from('homepage').upsert({ id: 'default', data: db.homepage });
    if (error) console.error('Lá»—i Homepage:', error);
    else console.log('âœ” Homepage OK');
  }

  // 4. Coupons
  if (db.coupons?.length) {
    const { error } = await supabase.from('coupons').upsert(db.coupons);
    if (error) console.error('Lá»—i Coupons:', error);
    else console.log('âœ” Coupons OK');
  }

  // 5. Orders
  if (db.orders?.length) {
    const { error } = await supabase.from('orders').upsert(db.orders);
    if (error) console.error('Lá»—i Orders:', error);
    else console.log('âœ” Orders OK');
  }

  // 6. Contacts
  if (db.contacts?.length) {
    const { error } = await supabase.from('contacts').upsert(db.contacts);
    if (error) console.error('Lá»—i Contacts:', error);
    else console.log('âœ” Contacts OK');
  }

  // 7. Reviews
  if (db.reviews?.length) {
    const { error } = await supabase.from('reviews').upsert(db.reviews);
    if (error) console.error('Lá»—i Reviews:', error);
    else console.log('âœ” Reviews OK');
  }

  console.log('HoÃ n táº¥t migrate!');
}

migrate();
