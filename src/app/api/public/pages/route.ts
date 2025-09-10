import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const locale = searchParams.get('locale');

    if (!slug || !locale) {
      return NextResponse.json({ error: 'Missing slug or locale parameter' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    console.log(`Fetching page: slug=${slug}, locale=${locale}`);
    const { data: pages, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('locale', locale);
    
    const data = pages && pages.length > 0 ? pages[0] : null;
    console.log('Page data fetched:', data ? {id: data.id, title: data.title, h1: data.h1, updated_at: data.updated_at} : 'No data');

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return NextResponse.json({ data: null });
      }
      console.error('Error fetching page:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'CDN-Cache-Control': 'public, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error in public pages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
