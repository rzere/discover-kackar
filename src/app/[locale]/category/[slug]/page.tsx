'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryImage, getImageUrl } from '@/lib/utils/imageUtils';
import { useImageSize } from '@/hooks/useResponsiveImage';
import { useState, useEffect } from 'react';
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
import SimpleNavbar from '@/components/layout/SimpleNavbar';

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
  adventure: 'Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
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
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        console.log('Fetching category for slug:', slug, 'locale:', locale);
        const response = await fetch(`/api/public/categories/${slug}?locale=${locale}&t=${Date.now()}`);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Category fetched:', result.data);
          console.log('Subcategories:', result.data?.subcategories);
          
          if (result.data) {
            setCategory(result.data);
            setLoading(false);
            return;
          }
        }
        
        console.log('Category not found for slug:', slug, 'locale:', locale);
        console.log('Response status:', response.status);
        const errorText = await response.text();
        console.log('Response text:', errorText);
        notFound();
      } catch (error) {
        console.error('Error fetching category:', error);
        notFound();
      }
    };

    if (slug && locale) {
      fetchCategory();
    }
  }, [slug, locale]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!category) {
    notFound();
  }

  const backgroundImage = category?.hero_image?.file_path || categoryImageMap[slug as keyof typeof categoryImageMap];
  const IconComponent = categoryIconMap[slug as keyof typeof categoryIconMap];

  return (
    <div className="min-h-screen bg-white" key={`${locale}-${slug}`}>
      <SimpleNavbar locale={locale} />

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
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
            >
              ← {isEnglish ? 'Back to Home' : 'Ana Sayfaya Dön'}
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
                  {isEnglish ? 'Highlights' : 'Öne Çıkanlar'}
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
                  {isEnglish ? 'Explore More' : 'Daha Fazla Keşfet'}
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
                                alt={subcategory.image.alt_text || subcategory.title}
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
                              (() => {
                                if (typeof subcategory.title === 'string') {
                                  return subcategory.title;
                                }
                                const titleObj = subcategory.title as any;
                                if (isEnglish) {
                                  // Handle nested structure: title.en.en or title.en
                                  return titleObj?.en?.en || titleObj?.en || '';
                                } else {
                                  return titleObj?.tr || '';
                                }
                              })(), 
                              locale
                            )}
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                            {(() => {
                              if (typeof subcategory.body_text === 'string') {
                                return subcategory.body_text;
                              }
                              const bodyObj = subcategory.body_text as any;
                              if (isEnglish) {
                                // Handle nested structure: body_text.en.en or body_text.en
                                return bodyObj?.en?.en || bodyObj?.en || '';
                              } else {
                                return bodyObj?.tr || '';
                              }
                            })()}
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
                {isEnglish ? 'Ready to Explore?' : 'Keşfetmeye Hazır mısın?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {isEnglish 
                  ? 'Get in touch with local experts to plan your perfect Kaçkar experience.'
                  : 'Mükemmel Kaçkar deneyiminizi planlamak için yerel uzmanlarla iletişime geçin.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${locale}/contact`}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {isEnglish ? 'Contact Experts' : 'Uzmanlarla İletişim'}
                </Link>
                <Link
                  href={`/${locale}/plan-your-trip`}
                  className="bg-transparent border-2 border-navy text-navy px-8 py-3 rounded-lg font-medium hover:bg-navy hover:text-white transition-colors"
                >
                  {isEnglish ? 'Plan Your Trip' : 'Seyahatini Planla'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Footer */}
      <footer className="bg-navy text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href={`/${locale}`} className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-32 bg-white p-2 rounded flex items-center justify-center">
                  <img 
                    src="/logos/logo-main.png" 
                    alt="Discover Kaçkar" 
                    className="h-10 w-auto"
                    style={{ maxWidth: '120px' }}
                    onError={(e) => {
                      console.log('Footer logo failed to load, trying JPG version');
                      e.currentTarget.src = '/logos/logo-main.jpg';
                      e.currentTarget.onerror = () => {
                        console.log('JPG also failed, trying UTMB logo');
                        e.currentTarget.src = '/logos/logo-UTMB.png';
                        e.currentTarget.onerror = () => {
                          console.log('All logos failed, showing fallback text');
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-sm text-gray-600 font-bold">LOGO</span>';
                        };
                      };
                    }}
                  />
                </div>
                <span className="text-2xl font-serif font-bold text-white">
                  Discover Kaçkar
                </span>
              </Link>
              <p className="text-gray-300 max-w-md leading-relaxed mb-6">
                {isEnglish 
                  ? "Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains in Turkey's Black Sea region."
                  : "Türkiye'nin Karadeniz bölgesindeki Kaçkar Dağları'nın doğal güzelliklerini, zengin kültürünü ve macera fırsatlarını keşfedin."
                }
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10" title="Facebook">
                  <FacebookLogo size={20} />
                </a>
                <a href="https://www.instagram.com/discoverkackar" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10" title="Instagram">
                  <InstagramLogo size={20} />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10" title="Twitter">
                  <TwitterLogo size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">
                {isEnglish ? 'Explore' : 'Keşfet'}
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href={`/${locale}/category/nature`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {isEnglish ? 'Nature & Adventure' : 'Doğa & Macera'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/category/culture`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {isEnglish ? 'Culture & Local Life' : 'Kültür & Yerel Hayat'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/category/gastronomy`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {isEnglish ? 'Gastronomy & Local Flavours' : 'Gastronomi & Yerel Lezzetler'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/category/music-dance`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {isEnglish ? 'Music & Dance' : 'Müzik & Dans'}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/category/sustainable-tourism`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {isEnglish ? 'Sustainable Tourism' : 'Sürdürülebilir Turizm'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">
                {isEnglish ? 'Contact' : 'İletişim'}
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">
                      {isEnglish 
                        ? 'Kaçkar Mountains, Black Sea Region, Turkey'
                        : 'Kaçkar Dağları, Karadeniz Bölgesi, Türkiye'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Envelope size={20} className="text-primary flex-shrink-0" />
                  <a href="mailto:info@discoverkackar.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                    info@discoverkackar.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-primary flex-shrink-0" />
                  <a href="tel:+905551234567" className="text-gray-300 hover:text-white transition-colors text-sm">
                    +90 555 123 45 67
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Discover Kaçkar. {isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
              </p>
              <div className="flex space-x-6">
                <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}
                </Link>
                <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {isEnglish ? 'Terms of Service' : 'Kullanım Şartları'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}