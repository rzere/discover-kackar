import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // Mock authentication - in production this would validate against Supabase
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@discoverkackar.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (email === adminEmail && password === adminPassword) {
    const user = {
      id: '1',
      email: adminEmail,
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
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@discoverkackar.com';
  return NextResponse.json({
    user: {
      id: '1',
      email: adminEmail,
      role: 'admin',
      createdAt: new Date()
    }
  });
}

export async function DELETE() {
  // Mock logout
  return NextResponse.json({ message: 'Logged out successfully' });
}