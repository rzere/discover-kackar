import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    // Get the category for the requested locale
    let { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', params.slug)
      .eq('locale', locale)
      .eq('is_active', true)
      .single();

    // ALWAYS get hero image and subcategories from English version (shared across all languages)
    const { data: enCategory } = await supabase
      .from('categories')
      .select(`
        hero_image_id,
        hero_image:images!categories_hero_image_id_fkey(*),
        subcategories(*)
      `)
      .eq('slug', params.slug)
      .eq('locale', 'en')
      .eq('is_active', true)
      .single();
    
    // Add hero image from English category (shared across all languages)
    if (enCategory) {
      (data as any).hero_image_id = enCategory.hero_image_id;
      (data as any).hero_image = enCategory.hero_image;
      
      if (enCategory.subcategories && Array.isArray(enCategory.subcategories)) {
        // Fetch images for the subcategories
        const imageIds = enCategory.subcategories.map((sub: any) => sub.image_id).filter(Boolean);
        if (imageIds.length > 0) {
          const { data: images } = await supabase
            .from('images')
            .select('*')
            .in('id', imageIds);
          
          // Map images to subcategories
          (data as any).subcategories = enCategory.subcategories.map((sub: any) => ({
            ...sub,
            image: images?.find((img: any) => img.id === sub.image_id) || null
          }));
        } else {
          (data as any).subcategories = enCategory.subcategories;
        }
      } else {
        (data as any).subcategories = [];
      }
    } else {
      (data as any).subcategories = [];
    }

    if (error) {
      console.error('Error fetching category:', error);
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in public category API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
