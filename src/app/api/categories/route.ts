import { NextResponse } from 'next/server';
import { categories } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Mock creating new category
  const newCategory = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return NextResponse.json(newCategory, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  
  // Mock updating category
  const updatedCategory = {
    ...body,
    updatedAt: new Date()
  };

  return NextResponse.json(updatedCategory);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Category deleted successfully' });
}