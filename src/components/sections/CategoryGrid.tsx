'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { categories } from '@/lib/data/mockData';
import { getCategoryImage, getImageUrl } from '@/lib/utils/imageUtils';
import { 
  Mountains, 
  Users, 
  ForkKnife, 
  MusicNote, 
  Leaf, 
  Heart, 
  Camera, 
  GraduationCap, 
  CalendarCheck 
} from '@phosphor-icons/react';

const categoryIcons = {
  '1': Mountains,
  '2': Users,
  '3': ForkKnife,
  '4': MusicNote,
  '5': Leaf,
  '6': Heart,
  '7': Camera,
  '8': GraduationCap,
  '9': CalendarCheck,
};

export default function CategoryGrid() {
  const locale = useLocale() as 'tr' | 'en';

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
            {locale === 'tr' ? 'Keşfedilecek Alanlar' : 'Areas to Explore'}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {locale === 'tr' 
              ? 'Kaçkar\'ın her köşesinde farklı bir deneyim sizi bekliyor'
              : 'A different experience awaits you in every corner of Kaçkar'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.id as keyof typeof categoryIcons];
            
            return (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Category Image */}
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
                      {category.name[locale]}
                    </h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {category.description?.[locale] || 
                      (locale === 'tr' 
                        ? 'Bu kategoride size özel deneyimler ve keşifler sunuyoruz.'
                        : 'We offer special experiences and discoveries in this category.'
                      )
                    }
                  </p>
                  
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span
                          key={sub.id}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {sub.name[locale]}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                          +{category.subcategories.length - 3} {locale === 'tr' ? 'daha' : 'more'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="px-8 pb-8">
                  <div className="flex items-center text-primary font-medium group-hover:text-navy transition-colors">
                    <span>{locale === 'tr' ? 'Keşfet' : 'Explore'}</span>
                    <svg 
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}