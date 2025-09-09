import Link from 'next/link';
import { MapPin, Phone, EnvelopeSimple, FacebookLogo, InstagramLogo, TwitterLogo } from '@phosphor-icons/react';

interface SimpleFooterProps {
  locale: string;
}

export default function SimpleFooter({ locale }: SimpleFooterProps) {
  const isEnglish = locale === 'en';

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-24 bg-white p-1 rounded flex items-center justify-center">
                <img 
                  src="/logos/logo-main.png" 
                  alt="Discover Kaçkar" 
                  className="h-8 w-auto"
                  style={{ maxWidth: '100px' }}
                  onError={(e) => {
                    console.log('SimpleFooter logo failed to load, trying JPG version');
                    e.currentTarget.src = '/logos/logo-main.jpg';
                    e.currentTarget.onerror = () => {
                      console.log('JPG also failed, trying UTMB logo');
                      e.currentTarget.src = '/logos/logo-UTMB.png';
                      e.currentTarget.onerror = () => {
                        console.log('All logos failed, showing fallback text');
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-gray-600 font-bold">LOGO</span>';
                      };
                    };
                  }}
                />
              </div>
              <h3 className="text-xl font-serif font-bold text-primary">
                Discover Kaçkar
              </h3>
            </div>
            <p className="text-gray-300 mb-4">
              {isEnglish 
                ? "Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains."
                : "Kaçkar Dağları'nın doğal güzelliklerini, zengin kültürünü ve macera fırsatlarını keşfedin."
              }
            </p>
            <div className="flex space-x-4">
              <FacebookLogo size={24} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <a href="https://www.instagram.com/discoverkackar" target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={24} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              </a>
              <TwitterLogo size={24} className="text-gray-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isEnglish ? 'Quick Links' : 'Hızlı Linkler'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/category/nature`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Nature & Adventure' : 'Doğa & Macera'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/culture`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Culture & Local Life' : 'Kültür & Yerel Hayat'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/gastronomy`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Gastronomy & Local Flavours' : 'Gastronomi & Yerel Lezzetler'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/music-dance`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Music & Dance' : 'Müzik & Dans'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isEnglish ? 'Services' : 'Hizmetler'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/category/accommodation`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Accommodation' : 'Konaklama'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/transportation`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Transportation' : 'Ulaşım'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/tours`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Tours' : 'Turlar'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/category/guides`} className="text-gray-300 hover:text-primary transition-colors">
                  {isEnglish ? 'Guides' : 'Rehberler'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {isEnglish ? 'Contact' : 'İletişim'}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin size={18} className="text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  {isEnglish ? 'Kaçkar Mountains, Rize/Artvin, Turkey' : 'Kaçkar Dağları, Rize/Artvin, Türkiye'}
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+90 464 XXX XX XX</span>
              </li>
              <li className="flex items-center">
                <EnvelopeSimple size={18} className="text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-300 text-sm">info@discoverkackar.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Discover Kaçkar. {isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-primary text-sm transition-colors">
              {isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}
            </Link>
            <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-primary text-sm transition-colors">
              {isEnglish ? 'Terms of Service' : 'Kullanım Şartları'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}