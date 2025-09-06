import { NextResponse } from 'next/server';
import { content } from '@/lib/data/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  
  let filteredContent = content;
  
  if (category) {
    filteredContent = filteredContent.filter(item => item.category === category);
  }
  
  if (subcategory) {
    filteredContent = filteredContent.filter(item => item.subcategory === subcategory);
  }
  
  return NextResponse.json(filteredContent);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newContent = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return NextResponse.json(newContent, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  
  const updatedContent = {
    ...body,
    updatedAt: new Date()
  };

  return NextResponse.json(updatedContent);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Content deleted successfully' });
}