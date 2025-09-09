'use client';

import Link from 'next/link';
import Image from 'next/image';
import ImageGallery from '@/components/sections/ImageGallery';
import { getImageFromCategory, getImageUrl, getCategoryImage } from '@/lib/utils/imageUtils';
import { useResponsiveImage, useImageSize } from '@/hooks/useResponsiveImage';
import { useState, useEffect } from 'react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const imageSize = useImageSize();

  // Fetch page data and categories from API routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch home page data with cache-busting
        const pageResponse = await fetch(`/api/public/pages?slug=home&locale=${params.locale}&t=${Date.now()}`);
        const pageResult = await pageResponse.json();

        if (pageResponse.ok && pageResult.data) {
          console.log('Page data loaded:', pageResult.data);
          setPageData(pageResult.data);
        } else {
          console.log('No page data found, using fallback');
        }

        // Fetch categories (always fetch English, then translate if needed)
        const categoriesResponse = await fetch(`/api/public/categories?locale=en`);
        const categoriesResult = await categoriesResponse.json();

        if (categoriesResponse.ok) {
          console.log('Categories loaded:', categoriesResult.data);
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
        } else {
          console.error('Error fetching categories:', categoriesResult.error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.locale]);
  
  // Get hero images
  const heroImages = [
    getImageFromCategory('hero', 0),
    getImageFromCategory('hero', 1),
    getImageFromCategory('hero', 2),
    getImageFromCategory('hero', 3),
    getImageFromCategory('hero', 4)
  ];

  // Rotate background images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Fallback content if no data from Supabase
  const fallbackContent = {
    title: isEnglish ? 'Discover Kaçkar' : 'Kaçkar\'ı Keşfedin',
    subtitle: isEnglish ? 'Turkey\'s Hidden Mountain Paradise' : 'Türkiye\'nin Gizli Dağ Cenneti',
    description: isEnglish 
      ? 'Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey\'s hidden gem in the Black Sea region.'
      : 'Karadeniz bölgesinin gizli hazinesi olan Kaçkar Dağları\'nın el değmemiş doğasını, kadim kültürlerini ve nefes kesen manzaralarını keşfedin.',
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${params.locale}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="h-10 w-24 flex items-center justify-center">
                <img 
                  src="/logos/logo-main.png" 
                  alt="Discover Kaçkar" 
                  className="h-8 w-auto"
                  style={{ maxWidth: '100px' }}
                  onLoad={() => console.log('Page navbar logo loaded successfully!')}
                  onError={(e) => {
                    console.log('Page navbar logo failed to load, trying UTMB logo');
                    e.currentTarget.src = '/logos/logo-UTMB.png';
                    e.currentTarget.onerror = () => {
                      console.log('All logos failed, showing fallback text');
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-gray-600 font-bold">LOGO</span>';
                    };
                  }}
                />
              </div>
              <span className="text-xl font-serif font-bold text-primary">
              Discover Kaçkar
              </span>
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/tr"
                className={`px-3 py-1 text-sm rounded ${params.locale === 'tr' ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary'}`}
              >
                TR
              </Link>
              <Link
                href="/en"
                className={`px-3 py-1 text-sm rounded ${params.locale === 'en' ? 'bg-primary text-white' : 'text-gray-700 hover:text-primary'}`}
              >
                EN
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
          
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <Mountains size={32} className="text-white sm:w-12 sm:h-12" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent drop-shadow-2xl px-2">
            {pageTitle}
          </h1>
          
          {/* Glass Panel for Text Content */}
          <div className="relative z-20 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-primary font-medium drop-shadow-lg">
              {content.subtitle}
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed drop-shadow-md">
              {content.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link
              href={`/${params.locale}/category/nature`}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
            >
              {content.cta_primary}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href={`/${params.locale}/category/culture`}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/80 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              {content.cta_secondary}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
            {content.stats.map((stat: { value: string; label: string }, index: number) => (
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

      {/* Categories Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-navy mb-6">
              {isEnglish ? 'Explore Categories' : 'Kategorileri Keşfet'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {isEnglish 
                ? "Discover every aspect of Kaçkar Mountains through our carefully curated categories, each offering unique experiences and adventures."
                : "Özenle hazırlanmış kategorilerimiz aracılığıyla Kaçkar Dağları'nın her yönünü keşfedin, her biri benzersiz deneyimler ve maceralar sunuyor."
              }
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
                        {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                    {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                    {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                    {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                    {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                    {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                    {isEnglish ? 'Explore →' : 'Keşfet →'}
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
                {isEnglish ? 'Plan Your Perfect Journey' : 'Mükemmel Yolculuğunuzu Planlayın'}
              </h3>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {isEnglish 
                  ? "Combine multiple categories to create your ideal Kaçkar experience. From nature exploration to cultural immersion, every adventure awaits."
                  : "İdeal Kaçkar deneyiminizi yaratmak için birden fazla kategoriyi birleştirin. Doğa keşfinden kültürel deneyime, her macera sizi bekliyor."
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`/${params.locale}/plan-your-trip`}
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Camera size={20} className="mr-2" />
                  {isEnglish ? 'Plan Your Trip' : 'Seyahatini Planla'}
                </Link>
                
                <Link
                  href={`/${params.locale}/contact`}
                  className="bg-transparent border-2 border-navy text-navy px-8 py-3 rounded-lg font-medium hover:bg-navy hover:text-white transition-colors"
                >
                  {isEnglish ? 'Get Expert Help' : 'Uzman Yardımı Al'}
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
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-12 w-32 flex items-center justify-center">
                    <img 
                      src="/logos/logo-main.png" 
                      alt="Discover Kaçkar" 
                      className="h-10 w-auto"
                      style={{ maxWidth: '120px' }}
                      onError={(e) => {
                        console.log('Footer logo failed to load, trying UTMB logo');
                        e.currentTarget.src = '/logos/logo-UTMB.png';
                        e.currentTarget.onerror = () => {
                          console.log('All logos failed, showing fallback text');
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-sm text-gray-600 font-bold">LOGO</span>';
                        };
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">
            Discover Kaçkar
          </h3>
                </div>
                <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
            {isEnglish 
                    ? "Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains. Your gateway to Turkey's hidden mountain paradise."
                    : "Kaçkar Dağları'nın doğal güzelliklerini, zengin kültürünü ve macera fırsatlarını keşfedin. Türkiye'nin gizli dağ cennetine açılan kapınız."
            }
          </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10" title="Facebook">
                    <FacebookLogo size={20} />
                  </a>
                  <a href="https://www.instagram.com/discoverkackar" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10" title="Instagram">
                    <InstagramLogo size={20} />
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10" title="Twitter">
                    <TwitterLogo size={20} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {isEnglish ? 'Explore' : 'Keşfet'}
                </h4>
                <ul className="space-y-3">
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
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-white">
                  {isEnglish ? 'Contact' : 'İletişim'}
                </h4>
                <div className="space-y-4">
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
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
                <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Discover Kaçkar. {isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{isEnglish ? 'Turkey\'s Hidden Mountain Paradise' : 'Türkiye\'nin Gizli Dağ Cenneti'}</span>
                </div>
              </div>
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {isEnglish ? 'Privacy Policy' : 'Gizlilik Politikası'}
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {isEnglish ? 'Terms of Service' : 'Kullanım Şartları'}
                </Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  {isEnglish ? 'Cookie Policy' : 'Çerez Politikası'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}