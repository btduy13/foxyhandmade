import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');
const readDb = () => JSON.parse(fs.readFileSync(getDbPath(), 'utf-8'));
const writeDb = (data) => fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');

export async function GET() {
  const db = readDb();
  return NextResponse.json((db.contacts || []).slice().reverse());
}

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.message) {
    return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
  }
  const db = readDb();
  if (!db.contacts) db.contacts = [];
  const msg = {
    id: `msg_${Date.now()}`,
    name: String(body.name).trim(),
    email: String(body.email || '').trim(),
    phone: String(body.phone || '').trim(),
    message: String(body.message).trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  db.contacts.push(msg);
  writeDb(db);
  return NextResponse.json(msg, { status: 201 });
}

export async function PUT(request) {
  const { id } = await request.json();
  const db = readDb();
  if (!db.contacts) db.contacts = [];
  const idx = db.contacts.findIndex(c => c.id === id);
  if (idx !== -1) db.contacts[idx].read = true;
  writeDb(db);
  return NextResponse.json({ success: true });
}
