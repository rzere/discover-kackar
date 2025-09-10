import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('contact_pages' as any)
      .select('*')
      .order('locale', { ascending: true });

    if (locale) {
      query = query.eq('locale', locale);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contact pages:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contact pages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in admin contact pages API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('contact_pages' as any)
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact page:', error);
      return NextResponse.json(
        { error: 'Failed to update contact page' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in admin contact pages update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('contact_pages' as any)
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('Error creating contact page:', error);
      return NextResponse.json(
        { error: 'Failed to create contact page' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in admin contact pages create API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
