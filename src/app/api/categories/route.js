import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
  return NextResponse.json(db.categories);
}

export async function POST(request) {
  const category = await request.json();
  const db = readDb();
  
  const newCategory = { 
    ...category, 
    id: `cat_${Date.now()}`,
    slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  };
  db.categories.push(newCategory);
  writeDb(db);
  
  return NextResponse.json(newCategory, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const db = readDb();
  db.categories = db.categories.filter(c => c.id !== id);
  writeDb(db);
  
  return NextResponse.json({ success: true });
}
