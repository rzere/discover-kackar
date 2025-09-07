'use client';

import Link from 'next/link';
import ImageGallery from '@/components/sections/ImageGallery';
import { getImageFromCategory, getImageUrl } from '@/lib/utils/imageUtils';
import { useResponsiveImage, useImageSize } from '@/hooks/useResponsiveImage';
import { useState, useEffect } from 'react';
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
  Car
} from '@phosphor-icons/react';

export default function Home({
  params
}: {
  params: {locale: string};
}) {
  const isEnglish = params.locale === 'en';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSize = useImageSize();
  
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

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={`/${params.locale}`} className="text-2xl font-serif font-bold text-navy hover:text-primary transition-colors">
              Discover Kaçkar
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
            Discover Kaçkar
          </h1>
          
          {/* Glass Panel for Text Content */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 border border-white/20 shadow-2xl max-w-4xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-primary font-medium drop-shadow-lg">
              {isEnglish ? 'Turkey\'s Hidden Mountain Paradise' : 'Türkiye\'nin Gizli Dağ Cenneti'}
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed drop-shadow-md">
              {isEnglish 
                ? "Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey's hidden gem in the Black Sea region."
                : "Karadeniz bölgesinin gizli hazinesi olan Kaçkar Dağları'nın el değmemiş doğasını, kadim kültürlerini ve nefes kesen manzaralarını keşfedin."
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link
              href={`/${params.locale}/category/nature`}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-navy font-semibold rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm text-sm sm:text-base"
            >
              {isEnglish ? 'Explore Nature' : 'Doğayı Keşfet'}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href={`/${params.locale}/category/culture`}
              className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/80 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              {isEnglish ? 'Discover Culture' : 'Kültürü Keşfet'}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                <Compass size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">3,937m</div>
              <div className="text-xs sm:text-sm text-gray-200">
                {isEnglish ? 'Highest Peak' : 'En Yüksek Zirve'}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                <Mountains size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">50+</div>
              <div className="text-xs sm:text-sm text-gray-200">
                {isEnglish ? 'Alpine Lakes' : 'Buzul Gölü'}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-white/20">
              <div className="flex justify-center mb-2">
                <Camera size={24} className="text-white sm:w-8 sm:h-8" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">100+</div>
              <div className="text-xs sm:text-sm text-gray-200">
                {isEnglish ? 'Photo Spots' : 'Fotoğraf Noktası'}
              </div>
            </div>
          </div>
        </div>

        {/* Image Indicators - Better positioned for mobile */}
        <div className="absolute bottom-20 sm:bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 backdrop-blur-sm ${
                index === currentImageIndex 
                  ? 'bg-white/90 scale-125 shadow-lg' 
                  : 'bg-white/30 hover:bg-white/60 hover:scale-110'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              {index === currentImageIndex && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <div className="w-1 h-2 sm:h-3 bg-gradient-to-b from-primary to-secondary rounded-full mt-1 sm:mt-2 animate-bounce"></div>
          </div>
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
            {/* Nature Category */}
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
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? '50+ Glacial Lakes' : '50+ Buzul Gölü'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? 'Endemic Plant Species' : 'Endemik Bitki Türleri'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary/60 rounded-full mr-3"></div>
                      {isEnglish ? '3,937m Kaçkar Peak' : '3,937m Kaçkar Zirvesi'}
                    </div>
                  </div>
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

      {/* Simple Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif font-bold mb-4 text-primary">
            Discover Kaçkar
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            {isEnglish 
              ? "Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains."
              : "Kaçkar Dağları'nın doğal güzelliklerini, zengin kültürünü ve macera fırsatlarını keşfedin."
            }
          </p>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Discover Kaçkar. {isEnglish ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </div>
        </div>
      </footer>
    </div>
  );
}