import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: ctaCards, error } = await supabase
      .from('cta_cards' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching CTA cards:', error);
      return NextResponse.json(
        { error: 'Failed to fetch CTA cards' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: ctaCards });
  } catch (error) {
    console.error('Error in admin CTA cards API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('CTA Cards PUT request received');
    const body = await request.json();
    console.log('Request body:', body);
    const { id, title, description, button_text, button_url, is_active } = body;

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('cta_cards' as any)
      .update({
        title,
        description,
        button_text,
        button_url,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating CTA card:', error);
      return NextResponse.json(
        { error: 'Failed to update CTA card' },
        { status: 500 }
      );
    }

    console.log('CTA card updated successfully:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in admin CTA cards update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
