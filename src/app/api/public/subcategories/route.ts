import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const categoryId = searchParams.get('category_id');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    let query = supabase
      .from('subcategories')
      .select(`
        *,
        image:images!subcategories_image_id_fkey(*)
      `)
      .eq('locale', locale)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    // Filter by category if provided
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subcategories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in public subcategories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
