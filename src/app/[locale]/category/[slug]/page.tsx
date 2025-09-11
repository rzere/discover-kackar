'use client';

import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategoryImage, getImageUrl } from '@/lib/utils/imageUtils';
import { useImageSize } from '@/hooks/useResponsiveImage';
import { useState, useEffect } from 'react';
import { getTranslation, type Locale } from '@/lib/utils/translations';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { 
  Leaf, 
  Users, 
  ForkKnife, 
  Mountains, 
  House, 
  Car,
  MusicNote,
  Heart,
  Camera,
  GraduationCap,
  CalendarCheck,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  MapPin,
  Envelope,
  Phone
} from '@phosphor-icons/react';
import Navbar from '@/components/layout/Navbar';

// Function to properly convert text to uppercase based on locale
const toLocaleUppercase = (text: string, locale: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (locale === 'tr') {
    // Turkish uppercase conversion
    return text
      .replace(/i/g, 'İ')
      .replace(/ı/g, 'I')
      .replace(/ğ/g, 'Ğ')
      .replace(/ü/g, 'Ü')
      .replace(/ş/g, 'Ş')
      .replace(/ö/g, 'Ö')
      .replace(/ç/g, 'Ç')
      .toUpperCase();
  } else {
    // Standard uppercase for English and other languages
    return text.toUpperCase();
  }
};

// Helper function to extract localized text from JSONB fields
const getLocalizedSubcategoryText = (jsonbField: any, locale: string, fallback: string = ''): string => {
  if (!jsonbField) return fallback;
  if (typeof jsonbField === 'string') return jsonbField;
  
  // Handle JSONB object with language keys
  const text = jsonbField[locale] || jsonbField.en || jsonbField.tr || fallback;
  
  // Ensure we return a string, not an object
  if (typeof text !== 'string') {
    console.warn('getLocalizedSubcategoryText: Expected string but got:', typeof text, text);
    return fallback;
  }
  
  return text;
};

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

interface Subcategory {
  id: string;
  category_id: string;
  slug: string;
  locale: string;
  title: string;
  body_text?: string;
  image_id?: string;
  image?: {
    id: string;
    file_path: string;
    alt_text?: string;
    caption?: string;
  };
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  content?: {
    header?: string;
    bullets?: string[];
    body?: string;
  };
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  hero_image_id?: string;
  hero_image?: {
    id: string;
    file_path: string;
    alt_text?: string;
  };
  subcategories?: Subcategory[];
}

