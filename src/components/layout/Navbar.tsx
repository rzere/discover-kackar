'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/lib/simple-translations';
import { usePathname } from 'next/navigation';
import { List, X, Globe } from '@phosphor-icons/react';
import { categories } from '@/lib/data/mockData';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'tr';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);

  // Create language switcher URLs that preserve the current path
  const getLanguageUrl = (targetLocale: string) => {
    // Remove the current locale from the pathname and add the target locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    return `/${targetLocale}${pathWithoutLocale}`;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-24 bg-white p-1 rounded shadow-sm border border-gray-200 flex items-center justify-center relative">
                <Image 
                  src="/logos/logo-main.png" 
                  alt="Discover Kaçkar" 
                  width={80}
                  height={32}
                  className="h-8 w-auto"
                  style={{ maxWidth: '100px' }}
                  onLoad={() => console.log('Logo loaded successfully!')}
                  onError={() => {
                    console.log('Logo failed to load, trying JPG version...');
                    // Fallback handled by Next.js Image component
                  }}
                />
                {/* Debug indicator - remove this later */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-xl font-serif font-bold text-primary">
                Discover Kaçkar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="text-primary hover:text-dark transition-colors font-medium text-sm"
              >
                {category.name[locale as 'tr' | 'en']}
              </Link>
            ))}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-1 text-primary hover:text-dark transition-colors"
              >
                <Globe size={20} />
                <span className="uppercase text-sm font-medium">{locale}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href={getLanguageUrl('tr')}
                    className="block px-3 py-2 text-sm text-navy hover:bg-secondary/50 hover:text-primary"
                    onClick={() => setIsLangMenuOpen(false)}
                  >
                    TR
                  </Link>
                  <Link
                    href={getLanguageUrl('en')}
                    className="block px-3 py-2 text-sm text-navy hover:bg-secondary/50 hover:text-primary"
                    onClick={() => setIsLangMenuOpen(false)}
                  >
                    EN
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-navy hover:text-primary transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/category/${category.slug}`}
                  className="block py-2 text-navy hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name[locale as 'tr' | 'en']}
                </Link>
              ))}
              
              <div className="flex space-x-2 pt-2">
                <Link
                  href={getLanguageUrl('tr')}
                  className="px-3 py-1 text-sm bg-secondary text-navy rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  TR
                </Link>
                <Link
                  href={getLanguageUrl('en')}
                  className="px-3 py-1 text-sm bg-secondary text-navy rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  EN
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}