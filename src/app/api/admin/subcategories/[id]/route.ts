import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await (supabaseAdmin as any)
      .from('subcategories')
      .select(`
        *,
        image:images!subcategories_image_id_fkey(*),
        category:categories!subcategories_category_id_fkey(id, slug, name, locale)
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching subcategory:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in subcategory GET API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabaseAdmin = getSupabaseAdmin();
    
    // Extract image metadata from body
    const { image_alt_text, image_caption, ...subcategoryData } = body;
    
    // Update subcategory
    const { data, error } = await (supabaseAdmin as any)
      .from('subcategories')
      .update(subcategoryData)
      .eq('id', params.id)
      .select(`
        *,
        image:images!subcategories_image_id_fkey(*)
      `);

    if (error) {
      console.error('Error updating subcategory:', error);
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
    console.error('Error in subcategory PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { error } = await (supabaseAdmin as any)
      .from('subcategories')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting subcategory:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in subcategory DELETE API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
