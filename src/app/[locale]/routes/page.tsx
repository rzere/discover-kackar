'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';

// 3D-like animated route visualization using CSS transforms
function RoutesScene() {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-96 bg-slate-50 overflow-hidden perspective-1000">
      {/* 3D-like container */}
      <div className="absolute inset-0 transform-gpu" style={{ 
        transform: `rotateX(15deg) rotateY(${animationPhase * 0.5}deg)`,
        transformStyle: 'preserve-3d'
      }}>
        {/* Hiking Route - 3D-like path */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 800 400" style={{ transform: 'translateZ(20px)' }}>
            <path
              d="M 100 200 Q 200 100 300 150 Q 400 200 500 120 Q 600 80 700 150"
              stroke="#059669"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8 4"
              strokeDashoffset={animationPhase}
              opacity="0.8"
            />
            
            {/* Route Points with 3D effect */}
            {[
              { x: 100, y: 200, label: "Ayder" },
              { x: 200, y: 100, label: "Hazindak" },
              { x: 300, y: 150, label: "Pokut" },
              { x: 500, y: 120, label: "Makrevis" },
              { x: 700, y: 150, label: "Çamlıhemşin" }
            ].map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#059669"
                  opacity="0.9"
                  style={{
                    transform: `translateZ(${Math.sin(animationPhase * 0.1 + index) * 10}px)`,
                    animation: `float 2s ease-in-out infinite ${index * 0.2}s`
                  }}
                />
                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="text-xs font-medium fill-slate-700"
                  style={{ transform: 'translateZ(5px)' }}
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Cycling Route - 3D-like path */}
        <div className="absolute inset-0" style={{ transform: 'translateZ(10px)' }}>
          <svg className="w-full h-full" viewBox="0 0 800 400">
            <path
              d="M 100 250 Q 250 300 400 280 Q 550 260 700 300"
              stroke="#2563eb"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10 5"
              strokeDashoffset={-animationPhase}
              opacity="0.8"
            />
            
            {/* Route Points with 3D effect */}
            {[
              { x: 100, y: 250, label: "Ayder" },
              { x: 250, y: 300, label: "Kavrun" },
              { x: 400, y: 280, label: "Çat" },
              { x: 700, y: 300, label: "Şenyuva" }
            ].map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#2563eb"
                  opacity="0.9"
                  style={{
                    transform: `translateZ(${Math.sin(animationPhase * 0.1 + index + 2) * 10}px)`,
                    animation: `float 2s ease-in-out infinite ${index * 0.3}s`
                  }}
                />
                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  className="text-xs font-medium fill-slate-700"
                  style={{ transform: 'translateZ(5px)' }}
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Floating particles for depth */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-green-400 rounded-full opacity-60" 
           style={{ 
             animation: `float 3s ease-in-out infinite`,
             transform: 'translateZ(30px)'
           }}></div>
      <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-60" 
           style={{ 
             animation: `float 3s ease-in-out infinite 1s`,
             transform: 'translateZ(25px)'
           }}></div>
      <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-slate-400 rounded-full opacity-60" 
           style={{ 
             animation: `float 3s ease-in-out infinite 2s`,
             transform: 'translateZ(20px)'
           }}></div>
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
      <div className="bg-slate-100 text-slate-800 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {routeData.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {routeData.description}
          </p>
        </div>
      </div>

      {/* Routes Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Hiking Trails */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-navy mb-6">
              {routeData.hikingTrails.title}
            </h2>
            <div className="space-y-4">
              {routeData.hikingTrails.trails.map((trail) => (
                <div key={trail.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div>
                    <span className="font-semibold text-slate-800">{trail.id}</span>
                    <p className="text-slate-600 text-sm mt-1">{trail.name}</p>
                  </div>
                  <span className="text-slate-700 font-bold">{trail.distance}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Running & Cycling Trails */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-navy mb-6">
              {routeData.runningCyclingTrails.title}
            </h2>
            <div className="space-y-4">
              {routeData.runningCyclingTrails.trails.map((trail) => (
                <div key={trail.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div>
                    <span className="font-semibold text-slate-800">{trail.id}</span>
                    <p className="text-slate-600 text-sm mt-1">{trail.name}</p>
                  </div>
                  <span className="text-slate-700 font-bold">{trail.distance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}