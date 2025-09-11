'use client';

import { useState, useEffect } from 'react';
import LanguageAwareAdminPage from '@/components/admin/LanguageAwareAdminPage';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  locale: string;
}

export default function ExampleLanguagePage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching content for all locales
    const mockContent: ContentItem[] = [
      { id: '1', title: 'Welcome to Kaçkar', description: 'Discover the beauty of Kaçkar Mountains', locale: 'en' },
      { id: '2', title: 'Kaçkar\'a Hoş Geldiniz', description: 'Kaçkar Dağları\'nın güzelliğini keşfedin', locale: 'tr' },
      { id: '3', title: 'Bienvenue à Kaçkar', description: 'Découvrez la beauté des montagnes de Kaçkar', locale: 'fr' },
      { id: '4', title: 'Willkommen in Kaçkar', description: 'Entdecken Sie die Schönheit der Kaçkar-Berge', locale: 'de' },
    ];
    
    setTimeout(() => {
      setContent(mockContent);
      setLoading(false);
    }, 1000);
  }, []);

  const renderContentForLocale = (locale: string) => {
    const localeContent = content.filter(item => item.locale === locale);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (localeContent.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No content available for {locale.toUpperCase()}</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
            Create Content for {locale.toUpperCase()}
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {localeContent.map((item) => (
          <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-navy">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <div className="mt-4 flex space-x-2">
              <button className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90">
                Edit
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <LanguageAwareAdminPage title="Example Language-Aware Admin Page">
      {renderContentForLocale}
    </LanguageAwareAdminPage>
  );
}
