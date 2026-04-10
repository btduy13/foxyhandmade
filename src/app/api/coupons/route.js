import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');
const readDb = () => JSON.parse(fs.readFileSync(getDbPath(), 'utf-8'));
const writeDb = (data) => fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.coupons || []);
}

export async function POST(request) {
  const body = await request.json();
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  // Validate code uniqueness
  if (db.coupons.find(c => c.code.toUpperCase() === body.code.toUpperCase())) {
    return NextResponse.json({ error: 'Mã giảm giá đã tồn tại' }, { status: 400 });
  }
  const newCoupon = {
    id: `coup_${Date.now()}`,
    code: body.code.toUpperCase().trim(),
    type: body.type || 'percent', // 'percent' | 'fixed'
    value: Number(body.value),
    minOrder: Number(body.minOrder) || 0,
    active: body.active !== false,
    createdAt: new Date().toISOString(),
  };
  db.coupons.push(newCoupon);
  writeDb(db);
  return NextResponse.json(newCoupon, { status: 201 });
}

export async function PUT(request) {
  const { id, active } = await request.json();
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  const idx = db.coupons.findIndex(c => c.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.coupons[idx] = { ...db.coupons[idx], active };
  writeDb(db);
  return NextResponse.json(db.coupons[idx]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDb();
  if (!db.coupons) db.coupons = [];
  db.coupons = db.coupons.filter(c => c.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}

// Validate a coupon code (public endpoint used by cart)
// POST /api/coupons/validate handled separately - use query param instead
// GET /api/coupons?code=XXX returns the matching coupon
