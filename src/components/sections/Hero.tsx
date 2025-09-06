'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, Mountains, Heart, Camera } from '@phosphor-icons/react';
import { getImageFromCategory, getImageUrl } from '@/lib/utils/imageUtils';
import { useState, useEffect } from 'react';

export default function Hero() {
  const t = useTranslations();
  const locale = useLocale();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Dynamic Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${getImageUrl(image)})`,
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
        
        {/* Animated geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-1/4 w-20 h-20 border border-white/20 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-20 right-1/3 w-16 h-16 border border-white/20 rounded-full animate-pulse delay-3000"></div>
          </div>
        </div>
      </div>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20">
          <Mountains size={48} className="text-primary" />
        </div>
        <div className="absolute top-40 right-32">
          <Heart size={32} className="text-secondary" />
        </div>
        <div className="absolute bottom-32 left-1/4">
          <Camera size={40} className="text-primary" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          {/* Floating elements for visual interest */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -top-5 -right-10 w-16 h-16 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-10 -left-20 w-24 h-24 bg-teal/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent drop-shadow-2xl">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-primary font-medium drop-shadow-lg">
            {t('hero.subtitle')}
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-100 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href={`/${locale}/category/nature-adventure`}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-navy font-semibold rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm"
            >
              {locale === 'tr' ? 'Macerayı Keşfet' : 'Explore Adventures'}
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href={`/${locale}/category/culture-local-life`}
              className="group inline-flex items-center px-8 py-4 border-2 border-white/80 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {locale === 'tr' ? 'Kültürü Keşfet' : 'Discover Culture'}
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative w-4 h-4 rounded-full transition-all duration-300 backdrop-blur-sm ${
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-3 bg-gradient-to-b from-primary to-secondary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}