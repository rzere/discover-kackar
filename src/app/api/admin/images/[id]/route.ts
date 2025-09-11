import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('images')
      .update({
        alt_text: body.alt_text,
        caption: body.caption,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating image:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in image update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('images')
      .update({
        is_visible: body.is_visible,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating image visibility:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in image visibility update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}