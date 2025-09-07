import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    // Use admin client directly to bypass RLS
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Error in public categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
