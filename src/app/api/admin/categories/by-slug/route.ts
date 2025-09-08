import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const locale = searchParams.get('locale');

    if (!slug || !locale) {
      return NextResponse.json({ error: 'Slug and locale are required' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('locale', locale)
      .single();

    if (error) {
      // If no category found for this slug/locale combination, return null
      if (error.code === 'PGRST116') {
        return NextResponse.json({ data: null });
      }
      console.error('Error fetching category by slug and locale:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in categories by-slug API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
