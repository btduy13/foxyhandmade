import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');
const readDb = () => JSON.parse(fs.readFileSync(getDbPath(), 'utf-8'));
const writeDb = (data) => fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');

export async function GET() {
  const db = readDb();
  const orders = (db.orders || []).slice().reverse(); // newest first
  return NextResponse.json(orders);
}

export async function POST(request) {
  const order = await request.json();
  const db = readDb();
  if (!db.orders) db.orders = [];
  const newOrder = { ...order, id: `order_${Date.now()}`, status: "pending" };
  db.orders.push(newOrder);
  writeDb(db);
  return NextResponse.json(newOrder, { status: 201 });
}

export async function PUT(request) {
  const { id, status } = await request.json();
  const db = readDb();
  if (!db.orders) db.orders = [];
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  db.orders[idx] = { ...db.orders[idx], status };
  writeDb(db);
  return NextResponse.json(db.orders[idx]);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const db = readDb();
  if (!db.orders) db.orders = [];
  db.orders = db.orders.filter(o => o.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
