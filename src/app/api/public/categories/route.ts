import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    // OPTIMIZED: Single query with joins to avoid N+1 problem
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        hero_image:images!categories_hero_image_id_fkey(*),
        en_category:categories!categories_slug_fkey(
          subcategories(
            *,
            image:images(*)
          )
        )
      `)
      .eq('locale', locale)
      .eq('is_active', true)
      .eq('en_category.locale', 'en')
      .eq('en_category.is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map the data to the expected format
    const categories = (data || []).map(category => ({
      ...category,
      subcategories: category.en_category?.subcategories || []
    }));

    return NextResponse.json({ data: categories }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
        'CDN-Cache-Control': 'public, s-maxage=600', // 10min CDN cache
      }
    });
  } catch (error) {
    console.error('Error in public categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
