import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');

    if (!locale) {
      return NextResponse.json({ error: 'Missing locale parameter' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // OPTIMIZED: Fetch all homepage data in parallel with Promise.allSettled
    const [
      pageResult,
      categoriesResult,
      subcategoriesResult,
      footerResult,
      ctaResult,
      galleryResult
    ] = await Promise.allSettled([
      // Get homepage data
      supabaseAdmin
        .from('pages')
        .select('*')
        .eq('slug', 'home')
        .eq('locale', locale)
        .single(),

      // Get categories for the requested locale
      supabase
        .from('categories')
        .select(`
          *,
          hero_image:images!categories_hero_image_id_fkey(*)
        `)
        .eq('locale', locale)
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),

      // Get all subcategories from English version
      supabase
        .from('categories')
        .select(`
          slug,
          subcategories(*)
        `)
        .eq('locale', 'en')
        .eq('is_active', true),

      // Get footer data
      supabase
        .from('footer' as any)
        .select('*')
        .eq('locale', locale)
        .eq('is_active', true)
        .single(),

      // Get CTA cards
      supabaseAdmin
        .from('cta_cards' as any)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),

      // Get gallery images
      supabase
        .from('images')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
    ]);

    // Process page data
    let pageData: any = null;
    if (pageResult.status === 'fulfilled' && !pageResult.value.error) {
      pageData = pageResult.value.data;
    }

    // Process categories data
    let categories: any[] = [];
    if (categoriesResult.status === 'fulfilled' && !categoriesResult.value.error) {
      categories = categoriesResult.value.data || [];
    }

    // Process subcategories and images
    if (subcategoriesResult.status === 'fulfilled' && !subcategoriesResult.value.error) {
      const subcategoriesData = subcategoriesResult.value.data || [];
      
      // Create a map of subcategories by category slug
      const subcategoriesMap = new Map();
      subcategoriesData.forEach(category => {
        if (category.subcategories && Array.isArray(category.subcategories)) {
          subcategoriesMap.set(category.slug, category.subcategories);
        }
      });

      // Collect all image IDs from subcategories
      const allImageIds = new Set<string>();
      subcategoriesData.forEach(category => {
        if (category.subcategories && Array.isArray(category.subcategories)) {
          category.subcategories.forEach((sub: any) => {
            if (sub.image_id) {
              allImageIds.add(sub.image_id);
            }
          });
        }
      });

      // Fetch all images in one query if needed
      let imagesMap = new Map();
      if (allImageIds.size > 0) {
        const { data: images } = await supabase
          .from('images')
          .select('*')
          .in('id', Array.from(allImageIds));
        
        if (images) {
          images.forEach(img => imagesMap.set(img.id, img));
        }
      }

      // Process categories with subcategories and images
      categories = categories.map(category => {
        const subcategories = subcategoriesMap.get(category.slug) || [];
        
        const processedSubcategories = subcategories.map((sub: any) => ({
          ...sub,
          image: sub.image_id ? imagesMap.get(sub.image_id) || null : null
        }));

        return {
          ...category,
          subcategories: processedSubcategories
        };
      });
    }

    // Apply Turkish translations if needed
    if (locale === 'tr') {
      const turkishTranslations = new Map([
        ['nature', { name: 'Doğa & Macera', description: 'Kaçkar\'ın vadilerinden zirvelerine uzanan patikalarda doğanın saf gücünü keşfedin.' }],
        ['culture', { name: 'Kültür & Yerel Hayat', description: 'Yaylaların, konakların ve köklü geleneklerin içten hikâyesine tanık olun.' }],
        ['gastronomy', { name: 'Gastronomi & Yerel Lezzetler', description: 'Coğrafi işaretli ürünler ve unutulmaz lezzetlerle Kaçkar\'ın tadına varın.' }],
        ['adventure', { name: 'Macera', description: 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin dolu aktiviteler' }],
        ['accommodation', { name: 'Konaklama', description: 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri' }],
        ['transportation', { name: 'Ulaşım', description: 'Kaçkar\'a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler' }],
        ['music-dance', { name: 'Müzik & Dans', description: 'Tulumun sesi ve horonun ritmiyle Karadeniz\'in ruhunu hissedin.' }],
        ['sustainable-tourism', { name: 'Sürdürülebilir Turizm', description: 'Doğaya saygılı, yerel halka faydalı bir keşif yolculuğu.' }],
        ['health-wellness', { name: 'Sağlık & Wellness', description: 'Yaylaların temiz havasında ruhunuzu ve bedeninizi yenileyin.' }],
        ['photography-art', { name: 'Fotoğraf & Sanat', description: 'Mevsimlerin ışığıyla şekillenen eşsiz manzaraları yakalayın.' }],
        ['educational-research', { name: 'Eğitim & Araştırma Turizmi', description: 'Endemik bitkilerden buzul göllerine uzanan canlı bir laboratuvar.' }],
        ['events-festivals', { name: 'Etkinlik & Festivaller', description: 'Yayla şenliklerinden çay hasadına, coşkulu kutlamalara katılın.' }]
      ]);
      
      categories = categories.map((cat: any) => {
        const translation = turkishTranslations.get(cat.slug);
        if (translation) {
          return {
            ...cat,
            name: translation.name,
            description: translation.description,
            locale: 'tr'
          };
        }
        return cat;
      });
    }

    // Process footer data
    let footerData: any = null;
    if (footerResult.status === 'fulfilled' && !footerResult.value.error) {
      footerData = footerResult.value.data;
    }

    // Process CTA card data
    let ctaCard: any = null;
    if (ctaResult.status === 'fulfilled' && !ctaResult.value.error) {
      const ctaCards = ctaResult.value.data || [];
      const planYourTripCard = ctaCards.find((card: any) => card.slug === 'plan-your-trip');
      if (planYourTripCard) {
        ctaCard = {
          id: planYourTripCard.id,
          slug: planYourTripCard.slug,
          title: planYourTripCard.title?.[locale] || planYourTripCard.title?.en,
          description: planYourTripCard.description?.[locale] || planYourTripCard.description?.en,
          buttonText: planYourTripCard.button_text?.[locale] || planYourTripCard.button_text?.en,
          buttonUrl: planYourTripCard.button_url,
          isActive: planYourTripCard.is_active,
        };
      }
    }

    // Process gallery images
    let galleryImages: any[] = [];
    if (galleryResult.status === 'fulfilled' && !galleryResult.value.error) {
      galleryImages = galleryResult.value.data || [];
    }

    return NextResponse.json({
      data: {
        page: pageData,
        categories,
        footer: footerData,
        ctaCard,
        galleryImages
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30min cache, 1hr stale
        'CDN-Cache-Control': 'public, s-maxage=1800', // 30min CDN cache
        'ETag': `"homepage-${locale}-${Date.now()}"`, // ETag for better caching
        'Content-Encoding': 'gzip', // Enable compression
        'Vary': 'Accept-Encoding', // Cache different versions for different encodings
      }
    });
  } catch (error) {
    console.error('Error in homepage data API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
