'use client';

import { useState } from 'react';
import Link from 'next/link';
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

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="text-2xl font-serif font-bold text-navy hover:text-primary transition-colors"
          >
            Discover Kaçkar
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="text-navy hover:text-primary transition-colors font-medium text-sm"
              >
                {category.name[locale as 'tr' | 'en']}
              </Link>
            ))}
            
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
                  <Link
                    href="/tr"
                    className="block px-3 py-2 text-sm text-navy hover:bg-secondary/50 hover:text-primary"
                    onClick={() => setIsLangMenuOpen(false)}
                  >
                    TR
                  </Link>
                  <Link
                    href="/en"
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
                  href="/tr"
                  className="px-3 py-1 text-sm bg-secondary text-navy rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  TR
                </Link>
                <Link
                  href="/en"
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