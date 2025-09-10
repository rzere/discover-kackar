import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const slug = searchParams.get('slug') || 'plan-your-trip';

    const supabase = createClient();

    const { data: ctaCard, error } = await supabase
      .from('cta_cards')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching CTA card:', error);
      return NextResponse.json(
        { error: 'Failed to fetch CTA card' },
        { status: 500 }
      );
    }

    if (!ctaCard) {
      return NextResponse.json(
        { error: 'CTA card not found' },
        { status: 404 }
      );
    }

    // Extract localized content
    const localizedCard = {
      id: ctaCard.id,
      slug: ctaCard.slug,
      title: ctaCard.title[locale] || ctaCard.title.en,
      description: ctaCard.description?.[locale] || ctaCard.description?.en,
      buttonText: ctaCard.button_text[locale] || ctaCard.button_text.en,
      buttonUrl: ctaCard.button_url,
      isActive: ctaCard.is_active,
    };

    return NextResponse.json(
      { data: localizedCard },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'CDN-Cache-Control': 'public, s-maxage=600',
        },
      }
    );
  } catch (error) {
    console.error('Error in CTA cards API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
