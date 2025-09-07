import Link from 'next/link';
import { 
  Tree, 
  Buildings, 
  ForkKnife, 
  Backpack, 
  House, 
  Car, 
  MapPin, 
  Camera,
  Heart
} from '@phosphor-icons/react';
import { getCategoryImage, getImageUrl } from '@/lib/utils/imageUtils';

interface SimpleCategoryGridProps {
  locale: string;
}

const categories = [
  {
    id: '1',
    slug: 'nature',
    icon: Tree,
    name: { tr: 'Doğa', en: 'Nature' },
    description: { 
      tr: 'Kaçkar Dağları\'nın pristine doğası, buzul gölleri, endemik bitki örtüsü ve muhteşem manzaraları',
      en: 'Pristine nature of Kaçkar Mountains, glacial lakes, endemic flora and breathtaking landscapes'
    },
    highlights: {
      tr: ['50+ Buzul Gölü', 'Endemik Bitki Türleri', '3,937m Kaçkar Zirvesi'],
      en: ['50+ Glacial Lakes', 'Endemic Plant Species', '3,937m Kaçkar Peak']
    }
  },
  {
    id: '2',
    slug: 'culture',
    icon: Buildings,
    name: { tr: 'Kültür', en: 'Culture' },
    description: { 
      tr: 'Çok kültürlü miras, tarihi köyler, geleneksel mimarisi ve kadim gelenekler',
      en: 'Multicultural heritage, historic villages, traditional architecture and ancient traditions'
    },
    highlights: {
      tr: ['Tarihi Köyler', 'Geleneksel Mimarisi', 'Kültürel Festivaller'],
      en: ['Historic Villages', 'Traditional Architecture', 'Cultural Festivals']
    }
  },
  {
    id: '3',
    slug: 'gastronomy',
    icon: ForkKnife,
    name: { tr: 'Gastronomi', en: 'Gastronomy' },
    description: { 
      tr: 'Karadeniz mutfağının lezzetleri, yerel ürünler, geleneksel yemekler ve organik tatlar',
      en: 'Flavors of Black Sea cuisine, local products, traditional dishes and organic tastes'
    },
    highlights: {
      tr: ['Karadeniz Mutfağı', 'Organik Ürünler', 'Geleneksel Tatlar'],
      en: ['Black Sea Cuisine', 'Organic Products', 'Traditional Flavors']
    }
  },
  {
    id: '4',
    slug: 'adventure',
    icon: Backpack,
    name: { tr: 'Macera', en: 'Adventure' },
    description: { 
      tr: 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin dolu aktiviteler',
      en: 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities'
    },
    highlights: {
      tr: ['Trekking Rotaları', 'Dağcılık', 'Yayla Turları'],
      en: ['Trekking Routes', 'Mountaineering', 'Highland Tours']
    }
  },
  {
    id: '5',
    slug: 'accommodation',
    icon: House,
    name: { tr: 'Konaklama', en: 'Accommodation' },
    description: { 
      tr: 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri',
      en: 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options'
    },
    highlights: {
      tr: ['Geleneksel Pansiyonlar', 'Yayla Evleri', 'Kamp Alanları'],
      en: ['Traditional Guesthouses', 'Highland Houses', 'Camping Sites']
    }
  },
  {
    id: '6',
    slug: 'transportation',
    icon: Car,
    name: { tr: 'Ulaşım', en: 'Transportation' },
    description: { 
      tr: 'Kaçkar\'a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler',
      en: 'How to reach Kaçkar, local transportation, transfer services and practical information'
    },
    highlights: {
      tr: ['Havayolu Bağlantıları', 'Otobüs Seferleri', 'Yerel Transfer'],
      en: ['Flight Connections', 'Bus Services', 'Local Transfers']
    }
  }
];

export default function SimpleCategoryGrid({ locale }: SimpleCategoryGridProps) {
  const isEnglish = locale === 'en';

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
            {isEnglish ? 'Explore Categories' : 'Kategorileri Keşfet'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isEnglish 
              ? "Discover every aspect of Kaçkar Mountains through our carefully curated categories, each offering unique experiences and adventures."
              : "Özenle hazırlanmış kategorilerimiz aracılığıyla Kaçkar Dağları'nın her yönünü keşfedin, her biri benzersiz deneyimler ve maceralar sunuyor."
            }
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                  {/* Header with category image */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getImageUrl(getCategoryImage(category.id))})`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Category Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-serif font-bold text-white drop-shadow-lg">
                        {category.name[locale as 'tr' | 'en']}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {category.description[locale as 'tr' | 'en']}
                    </p>
                    
                    {/* Highlights */}
                    <div className="space-y-2 mb-4">
                      {category.highlights[locale as 'tr' | 'en'].map((highlight, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                          {highlight}
                        </div>
                      ))}
                    </div>
                    
                    {/* Action */}
                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                      {isEnglish ? 'Explore' : 'Keşfet'}
                      <MapPin size={18} className="ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
            <div className="flex justify-center mb-6">
              <Heart size={48} className="text-primary" />
            </div>
            
            <h3 className="text-3xl font-serif text-navy mb-4">
              {isEnglish ? 'Plan Your Perfect Journey' : 'Mükemmel Yolculuğunuzu Planlayın'}
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              {isEnglish 
                ? "Combine multiple categories to create your ideal Kaçkar experience. From nature exploration to cultural immersion, every adventure awaits."
                : "İdeal Kaçkar deneyiminizi yaratmak için birden fazla kategoriyi birleştirin. Doğa keşfinden kültürel deneyime, her macera sizi bekliyor."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/plan-your-trip`}
                className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <Camera size={20} className="mr-2" />
                {isEnglish ? 'Plan Your Trip' : 'Seyahatini Planla'}
              </Link>
              
              <Link
                href={`/${locale}/contact`}
                className="bg-transparent border-2 border-navy text-navy px-8 py-3 rounded-lg font-medium hover:bg-navy hover:text-white transition-colors"
              >
                {isEnglish ? 'Get Expert Help' : 'Uzman Yardımı Al'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}