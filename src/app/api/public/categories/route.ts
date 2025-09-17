import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    // OPTIMIZED: Use Promise.all to fetch all data in parallel
    const [categoriesResult, subcategoriesResult] = await Promise.all([
      // Get categories for the requested locale
      supabase
        .from('categories')
        .select(`
          *,
          hero_image:images!categories_hero_image_id_fkey(*)
        `)
        .eq('locale', locale)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      
      // Get all subcategories from English version in one query
      supabase
        .from('categories')
        .select(`
          slug,
          subcategories(*)
        `)
        .eq('locale', 'en')
        .eq('is_active', true)
    ]);

    if (categoriesResult.error) {
      console.error('Error fetching categories:', categoriesResult.error);
      return NextResponse.json({ error: categoriesResult.error.message }, { status: 500 });
    }

    if (subcategoriesResult.error) {
      console.error('Error fetching subcategories:', subcategoriesResult.error);
      return NextResponse.json({ error: subcategoriesResult.error.message }, { status: 500 });
    }

    const categories = categoriesResult.data || [];
    const subcategoriesData = subcategoriesResult.data || [];

    // Create a map of subcategories by category slug for O(1) lookup
    const subcategoriesMap = new Map();
    subcategoriesData.forEach(category => {
      if (category.subcategories && Array.isArray(category.subcategories)) {
        subcategoriesMap.set(category.slug, category.subcategories);
      }
    });

    // Collect all image IDs from subcategories
    const allImageIds = new Set<string>();
    subcategoriesData.forEach(category => {
      if (category.subcategories && Array.isArray(category.subcategories)) {
        category.subcategories.forEach((sub: any) => {
          if (sub.image_id) {
            allImageIds.add(sub.image_id);
          }
        });
      }
    });

    // Fetch all images in one query
    let imagesMap = new Map();
    if (allImageIds.size > 0) {
      const { data: images, error: imagesError } = await supabase
        .from('images')
        .select('*')
        .in('id', Array.from(allImageIds));

      if (imagesError) {
        console.error('Error fetching subcategory images:', imagesError);
      } else {
        images.forEach(img => imagesMap.set(img.id, img));
      }
    }

    // Process categories with subcategories and images
    const processedCategories = categories.map(category => {
      const subcategories = subcategoriesMap.get(category.slug) || [];
      
      const processedSubcategories = subcategories.map((sub: any) => ({
        ...sub,
        image: sub.image_id ? imagesMap.get(sub.image_id) || null : null
      }));

      return {
        ...category,
        subcategories: processedSubcategories
      };
    });

    return NextResponse.json({ data: processedCategories }, {
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
