import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    // Get categories for the requested locale
    let { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        hero_image:images!categories_hero_image_id_fkey(*)
      `)
      .eq('locale', locale)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    // ALWAYS get subcategories from English version (shared across all languages)
    if (data && data.length > 0) {
      for (let category of data) {
        const { data: enCategory } = await supabase
          .from('categories')
          .select(`
            subcategories(*)
          `)
          .eq('slug', category.slug)
          .eq('locale', 'en')
          .eq('is_active', true)
          .single();
        
        if (enCategory && enCategory.subcategories && Array.isArray(enCategory.subcategories)) {
          // Fetch images for the subcategories
          const imageIds = enCategory.subcategories.map((sub: any) => sub.image_id).filter(Boolean);
          if (imageIds.length > 0) {
            const { data: images } = await supabase
              .from('images')
              .select('*')
              .in('id', imageIds);
            
            // Map images to subcategories
            (category as any).subcategories = enCategory.subcategories.map((sub: any) => ({
              ...sub,
              image: images?.find((img: any) => img.id === sub.image_id) || null
            }));
          } else {
            (category as any).subcategories = enCategory.subcategories;
          }
        } else {
          (category as any).subcategories = [];
        }
      }
    }

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] }, {
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
