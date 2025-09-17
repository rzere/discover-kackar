'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from '@/lib/simple-translations';
import { usePathname } from 'next/navigation';
import { List, X, Globe } from '@phosphor-icons/react';
import { locales } from '../../../i18n';
import { getTranslation, type Locale } from '@/lib/utils/translations';

interface Category {
  id: string;
  slug: string;
  name: string;
  locale: string;
  is_active: boolean;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/fr') ? 'fr' : pathname.startsWith('/de') ? 'de' : 'tr';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);

  // Navigate to About page
  const navigateToAbout = () => {
    setIsMenuOpen(false);
  };

  // Get About text based on locale
  const getAboutText = () => {
    switch (locale) {
      case 'tr': return 'Hakkımızda';
      case 'fr': return 'À propos';
      case 'de': return 'Über uns';
      default: return 'About';
    }
  };

  // Get Routes text based on locale
  const getRoutesText = () => {
    switch (locale) {
      case 'tr': return 'Rotalar';
      case 'fr': return 'Itinéraires';
      case 'de': return 'Routen';
      default: return 'Routes';
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const result = await response.json();
          // Filter categories by current locale and active status
          const filteredCategories = (result.data || []).filter(
            (category: Category) => category.locale === locale && category.is_active
          );
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [locale]);

  // Create language switcher URLs that preserve the current path
  const getLanguageUrl = (targetLocale: string) => {
    // Remove the current locale from the pathname and add the target locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    return `/${targetLocale}${pathWithoutLocale}`;
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-12 w-28 flex items-center justify-center">
              <Image 
                src="/logos/logo-main.png" 
                alt="Discover Kaçkar" 
                width={100}
                height={40}
                className="h-10 w-auto"
                style={{ maxWidth: '120px' }}
                onLoad={() => console.log('Logo loaded successfully!')}
                onError={() => {
                  console.log('Logo failed to load, trying JPG version...');
                  // Fallback handled by Next.js Image component
                }}
              />
            </div>
          </Link>

          {/* Right side: Routes + About + Hamburger + Language Selector */}
          <div className="flex items-center space-x-4">
            {/* Routes Button - Desktop Only */}
            <div className="hidden md:block">
              <Link
                href={`/${locale}/routes`}
                className="text-navy hover:text-primary transition-colors font-medium"
              >
                {getRoutesText()}
              </Link>
            </div>
            {/* About Button - Desktop Only */}
            <div className="hidden md:block">
              <Link
                href={`/${locale}/about`}
                className="text-navy hover:text-primary transition-colors font-medium"
              >
                {getAboutText()}
              </Link>
            </div>
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-navy hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center space-x-1 text-navy hover:text-primary transition-colors"
              >
                <Globe size={20} />
                <span className="uppercase text-sm font-medium">{locale}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg py-1 z-50">
                  {locales.map((loc: string) => (
                    <Link
                      key={loc}
                      href={getLanguageUrl(loc)}
                      className="block px-3 py-2 text-sm text-navy hover:bg-secondary/50 hover:text-primary"
                      onClick={() => setIsLangMenuOpen(false)}
                    >
                      {loc.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hamburger Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-secondary/20 shadow-lg z-40 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Categories Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  {locale === 'tr' ? 'Kategoriler' : 
                   locale === 'fr' ? 'Catégories' : 
                   locale === 'de' ? 'Kategorien' : 
                   'Categories'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {!loading && categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${locale}/category/${category.slug}`}
                      className="block py-3 px-4 text-gray-800 hover:text-primary hover:bg-primary/5 transition-colors rounded-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>
              
              {/* Other Menu Items */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                  {locale === 'tr' ? 'Diğer' : 
                   locale === 'fr' ? 'Autres' : 
                   locale === 'de' ? 'Andere' : 
                   'Other'}
                </h3>
                
                {/* Routes Link */}
                <Link
                  href={`/${locale}/routes`}
                  className="block py-3 px-4 text-gray-800 hover:text-primary hover:bg-primary/5 transition-colors rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getRoutesText()}
                </Link>
                
                {/* About Link */}
                <Link
                  href={`/${locale}/about`}
                  className="block py-3 px-4 text-gray-800 hover:text-primary hover:bg-primary/5 transition-colors rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getAboutText()}
                </Link>
                
                {/* Contact Link - Primary CTA */}
                <Link
                  href={`/${locale}/contact`}
                  className="block py-3 px-4 bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getTranslation('contact.contact', locale as Locale)}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}