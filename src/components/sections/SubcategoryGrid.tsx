'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Subcategory } from '@/lib/types/content';
import { ArrowRight } from '@phosphor-icons/react';

interface SubcategoryGridProps {
  subcategories: Subcategory[];
  locale: 'tr' | 'en';
}

export default function SubcategoryGrid({ subcategories, locale }: SubcategoryGridProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            {locale === 'tr' ? 'Keşfedilecek Alanlar' : 'Areas to Explore'}
          </h2>
          <p className="text-lg text-gray-600">
            {locale === 'tr' 
              ? 'Bu kategori altındaki özel deneyimleri keşfedin'
              : 'Discover special experiences under this category'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory, index) => (
            <div
              key={subcategory.id}
              className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="text-primary font-serif font-bold text-lg">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <ArrowRight 
                  size={20} 
                  className="text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" 
                />
              </div>

              <h3 className="text-xl font-serif font-bold text-navy mb-3 group-hover:text-primary transition-colors">
                {(subcategory.title as any)[locale]}
              </h3>

              {subcategory.body_text && (
                <p className="text-gray-600 text-sm line-clamp-3">
                  {(subcategory.body_text as any)[locale]}
                </p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-primary text-sm font-medium group-hover:text-navy transition-colors">
                  {locale === 'tr' ? 'Detayları Görüntüle' : 'View Details'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}