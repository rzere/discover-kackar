'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { getCategoryImage, getImageUrl } from '@/lib/utils/imageUtils';
import { useState, useEffect } from 'react';
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

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  hero_image_id?: string;
  hero_image?: {
    id: string;
    file_path: string;
    alt_text?: string;
  };
  subcategories?: any[];
}

const categoryIcons: Record<string, any> = {
  'Leaf': Leaf,
  'Users': Users,
  'ForkKnife': ForkKnife,
  'Mountains': Mountains,
  'House': Users, // Using Users as fallback
  'Car': Users, // Using Users as fallback
  'MusicNote': MusicNote,
  'Heart': Heart,
  'Camera': Camera,
  'GraduationCap': GraduationCap,
  'CalendarCheck': CalendarCheck,
};

export default function CategoryGrid() {
  const locale = useLocale() as 'tr' | 'en';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/public/categories?locale=${locale}`);
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [locale]);

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.icon_name] || Users;
              const backgroundImage = category.hero_image?.file_path || getImageUrl(getCategoryImage(category.slug));
              
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
                        backgroundImage: `url(${backgroundImage})`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Category Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-serif font-bold text-white drop-shadow-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {category.description}
                    </p>
                    
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub.id}
                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {sub.title}
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
        )}
      </div>
    </section>
  );
}