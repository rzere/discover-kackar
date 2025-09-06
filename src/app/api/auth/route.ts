import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Mock authentication - in production this would validate against Supabase
  if (email === 'admin@discoverkackar.com' && password === 'admin123') {
    const user = {
      id: '1',
      email: 'admin@discoverkackar.com',
      role: 'admin' as const,
      createdAt: new Date()
    };

    return NextResponse.json({ 
      user,
      token: 'mock-jwt-token' 
    });
  }

  return NextResponse.json(
    { error: 'Invalid credentials' }, 
    { status: 401 }
  );
}

export async function GET() {
  // Mock getting current user
  return NextResponse.json({
    user: {
      id: '1',
      email: 'admin@discoverkackar.com',
      role: 'admin',
      createdAt: new Date()
    }
  });
}

export async function DELETE() {
  // Mock logout
  return NextResponse.json({ message: 'Logged out successfully' });
}