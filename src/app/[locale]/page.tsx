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
  const locale = params.locale as Locale;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [footerData, setFooterData] = useState<any>(null);
  const [ctaCard, setCtaCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [openDistrict, setOpenDistrict] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const imageSize = useImageSize();

  // Fetch page data and categories from API routes
  useEffect(() => {
    const fetchData = async () => {
      // Removed minimum loading time for fastest possible loading
      
      try {
        // OPTIMIZED: Fetch all data in parallel for much faster loading
        const [pageResponse, categoriesResponse, footerResponse, ctaResponse] = await Promise.all([
          fetch(`/api/admin/pages`), // Use admin API since public API is not working
          fetch(`/api/public/categories?locale=${params.locale}`), // Use correct locale
          fetch(`/api/public/footer?locale=${params.locale}`), // Use correct locale
          fetch(`/api/admin/cta-cards`) // Fetch CTA card data from admin API
        ]);

        // Process page data
        if (pageResponse.ok) {
          const pageResult = await pageResponse.json();
          if (pageResult.data) {
            // Admin API returns array, find the home page for current locale
            const homePage = pageResult.data.find((page: any) => 
              page.slug === 'home' && page.locale === params.locale
            );
            if (homePage) {
              setPageData(homePage);
            }
          }
        }

        // Process categories data
        if (categoriesResponse.ok) {
          const categoriesResult = await categoriesResponse.json();
          let categoriesData = categoriesResult.data || [];
          
          // Apply Turkish translations if needed
          if (params.locale === 'tr') {
            const turkishTranslations: Record<string, { name: string; description: string }> = {
              'nature': { name: 'Doğa & Macera', description: 'Kaçkar\'ın vadilerinden zirvelerine uzanan patikalarda doğanın saf gücünü keşfedin.' },
              'culture': { name: 'Kültür & Yerel Hayat', description: 'Yaylaların, konakların ve köklü geleneklerin içten hikâyesine tanık olun.' },
              'gastronomy': { name: 'Gastronomi & Yerel Lezzetler', description: 'Coğrafi işaretli ürünler ve unutulmaz lezzetlerle Kaçkar\'ın tadına varın.' },
              'adventure': { name: 'Macera', description: 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin dolu aktiviteler' },
              'accommodation': { name: 'Konaklama', description: 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri' },
              'transportation': { name: 'Ulaşım', description: 'Kaçkar\'a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler' },
              'music-dance': { name: 'Müzik & Dans', description: 'Tulumun sesi ve horonun ritmiyle Karadeniz\'in ruhunu hissedin.' },
              'sustainable-tourism': { name: 'Sürdürülebilir Turizm', description: 'Doğaya saygılı, yerel halka faydalı bir keşif yolculuğu.' },
              'health-wellness': { name: 'Sağlık & Wellness', description: 'Yaylaların temiz havasında ruhunuzu ve bedeninizi yenileyin.' },
              'photography-art': { name: 'Fotoğraf & Sanat', description: 'Mevsimlerin ışığıyla şekillenen eşsiz manzaraları yakalayın.' },
              'educational-research': { name: 'Eğitim & Araştırma Turizmi', description: 'Endemik bitkilerden buzul göllerine uzanan canlı bir laboratuvar.' },
              'events-festivals': { name: 'Etkinlik & Festivaller', description: 'Yayla şenliklerinden çay hasadına, coşkulu kutlamalara katılın.' }
            };
            
            categoriesData = categoriesData.map((cat: Category) => {
              if (turkishTranslations[cat.slug]) {
                const translation = turkishTranslations[cat.slug];
                return {
                  ...cat,
                  name: translation.name,
                  description: translation.description,
                  locale: 'tr'
                };
              }
              return cat;
            });
          }
          
          setCategories(categoriesData);
        }

        // Process footer data
        if (footerResponse.ok) {
          const footerResult = await footerResponse.json();
          if (footerResult.data) {
            setFooterData(footerResult.data);
          }
        }

        // Process CTA card data
        if (ctaResponse.ok) {
          const ctaResult = await ctaResponse.json();
          if (ctaResult.data && ctaResult.data.length > 0) {
            // Find the plan-your-trip card from the admin API response
            const planYourTripCard = ctaResult.data.find((card: any) => card.slug === 'plan-your-trip');
            if (planYourTripCard) {
              // Transform admin API format to frontend format
              const transformedCard = {
                id: planYourTripCard.id,
                slug: planYourTripCard.slug,
                title: planYourTripCard.title[params.locale] || planYourTripCard.title.en,
                description: planYourTripCard.description?.[params.locale] || planYourTripCard.description?.en,
                buttonText: planYourTripCard.button_text[params.locale] || planYourTripCard.button_text.en,
                buttonUrl: planYourTripCard.button_url,
                isActive: planYourTripCard.is_active,
              };
              setCtaCard(transformedCard);
            }
          }
        } else {
          console.error('CTA API Error:', ctaResponse.status, await ctaResponse.text());
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.locale]);
  
  // OPTIMIZED: Get hero images with lazy loading
  const heroImages = [
    getImageFromCategory('hero', 0),
    getImageFromCategory('hero', 1),
    getImageFromCategory('hero', 2),
    getImageFromCategory('hero', 3),
    getImageFromCategory('hero', 4)
  ];

  // Preload the first hero image for faster initial load
  useEffect(() => {
    if (heroImages[0]) {
      const img = new window.Image();
      img.src = getImageUrl(heroImages[0], imageSize);
    }
  }, [heroImages, imageSize]);

  // Rotate background images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % heroImages.length;
        // Preload next image
        if (heroImages[nextIndex]) {
          const img = new window.Image();
          img.src = getImageUrl(heroImages[nextIndex], imageSize);
        }
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
              {isEnglish ? 'Discover Rize' : 'Rize\'yi Keşfedin'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isEnglish 
                ? 'Located on Türkiye\'s northeastern Black Sea coast, Rize is where steep mountains meet the sea. The province borders Artvin, Trabzon and Erzurum, shaped by deep valleys, rushing rivers and dramatic slopes.'
                : 'Türkiye\'nin kuzeydoğusunda, Karadeniz\'in kıyısında yer alan Rize; sarp dağların denizle buluştuğu benzersiz bir coğrafyadır. İl, doğudan Artvin, batıdan Trabzon, güneyden Erzurum ile çevrilidir.'
              }
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
                            {isEnglish ? 'Gate of Blacksea' : 'Karadeniz\'in Kapısı'}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {isEnglish 
                            ? 'Located on Türkiye\'s northeastern Black Sea coast, Rize is where steep mountains meet the sea. The province borders Artvin, Trabzon and Erzurum, shaped by deep valleys, rushing rivers and dramatic slopes.'
                            : 'Türkiye\'nin kuzeydoğusunda, Karadeniz\'in kıyısında yer alan Rize; sarp dağların denizle buluştuğu benzersiz bir coğrafyadır. İl, doğudan Artvin, batıdan Trabzon, güneyden Erzurum ile çevrilidir. Coğrafi yapısı dik yamaçlar, derin vadiler ve coşkulu derelerden oluşur.'
                          }
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Northeastern Black Sea coast' : 'Kuzeydoğu Karadeniz kıyısı'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Steep mountains meet the sea' : 'Sarp dağlar denizle buluşur'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Deep valleys and rushing rivers' : 'Derin vadiler ve coşkulu dereler'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg" 
                          alt={isEnglish ? 'Rize Gate of Blacksea' : 'Rize Karadeniz Kapısı'}
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
                            {isEnglish ? 'Mosaic of History and Culture' : 'Tarih ve Kültür Mozaiği'}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {isEnglish 
                            ? 'Settled since antiquity, Rize was a coastal stronghold in Roman and Byzantine times. In the Ottoman era, tea cultivation transformed the region. Today, Rize is a cultural mosaic shaped by Hemşin and Laz traditions.'
                            : 'Antik çağlardan beri yerleşim yeri olan Rize, Roma ve Bizans döneminde önemli bir kıyı kalesiydi. Osmanlı döneminde çay tarımıyla büyük bir dönüşüm yaşandı. Bugün Rize, Hemşin ve Laz topluluklarının kültürel izlerini taşıyan bir mozaiktir.'
                          }
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Roman and Byzantine heritage' : 'Roma ve Bizans mirası'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Ottoman tea transformation' : 'Osmanlı çay dönüşümü'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Hemşin and Laz traditions' : 'Hemşin ve Laz gelenekleri'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg" 
                          alt={isEnglish ? 'Rize History and Culture' : 'Rize Tarih ve Kültür'}
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
                            {isEnglish ? 'Plateau Wonderland' : 'Yaylaların Diyarı'}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {isEnglish 
                            ? 'At the foot of the Kaçkar Mountains lie hundreds of highland plateaus. Pokut, Ayder, Anzer, Ovit and Elevit are famous for their wooden houses, cloud seas and flower meadows. The tradition of transhumance is still alive today.'
                            : 'Kaçkar Dağları\'nın eteklerinde yüzlerce yayla bulunur. Pokut, Ayder, Anzer, Ovit ve Elevit yaylaları; ahşap evleri, sis denizleri ve çiçekli çayırlarıyla tanınır. Yaylacılık geleneği bugün hâlâ yaşamaktadır.'
                          }
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Hundreds of highland plateaus' : 'Yüzlerce yayla'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Pokut, Ayder, Anzer, Ovit, Elevit' : 'Pokut, Ayder, Anzer, Ovit, Elevit'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Living transhumance tradition' : 'Yaşayan yaylacılık geleneği'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg" 
                          alt={isEnglish ? 'Rize Plateaus' : 'Rize Yaylaları'}
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
                            {isEnglish ? 'Center of Nature and Adventure' : 'Doğa ve Macera Merkezi'}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {isEnglish 
                            ? 'Rize is a year-round destination for outdoor sports: trekking, cycling, rafting in summer, snow trekking and skiing in winter. Glacial lakes, waterfalls and endemic plants make the region unique for nature lovers.'
                            : 'Rize, yıl boyunca doğa sporları için eşsiz bir merkezdir. Yazın trekking, bisiklet, rafting; kışın kar yürüyüşü ve kayak yapılır. Buzul gölleri, şelaleler ve endemik bitki türleri bölgeyi doğaseverler için benzersiz kılar.'
                          }
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Year-round outdoor sports' : 'Yıl boyunca doğa sporları'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Glacial lakes and waterfalls' : 'Buzul gölleri ve şelaleler'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Endemic plant species' : 'Endemik bitki türleri'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg" 
                          alt={isEnglish ? 'Rize Nature and Adventure' : 'Rize Doğa ve Macera'}
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
                            {isEnglish ? 'Capital of Tea' : 'Çayın Başkenti'}
                          </h3>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-6">
                          {isEnglish 
                            ? 'Tea cultivation, begun in the early 20th century, has become Rize\'s symbol. Today most of Türkiye\'s tea is produced here. Tea gardens stretch from the coast to the mountain slopes, shaping the landscape.'
                            : '20. yüzyılın başında başlayan çay tarımı, Rize\'nin simgesi oldu. Bugün Türkiye\'nin çay ihtiyacının büyük kısmı buradan karşılanır. Çay bahçeleri kıyıdan dağların zirvelerine kadar uzanır ve manzarayı şekillendirir.'
                          }
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Early 20th century tea cultivation' : '20. yüzyıl başı çay tarımı'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Most of Türkiye\'s tea production' : 'Türkiye\'nin çay üretiminin çoğu'}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-600">{isEnglish ? 'Coast to mountain tea gardens' : 'Kıyıdan dağlara çay bahçeleri'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <img 
                          src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg" 
                          alt={isEnglish ? 'Rize Tea Capital' : 'Rize Çay Başkenti'}
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
              {isEnglish ? 'Rize Districts' : 'Rize İlçeleri'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isEnglish 
                ? 'Explore the diverse districts of Rize, each offering unique experiences from coastal towns to mountain retreats.'
                : 'Rize\'nin çeşitli ilçelerini keşfedin, her biri kıyı kasabalarından dağ inzivalarına kadar benzersiz deneyimler sunar.'
              }
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
                    {isEnglish ? 'Administrative and Cultural Hub' : 'İdari ve Kültürel Merkez'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0028-2.jpg" 
                        alt="Rize Merkez"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'As the administrative and cultural hub of the region, Rize offers a lifestyle infused with the aroma of tea along the Black Sea coast. The city\'s symbol, Kale-i Bala (Rize Castle), welcomes visitors with a history dating back to the Byzantine era. The Rize Museum and Çaykur Tea Museum showcase the region\'s cultural heritage and the journey of tea.'
                          : 'Rize\'nin idari ve kültürel merkezi olan şehir, Karadeniz\'in kıyısında çay kokusuyla harmanlanmış bir yaşam sunar. Şehrin simgesi haline gelen Kale-i Bala (Rize Kalesi), Bizans döneminden günümüze uzanan tarihî geçmişiyle ziyaretçilerini karşılar.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Kale-i Bala (Rize Castle)' : 'Kale-i Bala (Rize Kalesi)'}</li>
                        <li>• {isEnglish ? 'Rize Museum and Tea Museum' : 'Rize Müzesi ve Çay Müzesi'}</li>
                        <li>• {isEnglish ? 'Coastal promenades and cafés' : 'Sahil yürüyüş yolları ve kafeler'}</li>
                        <li>• {isEnglish ? 'Tea factory tours' : 'Çay fabrikası turları'}</li>
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
                    {isEnglish ? 'Gateway to Kaçkar Mountains' : 'Kaçkar Dağları\'na Açılan Kapı'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0069-Pano-2.jpg" 
                        alt="Çamlıhemşin"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'The tourism heart of Rize. Ayder Plateau, with its hot springs, festivals and wooden chalets, is the most iconic destination. Çamlıhemşin also offers the Fırtına Valley, historic stone bridges, and access to the Kaçkar Mountains—a hub where nature and culture meet.'
                          : 'Rize\'nin turizm kalbi. Ayder Yaylası, sıcak kaplıcaları, şenlikleri ve ahşap yayla evleriyle bölgenin en bilinen destinasyonu. Çamlıhemşin aynı zamanda Fırtına Vadisi, tarihi taş kemer köprüleri ve Kaçkar Dağları\'na açılan kapısıyla doğa ve kültürün birleştiği bir merkezdir.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Ayder Plateau with hot springs' : 'Sıcak kaplıcalı Ayder Yaylası'}</li>
                        <li>• {isEnglish ? 'Fırtına Valley and historic bridges' : 'Fırtına Vadisi ve tarihi köprüler'}</li>
                        <li>• {isEnglish ? 'Gateway to Kaçkar Mountains' : 'Kaçkar Dağları\'na açılan kapı'}</li>
                        <li>• {isEnglish ? 'Traditional festivals and culture' : 'Geleneksel şenlikler ve kültür'}</li>
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
                    {isEnglish ? 'Tea Capital of Turkey' : 'Türkiye\'nin Çay Başkenti'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0098-2.jpg" 
                        alt="Ardeşen"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'One of the most vibrant coastal towns. Known as a rafting hub and for its handmade pita bread. The Tunca Valley with its historic bridges and plateaus adds both cultural and natural richness to the district.'
                          : 'Karadeniz\'in en hareketli sahil ilçelerinden biridir. Rafting merkezi olarak bilinir ve el yapımı Ardeşen pidesi ile sofralarda yerini alır. Ayrıca Tunca Vadisi üzerindeki tarihi köprüler ve yaylalar, ilçeye kültürel ve doğal bir zenginlik katar.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Rafting center and water sports' : 'Rafting merkezi ve su sporları'}</li>
                        <li>• {isEnglish ? 'Handmade Ardeşen pita bread' : 'El yapımı Ardeşen pidesi'}</li>
                        <li>• {isEnglish ? 'Tunca Valley with historic bridges' : 'Tarihi köprülü Tunca Vadisi'}</li>
                        <li>• {isEnglish ? 'Vibrant coastal atmosphere' : 'Canlı kıyı atmosferi'}</li>
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
                    {isEnglish ? 'Historic Trading Center' : 'Tarihi Ticaret Merkezi'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg" 
                        alt="Pazar"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Pazar has a rich history as a trading center and offers a mix of coastal beauty and cultural heritage. The district is known for its vibrant local markets.'
                          : 'Pazar, ticaret merkezi olarak zengin bir geçmişe sahiptir ve kıyı güzelliği ile kültürel mirasın karışımını sunar. İlçe canlı yerel pazarları ile tanınır.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Historic local markets' : 'Tarihi yerel pazarlar'}</li>
                        <li>• {isEnglish ? 'Cultural heritage sites' : 'Kültürel miras alanları'}</li>
                        <li>• {isEnglish ? 'Coastal walking paths' : 'Kıyı yürüyüş yolları'}</li>
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
                    {isEnglish ? 'Hazelnut Paradise' : 'Fındık Cenneti'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00174-2.jpg" 
                        alt="Fındıklı"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'As the eastern gateway of Rize, Fındıklı stands out with its varied geography stretching from the Black Sea coast to high plateaus. The Çağlayan River and its historic stone arch bridges reflect the region\'s past. Traditional stone mansions showcase Laz culture in architecture. Fındıklı is also known for kiwi cultivation, offering unique agricultural diversity within the Black Sea region.'
                          : 'Rize\'nin doğu kapısı olan Fındıklı, deniz kıyısından yüksek yaylalara uzanan farklı coğrafi yapısıyla dikkat çeker. Çağlayan Deresi ve üzerindeki tarihi taş kemer köprüler, bölgenin geçmişini yansıtır. İlçedeki geleneksel taş konaklar, Laz kültürünün mimariye yansımış özgün örnekleridir. Ayrıca Fındıklı, kivi üretimiyle de tanınır ve bu yönüyle Karadeniz\'de farklı bir tarımsal çeşitlilik sunar.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Historic stone arch bridges' : 'Tarihi taş kemer köprüler'}</li>
                        <li>• {isEnglish ? 'Traditional Laz stone mansions' : 'Geleneksel Laz taş konakları'}</li>
                        <li>• {isEnglish ? 'Kiwi cultivation and agriculture' : 'Kivi yetiştiriciliği ve tarım'}</li>
                        <li>• {isEnglish ? 'Eastern gateway to Rize' : 'Rize\'nin doğu kapısı'}</li>
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
                    {isEnglish ? 'Tea Gardens and Beautiful Beaches' : 'Çay Bahçeleri ve Güzel Sahiller'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0043-2.jpg" 
                        alt="Çayeli"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Known for tea-covered slopes and some of the Black Sea\'s most beautiful beaches. Its cuisine is highlighted by Çayeli-style beans and seafood. Aşıklar and Başköy Plateaus also attract nature lovers with their hiking opportunities.'
                          : 'Çay tarlalarıyla kaplı yamaçların yanı sıra Karadeniz\'in en güzel sahillerine sahiptir. Çayeli kuru fasulyesi ve deniz ürünleriyle mutfağı öne çıkar. Ayrıca Aşıklar ve Başköy yaylaları, doğa yürüyüşçüleri için keşfedilmeyi bekleyen güzelliklerdir.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Tea-covered slopes' : 'Çay tarlalarıyla kaplı yamaçlar'}</li>
                        <li>• {isEnglish ? 'Beautiful Black Sea beaches' : 'Güzel Karadeniz sahilleri'}</li>
                        <li>• {isEnglish ? 'Çayeli-style beans and seafood' : 'Çayeli kuru fasulyesi ve deniz ürünleri'}</li>
                        <li>• {isEnglish ? 'Aşıklar and Başköy Plateaus' : 'Aşıklar ve Başköy yaylaları'}</li>
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
                    {isEnglish ? 'Tea Processing and Coastal Atmosphere' : 'Çay İşleme ve Sahil Atmosferi'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-DJI_0050-2.jpg" 
                        alt="Derepazarı"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Known for tea processing facilities and its coastal atmosphere with seafood restaurants. Sivrikaya Plateau in the highlands offers a cool climate and natural beauty, popular among locals in summer.'
                          : 'Çay işleme tesisleriyle bilinir. Ayrıca sahil kasabası atmosferi ve balık lokantalarıyla öne çıkar. İlçenin yükseklerinde yer alan Sivrikaya Yaylası, serin havası ve doğal güzellikleriyle bölge halkının yaz aylarında tercih ettiği bir mekândır.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Tea processing facilities' : 'Çay işleme tesisleri'}</li>
                        <li>• {isEnglish ? 'Coastal atmosphere and seafood' : 'Sahil atmosferi ve deniz ürünleri'}</li>
                        <li>• {isEnglish ? 'Sivrikaya Plateau' : 'Sivrikaya Yaylası'}</li>
                        <li>• {isEnglish ? 'Cool summer climate' : 'Serin yaz iklimi'}</li>
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
                    {isEnglish ? 'Cultural Heritage Center' : 'Kültürel Miras Merkezi'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00159-2.jpg" 
                        alt="Hemşin"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'A cultural hub with tulum music, horon dances, transhumance, and weaving traditions. Hemşin wool socks are a geographically protected product. The Balcıdere Plateau and surrounding stone bridges combine cultural heritage with nature.'
                          : 'Tulum ezgileri, horonlar, yaylacılık ve dokuma gelenekleriyle kültürel zenginliğin merkezi. Hemşin çorabı coğrafi işaretli ürünlerindendir. İlçede ayrıca Balcıdere Yaylası ve çevresindeki taş köprüler, kültürel dokuyu ve doğayı bir arada sunar.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Tulum music and horon dances' : 'Tulum ezgileri ve horonlar'}</li>
                        <li>• {isEnglish ? 'Hemşin wool socks (protected product)' : 'Hemşin çorabı (coğrafi işaretli)'}</li>
                        <li>• {isEnglish ? 'Balcıdere Plateau' : 'Balcıdere Yaylası'}</li>
                        <li>• {isEnglish ? 'Traditional weaving and transhumance' : 'Geleneksel dokuma ve yaylacılık'}</li>
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
                    {isEnglish ? 'Tea Valleys and Historic Mosques' : 'Çay Vadileri ve Tarihi Camiler'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00219-2.jpg" 
                        alt="Güneysu"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Recognized for valleys covered in tea gardens and historic mosques. A balanced reflection of Rize\'s cultural and natural identity. The district is especially famous for Handüzü Plateau, which comes alive in summer with nature hikes and festivals.'
                          : 'Çay bahçeleriyle çevrili vadileri ve tarihi camileriyle bilinir. Rize\'nin kültürel ve doğal kimliğinin dengeli bir yansımasıdır. İlçe, özellikle Handüzü Yaylası ile ünlüdür; yaz aylarında doğa yürüyüşleri ve yayla şenlikleriyle canlanır.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Tea garden valleys' : 'Çay bahçeli vadiler'}</li>
                        <li>• {isEnglish ? 'Historic mosques' : 'Tarihi camiler'}</li>
                        <li>• {isEnglish ? 'Handüzü Plateau' : 'Handüzü Yaylası'}</li>
                        <li>• {isEnglish ? 'Nature hikes and festivals' : 'Doğa yürüyüşleri ve şenlikler'}</li>
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
                    {isEnglish ? 'Thermal Waters and Anzer Honey' : 'Termal Sular ve Anzer Balı'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00230-2.jpg" 
                        alt="İkizdere"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Famous for its thermal waters and mountain villages. Anzer Plateau is the homeland of world-famous Anzer Honey, produced thanks to its endemic flora. The Ovit Plateau and tunnel also serve as a strategic gateway connecting the region to Eastern Anatolia.'
                          : 'Termal suları ve dağ köyleriyle ünlüdür. Özellikle Anzer Yaylası, dünyaca tanınan Anzer Balı\'nın üretildiği yerdir. Endemik bitki çeşitliliği sayesinde bu bal yalnızca burada elde edilir. Ayrıca Ovit Yaylası ve tüneli, bölgeyi Doğu Anadolu\'ya bağlayan stratejik bir geçittir.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'World-famous Anzer Honey' : 'Dünyaca ünlü Anzer Balı'}</li>
                        <li>• {isEnglish ? 'Thermal waters and spas' : 'Termal sular ve kaplıcalar'}</li>
                        <li>• {isEnglish ? 'Ovit Plateau and tunnel' : 'Ovit Yaylası ve tüneli'}</li>
                        <li>• {isEnglish ? 'Endemic flora diversity' : 'Endemik bitki çeşitliliği'}</li>
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
                    {isEnglish ? 'Strategic Port and Rize Mandarin' : 'Stratejik Liman ve Rize Mandalinası'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00439-2.jpg" 
                        alt="İyidere"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'On the Black Sea coast, known for its strategic port, fishing, and the distinctive Rize mandarin. The district is also notable for the stone bridges over the Taşhane Stream, reflecting its historical character.'
                          : 'Karadeniz kıyısında stratejik limanı, balıkçılığı ve Rize mandalinası ile tanınır. Rize mandalinası aromasıyla Türkiye\'nin en özel turunçgillerindendir. İlçenin çevresinde bulunan Taşhane Deresi üzerindeki köprüler, tarihi dokusuyla öne çıkar.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Strategic Black Sea port' : 'Stratejik Karadeniz limanı'}</li>
                        <li>• {isEnglish ? 'Distinctive Rize mandarin' : 'Özel Rize mandalinası'}</li>
                        <li>• {isEnglish ? 'Fishing and seafood' : 'Balıkçılık ve deniz ürünleri'}</li>
                        <li>• {isEnglish ? 'Historic stone bridges' : 'Tarihi taş köprüler'}</li>
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
                    {isEnglish ? 'Authentic Rural Life' : 'Otantik Kırsal Yaşam'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_00781-2.jpg" 
                        alt="Kalkandere"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Kalkandere is known for its calm nature and small-scale tea production, offering some of the most authentic examples of rural life. Its fertile valleys contribute to Rize\'s tea cultivation, while historic mosques, village houses, and traditional farming practices reflect the preserved spirit of the Black Sea\'s past.'
                          : 'Sakin doğası ve küçük ölçekli çay üretimiyle bilinen Kalkandere, kırsal yaşamın en otantik örneklerini sunar. İlçe, bereketli vadilerinde yetişen çay bahçeleriyle Rize\'nin çay üretimine katkıda bulunur. Tarihî camileri, köy evleri ve geleneksel tarım yöntemleriyle Karadeniz\'in geçmişini bugüne taşıyan bir atmosfere sahiptir.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Small-scale tea production' : 'Küçük ölçekli çay üretimi'}</li>
                        <li>• {isEnglish ? 'Authentic rural life' : 'Otantik kırsal yaşam'}</li>
                        <li>• {isEnglish ? 'Historic mosques and village houses' : 'Tarihi camiler ve köy evleri'}</li>
                        <li>• {isEnglish ? 'Local handicrafts and organic produce' : 'Yöresel el sanatları ve organik ürünler'}</li>
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
                    {isEnglish ? 'Historic Kızkalesi and Fishing Culture' : 'Tarihi Kızkalesi ve Balıkçılık Kültürü'}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="/images/Kackar_HiRes-nodumsports_moritzklee-MK_01854-2.jpg" 
                        alt="Pazar"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 mb-4">
                        {isEnglish 
                          ? 'Known for the historic Kızkalesi fortress and its fishing culture. Along the coast, tea cultivation and sea life go hand in hand. The Akbucak Plateau is among the most popular summer retreats for locals.'
                          : 'Tarihi Kızkalesi ve balıkçılığıyla tanınır. Sahil boyunca çay tarımı ve deniz kültürü iç içedir. İlçenin yaylalarından Akbucak Yaylası, yaz aylarında yöre halkının en çok tercih ettiği yaylalardan biridir.'
                        }
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• {isEnglish ? 'Historic Kızkalesi fortress' : 'Tarihi Kızkalesi'}</li>
                        <li>• {isEnglish ? 'Fishing culture and seafood' : 'Balıkçılık kültürü ve deniz ürünleri'}</li>
                        <li>• {isEnglish ? 'Akbucak Plateau' : 'Akbucak Yaylası'}</li>
                        <li>• {isEnglish ? 'Tea cultivation by the sea' : 'Deniz kenarında çay tarımı'}</li>
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
                    footerData.quick_links.map((link: any, index: number) => {
                      // Disable About and Blog links but keep them visible
                      const isDisabled = link.title?.toLowerCase().includes('about') || 
                                       link.title?.toLowerCase().includes('blog') ||
                                       link.title?.toLowerCase().includes('hakkında') ||
                                       link.title?.toLowerCase().includes('hakkımızda') ||
                                       link.title?.toLowerCase().includes('blok');
                      
                      return (
                        <li key={index}>
                          {isDisabled ? (
                            <span className="text-gray-300 text-sm cursor-not-allowed opacity-60">
                              {link.title}
                            </span>
                          ) : (
                            <Link href={`/${params.locale}${link.url}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                              {link.title}
                            </Link>
                          )}
                        </li>
                      );
                    })
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