const categories = {
  nature: {
    name: { tr: 'Doğa', en: 'Nature' },
    description: {
      tr: 'Kaçkar Dağları\'nın pristine doğası, buzul gölleri, endemik bitki örtüsü ve muhteşem manzaraları',
      en: 'Pristine nature of Kaçkar Mountains, glacial lakes, endemic flora and breathtaking landscapes'
    },
    content: {
      tr: 'Kaçkar Dağları, Türkiye\'nin en büyüleyici doğa harikalarından biridir. 3,937 metre yüksekliğindeki Kaçkar Zirvesi ile Doğu Karadeniz\'in çatısını oluşturan bu dağ silsilesi, buzul vadileri, kristal berraklığında göller ve endemik bitki türleri ile doğaseverlerin cennetidir.',
      en: 'The Kaçkar Mountains are one of Turkey\'s most enchanting natural wonders. With Kaçkar Peak at 3,937 meters forming the roof of the Eastern Black Sea, this mountain range is a paradise for nature lovers with its glacial valleys, crystal-clear lakes and endemic plant species.'
    },
    highlights: {
      tr: [
        '50\'den fazla buzul gölü',
        '3,937m Kaçkar Zirvesi',
        'Endemik bitki türleri',
        'Buzul vadileri',
        'Alpine çiçek halıları',
        'Kristal berraklığında derekler'
      ],
      en: [
        'More than 50 glacial lakes',
        '3,937m Kaçkar Peak',
        'Endemic plant species',
        'Glacial valleys',
        'Alpine flower carpets',
        'Crystal clear streams'
      ]
    }
  },
  culture: {
    name: { tr: 'Kültür', en: 'Culture' },
    description: {
      tr: 'Çok kültürlü miras, tarihi köyler, geleneksel mimarisi ve kadim gelenekler',
      en: 'Multicultural heritage, historic villages, traditional architecture and ancient traditions'
    },
    content: {
      tr: 'Kaçkar bölgesi, tarihi boyunca farklı kültürlerden insanları bir araya getirmiş, zengin bir kültürel mozaik yaratmıştır. Gürcü, Ermeni, Türk ve Laz kültürlerinin harmanlandığı bu topraklar, geleneksel taş evleri, tarihi kiliseleri ve köprüleri ile adeta açık hava müzesi niteliğindedir.',
      en: 'The Kaçkar region has brought together people from different cultures throughout history, creating a rich cultural mosaic. These lands, where Georgian, Armenian, Turkish and Laz cultures blend, are like an open-air museum with traditional stone houses, historic churches and bridges.'
    },
    highlights: {
      tr: [
        'Tarihi taş köyler',
        'Geleneksel mimarisi',
        'Çok kültürlü miras',
        'Tarihi kilise ve cami',
        'Geleneksel el sanatları',
        'Folklorik dans ve müzik'
      ],
      en: [
        'Historic stone villages',
        'Traditional architecture',
        'Multicultural heritage',
        'Historic churches and mosques',
        'Traditional handicrafts',
        'Folkloric dance and music'
      ]
    }
  },
  gastronomy: {
    name: { tr: 'Gastronomi', en: 'Gastronomy' },
    description: {
      tr: 'Karadeniz mutfağının lezzetleri, yerel ürünler, geleneksel yemekler ve organik tatlar',
      en: 'Flavors of Black Sea cuisine, local products, traditional dishes and organic tastes'
    },
    content: {
      tr: 'Kaçkar\'ın zengin toprakları ve temiz havası, organik tarımın merkezi haline getirmiştir bu bölgeyi. Karadeniz mutfağının benzersiz lezzetleri, yayla tereyağı, organik bal, taze balık ve otlu peynirler ile sofralarınızı şenlendirecek.',
      en: 'Kaçkar\'s fertile soil and clean air have made this region a center for organic agriculture. The unique flavors of Black Sea cuisine will enliven your tables with highland butter, organic honey, fresh fish and herbed cheeses.'
    },
    highlights: {
      tr: [
        'Organik yayla ürünleri',
        'Karadeniz balıkları',
        'Geleneksel otlu peynir',
        'Doğal bal çeşitleri',
        'Yayla tereyağı',
        'Geleneksel hamur işleri'
      ],
      en: [
        'Organic highland products',
        'Black Sea fish',
        'Traditional herbed cheese',
        'Natural honey varieties',
        'Highland butter',
        'Traditional pastries'
      ]
    }
  },
  adventure: {
    name: { tr: 'Macera', en: 'Adventure' },
    description: {
      tr: 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin dolu aktiviteler',
      en: 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities'
    },
    content: {
      tr: 'Kaçkar Dağları, maceraperestler için sınırsız fırsatlar sunuyor. Zorlu trekking rotalarından rahat yayla yürüyüşlerine, teknik dağcılıktan kamp deneyimlerine kadar her seviyeden outdoor aktivite burada mümkün.',
      en: 'The Kaçkar Mountains offer unlimited opportunities for adventure seekers. Every level of outdoor activity is possible here, from challenging trekking routes to comfortable highland walks, from technical mountaineering to camping experiences.'
    },
    highlights: {
      tr: [
        'Kaçkar Zirvesi tırmanışı',
        'Buzul gölleri trekking',
        'Yayla kamp alanları',
        'Dağcılık rotaları',
        'Fotoğraf safari',
        'Doğa yürüyüşleri'
      ],
      en: [
        'Kaçkar Peak climbing',
        'Glacial lakes trekking',
        'Highland camping areas',
        'Mountaineering routes',
        'Photography safari',
        'Nature walks'
      ]
    }
  },
  accommodation: {
    name: { tr: 'Konaklama', en: 'Accommodation' },
    description: {
      tr: 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri',
      en: 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options'
    },
    content: {
      tr: 'Kaçkar bölgesinde geleneksel taş evlerden modern otel seçeneklerine, romantik yayla evlerinden maceraperest kamp alanlarına kadar her bütçe ve zevke uygun konaklama imkanları bulunmaktadır.',
      en: 'In the Kaçkar region, there are accommodation opportunities for every budget and taste, from traditional stone houses to modern hotel options, from romantic highland houses to adventurous camping areas.'
    },
    highlights: {
      tr: [
        'Geleneksel taş ev pansiyonlar',
        'Yayla bungalov evleri',
        'Organik kahvaltı seçenekleri',
        'Kamp ve karavan alanları',
        'Boutique otel seçenekleri',
        'Aile işletmesi konukevleri'
      ],
      en: [
        'Traditional stone guesthouses',
        'Highland bungalow houses',
        'Organic breakfast options',
        'Camping and caravan areas',
        'Boutique hotel options',
        'Family-run guesthouses'
      ]
    }
  },
  transportation: {
    name: { tr: 'Ulaşım', en: 'Transportation' },
    description: {
      tr: 'Kaçkar\'a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler',
      en: 'How to reach Kaçkar, local transportation, transfer services and practical information'
    },
    content: {
      tr: 'Kaçkar Dağları\'na ulaşım, Trabzon ve Erzurum havaalanları üzerinden sağlanmaktadır. Bölgeye otobüs, minibüs ve özel araçlarla ulaşabilir, yerel transfer hizmetlerinden faydalanabilirsiniz.',
      en: 'Transportation to the Kaçkar Mountains is provided through Trabzon and Erzurum airports. You can reach the region by bus, minibus and private vehicles, and benefit from local transfer services.'
    },
    highlights: {
      tr: [
        'Trabzon Havaalanı (2 saat)',
        'Erzurum Havaalanı (1.5 saat)',
        'Otobüs terminal bağlantıları',
        'Yerel minibüs seferleri',
        'Özel transfer hizmetleri',
        'Araç kiralama seçenekleri'
      ],
      en: [
        'Trabzon Airport (2 hours)',
        'Erzurum Airport (1.5 hours)',
        'Bus terminal connections',
        'Local minibus services',
        'Private transfer services',
        'Car rental options'
      ]
    }
  }
};

