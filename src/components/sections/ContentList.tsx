'use client';

import { ContentItem } from '@/lib/types/content';
import { Clock, ArrowRight } from '@phosphor-icons/react';

interface ContentListProps {
  content: ContentItem[];
  locale: 'tr' | 'en';
}

export default function ContentList({ content, locale }: ContentListProps) {
  if (content.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4">
            {locale === 'tr' ? 'İçerikler' : 'Contents'}
          </h2>
          <p className="text-lg text-gray-600">
            {locale === 'tr' 
              ? 'Bu kategori hakkında detaylı bilgiler'
              : 'Detailed information about this category'
            }
          </p>
        </div>

        <div className="space-y-8">
          {content.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif font-bold text-navy mb-3 hover:text-primary transition-colors cursor-pointer">
                      {item.title[locale]}
                    </h3>
                    
                    {item.description && (
                      <p className="text-gray-600 text-lg mb-4">
                        {item.description[locale]}
                      </p>
                    )}
                  </div>
                  
                  {item.image && (
                    <div className="ml-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex-shrink-0">
                      {/* Placeholder for image */}
                      <div className="w-full h-full rounded-lg bg-gray-200"></div>
                    </div>
                  )}
                </div>

                {item.content && (
                  <div className="prose prose-gray max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {item.content[locale]}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>
                        {new Date(item.updatedAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                    </div>
                  </div>
                  
                  <button className="inline-flex items-center text-primary hover:text-navy transition-colors font-medium">
                    <span>{locale === 'tr' ? 'Devamını Oku' : 'Read More'}</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}