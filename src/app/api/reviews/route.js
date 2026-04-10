import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');
const readDb = () => JSON.parse(fs.readFileSync(getDbPath(), 'utf-8'));
const writeDb = (data) => fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const db = readDb();
  const reviews = db.reviews || [];
  const result = productId ? reviews.filter(r => r.productId === productId) : reviews;
  return NextResponse.json(result.slice().reverse()); // newest first
}

export async function POST(request) {
  const body = await request.json();
  if (!body.productId || !body.name || !body.rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const db = readDb();
  if (!db.reviews) db.reviews = [];
  const newReview = {
    id: `rev_${Date.now()}`,
    productId: body.productId,
    name: String(body.name).trim().slice(0, 50),
    rating: Math.min(5, Math.max(1, Number(body.rating))),
    comment: String(body.comment || '').trim().slice(0, 500),
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(newReview);
  writeDb(db);
  return NextResponse.json(newReview, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDb();
  if (!db.reviews) return NextResponse.json({ success: true });
  db.reviews = db.reviews.filter(r => r.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
