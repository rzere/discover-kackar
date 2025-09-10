import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('contact_pages' as any)
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching contact page:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contact page data' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Contact page not found' },
        { status: 404 }
      );
    }

    // Add caching headers (shorter cache for contact pages since they change frequently)
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // 5 minutes cache
    headers.set('CDN-Cache-Control', 'public, s-maxage=300');

    return NextResponse.json({ data }, { headers });
  } catch (error) {
    console.error('Error in contact page API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
