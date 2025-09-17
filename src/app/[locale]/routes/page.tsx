'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { MapPin, Envelope, Phone, FacebookLogo, InstagramLogo, TwitterLogo } from '@phosphor-icons/react';

// Enhanced 3D route visualization with traveling trail effects
function RoutesScene() {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [trailPosition, setTrailPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 200);
      setTrailPosition(prev => (prev + 2) % 200);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 sm:h-80 md:h-96 bg-primary overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Enhanced 3D container with multiple layers */}
      <div className="absolute inset-0 transform-gpu" style={{ 
        transform: `rotateX(15deg) rotateY(${animationPhase * 0.05}deg)`,
        transformStyle: 'preserve-3d'
      }}>
        
        {/* Background terrain layer */}
        <div className="absolute inset-0" style={{ transform: 'translateZ(-50px)' }}>
          <svg className="w-full h-full opacity-10 sm:opacity-20" viewBox="0 0 800 400">
            <path
              d="M 0 350 Q 200 300 400 320 Q 600 340 800 350"
              stroke="#64748b"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 0 380 Q 200 360 400 370 Q 600 375 800 380"
              stroke="#64748b"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>

        {/* Hiking Route - Enhanced with traveling trail */}
        <div className="absolute inset-0" style={{ transform: 'translateZ(30px)' }}>
          <svg className="w-full h-full" viewBox="0 0 800 400">
            {/* Base route line */}
            <path
              d="M 100 200 Q 200 100 300 150 Q 400 200 500 120 Q 600 80 700 150"
              stroke="#059669"
              strokeWidth="2"
              fill="none"
              strokeDasharray="8 4"
              strokeDashoffset={animationPhase}
              opacity="0.6"
              className="sm:stroke-[4] sm:stroke-dasharray-[12_6]"
            />
            
            {/* Traveling trail effect */}
            <path
              d="M 100 200 Q 200 100 300 150 Q 400 200 500 120 Q 600 80 700 150"
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 2"
              strokeDashoffset={trailPosition}
              opacity="0.9"
              className="sm:stroke-[6] sm:stroke-dasharray-[20_2]"
              style={{
                filter: 'drop-shadow(0 0 4px #10b981)',
                transform: 'translateZ(5px)'
              }}
            />
            
            {/* Glowing trail head */}
            <circle
              r="6"
              fill="#22c55e"
              opacity="1"
              className="sm:r-8"
              style={{
                filter: 'drop-shadow(0 0 8px #22c55e)',
                transform: `translateZ(10px)`,
                animation: `trailGlow 1.5s ease-in-out infinite`
              }}
            >
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 100 200 Q 200 100 300 150 Q 400 200 500 120 Q 600 80 700 150"
              />
            </circle>
            
            {/* Route Points with enhanced 3D effect */}
            {[
              { x: 100, y: 200, label: "Ayder", z: 25 },
              { x: 200, y: 137, label: "Hazindak", z: 35 },
              { x: 300, y: 150, label: "Pokut", z: 30 },
              { x: 500, y: 120, label: "Makrevis", z: 40 },
              { x: 700, y: 150, label: "Çamlıhemşin", z: 20 }
            ].map((point, index) => (
              <g key={index} style={{ transform: `translateZ(${point.z}px)` }}>
                {/* Shadow */}
                <circle
                  cx={point.x + 1}
                  cy={point.y + 1}
                  r="6"
                  fill="#000"
                  opacity="0.2"
                  className="sm:r-8 sm:cx-[calc(var(--x)+2px)] sm:cy-[calc(var(--y)+2px)]"
                  style={{ transform: 'translateZ(-5px)', '--x': point.x, '--y': point.y } as React.CSSProperties}
                />
                {/* Main point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#059669"
                  opacity="0.95"
                  className="sm:r-8"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(5, 150, 105, 0.3))',
                    animation: `float3D 3s ease-in-out infinite ${index * 0.4}s`
                  }}
                />
                {/* Inner glow */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#22c55e"
                  opacity="0.8"
                  className="sm:r-4"
                />
                <text
                  x={point.x}
                  y={point.y - 20}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs font-semibold fill-white"
                  style={{ 
                    transform: 'translateZ(10px)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Cycling Route - Enhanced with traveling trail */}
        <div className="absolute inset-0" style={{ transform: 'translateZ(20px)' }}>
          <svg className="w-full h-full" viewBox="0 0 800 400">
            {/* Base route line */}
            <path
              d="M 100 250 Q 250 300 400 280 Q 550 260 700 300"
              stroke="#2563eb"
              strokeWidth="2"
              fill="none"
              strokeDasharray="10 6"
              strokeDashoffset={-animationPhase}
              opacity="0.6"
              className="sm:stroke-[4] sm:stroke-dasharray-[15_8]"
            />
            
            {/* Traveling trail effect */}
            <path
              d="M 100 250 Q 250 300 400 280 Q 550 260 700 300"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
              strokeDasharray="15 2"
              strokeDashoffset={-trailPosition}
              opacity="0.9"
              className="sm:stroke-[6] sm:stroke-dasharray-[25_3]"
              style={{
                filter: 'drop-shadow(0 0 4px #3b82f6)',
                transform: 'translateZ(5px)'
              }}
            />
            
            {/* Glowing trail head */}
            <circle
              r="6"
              fill="#60a5fa"
              opacity="1"
              className="sm:r-8"
              style={{
                filter: 'drop-shadow(0 0 8px #60a5fa)',
                transform: `translateZ(10px)`,
                animation: `trailGlow 1.8s ease-in-out infinite`
              }}
            >
              <animateMotion
                dur="5s"
                repeatCount="indefinite"
                path="M 100 250 Q 250 300 400 280 Q 550 260 700 300"
              />
            </circle>
            
            {/* Route Points with enhanced 3D effect */}
            {[
              { x: 100, y: 250, label: "Ayder", z: 15 },
              { x: 250, y: 282, label: "Kavrun", z: 25 },
              { x: 400, y: 280, label: "Çat", z: 20 },
              { x: 700, y: 300, label: "Şenyuva", z: 10 }
            ].map((point, index) => (
              <g key={index} style={{ transform: `translateZ(${point.z}px)` }}>
                {/* Shadow */}
                <circle
                  cx={point.x + 1}
                  cy={point.y + 1}
                  r="6"
                  fill="#000"
                  opacity="0.2"
                  className="sm:r-8 sm:cx-[calc(var(--x)+2px)] sm:cy-[calc(var(--y)+2px)]"
                  style={{ transform: 'translateZ(-5px)', '--x': point.x, '--y': point.y } as React.CSSProperties}
                />
                {/* Main point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#2563eb"
                  opacity="0.95"
                  className="sm:r-8"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3))',
                    animation: `float3D 3.5s ease-in-out infinite ${index * 0.5}s`
                  }}
                />
                {/* Inner glow */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#60a5fa"
                  opacity="0.8"
                  className="sm:r-4"
                />
                <text
                  x={point.x}
                  y={point.y - 20}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs font-semibold fill-white"
                  style={{ 
                    transform: 'translateZ(10px)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                  }}
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

      </div>
    </div>
  );
}

export default function RoutesPage({
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

  const getRouteData = () => {
    switch (locale) {
      case 'tr':
        return {
          title: "Rotaları Takip Edin",
          description: "Kaçkar Dağları, doğa yürüyüşü, koşu ve bisiklet için Türkiye'nin en özel rotalarını sunuyor. Orman içi patikalar, taş döşeli yollar, buzul gölleri ve yaylalar arasında ilerleyen parkurlar; hem doğa hem de kültürle iç içe, ilham verici bir deneyim vadediyor. Rotalarda; tarihi taş köprüler, bulut denizi manzaraları, şenlikler ve yerel mutfak tatları sizi karşılıyor.",
          description2: "Her rota farklı bir seviyeye hitap ediyor: kısa günlük yürüyüşlerden zorlu çok günlük parkurlara, ailelere uygun keşiflerden deneyimli dağcı ve koşuculara yönelik yüksek irtifa etaplarına kadar birçok seçenek mevcut. Yaz aylarında yürüyüş ve bisiklet için ideal olan bu rotalar, kışın ise kar yürüyüşü ve macera fırsatları sunuyor.",
          hikingTrails: {
            title: "🚶‍♂️ Yürüyüş Rotaları (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" },
              { id: "Y07", name: "Amlakit – Kotençur – Palovit – Amlakit", distance: "11 km" },
              { id: "Y08", name: "Amlakit – Samistal – Hazindak – Amlakit", distance: "15 km" },
              { id: "Y09", name: "Şimşir Ormanı – Meydanköy – Gito – Şimşir Ormanı", distance: "22 km" },
              { id: "Y10", name: "Cinciva – Ülkü Köyü – Cinciva", distance: "8,5 km" },
              { id: "Y11", name: "Ayder – Huser – A.Kaçkar – Didingola – Dadala – Avusor – Ayder", distance: "40 km" },
              { id: "Y12", name: "Ayder – Hazindak – Ayder", distance: "9 km" }
            ]
          },
          runningCyclingTrails: {
            title: "🏃‍♀️ Koşu & Bisiklet Rotaları (6)",
            trails: [
              { id: "B1", name: "Ayder – Yukarı Kavrun – Çat", distance: "47,5 km" },
              { id: "B2", name: "Ayder – Palovit Şelalesi – Şenyuva", distance: "58 km" },
              { id: "B3", name: "Ayder – Hazindak – Şenyuva", distance: "55,5 km" },
              { id: "B4", name: "Ayder – Yukarı Çeymakçur", distance: "24 km" },
              { id: "B5", name: "Ayder – Huser – Avusor – Ayder", distance: "24 km" },
              { id: "B6", name: "Ayder – Yukarı Kavrun – Ayder", distance: "23 km" }
            ]
          }
        };
      case 'fr':
        return {
          title: "Suivez les Sentiers",
          description: "Les montagnes Kaçkar offrent certains des sentiers les plus remarquables de Turquie pour la randonnée, la course et le vélo. À travers des chemins forestiers, des pistes pavées, des lacs glaciaires et des plateaux, chaque itinéraire promet une expérience inspirante où la nature et la culture se rencontrent. En chemin, vous découvrirez des ponts de pierre historiques, des mers de nuages, des festivals et la cuisine locale.",
          description2: "Chaque parcours s'adresse à un niveau différent : des promenades quotidiennes aux treks de plusieurs jours, des explorations familiales aux itinéraires en altitude pour les alpinistes et coureurs expérimentés. Idéal pour la randonnée et le vélo en été, les sentiers offrent également des possibilités de randonnée sur neige et d'aventure en hiver.",
          hikingTrails: {
            title: "Itinéraires de randonnée (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" },
              { id: "Y07", name: "Amlakit – Kotençur – Palovit – Amlakit", distance: "11 km" },
              { id: "Y08", name: "Amlakit – Samistal – Hazindak – Amlakit", distance: "15 km" },
              { id: "Y09", name: "Şimşir Ormanı – Meydanköy – Gito – Şimşir Ormanı", distance: "22 km" },
              { id: "Y10", name: "Cinciva – Ülkü Köyü – Cinciva", distance: "8,5 km" },
              { id: "Y11", name: "Ayder – Huser – A.Kaçkar – Didingola – Dadala – Avusor – Ayder", distance: "40 km" },
              { id: "Y12", name: "Ayder – Hazindak – Ayder", distance: "9 km" }
            ]
          },
          runningCyclingTrails: {
            title: "Itinéraires de course & vélo (6)",
            trails: [
              { id: "B1", name: "Ayder – Yukarı Kavrun – Çat", distance: "47,5 km" },
              { id: "B2", name: "Ayder – Palovit Şelalesi – Şenyuva", distance: "58 km" },
              { id: "B3", name: "Ayder – Hazindak – Şenyuva", distance: "55,5 km" },
              { id: "B4", name: "Ayder – Yukarı Çeymakçur", distance: "24 km" },
              { id: "B5", name: "Ayder – Huser – Avusor – Ayder", distance: "24 km" },
              { id: "B6", name: "Ayder – Yukarı Kavrun – Ayder", distance: "23 km" }
            ]
          }
        };
      case 'de':
        return {
          title: "Folgen Sie den Pfaden",
          description: "Das Kaçkar-Gebirge bietet einige der bemerkenswertesten Routen der Türkei zum Wandern, Laufen und Radfahren. Durch Waldpfade, gepflasterte Wege, Gletscherseen und Hochplateaus verspricht jede Route ein inspirierendes Erlebnis, bei dem sich Natur und Kultur begegnen. Unterwegs stoßen Sie auf historische Steinbrücken, Wolkenmeere, Feste und regionale Küche.",
          description2: "Jede Strecke richtet sich an ein anderes Niveau: von kurzen Tageswanderungen bis zu anspruchsvollen Mehrtagestouren, von familienfreundlichen Erkundungen bis zu Hochgebirgsrouten für erfahrene Bergsteiger und Läufer. Im Sommer ideal zum Wandern und Radfahren, im Winter bieten die Wege auch Möglichkeiten für Schneewanderungen und Abenteuer.",
          hikingTrails: {
            title: "Wanderwege (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" },
              { id: "Y07", name: "Amlakit – Kotençur – Palovit – Amlakit", distance: "11 km" },
              { id: "Y08", name: "Amlakit – Samistal – Hazindak – Amlakit", distance: "15 km" },
              { id: "Y09", name: "Şimşir Ormanı – Meydanköy – Gito – Şimşir Ormanı", distance: "22 km" },
              { id: "Y10", name: "Cinciva – Ülkü Köyü – Cinciva", distance: "8,5 km" },
              { id: "Y11", name: "Ayder – Huser – A.Kaçkar – Didingola – Dadala – Avusor – Ayder", distance: "40 km" },
              { id: "Y12", name: "Ayder – Hazindak – Ayder", distance: "9 km" }
            ]
          },
          runningCyclingTrails: {
            title: "Lauf- & Radwege (6)",
            trails: [
              { id: "B1", name: "Ayder – Yukarı Kavrun – Çat", distance: "47,5 km" },
              { id: "B2", name: "Ayder – Palovit Şelalesi – Şenyuva", distance: "58 km" },
              { id: "B3", name: "Ayder – Hazindak – Şenyuva", distance: "55,5 km" },
              { id: "B4", name: "Ayder – Yukarı Çeymakçur", distance: "24 km" },
              { id: "B5", name: "Ayder – Huser – Avusor – Ayder", distance: "24 km" },
              { id: "B6", name: "Ayder – Yukarı Kavrun – Ayder", distance: "23 km" }
            ]
          }
        };
      default: // English
        return {
          title: "Follow the Trails",
          description: "The Kaçkar Mountains offer some of Türkiye's most remarkable trails for hiking, running and cycling. Through forest paths, cobblestone tracks, glacial lakes and high plateaus, each route promises an inspiring experience where nature and culture meet. Along the way, you'll find historic stone bridges, sea-of-cloud views, festivals, and local cuisine.",
          description2: "Each trail caters to a different level: from short daily hikes to challenging multi-day treks, from family-friendly explorations to high-altitude routes for experienced mountaineers and runners. Ideal for hiking and cycling in summer, the routes also open doors to snow trekking and adventure in winter.",
          hikingTrails: {
            title: "Hiking Trails (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" },
              { id: "Y07", name: "Amlakit – Kotençur – Palovit – Amlakit", distance: "11 km" },
              { id: "Y08", name: "Amlakit – Samistal – Hazindak – Amlakit", distance: "15 km" },
              { id: "Y09", name: "Şimşir Ormanı – Meydanköy – Gito – Şimşir Ormanı", distance: "22 km" },
              { id: "Y10", name: "Cinciva – Ülkü Köyü – Cinciva", distance: "8,5 km" },
              { id: "Y11", name: "Ayder – Huser – A.Kaçkar – Didingola – Dadala – Avusor – Ayder", distance: "40 km" },
              { id: "Y12", name: "Ayder – Hazindak – Ayder", distance: "9 km" }
            ]
          },
          runningCyclingTrails: {
            title: "Running & Cycling Trails (6)",
            trails: [
              { id: "B1", name: "Ayder – Yukarı Kavrun – Çat", distance: "47,5 km" },
              { id: "B2", name: "Ayder – Palovit Şelalesi – Şenyuva", distance: "58 km" },
              { id: "B3", name: "Ayder – Hazindak – Şenyuva", distance: "55,5 km" },
              { id: "B4", name: "Ayder – Yukarı Çeymakçur", distance: "24 km" },
              { id: "B5", name: "Ayder – Huser – Avusor – Ayder", distance: "24 km" },
              { id: "B6", name: "Ayder – Yukarı Kavrun – Ayder", distance: "23 km" }
            ]
          }
        };
    }
  };

  const routeData = getRouteData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* 3D Routes Scene */}
      <RoutesScene />
      
      {/* Hero Section */}
      <div className="bg-white text-slate-800 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            {routeData.title}
          </h1>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed">
              {routeData.description}
            </p>
            {routeData.description2 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">
                      {locale === 'tr' ? 'Rota Seviyeleri' : 
                       locale === 'fr' ? 'Niveaux de Parcours' :
                       locale === 'de' ? 'Routen-Niveaus' : 'Trail Levels'}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                      {routeData.description2}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Routes Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Hiking Trails */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4 sm:mb-6">
              {routeData.hikingTrails.title}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {routeData.hikingTrails.trails.map((trail) => (
                <div key={trail.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="mb-2 sm:mb-0">
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{trail.id}</span>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1">{trail.name}</p>
                  </div>
                  <span className="text-slate-700 font-bold text-sm sm:text-base">{trail.distance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Running & Cycling Trails */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4 sm:mb-6">
              {routeData.runningCyclingTrails.title}
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {routeData.runningCyclingTrails.trails.map((trail) => (
                <div key={trail.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="mb-2 sm:mb-0">
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{trail.id}</span>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1">{trail.name}</p>
                  </div>
                  <span className="text-slate-700 font-bold text-sm sm:text-base">{trail.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trails Image Section */}
      <div className="bg-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img 
              src="/trails.jpg" 
              alt="Kaçkar Trails" 
              className="w-full h-auto rounded-lg shadow-lg max-w-4xl mx-auto"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              onError={(e) => {
                console.log('Trails image failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
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