'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';

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
    <div className="relative h-64 sm:h-80 md:h-96 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Enhanced 3D container with multiple layers */}
      <div className="absolute inset-0 transform-gpu" style={{ 
        transform: `rotateX(15deg) rotateY(${animationPhase * 0.1}deg)`,
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
              { x: 200, y: 100, label: "Hazindak", z: 35 },
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
                  style={{ transform: 'translateZ(-5px)', '--x': point.x, '--y': point.y }}
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
                  y={point.y - 12}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs font-semibold fill-slate-800"
                  style={{ 
                    transform: 'translateZ(10px)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
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
              { x: 250, y: 300, label: "Kavrun", z: 25 },
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
                  style={{ transform: 'translateZ(-5px)', '--x': point.x, '--y': point.y }}
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
                  y={point.y - 12}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs font-semibold fill-slate-800"
                  style={{ 
                    transform: 'translateZ(10px)',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                  }}
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Atmospheric depth elements - hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-16 left-16 w-3 h-3 bg-green-300 rounded-full opacity-40" 
             style={{ 
               animation: `float3D 4s ease-in-out infinite`,
               transform: 'translateZ(50px)',
               filter: 'blur(1px)'
             }}></div>
        <div className="hidden sm:block absolute top-24 right-24 w-2 h-2 bg-blue-300 rounded-full opacity-40" 
             style={{ 
               animation: `float3D 5s ease-in-out infinite 1.5s`,
               transform: 'translateZ(45px)',
               filter: 'blur(1px)'
             }}></div>
        <div className="hidden sm:block absolute bottom-24 left-1/3 w-1.5 h-1.5 bg-slate-300 rounded-full opacity-40" 
             style={{ 
               animation: `float3D 6s ease-in-out infinite 3s`,
               transform: 'translateZ(40px)',
               filter: 'blur(1px)'
             }}></div>
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

  const getRouteData = () => {
    switch (locale) {
      case 'tr':
        return {
          title: "Rotaları Takip Edin",
          description: "Kaçkar Dağları, doğa yürüyüşü, koşu ve bisiklet için Türkiye'nin en özel rotalarını sunuyor. Orman içi patikalar, taş döşeli yollar, buzul gölleri ve yaylalar arasında ilerleyen parkurlar; hem doğa hem de kültürle iç içe, ilham verici bir deneyim vadediyor.",
          hikingTrails: {
            title: "🚶‍♂️ Yürüyüş Rotaları (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" }
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
          description: "Les montagnes Kaçkar offrent certains des sentiers les plus remarquables de Turquie pour la randonnée, la course et le vélo. À travers des chemins forestiers, des pistes pavées, des lacs glaciaires et des plateaux, chaque itinéraire promet une expérience inspirante où la nature et la culture se rencontrent.",
          hikingTrails: {
            title: "Itinéraires de randonnée (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" }
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
          description: "Das Kaçkar-Gebirge bietet einige der bemerkenswertesten Routen der Türkei zum Wandern, Laufen und Radfahren. Durch Waldpfade, gepflasterte Wege, Gletscherseen und Hochplateaus verspricht jede Route ein inspirierendes Erlebnis, bei dem sich Natur und Kultur begegnen.",
          hikingTrails: {
            title: "Wanderwege (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" }
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
          description: "The Kaçkar Mountains offer some of Türkiye's most remarkable trails for hiking, running and cycling. Through forest paths, cobblestone tracks, glacial lakes and high plateaus, each route promises an inspiring experience where nature and culture meet.",
          hikingTrails: {
            title: "Hiking Trails (12)",
            trails: [
              { id: "Y01", name: "Ayder – Hazindak – Pokut – Makrevis – Çamlıhemşin", distance: "24 km" },
              { id: "Y02", name: "Ayder – Çeymakçur – Kavrun – Ayder", distance: "27 km" },
              { id: "Y03", name: "Ayder – Huser – Ayder", distance: "14 km" },
              { id: "Y04", name: "Ayder – Huser – Çamyatak – Peryatak – Çise – Kuntz – Ayder", distance: "19 km" },
              { id: "Y05", name: "Kavrun – Göller – Öküzyatağı – Kavrun", distance: "12,5 km" },
              { id: "Y06", name: "Kavrun – Asit – Apivanak – Palovit – Amlakit – Samistal – Kavrun", distance: "27 km" }
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
      <div className="bg-slate-100 text-slate-800 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            {routeData.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {routeData.description}
          </p>
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
    </div>
  );
}