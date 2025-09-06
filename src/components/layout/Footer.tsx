'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { FacebookLogo, InstagramLogo, TwitterLogo, MapPin, Envelope, Phone } from '@phosphor-icons/react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-navy text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${locale}`} className="text-2xl font-serif font-bold text-white hover:text-primary transition-colors">
              Discover Kaçkar
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              {locale === 'tr' 
                ? 'Kaçkar Dağları\'nın eşsiz güzelliklerini, zengin kültürünü ve heyecan verici maceralarını keşfedin.'
                : 'Discover the unique beauties, rich culture and exciting adventures of the Kaçkar Mountains.'
              }
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <FacebookLogo size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <InstagramLogo size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors">
                <TwitterLogo size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'tr' ? 'Hızlı Bağlantılar' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/category/nature-adventure`} className="text-gray-300 hover:text-primary transition-colors">
                  {locale === 'tr' ? 'Doğa & Macera' : 'Nature & Adventure'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/culture-local-life`} className="text-gray-300 hover:text-primary transition-colors">
                  {locale === 'tr' ? 'Kültür & Yerel Hayat' : 'Culture & Local Life'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/gastronomy`} className="text-gray-300 hover:text-primary transition-colors">
                  {locale === 'tr' ? 'Gastronomi' : 'Gastronomy'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/sustainable-tourism`} className="text-gray-300 hover:text-primary transition-colors">
                  {locale === 'tr' ? 'Sürdürülebilir Turizm' : 'Sustainable Tourism'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {locale === 'tr' ? 'İletişim' : 'Contact'}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-gray-300 text-sm">Rize, Türkiye</span>
              </div>
              <div className="flex items-center space-x-2">
                <Envelope size={16} className="text-primary" />
                <span className="text-gray-300 text-sm">info@discoverkackar.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-primary" />
                <span className="text-gray-300 text-sm">+90 464 XXX XXXX</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Discover Kaçkar. {locale === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-300 hover:text-primary transition-colors text-sm">
                {locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
              </Link>
              <Link href="#" className="text-gray-300 hover:text-primary transition-colors text-sm">
                {locale === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}