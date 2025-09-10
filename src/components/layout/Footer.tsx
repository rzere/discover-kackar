'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { FacebookLogo, InstagramLogo, TwitterLogo, MapPin, Envelope, Phone } from '@phosphor-icons/react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-navy text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href={`/${locale}`} className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-32 bg-white p-2 rounded flex items-center justify-center">
                <img 
                  src="/logos/logo-main.png" 
                  alt="Discover Kaçkar" 
                  className="h-10 w-auto"
                  style={{ maxWidth: '120px' }}
                  onError={(e) => {
                    console.log('Footer logo failed to load, trying JPG version');
                    e.currentTarget.src = '/logos/logo-main.jpg';
                    e.currentTarget.onerror = () => {
                      console.log('JPG also failed, trying UTMB logo');
                      e.currentTarget.src = '/logos/logo-UTMB.png';
                      e.currentTarget.onerror = () => {
                        console.log('All logos failed, showing fallback text');
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-sm text-gray-600 font-bold">LOGO</span>';
                      };
                    };
                  }}
                />
              </div>
              <span className="text-2xl font-serif font-bold text-white">
                Discover Kaçkar
              </span>
            </Link>
            <p className="text-gray-300 max-w-md leading-relaxed mb-6">
              {locale === 'tr' 
                ? 'Kaçkar Dağları\'nın eşsiz güzelliklerini, zengin kültürünü ve heyecan verici maceralarını keşfedin. Doğa, kültür ve macera dolu bir deneyim için bize katılın.'
                : 'Discover the unique beauties, rich culture and exciting adventures of the Kaçkar Mountains. Join us for an experience filled with nature, culture and adventure.'
              }
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <FacebookLogo size={20} />
              </a>
              <a href="https://www.instagram.com/discoverkackar" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <InstagramLogo size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <TwitterLogo size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              {locale === 'tr' ? 'Keşfet' : 'Explore'}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/category/nature`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Doğa & Macera' : 'Nature & Adventure'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/culture`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Kültür & Yerel Hayat' : 'Culture & Local Life'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/gastronomy`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Gastronomi & Yerel Lezzetler' : 'Gastronomy & Local Flavours'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/music-dance`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Müzik & Dans' : 'Music & Dance'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/sustainable-tourism`} className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Sürdürülebilir Turizm' : 'Sustainable Tourism'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">
              {locale === 'tr' ? 'İletişim' : 'Contact'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-white mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    {locale === 'tr' ? 'Kaçkar Dağları, Rize/Artvin' : 'Kaçkar Mountains, Rize/Artvin'}
                  </p>
                  <p className="text-gray-300 text-sm">Türkiye</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Envelope size={18} className="text-white flex-shrink-0" />
                <a href="mailto:info@discoverkackar.com" className="text-gray-300 hover:text-white transition-colors text-sm">
                  info@discoverkackar.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-white flex-shrink-0" />
                <a href="tel:+90464XXXXXXX" className="text-gray-300 hover:text-white transition-colors text-sm">
                  +90 464 XXX XX XX
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-gray-300 text-sm">
                © 2024 Discover Kaçkar. {locale === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>{locale === 'tr' ? 'Türkiye\'nin Gizli Dağ Cenneti' : 'Turkey\'s Hidden Mountain Paradise'}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href={`/${locale}/contact`} 
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                {locale === 'tr' ? 'İletişime Geçin' : 'Contact Us'}
              </Link>
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {locale === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}