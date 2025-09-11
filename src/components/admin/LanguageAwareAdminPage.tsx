'use client';

import { useState, useEffect } from 'react';
import LanguageToggle from './LanguageToggle';

interface LanguageAwareAdminPageProps {
  title: string;
  children: (locale: string) => React.ReactNode;
  defaultLocale?: string;
}

export default function LanguageAwareAdminPage({ 
  title, 
  children, 
  defaultLocale = 'en' 
}: LanguageAwareAdminPageProps) {
  const [currentLocale, setCurrentLocale] = useState(defaultLocale);

  return (
    <div className="p-6">
      {/* Header with language toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        <LanguageToggle 
          currentLocale={currentLocale} 
          onLocaleChange={setCurrentLocale}
        />
      </div>

      {/* Language indicator */}
      <div className="mb-4 p-3 bg-primary/10 rounded-lg">
        <p className="text-sm text-primary font-medium">
          Currently editing: <span className="uppercase font-bold">{currentLocale}</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Switch languages to edit content for different locales
        </p>
      </div>

      {/* Content filtered by locale */}
      <div className="space-y-6">
        {children(currentLocale)}
      </div>
    </div>
  );
}
