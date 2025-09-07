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
    const { data, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('locale', locale)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return NextResponse.json({ data: null });
      }
      console.error('Error fetching page:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in public pages API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
