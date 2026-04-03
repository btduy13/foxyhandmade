import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Local temporary storage helper
const getDbPath = () => path.join(process.cwd(), 'src/data/db.json');

const readDb = () => {
  const fileData = fs.readFileSync(getDbPath(), 'utf-8');
  return JSON.parse(fileData);
};

const writeDb = (data) => {
  fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8');
};

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.products);
}

export async function POST(request) {
  const product = await request.json();
  const db = readDb();
  
  const newProduct = { ...product, id: `prod_${Date.now()}` };
  db.products.push(newProduct);
  writeDb(db);
  
  return NextResponse.json(newProduct, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const db = readDb();
  db.products = db.products.filter(p => p.id !== id);
  writeDb(db);
  
  return NextResponse.json({ success: true });
}
