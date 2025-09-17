'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { Mountains, MapPin, Envelope, Phone, FacebookLogo, InstagramLogo, TwitterLogo } from '@phosphor-icons/react';

interface Image {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  category: string;
  is_optimized: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Scrolling Image Carousel Component
function ScrollingImageCarousel() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fallback images from public folder
  const fallbackImages = [
    '/images/aa-01_edited.jpg',
    '/images/ayder_plateau_3_58bd958670.avif',
    '/images/discover_over_the_clouds_eeff360dff.avif',
    '/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg',
    '/images/Kackar_HiRes-nodumsports_moritzklee-MK_01928-2.jpg'
  ];
  
  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/public/images');
        const result = await response.json();
        
        if (response.ok && result.data && result.data.length > 0) {
          console.log('API returned images:', result.data.length);
          // Use any visible images, not just gallery category
          const visibleImages = result.data
            .filter((img: Image) => img.is_visible)
            .slice(0, 16);
          
          console.log('Visible images found:', visibleImages.length);
          
          if (visibleImages.length > 0) {
            setImages(visibleImages);
          } else {
            console.log('No visible images, using fallback');
            // Use fallback images if no API images
            setImages(fallbackImages.map((path, index) => ({
              id: `fallback-${index}`,
              filename: path.split('/').pop() || `image-${index}.jpg`,
              original_filename: path.split('/').pop() || `image-${index}.jpg`,
              file_path: path,
              file_size: 0,
              mime_type: 'image/jpeg',
              alt_text: `Kaçkar ${index + 1}`,
              category: 'gallery',
              is_optimized: true,
              is_visible: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })));
          }
        } else {
          console.log('API failed or no data, using fallback images');
          // Use fallback images if API fails
          setImages(fallbackImages.map((path, index) => ({
            id: `fallback-${index}`,
            filename: path.split('/').pop() || `image-${index}.jpg`,
            original_filename: path.split('/').pop() || `image-${index}.jpg`,
            file_path: path,
            file_size: 0,
            mime_type: 'image/jpeg',
            alt_text: `Kaçkar ${index + 1}`,
            category: 'gallery',
            is_optimized: true,
            is_visible: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })));
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        // Use fallback images on error
        setImages(fallbackImages.map((path, index) => ({
          id: `fallback-${index}`,
          filename: path.split('/').pop() || `image-${index}.jpg`,
          original_filename: path.split('/').pop() || `image-${index}.jpg`,
          file_path: path,
          file_size: 0,
          mime_type: 'image/jpeg',
          alt_text: `Kaçkar ${index + 1}`,
          category: 'gallery',
          is_optimized: true,
          is_visible: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="h-64 bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading images...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="h-64 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gray-100 py-8">
      <div className="flex animate-scroll">
        {/* First set of images */}
        {images.map((image, index) => (
          <div key={`first-${image.id}`} className="flex-shrink-0 w-64 h-64 mx-2">
            <img
              src={image.file_path}
              alt={image.alt_text || image.original_filename || `Kaçkar ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {images.map((image, index) => (
          <div key={`second-${image.id}`} className="flex-shrink-0 w-64 h-64 mx-2">
            <img
              src={image.file_path}
              alt={image.alt_text || image.original_filename || `Kaçkar ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage({
  params
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const [footerData, setFooterData] = useState<any>(null);
  const isEnglish = locale === 'en';

  // Fetch footer data
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch(`/api/public/footer?locale=${locale}`);
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setFooterData(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };
    
    fetchFooterData();
  }, [locale]);
  
  // Hardcoded content based on locale
  const content = (() => {
    switch (locale) {
      case 'tr':
        return {
          title: 'Kaçkar Dağları Hakkında',
          subtitle: 'Doğa ve Kültürün Buluştuğu Yer',
          description: 'Discover Kaçkar, Türkiye\'nin kuzeydoğusunda yer alan Kaçkar Dağları bölgesini hem doğa sporu meraklılarına hem de kültür-severlere açan kapsamlı bir turizm girişimidir. Proje; Rize Valiliği, DOKA (Doğu Karadeniz Kalkınma Ajansı) ve Gençlik ile Spor Bakanlığı gibi kurumların desteğiyle, Kültür ve Turizm Bakanlığı ve ildeki paydaşların iş birliğiyle, sürdürülebilirlik ilkesi gözetilerek yürütülmektedir.',
          secondParagraph: 'Projenin merkezinde trekking ve bisiklet rotaları, rehberli doğa gezileri, yöresel kültür deneyimleri yer alır. Ayrıca uluslararası etkinliklere ev sahipliği yapmak, yöresel mutfak ve el sanatlarını tanıtmak, bölgenin flora ve fauna zenginliğini korumak gibi hedefleri de vardır. "Kaçkar by UTMB" ultra-trail koşusu gibi organizasyonlarla bölge, dünya çapında bir doğa ve macera turizmi merkezi olmayı amaçlamaktadır.'
        };
      case 'fr':
        return {
          title: 'À Propos des Montagnes Kaçkar',
          subtitle: 'Où la Nature et la Culture se Rencontrent',
          description: 'Discover Kaçkar est une initiative touristique complète qui ouvre les montagnes du Kaçkar, au nord-est de la Turquie, aussi bien aux passionnés de nature qu\'aux amateurs de culture. Le projet est mené avec le soutien d\'institutions telles que le Gouvernorat de Rize, la DOKA (Agence de Développement de la mer Noire orientale) et le Ministère de la Jeunesse et des Sports, en coopération avec le Ministère de la Culture et du Tourisme et les acteurs locaux, dans une perspective de durabilité.',
          secondParagraph: 'Au cœur du projet se trouvent des itinéraires de trekking et de vélo, des excursions guidées dans la nature et des expériences culturelles authentiques. Il vise également à accueillir des événements internationaux, à promouvoir la cuisine locale et l\'artisanat, et à protéger la riche flore et faune de la région. Avec des événements tels que la course d\'ultra-trail « Kaçkar by UTMB », la région aspire à devenir une destination mondiale du tourisme de nature et d\'aventure.'
        };
      case 'de':
        return {
          title: 'Über die Kaçkar-Berge',
          subtitle: 'Wo sich Natur und Kultur Treffen',
          description: 'Discover Kaçkar ist eine umfassende Tourismusinitiative, die das Kaçkar-Gebirge im Nordosten der Türkei sowohl für Natursportler als auch für Kulturliebhaber öffnet. Das Projekt wird mit Unterstützung von Institutionen wie der Provinzverwaltung Rize, DOKA (Entwicklungsagentur für das östliche Schwarze Meer) und dem Ministerium für Jugend und Sport durchgeführt, in Zusammenarbeit mit dem Ministerium für Kultur und Tourismus sowie lokalen Partnern, stets im Sinne der Nachhaltigkeit.',
          secondParagraph: 'Im Mittelpunkt stehen Trekking- und Radwege, geführte Naturtouren und authentische Kulturerlebnisse. Darüber hinaus zielt das Projekt darauf ab, internationale Veranstaltungen auszurichten, die lokale Küche und das Kunsthandwerk zu fördern und die reiche Flora und Fauna der Region zu schützen. Mit Veranstaltungen wie dem „Kaçkar by UTMB"-Ultratrail will die Region zu einem weltweiten Zentrum für Natur- und Abenteuertourismus werden.'
        };
      default: // English
        return {
          title: 'About Kaçkar Mountains',
          subtitle: 'Where Nature and Culture Meet',
          description: 'Discover Kaçkar is a comprehensive tourism initiative that opens the Kaçkar Mountains in northeastern Türkiye to both outdoor enthusiasts and culture lovers. The project is carried out with the support of institutions such as the Rize Governorship, DOKA (Eastern Black Sea Development Agency), and the Ministry of Youth and Sports, in cooperation with the Ministry of Culture and Tourism and local stakeholders, with a focus on sustainability.',
          secondParagraph: 'At its core are trekking and cycling routes, guided nature tours, and authentic cultural experiences. The project also aims to host international events, promote local cuisine and handicrafts, and protect the region\'s rich flora and fauna. With events such as the "Kaçkar by UTMB" ultra-trail race, the region aspires to become a global destination for nature and adventure tourism.'
        };
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
          {/* Hero Section - Navy background with white text */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-navy overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Mountains size={64} className="text-white/90" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {content.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto px-4">
              {content.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Description Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {content.description}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.secondParagraph}
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling Image Carousel */}
      {/* <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-navy mb-8">
            {locale === 'tr' ? 'Kaçkar Görüntüleri' : 
             locale === 'fr' ? 'Images du Kaçkar' : 
             locale === 'de' ? 'Kaçkar Bilder' : 
             'Kaçkar Images'}
          </h2>
        </div>
        <ScrollingImageCarousel />
      </div> */}
      <div className="bg-white">
      <ScrollingImageCarousel />
      </div>
      
      {/* Dynamic Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img
                  src="/logos/logo-main.png"
                  alt="Discover Kaçkar"
                  className="h-12 w-auto mr-3"
                  onError={(e) => {
                    console.log('Footer logo failed to load, trying UTMB logo');
                    e.currentTarget.src = '/logos/logo-UTMB.png';
                  }}
                />
                <h3 className="text-xl font-bold">
                  {footerData?.company_name || 'Discover Kaçkar'}
                </h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                {footerData?.company_description || (isEnglish 
                  ? 'Discover the breathtaking beauty of the Kaçkar Mountains through our comprehensive travel guide.' 
                  : 'Kapsamlı seyahat rehberimiz aracılığıyla Kaçkar Dağları\'nın nefes kesen güzelliğini keşfedin.')}
              </p>
              <div className="flex space-x-4">
                {footerData?.social_links?.facebook && (
                  <a href={footerData.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Facebook">
                    <FacebookLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.instagram && (
                  <a href={footerData.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Instagram">
                    <InstagramLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.twitter && (
                  <a href={footerData.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Twitter">
                    <TwitterLogo size={20} />
                  </a>
                )}
                {footerData?.social_links?.youtube && (
                  <a href={footerData.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {isEnglish ? 'Quick Links' : 'Hızlı Bağlantılar'}
              </h4>
              <ul className="space-y-2">
                {footerData?.quick_links && footerData.quick_links.length > 0 ? (
                  footerData.quick_links.map((link: any, index: number) => (
                    <li key={index}>
                      <a 
                        href={link.url} 
                        className="text-gray-300 hover:text-white transition-colors text-sm"
                      >
                        {isEnglish ? link.title_en : link.title_tr}
                      </a>
                    </li>
                  ))
                ) : (
                  <>
                    <li><a href={`/${locale}`} className="text-gray-300 hover:text-white transition-colors text-sm">{isEnglish ? 'Home' : 'Ana Sayfa'}</a></li>
                    <li><a href={`/${locale}/contact`} className="text-gray-300 hover:text-white transition-colors text-sm">{isEnglish ? 'Contact' : 'İletişim'}</a></li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {isEnglish ? 'Contact Info' : 'İletişim Bilgileri'}
              </h4>
              <div className="space-y-3">
                {footerData?.address && (
                  <div className="flex items-start space-x-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">
                      {footerData.address}
                    </span>
                  </div>
                )}
                {footerData?.email && (
                  <div className="flex items-center space-x-2">
                    <Envelope size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${footerData.email}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {footerData.email}
                    </a>
                  </div>
                )}
                {footerData?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${footerData.phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {footerData.phone}
                    </a>
                  </div>
                )}
                {!footerData && (
                  <div className="text-gray-300 text-sm">
                    <p>{isEnglish ? 'Contact us for more information' : 'Daha fazla bilgi için bizimle iletişime geçin'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-400">
                {footerData?.copyright_text || `© ${new Date().getFullYear()} Discover Kaçkar. ${isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}`}
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end space-x-4 sm:space-x-6">
                {footerData?.legal_links && footerData.legal_links.length > 0 ? (
                  footerData.legal_links.map((link: any, index: number) => (
                    <a 
                      key={index}
                      href={link.url} 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {isEnglish ? link.title_en : link.title_tr}
                    </a>
                  ))
                ) : (
                  <>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}</a>
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{isEnglish ? 'Terms of Service' : 'Hizmet Şartları'}</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Partner Logos Strip */}
      <div className="bg-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-12">
            {/* Rize Valiliği Logo */}
            <div className="flex items-center justify-center">
              <img 
                src="/logos/logo_rizevaliligi.png" 
                alt="Rize Valiliği" 
                className="h-12 sm:h-14 lg:h-16 w-auto"
                style={{ maxWidth: '150px' }}
                onError={(e) => {
                  console.log('Rize Valiliği logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            {/* Çamlıhemşin Kaymakamlığı Logo */}
            <div className="flex items-center justify-center">
              <img 
                src="/logos/logo_camlihemsin_kaymakam.png" 
                alt="Çamlıhemşin Kaymakamlığı" 
                className="h-12 sm:h-14 lg:h-16 w-auto"
                style={{ maxWidth: '150px' }}
                onError={(e) => {
                  console.log('Çamlıhemşin Kaymakamlığı logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            {/* DOKA Logo */}
            <div className="flex items-center justify-center">
              <img 
                src="/logos/logo_doka.png" 
                alt="DOKA" 
                className="h-12 sm:h-14 lg:h-16 w-auto"
                style={{ maxWidth: '150px' }}
                onError={(e) => {
                  console.log('DOKA logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}