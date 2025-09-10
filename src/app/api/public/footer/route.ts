import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const { data, error } = await supabase
      .from('footer' as any)
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching footer:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
        'CDN-Cache-Control': 'public, s-maxage=600', // 10min CDN cache
      }
    });
  } catch (error) {
    console.error('Error in public footer API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
