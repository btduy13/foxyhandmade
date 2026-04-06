import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');
const readDb = () => JSON.parse(fs.readFileSync(getDbPath(), 'utf-8'));
const writeDb = (data) => fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.orders || []);
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
