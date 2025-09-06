import Link from 'next/link';
import { ArrowRight, Mountains, Compass, Camera } from '@phosphor-icons/react';

interface SimpleHeroProps {
  locale: string;
}

export default function SimpleHero({ locale }: SimpleHeroProps) {
  const isEnglish = locale === 'en';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with placeholder for future image */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-teal/20">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="mb-6 flex justify-center">
          <Mountains size={80} className="text-primary" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-serif text-navy mb-6 drop-shadow-lg">
          Discover Kaçkar
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed">
          {isEnglish 
            ? "Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey's hidden gem in the Black Sea region."
            : "Karadeniz bölgesinin gizli hazinesi olan Kaçkar Dağları'nın el değmemiş doğasını, kadim kültürlerini ve nefes kesen manzaralarını keşfedin."
          }
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href={`/${locale}/category/nature`}
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-primary/90 transition-all duration-300 flex items-center justify-center group"
          >
            {isEnglish ? 'Explore Nature' : 'Doğayı Keşfet'}
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href={`/${locale}/category/culture`}
            className="bg-transparent border-2 border-navy text-navy px-8 py-4 rounded-lg text-lg font-medium hover:bg-navy hover:text-white transition-all duration-300"
          >
            {isEnglish ? 'Discover Culture' : 'Kültürü Keşfet'}
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <Compass size={32} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-navy">3,937m</div>
            <div className="text-sm text-gray-600">
              {isEnglish ? 'Highest Peak' : 'En Yüksek Zirve'}
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <Mountains size={32} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-navy">50+</div>
            <div className="text-sm text-gray-600">
              {isEnglish ? 'Alpine Lakes' : 'Buzul Gölü'}
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <Camera size={32} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-navy">100+</div>
            <div className="text-sm text-gray-600">
              {isEnglish ? 'Photo Spots' : 'Fotoğraf Noktası'}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-navy/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-navy/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}