// Category to image mapping
const categoryImageMap = {
  nature: 'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
  culture: 'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
  gastronomy: 'aa-01_edited.jpg',
  adventure: 'Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
  accommodation: 'Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
  transportation: 'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
  'music-dance': 'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
  'sustainable-tourism': 'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
  'health-wellness': 'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
  'photography-art': 'Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
  'educational-research': 'Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
  'events-festivals': 'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg'
};

// Category to icon mapping
const categoryIconMap = {
  nature: Leaf,
  culture: Users,
  gastronomy: ForkKnife,
  adventure: Mountains,
  accommodation: House,
  transportation: Car,
  'music-dance': MusicNote,
  'sustainable-tourism': Leaf,
  'health-wellness': Heart,
  'photography-art': Camera,
  'educational-research': GraduationCap,
  'events-festivals': CalendarCheck
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = params;
  const isEnglish = locale === 'en';
  const imageSize = useImageSize();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [footerData, setFooterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchData = async () => {
      // Removed minimum loading time for fastest possible loading
      
      try {
        setLoading(true);
        console.log('Fetching category for slug:', slug, 'locale:', locale);
        
        const [categoryResponse, footerResponse] = await Promise.all([
          fetch(`/api/public/categories/${slug}?locale=${locale}`),
          fetch(`/api/public/footer?locale=${locale}`)
        ]);
        
        console.log('Category response status:', categoryResponse.status);
        console.log('Category response ok:', categoryResponse.ok);
        
        if (categoryResponse.ok) {
          const result = await categoryResponse.json();
          console.log('Category fetched:', result.data);
          console.log('Subcategories:', result.data?.subcategories);
          
          if (result.data) {
            setCategory(result.data);
          }
        }
        
        if (footerResponse.ok) {
          const footerResult = await footerResponse.json();
          if (footerResult.data) {
            setFooterData(footerResult.data);
          }
        }
        
        if (!categoryResponse.ok) {
          console.log('Category not found for slug:', slug, 'locale:', locale);
          console.log('Response status:', categoryResponse.status);
          const errorText = await categoryResponse.text();
          console.log('Response text:', errorText);
          router.push(`/${locale}`);
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category:', error);
        router.push(`/${locale}`);
        return;
      }
    };

    if (slug && locale) {
      fetchData();
    }
  }, [slug, locale]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  if (!category) {
    router.push(`/${locale}`);
    return null;
  }

  const backgroundImage = category?.hero_image?.file_path || categoryImageMap[slug as keyof typeof categoryImageMap];
  const IconComponent = categoryIconMap[slug as keyof typeof categoryIconMap];

  return (
    <div className="min-h-screen bg-white" key={`${locale}-${slug}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${category?.hero_image?.file_path ? backgroundImage : getImageUrl(backgroundImage, imageSize)})`
          }}
        />
        
        {/* Multi-layered gradient overlay for depth and better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/60 via-transparent to-teal/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        
        {/* Animated geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 border border-white/20 rounded-full animate-pulse delay-2000"></div>
          </div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <IconComponent size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif font-black mb-4 leading-tight text-white drop-shadow-2xl">
            {category.name}
          </h1>
          
          {/* Glass Panel for Description */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl max-w-3xl mx-auto">
            <p className="text-xl text-white leading-relaxed drop-shadow-md">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center text-primary hover:text-primary/80 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
            >
              ← {getTranslation('category.backToHome', locale as Locale)}
            </Link>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {/* Header Text */}
            {category.content?.header && (
              <h2 className="text-3xl font-serif text-primary mb-8 text-center">
                {category.content.header}
              </h2>
            )}

            {/* Bullets Section */}
            {category.content?.bullets && category.content.bullets.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-8 mb-12">
                <h3 className="text-2xl font-serif text-primary mb-6 text-center">
                  {getTranslation('category.highlights', locale as Locale)}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.content.bullets.map((bullet: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body Text */}
            {category.content?.body && (
              <div className="mb-12">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {category.content.body}
                </p>
              </div>
            )}

            {/* Fallback Description if no content */}
            {!category.content && (
              <p className="text-gray-700 leading-relaxed text-lg mb-8">
                {category.description}
              </p>
            )}

            {/* Subcategories Section */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-serif text-primary mb-8 text-center">
                  {getTranslation('categories.exploreButton', locale as Locale)}
                </h2>
                <div className="space-y-16">
                  {category.subcategories.map((subcategory, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div key={subcategory.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                        {/* Image */}
                        <div className="w-full lg:flex-1">
                          {subcategory.image ? (
                            <div className="relative overflow-hidden rounded-2xl shadow-xl">
                              <img
                                src={subcategory.image.file_path}
                                alt={subcategory.image.alt_text || getLocalizedSubcategoryText(subcategory.title, locale)}
                                className="w-full h-64 sm:h-80 lg:h-96 xl:h-[28rem] object-cover transition-transform duration-300 hover:scale-105"
                              />
                              {subcategory.image.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                  <p className="text-white text-sm">{subcategory.image.caption}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-64 sm:h-80 lg:h-96 xl:h-[28rem] bg-gradient-to-br from-primary/20 to-teal/20 rounded-2xl flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <div className="text-4xl mb-2">📸</div>
                                <p className="text-sm">Image coming soon</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="w-full lg:flex-1 lg:px-4">
                          <h3 className="text-xl sm:text-2xl font-bold text-navy mb-4 tracking-wide">
                            {toLocaleUppercase(
                              getLocalizedSubcategoryText(subcategory.title, locale),
                              locale
                            )}
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                            {getLocalizedSubcategoryText(subcategory.body_text, locale)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center bg-white border-2 border-primary/20 rounded-xl p-8">
              <h3 className="text-2xl font-serif text-navy mb-4">
                {getTranslation('category.readyToExplore', locale as Locale)}
              </h3>
              <p className="text-gray-600 mb-6">
                {getTranslation('category.readyToExploreDescription', locale as Locale)}
              </p>
              <div className="flex justify-center">
                <Link
                  href={`/${locale}/contact`}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {getTranslation('contact.contactUs', locale as Locale)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Footer */}
      <footer className="bg-navy text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/logo-main.png"
                  alt="Discover Kaçkar"
                  className="h-12 w-auto mr-3"
                  onError={(e) => {
                    console.log('Footer logo failed to load, trying UTMB logo');
                    e.currentTarget.src = '/logos/logo-UTMB.png';
                  }}
                />
                <h3 className="text-xl font-bold">
                  {footerData?.company_name || 'Discover Kaçkar'}
                </h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                {footerData?.company_description || (isEnglish 
                  ? 'Discover the breathtaking beauty of the Kaçkar Mountains through our comprehensive travel guide.' 
                  : 'Kapsamlı seyahat rehberimiz aracılığıyla Kaçkar Dağları\'nın nefes kesen güzelliğini keşfedin.')}
              </p>
              <div className="flex space-x-4">
                {footerData?.social_links?.facebook && (
                  <a href={footerData.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Facebook">
                    <FacebookLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.instagram && (
                  <a href={footerData.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Instagram">
                    <InstagramLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.twitter && (
                  <a href={footerData.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Twitter">
                    <TwitterLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.youtube && (
                  <a href={footerData.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {isEnglish ? 'Quick Links' : 'Hızlı Bağlantılar'}
              </h4>
              <ul className="space-y-2">
                {footerData?.quick_links && footerData.quick_links.length > 0 ? (
                  footerData.quick_links.map((link: any, index: number) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {isEnglish ? link.title_en : link.title_tr}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li><a href={`/${locale}`} className="text-gray-300 hover:text-white transition-colors text-sm">{isEnglish ? 'Home' : 'Ana Sayfa'}</a></li>
                    <li><a href={`/${locale}/contact`} className="text-gray-300 hover:text-white transition-colors text-sm">{isEnglish ? 'Contact' : 'İletişim'}</a></li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {isEnglish ? 'Contact Info' : 'İletişim Bilgileri'}
              </h4>
              <div className="space-y-3">
                {footerData?.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      {footerData.address}
                    </span>
                  </div>
                )}
                {footerData?.email && (
                  <div className="flex items-center space-x-2">
                    <Envelope size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${footerData.email}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {footerData.email}
                    </a>
                  </div>
                )}
                {footerData?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${footerData.phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {footerData.phone}
                    </a>
                  </div>
                )}
                {!footerData && (
                  <div className="text-gray-300 text-sm">
                    <p>{isEnglish ? 'Contact us for more information' : 'Daha fazla bilgi için bizimle iletişime geçin'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400">
                {footerData?.copyright_text || `© ${new Date().getFullYear()} Discover Kaçkar. ${isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}`}
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end space-x-4 sm:space-x-6">
                {footerData?.legal_links && footerData.legal_links.length > 0 ? (
                  footerData.legal_links.map((link: any, index: number) => (
                    <a 
                      key={index}
                      href={link.url} 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {isEnglish ? link.title_en : link.title_tr}
                    </a>
                  ))
                ) : (
                  <>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}</a>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{isEnglish ? 'Terms of Service' : 'Hizmet Şartları'}</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}