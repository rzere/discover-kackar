'use client';

import { useState } from 'react';
import { Globe, Check } from '@phosphor-icons/react';
import { locales } from '../../../i18n';

interface LanguageToggleProps {
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  className?: string;
}

const languageNames = {
  tr: 'Türkçe',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch'
};

const languageFlags = {
  tr: '🇹🇷',
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪'
};

export default function LanguageToggle({ currentLocale, onLocaleChange, className = '' }: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      >
        <Globe size={16} />
        <span className="text-lg">{languageFlags[currentLocale as keyof typeof languageFlags]}</span>
        <span>{languageNames[currentLocale as keyof typeof languageNames]}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => {
                    onLocaleChange(locale);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                    currentLocale === locale ? 'bg-primary/10 text-primary' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{languageFlags[locale as keyof typeof languageFlags]}</span>
                    <span>{languageNames[locale as keyof typeof languageNames]}</span>
                  </div>
                  {currentLocale === locale && (
                    <Check size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
