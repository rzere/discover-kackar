'use client';

import Link from 'next/link';
import Image from 'next/image';
import ImageGallery from '@/components/sections/ImageGallery';
import { getImageFromCategory, getImageUrl, getCategoryImage } from '@/lib/utils/imageUtils';
import { useResponsiveImage, useImageSize } from '@/hooks/useResponsiveImage';
import { useState, useEffect } from 'react';
import { getTranslation, getLocaleFromPathname, type Locale } from '@/lib/utils/translations';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
// Using API routes instead of direct Supabase calls
import { 
  Mountains, 
  Heart, 
  Camera, 
  Compass, 
  MapPin,
  Users,
  ForkKnife,
  MusicNote,
  Leaf,
  GraduationCap,
  CalendarCheck,
  House,
  Car,
  Envelope,
  Phone,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo
} from '@phosphor-icons/react';

interface PageData {
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  content: any;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  hero_image_id?: string;
  hero_image?: {
    id: string;
    file_path: string;
    alt_text?: string;
  };
}

export default function Home({
  params
}: {
  params: {locale: string};
}) {
  const isEnglish = params.locale === 'en';
  const isFrench = params.locale === 'fr';
  const isGerman = params.locale === 'de';
  const locale = params.locale as Locale;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [footerData, setFooterData] = useState<any>(null);
  const [ctaCard, setCtaCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openDistrict, setOpenDistrict] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [randomImages, setRandomImages] = useState<string[]>([]);
  
  // Generate random images when gallery images are loaded
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      const totalImagesNeeded = 18; // 5 carousel + 13 districts
      const generatedImages: string[] = [];
      
      // If we have fewer images than needed, allow duplicates
      if (galleryImages.length < totalImagesNeeded) {
        for (let i = 0; i < totalImagesNeeded; i++) {
          const randomIndex = Math.floor(Math.random() * galleryImages.length);
          const image = galleryImages[randomIndex];
          generatedImages.push(image?.file_path || '/images/placeholder.jpg');
        }
      } else {
        // We have enough images, ensure uniqueness
        const usedIndices = new Set<number>();
        for (let i = 0; i < totalImagesNeeded; i++) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * galleryImages.length);
          } while (usedIndices.has(randomIndex));
          
          usedIndices.add(randomIndex);
          const image = galleryImages[randomIndex];
          generatedImages.push(image?.file_path || '/images/placeholder.jpg');
        }
      }
      
      setRandomImages(generatedImages);
    }
  }, [galleryImages]);
  
  const getRandomImage = (index: number): string => {
    if (randomImages.length === 0) {
      return '/images/placeholder.jpg';
    }
    return randomImages[index % randomImages.length];
  };

  // Helper function to get localized content
  const getLocalizedContent = (en: string, tr: string, fr: string, de: string): string => {
    if (isEnglish) return en;
    if (isFrench) return fr;
    if (isGerman) return de;
    return tr; // Default to Turkish
  };
  const imageSize = useImageSize();

  // ULTRA-OPTIMIZED: Single API call for all homepage data with progressive loading
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // Single optimized API call that fetches all data server-side
        const response = await fetch(`/api/public/homepage-data?locale=${params.locale}`, {
          // Add request optimization headers
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate, br',
          },
          // Enable keep-alive for faster subsequent requests
          keepalive: true,
        });
        
        if (response.ok) {
          const result = await response.json();
          const { page, categories, footer, ctaCard, galleryImages } = result.data;
          
          // Set critical data first for faster perceived loading
          if (page) setPageData(page);
          if (categories) setCategories(categories);
          
          // Set secondary data immediately after
          if (footer) setFooterData(footer);
          if (ctaCard) setCtaCard(ctaCard);
          if (galleryImages) setGalleryImages(galleryImages);
          
          // Stop loading as soon as critical data is set
          setLoading(false);
        } else {
          console.error('Failed to fetch homepage data:', response.status);
          setGalleryImages([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setGalleryImages([]);
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, [params.locale]);
  
  // OPTIMIZED: Get hero images with lazy loading
  const heroImages = [
    getImageFromCategory('hero', 0),
    getImageFromCategory('hero', 1),
    getImageFromCategory('hero', 2),
    getImageFromCategory('hero', 3),
    getImageFromCategory('hero', 4)
  ];

  // OPTIMIZED: Preload critical images for faster initial load
  useEffect(() => {
    if (heroImages.length > 0) {
      // Preload first 3 hero images in parallel
      const preloadPromises = heroImages.slice(0, 3).map(image => {
        return new Promise<void>((resolve) => {
          const img = new window.Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't fail on image load errors
          img.src = getImageUrl(image, imageSize);
        });
      });
      
      // Don't await - let them load in background
      Promise.all(preloadPromises).catch(() => {
        // Silently handle any preload errors
      });
    }
  }, [heroImages, imageSize]);

  // OPTIMIZED: Rotate background images with smart preloading
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % heroImages.length;
        const nextNextIndex = (nextIndex + 1) % heroImages.length;
        
        // Preload next 2 images in background for smooth transitions
        [nextIndex, nextNextIndex].forEach(index => {
          if (heroImages[index]) {
            const img = new window.Image();
            img.src = getImageUrl(heroImages[index], imageSize);
          }
        });
        
        return nextIndex;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [heroImages.length, imageSize]);

  // Fallback content if no data from Supabase
  const fallbackContent = {
    title: isEnglish ? 'Where Nature and Culture Meet in the Peaks of Kaçkar' : 'Kaçkar\'ın Zirvelerinde Doğa ve Kültürün Buluşması',
    subtitle: isEnglish ? 'Turkey\'s Hidden Mountain Paradise' : 'Türkiye\'nin Gizli Dağ Cenneti',
    description: isEnglish 
      ? 'Discover the Kaçkar Mountains and Rize, where nature, culture, and history meet. Explore trails, highlands, local flavours, and traditions.'
      : 'Kaçkar Dağları ve Rize\'de doğa, kültür ve tarihin buluştuğu eşsiz rotaları keşfedin. Yaylalar, lezzetler ve gelenekler sizi bekliyor.',
    cta_primary: isEnglish ? 'Explore Nature' : 'Doğayı Keşfet',
    cta_secondary: isEnglish ? 'Discover Culture' : 'Kültürü Keşfet',
    stats: [
      { value: '3,937m', label: isEnglish ? 'Highest Peak' : 'En Yüksek Zirve' },
      { value: '50+', label: isEnglish ? 'Alpine Lakes' : 'Alpin Göl' },
      { value: '100+', label: isEnglish ? 'Photo Spots' : 'Fotoğraf Noktası' }
    ]
  };

  // Use dynamic data or fallback
  const content = pageData?.content || fallbackContent;
  const pageTitle = pageData?.h1 || fallbackContent.title;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white py-16 sm:py-20">
        {/* Dynamic Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${getImageUrl(image, imageSize)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
          
          {/* Multi-layered gradient overlay for depth and better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy/60 via-transparent to-teal/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          
          {/* Animated geometric patterns - hidden on mobile for performance */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
              <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-32 left-1/4 w-20 h-20 border border-white/20 rounded-full animate-pulse delay-2000"></div>
              <div className="absolute bottom-20 right-1/3 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-3000"></div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Floating elements for visual interest - hidden on mobile */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse hidden sm:block"></div>
          <div className="absolute -top-5 -right-10 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000 hidden sm:block"></div>
          <div className="absolute -bottom-10 -left-20 w-24 h-24 bg-teal/20 rounded-full blur-xl animate-pulse delay-2000 hidden sm:block"></div>
          
          
          {/* UTMB Banner */}
          <div className="mb-8 sm:mb-10 flex justify-center">
            <a 
              href="http://kackarbyutmb.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 shadow-lg hover:bg-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              <svg className="w-4 h-4 text-white/60 group-hover:text-primary mr-2 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-semibold text-sm sm:text-base">
                <span className="font-bold">Kaçkar by UTMB</span> {getTranslation('event.utmbBanner', locale).replace('Kaçkar by UTMB ', '')}
              </span>
            </a>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black mb-8 sm:mb-10 leading-tight text-white drop-shadow-2xl px-2">
            {pageTitle}
          </h1>
          
          {/* Glass Panel for Text Content */}
          <div className="relative z-20 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-white font-medium drop-shadow-lg">
              {content.subtitle || getTranslation('hero.subtitle', locale)}
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed drop-shadow-md">
              {content.description || (isEnglish 
                ? "Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey's hidden gem in the Black Sea region."
                : "Karadeniz bölgesinin gizli hazinesi olan Kaçkar Dağları'nın el değmemiş doğasını, kadim kültürlerini ve nefes kesen manzaralarını keşfedin."
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link
              href={`/${params.locale}/category/nature`}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
            >
{content.cta_primary || (isEnglish ? "Explore Nature" : "Doğayı Keşfet")}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href={`/${params.locale}/category/culture`}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-white/80 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
{content.cta_secondary || (isEnglish ? "Discover Culture" : "Kültürü Keşfet")}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href="#"
              className="group inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/30 text-sm sm:text-base"
            >
{getTranslation('hero.followTrails', locale)}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
            {(content.stats || fallbackContent.stats).map((stat: { value: string; label: string }, index: number) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                  {index === 0 && <Compass size={24} className="text-white sm:w-8 sm:h-8" />}
                  {index === 1 && <Mountains size={24} className="text-white sm:w-8 sm:h-8" />}
                  {index === 2 && <Camera size={24} className="text-white sm:w-8 sm:h-8" />}
              </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-200">
                  {stat.label}
            </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Indicators - Small white dots positioned behind glass panel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 z-0">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white/80' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Rize Introduction Carousel */}
      <section id="about-rize" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
              {getLocalizedContent('Discover Rize', 'Rize\'yi Keşfedin', 'Découvrir Rize', 'Rize entdecken')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getLocalizedContent(
                'Located on Türkiye\'s northeastern Black Sea coast, Rize is where steep mountains meet the sea. The province borders Artvin, Trabzon and Erzurum, shaped by deep valleys, rushing rivers and dramatic slopes.',
                'Türkiye\'nin kuzeydoğusunda, Karadeniz\'in kıyısında yer alan Rize; sarp dağların denizle buluştuğu benzersiz bir coğrafyadır. İl, doğudan Artvin, batıdan Trabzon, güneyden Erzurum ile çevrilidir.',
                'Située sur la côte nord-est de la Turquie, Rize est l\'endroit où les montagnes abruptes rencontrent la mer Noire. La province voisine d\'Artvin, Trabzon et Erzurum est façonnée par de profondes vallées, des rivières impétueuses et des pentes spectaculaires.',
                'An der nordöstlichen Schwarzmeerküste der Türkei liegt Rize, wo steile Berge auf das Meer treffen. Die Provinz grenzt an Artvin, Trabzon und Erzurum und ist geprägt von tiefen Tälern, reißenden Flüssen und dramatischen Hängen.'
              )}
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Carousel Slides */}
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Slide 1: Gate of Blacksea */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-12 rounded-2xl border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-bold text-navy">
                            {getLocalizedContent('Between Mountains and the Sea', 'Dağ ve Deniz Arasında', 'Entre Montagnes et Mer', 'Zwischen Bergen und Meer')}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {getLocalizedContent(
                            'Located on Türkiye\'s northeastern Black Sea coast, Rize is where steep mountains meet the sea. The province borders Artvin, Trabzon and Erzurum, shaped by deep valleys, rushing rivers and dramatic slopes.',
                            'Türkiye\'nin kuzeydoğusunda, Karadeniz\'in kıyısında yer alan Rize; sarp dağların denizle buluştuğu benzersiz bir coğrafyadır. İl, doğudan Artvin, batıdan Trabzon, güneyden Erzurum ile çevrilidir. Coğrafi yapısı dik yamaçlar, derin vadiler ve coşkulu derelerden oluşur.',
                            'Située sur la côte nord-est de la Turquie, Rize est l\'endroit où les montagnes abruptes rencontrent la mer Noire. La province voisine d\'Artvin, Trabzon et Erzurum est façonnée par de profondes vallées, des rivières impétueuses et des pentes spectaculaires.',
                            'An der nordöstlichen Schwarzmeerküste der Türkei liegt Rize, wo steile Berge auf das Meer treffen. Die Provinz grenzt an Artvin, Trabzon und Erzurum und ist geprägt von tiefen Tälern, reißenden Flüssen und dramatischen Hängen.'
                          )}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Northeastern Black Sea coast', 'Kuzeydoğu Karadeniz kıyısı', 'Côte nord-est de la mer Noire', 'Nordöstliche Schwarzmeerküste')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Steep mountains meet the sea', 'Sarp dağlar denizle buluşur', 'Montagnes abruptes rencontrent la mer', 'Steile Berge treffen auf das Meer')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Deep valleys and rushing rivers', 'Derin vadiler ve coşkulu dereler', 'Vallées profondes et rivières impétueuses', 'Tiefe Täler und reißende Flüsse')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/1.jpg"
                          alt={getLocalizedContent('Rize Between Mountains and Sea', 'Rize Karadeniz Kapısı', 'Rize Entre Montagnes et Mer', 'Rize Zwischen Bergen und Meer')}
                          className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2: History and Culture */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-2xl border border-blue-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-bold text-navy">
                            {getLocalizedContent('Mosaic of History and Culture', 'Tarih ve Kültür Mozaiği', 'Mosaïque d\'Histoire et Culture', 'Mosaik aus Geschichte und Kultur')}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {getLocalizedContent(
                            'Settled since antiquity, Rize was a coastal stronghold in Roman and Byzantine times. In the Ottoman era, tea cultivation transformed the region. Today, Rize is a cultural mosaic shaped by Hemşin and Laz traditions.',
                            'Antik çağlardan beri yerleşim yeri olan Rize, Roma ve Bizans döneminde önemli bir kıyı kalesiydi. Osmanlı döneminde çay tarımıyla büyük bir dönüşüm yaşandı. Bugün Rize, Hemşin ve Laz topluluklarının kültürel izlerini taşıyan bir mozaiktir.',
                            'Habité depuis l\'Antiquité, Rize fut une forteresse côtière à l\'époque romaine et byzantine. Sous l\'Empire ottoman, la culture du thé transforma la région. Aujourd\'hui, Rize est un véritable mosaïque culturelle façonnée par les traditions hémichiennes et lazes.',
                            'Seit der Antike besiedelt, war Rize in römischer und byzantinischer Zeit eine Küstenfestung. In der osmanischen Ära veränderte der Teeanbau die Region grundlegend. Heute ist Rize ein kulturelles Mosaik, geprägt von den Traditionen der Hemşin und Lazen.'
                          )}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Roman and Byzantine heritage', 'Roma ve Bizans mirası', 'Héritage romain et byzantin', 'Römisches und byzantinisches Erbe')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Ottoman tea transformation', 'Osmanlı çay dönüşümü', 'Transformation ottomane du thé', 'Osmanische Tee-Transformation')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Hemşin and Laz traditions', 'Hemşin ve Laz gelenekleri', 'Traditions hémichiennes et lazes', 'Hemşin und Laz Traditionen')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/2.jpg"
                          alt={getLocalizedContent('Rize History and Culture', 'Rize Tarih ve Kültür', 'Rize Histoire et Culture', 'Rize Geschichte und Kultur')}
                          className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 2: Plateau Wonderland */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-12 rounded-2xl border border-green-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-bold text-navy">
                            {getLocalizedContent('Plateau Wonderland', 'Yaylaların Diyarı', 'Pays des Merveilles des Plateaux', 'Plateau-Wunderland')}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {getLocalizedContent(
                            'At the foot of the Kaçkar Mountains lie hundreds of highland plateaus. Pokut, Ayder, Anzer, Ovit and Elevit are famous for their wooden houses, cloud seas and flower meadows. The tradition of transhumance is still alive today.',
                            'Kaçkar Dağları\'nın eteklerinde yüzlerce yayla bulunur. Pokut, Ayder, Anzer, Ovit ve Elevit yaylaları; ahşap evleri, sis denizleri ve çiçekli çayırlarıyla tanınır. Yaylacılık geleneği bugün hâlâ yaşamaktadır.',
                            'Au pied des montagnes du Kaçkar se trouvent des centaines de plateaux. Pokut, Ayder, Anzer, Ovit et Elevit sont célèbres pour leurs maisons en bois, leurs mers de nuages et leurs prairies fleuries. La tradition de la transhumance est encore vivante aujourd\'hui.',
                            'Am Fuße des Kaçkar-Gebirges liegen Hunderte von Hochplateaus. Pokut, Ayder, Anzer, Ovit und Elevit sind berühmt für ihre Holzhäuser, Wolkenmeere und Blumenwiesen. Die Tradition der Almwirtschaft ist auch heute noch lebendig.'
                          )}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Hundreds of highland plateaus', 'Yüzlerce yayla', 'Centaines de plateaux', 'Hunderte von Hochplateaus')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Pokut, Ayder, Anzer, Ovit, Elevit', 'Pokut, Ayder, Anzer, Ovit, Elevit', 'Pokut, Ayder, Anzer, Ovit, Elevit', 'Pokut, Ayder, Anzer, Ovit, Elevit')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Living transhumance tradition', 'Yaşayan yaylacılık geleneği', 'Tradition vivante de transhumance', 'Lebendige Almwirtschaft-Tradition')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/3.jpg"
                          alt={getLocalizedContent('Rize Plateaus', 'Rize Yaylaları', 'Plateaux de Rize', 'Rize Plateaus')}
                          className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 3: Nature and Adventure */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-12 rounded-2xl border border-purple-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-bold text-navy">
                            {getLocalizedContent('Center of Nature and Adventure', 'Doğa ve Macera Merkezi', 'Centre de Nature et Aventure', 'Zentrum für Natur und Abenteuer')}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {getLocalizedContent(
                            'Rize is a year-round destination for outdoor sports: trekking, cycling, rafting in summer, snow trekking and skiing in winter. Glacial lakes, waterfalls and endemic plants make the region unique for nature lovers.',
                            'Rize, yıl boyunca doğa sporları için eşsiz bir merkezdir. Yazın trekking, bisiklet, rafting; kışın kar yürüyüşü ve kayak yapılır. Buzul gölleri, şelaleler ve endemik bitki türleri bölgeyi doğaseverler için benzersiz kılar.',
                            'Rize est une destination toute l\'année pour les sports de plein air : trekking, vélo, rafting en été, randonnée dans la neige et ski en hiver. Ses lacs glaciaires, cascades et plantes endémiques rendent la région unique pour les amoureux de la nature.',
                            'Rize ist ein Ganzjahresziel für Outdoor-Sportarten: Trekking, Radfahren, Rafting im Sommer, Schneewanderungen und Skifahren im Winter. Gletscherseen, Wasserfälle und endemische Pflanzen machen die Region einzigartig für Naturliebhaber.'
                          )}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Year-round outdoor sports', 'Yıl boyunca doğa sporları', 'Sports de plein air toute l\'année', 'Ganzjährige Outdoor-Sportarten')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Glacial lakes and waterfalls', 'Buzul gölleri ve şelaleler', 'Lacs glaciaires et cascades', 'Gletscherseen und Wasserfälle')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Endemic plant species', 'Endemik bitki türleri', 'Espèces végétales endémiques', 'Endemische Pflanzenarten')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/4.jpg"
                          alt={getLocalizedContent('Rize Nature and Adventure', 'Rize Doğa ve Macera', 'Rize Nature et Aventure', 'Rize Natur und Abenteuer')}
                          className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slide 4: Tea Capital */}
                <div className="w-full flex-shrink-0">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-12 rounded-2xl border border-amber-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <h3 className="text-3xl font-bold text-navy">
                            {getLocalizedContent('Capital of Tea', 'Çayın Başkenti', 'Capitale du Thé', 'Hauptstadt des Tees')}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {getLocalizedContent(
                            'Tea cultivation, begun in the early 20th century, has become Rize\'s symbol. Today most of Türkiye\'s tea is produced here. Tea gardens stretch from the coast to the mountain slopes, shaping the landscape.',
                            '20. yüzyılın başında başlayan çay tarımı, Rize\'nin simgesi oldu. Bugün Türkiye\'nin çay ihtiyacının büyük kısmı buradan karşılanır. Çay bahçeleri kıyıdan dağların zirvelerine kadar uzanır ve manzarayı şekillendirir.',
                            'La culture du thé, commencée au début du XXe siècle, est devenue le symbole de Rize. Aujourd\'hui, la majorité du thé turc est produite ici. Les jardins de thé s\'étendent de la côte jusqu\'aux pentes montagneuses, façonnant le paysage.',
                            'Der Teeanbau, der Anfang des 20. Jahrhunderts begann, ist zum Symbol von Rize geworden. Heute wird der Großteil des türkischen Tees hier produziert. Teegärten ziehen sich von der Küste bis zu den Berghängen und prägen die Landschaft.'
                          )}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Early 20th century tea cultivation', '20. yüzyıl başı çay tarımı', 'Culture du thé début XXe siècle', 'Teeanbau Anfang des 20. Jahrhunderts')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Most of Türkiye\'s tea production', 'Türkiye\'nin çay üretiminin çoğu', 'Majorité de la production de thé turc', 'Großteil der türkischen Teeproduktion')}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-600">{getLocalizedContent('Coast to mountain tea gardens', 'Kıyıdan dağlara çay bahçeleri', 'Jardins de thé de la côte aux montagnes', 'Teegärten von der Küste zu den Bergen')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/5.jpg"
                          alt={getLocalizedContent('Rize Tea Capital', 'Rize Çay Başkenti', 'Rize Capitale du Thé', 'Rize Hauptstadt des Tees')}
                          className="w-full h-96 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? 4 : prev - 1))}
              className="absolute -left-12 text-gray-400 hover:text-primary hover:scale-105 transition-all duration-200 z-10"
              style={{ top: 'calc(50% - 2rem)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 4 ? 0 : prev + 1))}
              className="absolute -right-12 text-gray-400 hover:text-primary hover:scale-105 transition-all duration-200 z-10"
              style={{ top: 'calc(50% - 2rem)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {[0, 1, 2, 3, 4].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index ? 'bg-navy scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rize Districts Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
              {getLocalizedContent('Rize Districts', 'Rize İlçeleri', 'Districts de Rize', 'Rize Bezirke')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getLocalizedContent(
                'Explore the diverse districts of Rize, each offering unique experiences from coastal towns to mountain retreats.',
                'Rize\'nin çeşitli ilçelerini keşfedin, her biri kıyı kasabalarından dağ inzivalarına kadar benzersiz deneyimler sunar.',
                'Explorez les divers districts de Rize, chacun offrant des expériences uniques des villes côtières aux retraites montagnardes.',
                'Entdecken Sie die vielfältigen Bezirke von Rize, die jeweils einzigartige Erlebnisse von Küstenstädten bis hin zu Bergretreats bieten.'
              )}
            </p>
          </div>

          {/* Districts Accordion */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Rize Merkez (City Center) */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'rize_merkez' ? null : 'rize_merkez')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Rize Merkez</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Administrative and Cultural Hub', 'İdari ve Kültürel Merkez', 'Centre Administratif et Culturel', 'Verwaltungs- und Kulturzentrum')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'rize_merkez' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'rize_merkez' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'As the administrative and cultural hub of the region, Rize offers a lifestyle infused with the aroma of tea along the Black Sea coast. The city\'s symbol, Kale-i Bala (Rize Castle), welcomes visitors with a history dating back to the Byzantine era. The Rize Museum and Çaykur Tea Museum showcase the region\'s cultural heritage and the journey of tea.',
                        'Rize\'nin idari ve kültürel merkezi olan şehir, Karadeniz\'in kıyısında çay kokusuyla harmanlanmış bir yaşam sunar. Şehrin simgesi haline gelen Kale-i Bala (Rize Kalesi), Bizans döneminden günümüze uzanan tarihî geçmişiyle ziyaretçilerini karşılar.',
                        'En tant que centre administratif et culturel de la région, Rize offre un mode de vie imprégné de l\'arôme du thé le long de la côte de la mer Noire. Le symbole de la ville, Kale-i Bala (Château de Rize), accueille les visiteurs avec une histoire remontant à l\'ère byzantine. Le Musée de Rize et le Musée du Thé Çaykur présentent le patrimoine culturel de la région et le voyage du thé.',
                        'Als Verwaltungs- und Kulturzentrum der Region bietet Rize einen Lebensstil, der vom Aroma des Tees entlang der Schwarzmeerküste durchdrungen ist. Das Symbol der Stadt, Kale-i Bala (Rize-Burg), begrüßt Besucher mit einer Geschichte, die bis in die byzantinische Ära zurückreicht. Das Rize-Museum und das Çaykur-Tee-Museum zeigen das kulturelle Erbe der Region und die Reise des Tees.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Kale-i Bala (Rize Castle)', 'Kale-i Bala (Rize Kalesi)', 'Kale-i Bala (Château de Rize)', 'Kale-i Bala (Rize-Burg)')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Rize Museum and Tea Museum', 'Rize Müzesi ve Çay Müzesi', 'Musée de Rize et Musée du Thé', 'Rize-Museum und Tee-Museum')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Coastal promenades and cafés', 'Sahil yürüyüş yolları ve kafeler', 'Promenades côtières et cafés', 'Küstenpromenaden und Cafés')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tea factory tours', 'Çay fabrikası turları', 'Visites d\'usines de thé', 'Tee-Fabrikführungen')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Çamlıhemşin */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'camlihemsin' ? null : 'camlihemsin')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Çamlıhemşin</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Gateway to Kaçkar Mountains', 'Kaçkar Dağları\'na Açılan Kapı', 'Porte d\'Entrée vers les Montagnes Kaçkar', 'Tor zu den Kaçkar-Bergen')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'camlihemsin' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'camlihemsin' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'The tourism heart of Rize. Ayder Plateau, with its hot springs, festivals and wooden chalets, is the most iconic destination. Çamlıhemşin also offers the Fırtına Valley, historic stone bridges, and access to the Kaçkar Mountains—a hub where nature and culture meet.',
                        'Rize\'nin turizm kalbi. Ayder Yaylası, sıcak kaplıcaları, şenlikleri ve ahşap yayla evleriyle bölgenin en bilinen destinasyonu. Çamlıhemşin aynı zamanda Fırtına Vadisi, tarihi taş kemer köprüleri ve Kaçkar Dağları\'na açılan kapısıyla doğa ve kültürün birleştiği bir merkezdir.',
                        'Le cœur touristique de Rize. Le Plateau d\'Ayder, avec ses sources chaudes, festivals et chalets en bois, est la destination la plus emblématique. Çamlıhemşin offre également la Vallée de Fırtına, des ponts de pierre historiques et l\'accès aux Montagnes Kaçkar—un centre où la nature et la culture se rencontrent.',
                        'Das touristische Herz von Rize. Das Ayder-Plateau mit seinen heißen Quellen, Festivals und Holzhäusern ist das ikonischste Reiseziel. Çamlıhemşin bietet auch das Fırtına-Tal, historische Steinbrücken und Zugang zu den Kaçkar-Bergen—ein Zentrum, wo Natur und Kultur aufeinandertreffen.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Ayder Plateau with hot springs', 'Sıcak kaplıcalı Ayder Yaylası', 'Plateau d\'Ayder avec sources chaudes', 'Ayder-Plateau mit heißen Quellen')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Fırtına Valley and historic bridges', 'Fırtına Vadisi ve tarihi köprüler', 'Vallée de Fırtına et ponts historiques', 'Fırtına-Tal und historische Brücken')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Gateway to Kaçkar Mountains', 'Kaçkar Dağları\'na açılan kapı', 'Porte d\'entrée vers les Montagnes Kaçkar', 'Tor zu den Kaçkar-Bergen')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Traditional festivals and culture', 'Geleneksel şenlikler ve kültür', 'Festivals traditionnels et culture', 'Traditionelle Feste und Kultur')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ardeşen */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'ardesen' ? null : 'ardesen')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Ardeşen</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Tea Capital of Turkey', 'Türkiye\'nin Çay Başkenti', 'Capitale du Thé de Turquie', 'Tee-Hauptstadt der Türkei')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'ardesen' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'ardesen' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'One of the most vibrant coastal towns. Known as a rafting hub and for its handmade pita bread. The Tunca Valley with its historic bridges and plateaus adds both cultural and natural richness to the district.',
                        'Karadeniz\'in en hareketli sahil ilçelerinden biridir. Rafting merkezi olarak bilinir ve el yapımı Ardeşen pidesi ile sofralarda yerini alır. Ayrıca Tunca Vadisi üzerindeki tarihi köprüler ve yaylalar, ilçeye kültürel ve doğal bir zenginlik katar.',
                        'L\'une des villes côtières les plus dynamiques. Connue comme centre de rafting et pour son pain pita artisanal. La Vallée de Tunca avec ses ponts historiques et plateaux ajoute richesse culturelle et naturelle au district.',
                        'Eine der lebendigsten Küstenstädte. Bekannt als Rafting-Zentrum und für ihr handgemachtes Pita-Brot. Das Tunca-Tal mit seinen historischen Brücken und Plateaus verleiht dem Bezirk sowohl kulturelle als auch natürliche Reichtümer.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Rafting center and water sports', 'Rafting merkezi ve su sporları', 'Centre de rafting et sports nautiques', 'Rafting-Zentrum und Wassersport')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Handmade Ardeşen pita bread', 'El yapımı Ardeşen pidesi', 'Pain pita artisanal d\'Ardeşen', 'Handgemachtes Ardeşen-Pita-Brot')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tunca Valley with historic bridges', 'Tarihi köprülü Tunca Vadisi', 'Vallée de Tunca avec ponts historiques', 'Tunca-Tal mit historischen Brücken')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Vibrant coastal atmosphere', 'Canlı kıyı atmosferi', 'Atmosphère côtière dynamique', 'Lebendige Küstenatmosphäre')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pazar */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'pazar' ? null : 'pazar')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Pazar</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Historic Trading Center', 'Tarihi Ticaret Merkezi', 'Centre Commercial Historique', 'Historisches Handelszentrum')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'pazar' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'pazar' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Pazar has a rich history as a trading center and offers a mix of coastal beauty and cultural heritage. The district is known for its vibrant local markets.',
                        'Pazar, ticaret merkezi olarak zengin bir geçmişe sahiptir ve kıyı güzelliği ile kültürel mirasın karışımını sunar. İlçe canlı yerel pazarları ile tanınır.',
                        'Pazar a une riche histoire en tant que centre commercial et offre un mélange de beauté côtière et de patrimoine culturel. Le district est connu pour ses marchés locaux dynamiques.',
                        'Pazar hat eine reiche Geschichte als Handelszentrum und bietet eine Mischung aus Küstenschönheit und kulturellem Erbe. Der Bezirk ist für seine lebendigen lokalen Märkte bekannt.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Historic local markets', 'Tarihi yerel pazarlar', 'Marchés locaux historiques', 'Historische lokale Märkte')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Cultural heritage sites', 'Kültürel miras alanları', 'Sites du patrimoine culturel', 'Kulturerbestätten')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Coastal walking paths', 'Kıyı yürüyüş yolları', 'Sentiers de promenade côtière', 'Küstenspazierwege')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fındıklı */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'findikli' ? null : 'findikli')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Fındıklı</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Hazelnut Paradise', 'Fındık Cenneti', 'Paradis de la Noisette', 'Haselnuss-Paradies')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'findikli' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'findikli' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'As the eastern gateway of Rize, Fındıklı stands out with its varied geography stretching from the Black Sea coast to high plateaus. The Çağlayan River and its historic stone arch bridges reflect the region\'s past. Traditional stone mansions showcase Laz culture in architecture. Fındıklı is also known for kiwi cultivation, offering unique agricultural diversity within the Black Sea region.',
                        'Rize\'nin doğu kapısı olan Fındıklı, deniz kıyısından yüksek yaylalara uzanan farklı coğrafi yapısıyla dikkat çeker. Çağlayan Deresi ve üzerindeki tarihi taş kemer köprüler, bölgenin geçmişini yansıtır. İlçedeki geleneksel taş konaklar, Laz kültürünün mimariye yansımış özgün örnekleridir. Ayrıca Fındıklı, kivi üretimiyle de tanınır ve bu yönüyle Karadeniz\'de farklı bir tarımsal çeşitlilik sunar.',
                        'En tant que porte d\'entrée orientale de Rize, Fındıklı se distingue par sa géographie variée s\'étendant de la côte de la mer Noire aux hauts plateaux. La rivière Çağlayan et ses ponts de pierre historiques reflètent le passé de la région. Les manoirs de pierre traditionnels mettent en valeur la culture laze dans l\'architecture. Fındıklı est également connue pour la culture du kiwi, offrant une diversité agricole unique dans la région de la mer Noire.',
                        'Als östliches Tor zu Rize sticht Fındıklı mit seiner vielfältigen Geografie hervor, die sich von der Schwarzmeerküste bis zu hohen Plateaus erstreckt. Der Çağlayan-Fluss und seine historischen Steinbogenbrücken spiegeln die Vergangenheit der Region wider. Traditionelle Steinhäuser zeigen die Laz-Kultur in der Architektur. Fındıklı ist auch für den Kiwi-Anbau bekannt und bietet eine einzigartige landwirtschaftliche Vielfalt in der Schwarzmeerregion.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Historic stone arch bridges', 'Tarihi taş kemer köprüler', 'Ponts de pierre historiques', 'Historische Steinbogenbrücken')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Traditional Laz stone mansions', 'Geleneksel Laz taş konakları', 'Manoirs de pierre lazes traditionnels', 'Traditionelle Laz-Steinhäuser')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Kiwi cultivation and agriculture', 'Kivi yetiştiriciliği ve tarım', 'Culture du kiwi et agriculture', 'Kiwi-Anbau und Landwirtschaft')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Eastern gateway to Rize', 'Rize\'nin doğu kapısı', 'Porte d\'entrée orientale de Rize', 'Östliches Tor zu Rize')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Çayeli */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'cayeli' ? null : 'cayeli')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Çayeli</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Tea Gardens and Beautiful Beaches', 'Çay Bahçeleri ve Güzel Sahiller', 'Jardins de Thé et Belles Plages', 'Teegärten und Schöne Strände')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'cayeli' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'cayeli' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Known for tea-covered slopes and some of the Black Sea\'s most beautiful beaches. Its cuisine is highlighted by Çayeli-style beans and seafood. Aşıklar and Başköy Plateaus also attract nature lovers with their hiking opportunities.',
                        'Çay tarlalarıyla kaplı yamaçların yanı sıra Karadeniz\'in en güzel sahillerine sahiptir. Çayeli kuru fasulyesi ve deniz ürünleriyle mutfağı öne çıkar. Ayrıca Aşıklar ve Başköy yaylaları, doğa yürüyüşçüleri için keşfedilmeyi bekleyen güzelliklerdir.',
                        'Connu pour ses pentes couvertes de thé et certaines des plus belles plages de la mer Noire. Sa cuisine est mise en valeur par les haricots à la façon Çayeli et les fruits de mer. Les plateaux d\'Aşıklar et Başköy attirent également les amoureux de la nature avec leurs opportunités de randonnée.',
                        'Bekannt für seine teebedeckten Hänge und einige der schönsten Strände des Schwarzen Meeres. Seine Küche wird durch Çayeli-Bohnen und Meeresfrüchte hervorgehoben. Die Aşıklar- und Başköy-Plateaus ziehen auch Naturliebhaber mit ihren Wandermöglichkeiten an.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tea-covered slopes', 'Çay tarlalarıyla kaplı yamaçlar', 'Pentes couvertes de thé', 'Teebedeckte Hänge')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Beautiful Black Sea beaches', 'Güzel Karadeniz sahilleri', 'Belles plages de la mer Noire', 'Schöne Schwarzmeerstrände')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Çayeli-style beans and seafood', 'Çayeli kuru fasulyesi ve deniz ürünleri', 'Haricots à la façon Çayeli et fruits de mer', 'Çayeli-Bohnen und Meeresfrüchte')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Aşıklar and Başköy Plateaus', 'Aşıklar ve Başköy yaylaları', 'Plateaux d\'Aşıklar et Başköy', 'Aşıklar- und Başköy-Plateaus')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Derepazarı */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'derepazari' ? null : 'derepazari')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Derepazarı</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Tea Processing and Coastal Atmosphere', 'Çay İşleme ve Sahil Atmosferi', 'Traitement du Thé et Atmosphère Côtière', 'Tee-Verarbeitung und Küstenatmosphäre')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'derepazari' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'derepazari' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Known for tea processing facilities and its coastal atmosphere with seafood restaurants. Sivrikaya Plateau in the highlands offers a cool climate and natural beauty, popular among locals in summer.',
                        'Çay işleme tesisleriyle bilinir. Ayrıca sahil kasabası atmosferi ve balık lokantalarıyla öne çıkar. İlçenin yükseklerinde yer alan Sivrikaya Yaylası, serin havası ve doğal güzellikleriyle bölge halkının yaz aylarında tercih ettiği bir mekândır.',
                        'Connu pour ses installations de traitement du thé et son atmosphère côtière avec restaurants de fruits de mer. Le Plateau de Sivrikaya dans les hautes terres offre un climat frais et une beauté naturelle, populaire parmi les habitants en été.',
                        'Bekannt für Tee-Verarbeitungsanlagen und seine Küstenatmosphäre mit Meeresfrüchte-Restaurants. Das Sivrikaya-Plateau in den Hochländern bietet ein kühles Klima und natürliche Schönheit, beliebt bei Einheimischen im Sommer.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tea processing facilities', 'Çay işleme tesisleri', 'Installations de traitement du thé', 'Tee-Verarbeitungsanlagen')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Coastal atmosphere and seafood', 'Sahil atmosferi ve deniz ürünleri', 'Atmosphère côtière et fruits de mer', 'Küstenatmosphäre und Meeresfrüchte')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Sivrikaya Plateau', 'Sivrikaya Yaylası', 'Plateau de Sivrikaya', 'Sivrikaya-Plateau')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Cool summer climate', 'Serin yaz iklimi', 'Climat estival frais', 'Kühles Sommerklima')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hemşin */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'hemsin' ? null : 'hemsin')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Hemşin</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Cultural Heritage Center', 'Kültürel Miras Merkezi', 'Centre du Patrimoine Culturel', 'Kulturerbe-Zentrum')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'hemsin' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'hemsin' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'A cultural hub with tulum music, horon dances, transhumance, and weaving traditions. Hemşin wool socks are a geographically protected product. The Balcıdere Plateau and surrounding stone bridges combine cultural heritage with nature.',
                        'Tulum ezgileri, horonlar, yaylacılık ve dokuma gelenekleriyle kültürel zenginliğin merkezi. Hemşin çorabı coğrafi işaretli ürünlerindendir. İlçede ayrıca Balcıdere Yaylası ve çevresindeki taş köprüler, kültürel dokuyu ve doğayı bir arada sunar.',
                        'Un centre culturel avec musique tulum, danses horon, transhumance et traditions de tissage. Les chaussettes en laine Hemşin sont un produit géographiquement protégé. Le Plateau de Balcıdere et les ponts de pierre environnants combinent patrimoine culturel et nature.',
                        'Ein kulturelles Zentrum mit Tulum-Musik, Horon-Tänzen, Almwirtschaft und Webtraditionen. Hemşin-Wollsocken sind ein geografisch geschütztes Produkt. Das Balcıdere-Plateau und die umliegenden Steinbrücken verbinden kulturelles Erbe mit Natur.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tulum music and horon dances', 'Tulum ezgileri ve horonlar', 'Musique tulum et danses horon', 'Tulum-Musik und Horon-Tänze')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Hemşin wool socks (protected product)', 'Hemşin çorabı (coğrafi işaretli)', 'Chaussettes en laine Hemşin (produit protégé)', 'Hemşin-Wollsocken (geschütztes Produkt)')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Balcıdere Plateau', 'Balcıdere Yaylası', 'Plateau de Balcıdere', 'Balcıdere-Plateau')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Traditional weaving and transhumance', 'Geleneksel dokuma ve yaylacılık', 'Tissage traditionnel et transhumance', 'Traditionelles Weben und Almwirtschaft')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Güneysu */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'guneysu' ? null : 'guneysu')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Güneysu</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Tea Valleys and Historic Mosques', 'Çay Vadileri ve Tarihi Camiler', 'Vallées de Thé et Mosquées Historiques', 'Teetäler und Historische Moscheen')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'guneysu' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'guneysu' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Recognized for valleys covered in tea gardens and historic mosques. A balanced reflection of Rize\'s cultural and natural identity. The district is especially famous for Handüzü Plateau, which comes alive in summer with nature hikes and festivals.',
                        'Çay bahçeleriyle çevrili vadileri ve tarihi camileriyle bilinir. Rize\'nin kültürel ve doğal kimliğinin dengeli bir yansımasıdır. İlçe, özellikle Handüzü Yaylası ile ünlüdür; yaz aylarında doğa yürüyüşleri ve yayla şenlikleriyle canlanır.',
                        'Reconnu pour ses vallées couvertes de jardins de thé et ses mosquées historiques. Un reflet équilibré de l\'identité culturelle et naturelle de Rize. Le district est particulièrement célèbre pour le Plateau de Handüzü, qui s\'anime en été avec randonnées nature et festivals.',
                        'Bekannt für Täler, die mit Teegärten bedeckt sind, und historische Moscheen. Ein ausgewogenes Spiegelbild der kulturellen und natürlichen Identität von Rize. Der Bezirk ist besonders berühmt für das Handüzü-Plateau, das im Sommer mit Naturwanderungen und Festivals zum Leben erwacht.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tea garden valleys', 'Çay bahçeli vadiler', 'Vallées de jardins de thé', 'Teegarten-Täler')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Historic mosques', 'Tarihi camiler', 'Mosquées historiques', 'Historische Moscheen')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Handüzü Plateau', 'Handüzü Yaylası', 'Plateau de Handüzü', 'Handüzü-Plateau')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Nature hikes and festivals', 'Doğa yürüyüşleri ve şenlikler', 'Randonnées nature et festivals', 'Naturwanderungen und Feste')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* İkizdere */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'ikizdere' ? null : 'ikizdere')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">İkizdere</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Thermal Waters and Anzer Honey', 'Termal Sular ve Anzer Balı', 'Eaux Thermales et Miel d\'Anzer', 'Thermalwasser und Anzer-Honig')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'ikizdere' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'ikizdere' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Famous for its thermal waters and mountain villages. Anzer Plateau is the homeland of world-famous Anzer Honey, produced thanks to its endemic flora. The Ovit Plateau and tunnel also serve as a strategic gateway connecting the region to Eastern Anatolia.',
                        'Termal suları ve dağ köyleriyle ünlüdür. Özellikle Anzer Yaylası, dünyaca tanınan Anzer Balı\'nın üretildiği yerdir. Endemik bitki çeşitliliği sayesinde bu bal yalnızca burada elde edilir. Ayrıca Ovit Yaylası ve tüneli, bölgeyi Doğu Anadolu\'ya bağlayan stratejik bir geçittir.',
                        'Célèbre pour ses eaux thermales et ses villages de montagne. Le Plateau d\'Anzer est la patrie du miel d\'Anzer mondialement connu, produit grâce à sa flore endémique. Le Plateau d\'Ovit et son tunnel servent également de porte d\'entrée stratégique reliant la région à l\'Anatolie orientale.',
                        'Berühmt für seine Thermalwasser und Bergdörfer. Das Anzer-Plateau ist die Heimat des weltberühmten Anzer-Honigs, der dank seiner endemischen Flora produziert wird. Das Ovit-Plateau und der Tunnel dienen auch als strategisches Tor, das die Region mit Ostanatolien verbindet.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('World-famous Anzer Honey', 'Dünyaca ünlü Anzer Balı', 'Miel d\'Anzer mondialement connu', 'Weltberühmter Anzer-Honig')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Thermal waters and spas', 'Termal sular ve kaplıcalar', 'Eaux thermales et spas', 'Thermalwasser und Spas')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Ovit Plateau and tunnel', 'Ovit Yaylası ve tüneli', 'Plateau d\'Ovit et tunnel', 'Ovit-Plateau und Tunnel')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Endemic flora diversity', 'Endemik bitki çeşitliliği', 'Diversité de la flore endémique', 'Endemische Flora-Vielfalt')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* İyidere */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'iyidere' ? null : 'iyidere')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">İyidere</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Strategic Port and Rize Mandarin', 'Stratejik Liman ve Rize Mandalinası', 'Port Stratégique et Mandarin de Rize', 'Strategischer Hafen und Rize-Mandarine')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'iyidere' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'iyidere' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'On the Black Sea coast, known for its strategic port, fishing, and the distinctive Rize mandarin. The district is also notable for the stone bridges over the Taşhane Stream, reflecting its historical character.',
                        'Karadeniz kıyısında stratejik limanı, balıkçılığı ve Rize mandalinası ile tanınır. Rize mandalinası aromasıyla Türkiye\'nin en özel turunçgillerindendir. İlçenin çevresinde bulunan Taşhane Deresi üzerindeki köprüler, tarihi dokusuyla öne çıkar.',
                        'Sur la côte de la mer Noire, connue pour son port stratégique, sa pêche et la mandarine distinctive de Rize. Le district est également remarquable pour les ponts de pierre sur le ruisseau Taşhane, reflétant son caractère historique.',
                        'An der Schwarzmeerküste bekannt für seinen strategischen Hafen, Fischerei und die charakteristische Rize-Mandarine. Der Bezirk ist auch bemerkenswert für die Steinbrücken über den Taşhane-Bach, die seinen historischen Charakter widerspiegeln.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Strategic Black Sea port', 'Stratejik Karadeniz limanı', 'Port stratégique de la mer Noire', 'Strategischer Schwarzmeerhafen')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Distinctive Rize mandarin', 'Özel Rize mandalinası', 'Mandarine distinctive de Rize', 'Charakteristische Rize-Mandarine')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Fishing and seafood', 'Balıkçılık ve deniz ürünleri', 'Pêche et fruits de mer', 'Fischerei und Meeresfrüchte')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Historic stone bridges', 'Tarihi taş köprüler', 'Ponts de pierre historiques', 'Historische Steinbrücken')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kalkandere */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'kalkandere' ? null : 'kalkandere')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Kalkandere</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Authentic Rural Life', 'Otantik Kırsal Yaşam', 'Vie Rurale Authentique', 'Authentisches Landleben')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'kalkandere' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'kalkandere' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Kalkandere is known for its calm nature and small-scale tea production, offering some of the most authentic examples of rural life. Its fertile valleys contribute to Rize\'s tea cultivation, while historic mosques, village houses, and traditional farming practices reflect the preserved spirit of the Black Sea\'s past.',
                        'Sakin doğası ve küçük ölçekli çay üretimiyle bilinen Kalkandere, kırsal yaşamın en otantik örneklerini sunar. İlçe, bereketli vadilerinde yetişen çay bahçeleriyle Rize\'nin çay üretimine katkıda bulunur. Tarihî camileri, köy evleri ve geleneksel tarım yöntemleriyle Karadeniz\'in geçmişini bugüne taşıyan bir atmosfere sahiptir.',
                        'Kalkandere est connue pour sa nature calme et sa production de thé à petite échelle, offrant quelques-uns des exemples les plus authentiques de la vie rurale. Ses vallées fertiles contribuent à la culture du thé de Rize, tandis que les mosquées historiques, les maisons de village et les pratiques agricoles traditionnelles reflètent l\'esprit préservé du passé de la mer Noire.',
                        'Kalkandere ist bekannt für seine ruhige Natur und kleinskalige Teeproduktion und bietet einige der authentischsten Beispiele des ländlichen Lebens. Seine fruchtbaren Täler tragen zur Teekultivierung von Rize bei, während historische Moscheen, Dorfhäuser und traditionelle Landwirtschaftspraktiken den bewahrten Geist der Vergangenheit des Schwarzen Meeres widerspiegeln.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Small-scale tea production', 'Küçük ölçekli çay üretimi', 'Production de thé à petite échelle', 'Kleinskalige Teeproduktion')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Authentic rural life', 'Otantik kırsal yaşam', 'Vie rurale authentique', 'Authentisches Landleben')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Historic mosques and village houses', 'Tarihi camiler ve köy evleri', 'Mosquées historiques et maisons de village', 'Historische Moscheen und Dorfhäuser')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Local handicrafts and organic produce', 'Yöresel el sanatları ve organik ürünler', 'Artisanat local et produits biologiques', 'Lokales Handwerk und Bio-Produkte')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pazar */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <button 
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenDistrict(openDistrict === 'pazar' ? null : 'pazar')}
              >
                <div>
                  <h3 className="text-xl font-bold text-navy">Pazar</h3>
                  <p className="text-gray-600 text-sm">
                    {getLocalizedContent('Historic Kızkalesi and Fishing Culture', 'Tarihi Kızkalesi ve Balıkçılık Kültürü', 'Kızkalesi Historique et Culture de la Pêche', 'Historische Kızkalesi und Fischereikultur')}
                  </p>
                </div>
                <div className={`transform transition-transform ${openDistrict === 'pazar' ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openDistrict === 'pazar' && (
                <div className="px-6 pb-6 animate-fade-in-up">
                  <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                      {getLocalizedContent(
                        'Known for the historic Kızkalesi fortress and its fishing culture. Along the coast, tea cultivation and sea life go hand in hand. The Akbucak Plateau is among the most popular summer retreats for locals.',
                        'Tarihi Kızkalesi ve balıkçılığıyla tanınır. Sahil boyunca çay tarımı ve deniz kültürü iç içedir. İlçenin yaylalarından Akbucak Yaylası, yaz aylarında yöre halkının en çok tercih ettiği yaylalardan biridir.',
                        'Connu pour la forteresse historique de Kızkalesi et sa culture de la pêche. Le long de la côte, la culture du thé et la vie marine vont de pair. Le Plateau d\'Akbucak est parmi les retraites d\'été les plus populaires pour les habitants.',
                        'Bekannt für die historische Kızkalesi-Festung und ihre Fischereikultur. Entlang der Küste gehen Teeanbau und Meeresleben Hand in Hand. Das Akbucak-Plateau gehört zu den beliebtesten Sommerretreats für Einheimische.'
                      )}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-navy mb-3">
                        {getLocalizedContent('Key Attractions', 'Önemli Yerler', 'Attractions Principales', 'Hauptattraktionen')}
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Historic Kızkalesi fortress', 'Tarihi Kızkalesi', 'Forteresse historique de Kızkalesi', 'Historische Kızkalesi-Festung')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Fishing culture and seafood', 'Balıkçılık kültürü ve deniz ürünleri', 'Culture de la pêche et fruits de mer', 'Fischereikultur und Meeresfrüchte')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Akbucak Plateau', 'Akbucak Yaylası', 'Plateau d\'Akbucak', 'Akbucak-Plateau')}</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-primary mr-2 mt-1">•</span>
                          <span className="text-gray-700">{getLocalizedContent('Tea cultivation by the sea', 'Deniz kenarında çay tarımı', 'Culture du thé au bord de la mer', 'Teeanbau am Meer')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
              {content.categories_title || getTranslation('categories.title', locale)}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content.categories_description || getTranslation('categories.description', locale)}
            </p>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category.id} href={`/${params.locale}/category/${category.slug}`} className="group">
                  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                    {/* Header with category image */}
                    <div className="relative h-48 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${category.hero_image?.file_path || getImageUrl(getCategoryImage(category.slug))})`
                        }}
                      />
                    </div>
                    
                    {/* Category Title Below Image */}
                    <div className="p-6">
                      <h3 className="text-xl font-serif font-bold text-navy mb-3">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                        {getTranslation('categories.exploreButtonWithArrow', locale)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback categories if no data from Supabase
              <>
            <Link href={`/${params.locale}/category/nature`} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Leaf size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-navy mb-3 group-hover:text-primary transition-colors">
                    {isEnglish ? 'Nature' : 'Doğa'}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {isEnglish 
                      ? 'Pristine nature of Kaçkar Mountains, glacial lakes, endemic flora and breathtaking landscapes'
                      : 'Kaçkar Dağları\'nın pristine doğası, buzul gölleri, endemik bitki örtüsü ve muhteşem manzaraları'
                    }
                  </p>
                  <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {getTranslation('categories.exploreButtonWithArrow', locale)}
                  </div>
                </div>
              </div>
            </Link>

            {/* Culture Category */}
            <Link href={`/${params.locale}/category/culture`} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                <div className="h-32 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Users size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-navy mb-3 group-hover:text-primary transition-colors">
                    {isEnglish ? 'Culture' : 'Kültür'}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {isEnglish 
                      ? 'Multicultural heritage, historic villages, traditional architecture and ancient traditions'
                      : 'Çok kültürlü miras, tarihi köyler, geleneksel mimarisi ve kadim gelenekler'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Historic Villages' : 'Tarihi Köyler'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Traditional Architecture' : 'Geleneksel Mimarisi'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Cultural Festivals' : 'Kültürel Festivaller'}
                    </div>
                  </div>
                  <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {getTranslation('categories.exploreButtonWithArrow', locale)}
                  </div>
                </div>
              </div>
            </Link>

            {/* Gastronomy Category */}
            <Link href={`/${params.locale}/category/gastronomy`} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                <div className="h-32 bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <ForkKnife size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-navy mb-3 group-hover:text-primary transition-colors">
                    {isEnglish ? 'Gastronomy' : 'Gastronomi'}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {isEnglish 
                      ? 'Flavors of Black Sea cuisine, local products, traditional dishes and organic tastes'
                      : 'Karadeniz mutfağının lezzetleri, yerel ürünler, geleneksel yemekler ve organik tatlar'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Black Sea Cuisine' : 'Karadeniz Mutfağı'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Organic Products' : 'Organik Ürünler'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Traditional Flavors' : 'Geleneksel Tatlar'}
                    </div>
                  </div>
                  <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {getTranslation('categories.exploreButtonWithArrow', locale)}
                  </div>
                </div>
              </div>
            </Link>

            {/* Adventure Category */}
            <Link href={`/${params.locale}/category/adventure`} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Mountains size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-navy mb-3 group-hover:text-primary transition-colors">
                    {isEnglish ? 'Adventure' : 'Macera'}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {isEnglish 
                      ? 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities'
                      : 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin dolu aktiviteler'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Trekking Routes' : 'Trekking Rotaları'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Mountaineering' : 'Dağcılık'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Highland Tours' : 'Yayla Turları'}
                    </div>
                  </div>
                  <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {getTranslation('categories.exploreButtonWithArrow', locale)}
                  </div>
                </div>
              </div>
            </Link>

            {/* Accommodation Category */}
            <Link href={`/${params.locale}/category/accommodation`} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                <div className="h-32 bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <House size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-navy mb-3 group-hover:text-primary transition-colors">
                    {isEnglish ? 'Accommodation' : 'Konaklama'}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {isEnglish 
                      ? 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options'
                      : 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Traditional Guesthouses' : 'Geleneksel Pansiyonlar'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Highland Houses' : 'Yayla Evleri'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Camping Sites' : 'Kamp Alanları'}
                    </div>
                  </div>
                  <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {getTranslation('categories.exploreButtonWithArrow', locale)}
                  </div>
                </div>
              </div>
            </Link>

            {/* Transportation Category */}
            <Link href={`/${params.locale}/category/transportation`} className="group">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-primary/30">
                <div className="h-32 bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center">
                  <Car size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-navy mb-3 group-hover:text-primary transition-colors">
                    {isEnglish ? 'Transportation' : 'Ulaşım'}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {isEnglish 
                      ? 'How to reach Kaçkar, local transportation, transfer services and practical information'
                      : 'Kaçkar\'a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Flight Connections' : 'Havayolu Bağlantıları'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Bus Services' : 'Otobüs Seferleri'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Local Transfers' : 'Yerel Transfer'}
                    </div>
                  </div>
                  <div className="text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {getTranslation('categories.exploreButtonWithArrow', locale)}
                  </div>
                </div>
              </div>
            </Link>
              </>
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
              <div className="flex justify-center mb-6">
                <Heart size={48} className="text-primary" />
              </div>
              
              <h3 className="text-3xl font-serif text-navy mb-4">
                {ctaCard?.title || (isEnglish ? 'Plan Your Perfect Journey' : 'Mükemmel Yolculuğunuzu Planlayın')}
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {ctaCard?.description || (isEnglish 
                  ? "Combine multiple categories to create your ideal Kaçkar experience. From nature exploration to cultural immersion, every adventure awaits."
                  : "İdeal Kaçkar deneyiminizi yaratmak için birden fazla kategoriyi birleştirin. Doğa keşfinden kültürel deneyime, her macera sizi bekliyor."
                )}
              </p>
              
              <div className="flex justify-center">
                <Link
                  href={ctaCard?.buttonUrl ? `/${params.locale}${ctaCard.buttonUrl}` : `/${params.locale}/contact`}
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Envelope size={20} className="mr-2" />
                  {ctaCard?.buttonText || getTranslation('contact.contactUs', locale)}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <ImageGallery />

      {/* Professional Footer */}
      <footer className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-8 sm:py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                  {/* Main Logo */}
                  <div className="h-10 sm:h-12 w-24 sm:w-32 flex items-center justify-center">
                    <img 
                      src="/logos/logo-main.png" 
                      alt="Discover Kaçkar" 
                      className="h-8 sm:h-10 w-auto"
                      style={{ maxWidth: '120px' }}
                      onError={(e) => {
                        console.log('Main logo failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Second Logo */}
                  <div className="h-10 sm:h-12 w-16 sm:w-20 flex items-center justify-center">
                    <img 
                      src="/logos/logolar-01.png" 
                      alt="Partner Logo" 
                      className="h-6 sm:h-8 w-auto"
                      style={{ maxWidth: '80px' }}
                      onError={(e) => {
                        console.log('Second logo failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
                  {footerData?.company_description || (isEnglish 
                    ? "Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains. Your gateway to Turkey's hidden mountain paradise."
                    : "Kaçkar Dağları'nın doğal güzelliklerini, zengin kültürünü ve macera fırsatlarını keşfedin. Türkiye'nin gizli dağ cennetine açılan kapınız."
                  )}
                </p>
                <div className="flex space-x-3 sm:space-x-4">
                  {footerData?.social_links?.facebook && (
                    <a href={footerData.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Facebook">
                      <FacebookLogo size={18} className="sm:w-5 sm:h-5" />
                    </a>
                  )}
                  {footerData?.social_links?.instagram && (
                    <a href={footerData.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Instagram">
                      <InstagramLogo size={18} className="sm:w-5 sm:h-5" />
                    </a>
                  )}
                  {footerData?.social_links?.twitter && (
                    <a href={footerData.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="Twitter">
                      <TwitterLogo size={18} className="sm:w-5 sm:h-5" />
                    </a>
                  )}
                  {footerData?.social_links?.youtube && (
                    <a href={footerData.social_links.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/10" title="YouTube">
                      <TwitterLogo size={18} className="sm:w-5 sm:h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">
                  {getTranslation('categories.exploreButton', locale)}
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {footerData?.quick_links && footerData.quick_links.length > 0 ? (
                    footerData.quick_links
                      .filter((link: any) => {
                        // Filter out Blog and About links completely
                        const title = link.title?.toLowerCase() || '';
                        return !title.includes('blog') && 
                               !title.includes('blok') &&
                               !title.includes('about') && 
                               !title.includes('hakkında') &&
                               !title.includes('hakkımızda');
                      })
                      .map((link: any, index: number) => (
                        <li key={index}>
                          <Link href={`/${params.locale}${link.url}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                            {link.title}
                          </Link>
                        </li>
                      ))
                  ) : (
                    <>
                      <li>
                        <Link href={`/${params.locale}/category/nature`} className="text-gray-300 hover:text-white transition-colors text-sm">
                          {isEnglish ? 'Nature & Adventure' : 'Doğa & Macera'}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${params.locale}/category/culture`} className="text-gray-300 hover:text-white transition-colors text-sm">
                          {isEnglish ? 'Culture & Local Life' : 'Kültür & Yerel Hayat'}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${params.locale}/category/gastronomy`} className="text-gray-300 hover:text-white transition-colors text-sm">
                          {isEnglish ? 'Gastronomy & Local Flavours' : 'Gastronomi & Yerel Lezzetler'}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${params.locale}/category/music-dance`} className="text-gray-300 hover:text-white transition-colors text-sm">
                          {isEnglish ? 'Music & Dance' : 'Müzik & Dans'}
                        </Link>
                      </li>
                      <li>
                        <Link href={`/${params.locale}/category/sustainable-tourism`} className="text-gray-300 hover:text-white transition-colors text-sm">
                          {isEnglish ? 'Sustainable Tourism' : 'Sürdürülebilir Turizm'}
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-white">
                  {getTranslation('contact.contact', locale)}
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {footerData?.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin size={18} className="text-white mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          {footerData.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {footerData?.email && (
                    <div className="flex items-center space-x-3">
                      <Envelope size={18} className="text-white flex-shrink-0" />
                      <a href={`mailto:${footerData.email}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                        {footerData.email}
                      </a>
                    </div>
                  )}
                  {footerData?.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone size={18} className="text-white flex-shrink-0" />
                      <a href={`tel:${footerData.phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                        {footerData.phone}
                      </a>
                    </div>
                  )}
                  {!footerData && (
                    <>
                      <div className="flex items-start space-x-3">
                        <MapPin size={18} className="text-white mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-300 text-sm">
                            {isEnglish ? 'Kaçkar Mountains, Rize/Artvin' : 'Kaçkar Dağları, Rize/Artvin'}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 py-4 sm:py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 sm:space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-center sm:text-left">
                <p className="text-gray-300 text-xs sm:text-sm">
                  {footerData?.copyright_text || `© ${new Date().getFullYear()} Discover Kaçkar. ${isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}`}
                </p>
                <div className="flex items-center space-x-2 sm:space-x-4 text-xs text-gray-400">
                  <span>{getTranslation('footer.subtitle', locale)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button 
                  onClick={() => {
                    const element = document.getElementById('about-rize');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium px-6 py-2 rounded-lg border border-gray-600 hover:border-white"
                >
                  {isEnglish ? 'About' : 'Hakkımızda'}
                </button>
                <Link 
                  href={`/${params.locale}/contact`} 
                  className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                >
                  {getTranslation('contact.contactUs', locale)}
                </Link>
                <div className="flex flex-wrap justify-center lg:justify-end space-x-4 sm:space-x-6">
                  {footerData?.legal_links && footerData.legal_links.length > 0 ? (
                    footerData.legal_links.map((link: any, index: number) => (
                      <Link key={index} href={`/${params.locale}${link.url}`} className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                        {link.title}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                        {isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}
                      </Link>
                      <Link href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                        {isEnglish ? 'Terms of Service' : 'Kullanım Şartları'}
                      </Link>
                      <Link href="#" className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm">
                        {isEnglish ? 'Cookie Policy' : 'Çerez Politikası'}
                      </Link>
                    </>
                  )}
                </div>
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