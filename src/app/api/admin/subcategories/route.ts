import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // First, get all subcategories with their images
    const { data: subcategories, error: subcategoriesError } = await (supabaseAdmin as any)
      .from('subcategories')
      .select(`
        *,
        image:images!subcategories_image_id_fkey(*)
      `)
      .order('sort_order', { ascending: true });

    if (subcategoriesError) {
      console.error('Error fetching subcategories:', subcategoriesError);
      return NextResponse.json({ error: subcategoriesError.message }, { status: 500 });
    }

    // Get all categories to map category_id to category info
    const { data: categories, error: categoriesError } = await (supabaseAdmin as any)
      .from('categories')
      .select('id, slug, name, locale')
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }

    // Create a map of category_id to category info (prefer English version)
    const categoryMap = new Map();
    categories?.forEach((category: any) => {
      if (!categoryMap.has(category.id) || category.locale === 'en') {
        categoryMap.set(category.id, category);
      }
    });

    // Deduplicate subcategories based on slug and category slug
    const seen = new Map();
    const deduplicatedSubcategories: any[] = [];

    subcategories?.forEach((subcategory: any) => {
      const category = categoryMap.get(subcategory.category_id);
      if (!category) return; // Skip if category not found
      
      // Create a unique key based on slug and category slug (not category_id)
      const key = `${subcategory.slug}-${category.slug}`;
      
      if (!seen.has(key)) {
        // First time seeing this combination, keep it
        seen.set(key, subcategory);
        deduplicatedSubcategories.push({
          ...subcategory,
          category: category
        });
      } else {
        // Duplicate found, keep the one with the most recent updated_at
        const existing = seen.get(key);
        const existingDate = new Date(existing.updated_at || existing.created_at || '');
        const currentDate = new Date(subcategory.updated_at || subcategory.created_at || '');
        
        if (currentDate > existingDate) {
          // Replace with newer version
          const index = deduplicatedSubcategories.findIndex(s => s.id === existing.id);
          if (index !== -1) {
            deduplicatedSubcategories[index] = {
              ...subcategory,
              category: category
            };
          }
          seen.set(key, subcategory);
        }
      }
    });

    console.log(`Deduplication: ${subcategories?.length || 0} → ${deduplicatedSubcategories.length} subcategories`);

    return NextResponse.json({ data: deduplicatedSubcategories });
  } catch (error) {
    console.error('Error in subcategories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabaseAdmin = getSupabaseAdmin();
    
    // Extract image metadata from body
    const { image_alt_text, image_caption, ...subcategoryData } = body;
    
    const { data, error } = await (supabaseAdmin as any)
      .from('subcategories')
      .insert([subcategoryData])
      .select(`
        *,
        image:images!subcategories_image_id_fkey(*)
      `);

    if (error) {
      console.error('Error creating subcategory:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update image metadata if provided
    if (subcategoryData.image_id && (image_alt_text !== undefined || image_caption !== undefined)) {
      await supabaseAdmin
        .from('images')
        .update({
          alt_text: image_alt_text || null,
          caption: image_caption || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', subcategoryData.image_id);
    }

    return NextResponse.json({ data: data[0] });
  } catch (error) {
    console.error('Error in subcategories POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
