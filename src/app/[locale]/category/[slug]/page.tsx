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
  Car 
} from '@phosphor-icons/react';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

interface Category {
  id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  transportation: 'Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg'
};

// Category to icon mapping
const categoryIconMap = {
  nature: Leaf,
  culture: Users,
  gastronomy: ForkKnife,
  adventure: Mountains,
  accommodation: House,
  transportation: Car
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = params;
  const isEnglish = locale === 'en';
  const imageSize = useImageSize();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Turkish translations for category names and descriptions
  const turkishTranslations: Record<string, { name: string; description: string }> = {
    'nature': {
      name: 'Doğa',
      description: 'Kaçkar Dağları\'nın el değmemiş doğası, buzul gölleri, endemik bitki örtüsü ve nefes kesen manzaraları'
    },
    'culture': {
      name: 'Kültür',
      description: 'Çok kültürlü miras, tarihi köyler, geleneksel mimari ve kadim gelenekler'
    },
    'gastronomy': {
      name: 'Gastronomi',
      description: 'Karadeniz mutfağının lezzetleri, yerel ürünler, geleneksel yemekler ve organik tatlar'
    },
    'adventure': {
      name: 'Macera',
      description: 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin aktiviteleri'
    },
    'accommodation': {
      name: 'Konaklama',
      description: 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri'
    },
    'transportation': {
      name: 'Ulaşım',
      description: 'Kaçkar\'a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler'
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/public/categories?locale=en`); // Always fetch English categories
        const result = await response.json();
        
        if (response.ok) {
          console.log('Categories fetched:', result.data);
          const foundCategory = result.data.find((cat: Category) => cat.slug === slug);
          if (foundCategory) {
            console.log('Category found:', foundCategory);
            
            // Apply Turkish translations if locale is 'tr'
            if (locale === 'tr' && turkishTranslations[slug]) {
              const translation = turkishTranslations[slug];
              setCategory({
                ...foundCategory,
                name: translation.name,
                description: translation.description,
                locale: 'tr'
              });
            } else {
              setCategory(foundCategory);
            }
          } else {
            console.log('Category not found for slug:', slug);
            notFound();
          }
        } else {
          console.error('Error fetching category:', result.error);
          notFound();
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
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

  const backgroundImage = categoryImageMap[slug as keyof typeof categoryImageMap];
  const IconComponent = categoryIconMap[slug as keyof typeof categoryIconMap];

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${locale}`} className="text-2xl font-serif font-bold text-navy hover:text-primary transition-colors">
              Discover Kaçkar
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/tr"
                className={`px-3 py-1 text-sm rounded ${locale === 'tr' ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary'}`}
              >
                TR
              </Link>
              <Link
                href="/en"
                className={`px-3 py-1 text-sm rounded ${locale === 'en' ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary'}`}
              >
                EN
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getImageUrl(backgroundImage, imageSize)})`
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
          
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 leading-tight bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent drop-shadow-2xl">
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
            <p className="text-gray-700 leading-relaxed text-lg mb-8">
              {category.description}
            </p>

            {/* Category Info */}
            <div className="bg-gray-50 rounded-xl p-8 mb-12">
              <h3 className="text-2xl font-serif text-navy mb-6">
                {isEnglish ? 'Category Information' : 'Kategori Bilgileri'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>{isEnglish ? 'Category:' : 'Kategori:'}</strong> {category.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>{isEnglish ? 'Status:' : 'Durum:'}</strong> {category.is_active ? (isEnglish ? 'Active' : 'Aktif') : (isEnglish ? 'Inactive' : 'Pasif')}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>{isEnglish ? 'Order:' : 'Sıra:'}</strong> {category.sort_order}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">
                    <strong>{isEnglish ? 'Language:' : 'Dil:'}</strong> {category.locale.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

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

      {/* Simple Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif font-bold mb-4 text-primary">
            Discover Kaçkar
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {isEnglish 
              ? "Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains."
              : "Kaçkar Dağları'nın doğal güzelliklerini, zengin kültürünü ve macera fırsatlarını keşfedin."
            }
          </p>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Discover Kaçkar. {isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </div>
        </div>
      </footer>
    </div>
  );
}