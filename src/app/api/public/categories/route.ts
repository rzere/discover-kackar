import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    // Proxy to admin API which works correctly
    const adminResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/admin/categories?t=${Date.now()}`);
    const adminData = await adminResponse.json();
    
    if (adminData.error) {
      return NextResponse.json({ error: adminData.error }, { status: 500 });
    }

    // Filter by locale and active status
    const filteredData = adminData.data.filter((category: any) => 
      category.locale === locale && category.is_active === true
    ).sort((a: any, b: any) => a.sort_order - b.sort_order);

    return NextResponse.json({ data: filteredData });
  } catch (error) {
    console.error('Error in public categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
