'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { List, X, Globe } from '@phosphor-icons/react';

interface SimpleNavbarProps {
  locale: string;
}

const categories = [
  { id: 'nature', slug: 'nature', name: { tr: 'Doğa', en: 'Nature' } },
  { id: 'culture', slug: 'culture', name: { tr: 'Kültür', en: 'Culture' } },
  { id: 'gastronomy', slug: 'gastronomy', name: { tr: 'Gastronomi', en: 'Gastronomy' } },
  { id: 'adventure', slug: 'adventure', name: { tr: 'Macera', en: 'Adventure' } },
  { id: 'accommodation', slug: 'accommodation', name: { tr: 'Konaklama', en: 'Accommodation' } },
  { id: 'transportation', slug: 'transportation', name: { tr: 'Ulaşım', en: 'Transportation' } }
];

export default function SimpleNavbar({ locale }: SimpleNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const isEnglish = locale === 'en';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="h-10 w-24 bg-white p-1 rounded shadow-sm flex items-center justify-center relative">
              <Image 
                src="/logos/logo-main.png" 
                alt="Discover Kaçkar" 
                width={80}
                height={32}
                className="h-8 w-auto"
                style={{ maxWidth: '100px' }}
                onLoad={() => console.log('SimpleNavbar logo loaded successfully!')}
                onError={() => {
                  console.log('SimpleNavbar logo failed to load, trying JPG version...');
                  // Fallback handled by Next.js Image component
                }}
              />
            </div>
            <span className="text-xl font-serif font-bold text-primary">
              Discover Kaçkar
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {category.name[locale as 'tr' | 'en']}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative">
              <button className="text-gray-700 hover:text-primary transition-colors font-medium">
                {isEnglish ? 'More' : 'Daha Fazla'}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={toggleLangMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
              >
                <Globe size={20} />
                <span className="uppercase font-medium">{locale}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg">
                  <Link
                    href="/tr"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setIsLangMenuOpen(false)}
                  >
                    TR
                  </Link>
                  <Link
                    href="/en"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary"
                    onClick={() => setIsLangMenuOpen(false)}
                  >
                    EN
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="block px-4 py-2 text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name[locale as 'tr' | 'en']}
              </Link>
            ))}
            
            <div className="flex items-center justify-between px-4 py-2 mt-4">
              <span className="text-gray-700 font-medium">
                {isEnglish ? 'Language' : 'Dil'}
              </span>
              <div className="flex space-x-2">
                <Link
                  href="/tr"
                  className={`px-3 py-1 text-sm rounded ${locale === 'tr' ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TR
                </Link>
                <Link
                  href="/en"
                  className={`px-3 py-1 text-sm rounded ${locale === 'en' ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary'}`}
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