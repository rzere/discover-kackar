import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Define valid image categories
    const validCategories = ['hero', 'category', 'content', 'gallery', 'admin_upload', 'subcategory', 'contact_hero'] as const;
    type ImageCategory = typeof validCategories[number];

    let query = supabase
      .from('images')
      .select('*')
      .eq('is_visible', true) // Only return visible images
      .order('created_at', { ascending: false });

    // Filter by category if provided and valid
    if (category && validCategories.includes(category as ImageCategory)) {
      query = query.eq('category', category as ImageCategory);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching public images:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5min cache, 10min stale
        'CDN-Cache-Control': 'public, s-maxage=600', // 10min CDN cache
      }
    });
  } catch (error) {
    console.error('Error in public images API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
