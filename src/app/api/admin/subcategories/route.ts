import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        image:images!subcategories_image_id_fkey(*),
        category:categories!subcategories_category_id_fkey(id, slug, name, locale)
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching subcategories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
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
    
    const { data, error } = await supabaseAdmin
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
