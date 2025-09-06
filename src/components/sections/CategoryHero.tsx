'use client';

import Link from 'next/link';
import { ArrowLeft } from '@phosphor-icons/react';
import { Category } from '@/lib/types/content';

interface CategoryHeroProps {
  category: Category;
  locale: 'tr' | 'en';
}

export default function CategoryHero({ category, locale }: CategoryHeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-navy to-teal text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            href={`/${locale}`}
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            {locale === 'tr' ? 'Ana Sayfa' : 'Home'}
          </Link>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            {category.name[locale]}
          </h1>
          
          {category.description && (
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {category.description[locale]}
            </p>
          )}

          {/* Stats */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span>
                  {category.subcategories.length} {locale === 'tr' ? 'Alt Kategori' : 'Subcategories'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span>
                  {locale === 'tr' ? 'Her Seviyeye Uygun' : 'Suitable for All Levels'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl"></div>
    </section>
  );
}