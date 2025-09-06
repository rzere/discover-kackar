import { Category, ContentItem, SiteContent } from '../types/content';

export const categories: Category[] = [
  {
    id: '1',
    name: {
      tr: 'Doğa & Macera',
      en: 'Nature & Adventure'
    },
    slug: 'nature-adventure',
    order: 1,
    published: true,
    subcategories: [
      {
        id: '1-1',
        name: { tr: 'Yürüyüş & Trekking', en: 'Hiking & Trekking' },
        slug: 'hiking-trekking',
        categoryId: '1',
        order: 1,
        published: true
      },
      {
        id: '1-2',
        name: { tr: 'Koşu Rotaları (Kaçkar by UTMB®)', en: 'Running Routes (Kaçkar by UTMB®)' },
        slug: 'running-routes',
        categoryId: '1',
        order: 2,
        published: true
      },
      {
        id: '1-3',
        name: { tr: 'Bisiklet & MTB', en: 'Cycling & MTB' },
        slug: 'cycling-mtb',
        categoryId: '1',
        order: 3,
        published: true
      },
      {
        id: '1-4',
        name: { tr: 'Su Sporları (rafting, kano)', en: 'Water Sports (rafting, canoeing)' },
        slug: 'water-sports',
        categoryId: '1',
        order: 4,
        published: true
      },
      {
        id: '1-5',
        name: { tr: 'Kış Aktiviteleri (kar yürüyüşü, heliski)', en: 'Winter Activities (snow trekking, heliski)' },
        slug: 'winter-activities',
        categoryId: '1',
        order: 5,
        published: true
      },
      {
        id: '1-6',
        name: { tr: 'Macera Sporları', en: 'Adventure Sports' },
        slug: 'adventure-sports',
        categoryId: '1',
        order: 6,
        published: true
      }
    ]
  },
  {
    id: '2',
    name: {
      tr: 'Kültür & Yerel Hayat',
      en: 'Culture & Local Life'
    },
    slug: 'culture-local-life',
    order: 2,
    published: true,
    subcategories: [
      {
        id: '2-1',
        name: { tr: 'Hemşin Kültürü', en: 'Hemşin Culture' },
        slug: 'hemsin-culture',
        categoryId: '2',
        order: 1,
        published: true
      },
      {
        id: '2-2',
        name: { tr: 'Laz Kültürü', en: 'Laz Culture' },
        slug: 'laz-culture',
        categoryId: '2',
        order: 2,
        published: true
      },
      {
        id: '2-3',
        name: { tr: 'Köy Yaşamı ve Yaylacılık', en: 'Village Life & Yayla Traditions' },
        slug: 'village-life',
        categoryId: '2',
        order: 3,
        published: true
      },
      {
        id: '2-4',
        name: { tr: 'Tarihi Konaklar & Aileler', en: 'Historical Mansions & Families' },
        slug: 'historical-mansions',
        categoryId: '2',
        order: 4,
        published: true
      },
      {
        id: '2-5',
        name: { tr: 'Müziğimiz: Tulum, Horon, Kemençe', en: 'Our Music: Tulum, Horon, Kemençe' },
        slug: 'music-culture',
        categoryId: '2',
        order: 5,
        published: true
      },
      {
        id: '2-6',
        name: { tr: 'Geleneksel El Sanatları', en: 'Traditional Handicrafts' },
        slug: 'handicrafts',
        categoryId: '2',
        order: 6,
        published: true
      }
    ]
  },
  {
    id: '3',
    name: {
      tr: 'Gastronomi & Yerel Lezzetler',
      en: 'Gastronomy & Local Flavours'
    },
    slug: 'gastronomy',
    order: 3,
    published: true,
    subcategories: [
      {
        id: '3-1',
        name: { tr: 'Coğrafi İşaretli Ürünler', en: 'Geographical Indication Products' },
        slug: 'geographical-products',
        categoryId: '3',
        order: 1,
        published: true
      },
      {
        id: '3-2',
        name: { tr: '"Yemeden Gitme" Lezzetleri', en: '"Must-Try" Dishes' },
        slug: 'must-try-dishes',
        categoryId: '3',
        order: 2,
        published: true
      },
      {
        id: '3-3',
        name: { tr: 'Çay Hasadı & Demleme Deneyimi', en: 'Tea Harvest & Brewing Experience' },
        slug: 'tea-experience',
        categoryId: '3',
        order: 3,
        published: true
      },
      {
        id: '3-4',
        name: { tr: 'Hemşin ve Laz mutfakları', en: 'Hemşin and Laz Cuisine' },
        slug: 'local-cuisine',
        categoryId: '3',
        order: 4,
        published: true
      },
      {
        id: '3-5',
        name: { tr: 'Gastronomi Atölyeleri', en: 'Gastronomy Workshops' },
        slug: 'gastronomy-workshops',
        categoryId: '3',
        order: 5,
        published: true
      }
    ]
  },
  {
    id: '4',
    name: {
      tr: 'Müzik & Dans',
      en: 'Music & Dance'
    },
    slug: 'music-dance',
    order: 4,
    published: true,
    subcategories: [
      {
        id: '4-1',
        name: { tr: 'Horon Çeşitleri', en: 'Types of Horon' },
        slug: 'horon-types',
        categoryId: '4',
        order: 1,
        published: true
      },
      {
        id: '4-2',
        name: { tr: 'Tulum ve Kemençe Dinletileri', en: 'Tulum & Kemençe Performances' },
        slug: 'music-performances',
        categoryId: '4',
        order: 2,
        published: true
      },
      {
        id: '4-3',
        name: { tr: 'Atölyeler (çalgı yapımı, temel adımlar)', en: 'Workshops (instrument making, basic steps)' },
        slug: 'music-workshops',
        categoryId: '4',
        order: 3,
        published: true
      },
      {
        id: '4-4',
        name: { tr: 'Şenlikler ve düğün kültürü', en: 'Festivals and Wedding Traditions' },
        slug: 'festivals-weddings',
        categoryId: '4',
        order: 4,
        published: true
      }
    ]
  },
  {
    id: '5',
    name: {
      tr: 'Sürdürülebilir Turizm',
      en: 'Sustainable Tourism'
    },
    slug: 'sustainable-tourism',
    order: 5,
    published: true,
    subcategories: [
      {
        id: '5-1',
        name: { tr: 'İz Bırakmama İlkeleri', en: 'Leave No Trace Principles' },
        slug: 'leave-no-trace',
        categoryId: '5',
        order: 1,
        published: true
      },
      {
        id: '5-2',
        name: { tr: 'Yerel Üretici Destek Listesi', en: 'Local Producer Support List' },
        slug: 'local-producers',
        categoryId: '5',
        order: 2,
        published: true
      },
      {
        id: '5-3',
        name: { tr: 'Doğa Dostu Konaklama', en: 'Eco-Friendly Accommodation' },
        slug: 'eco-accommodation',
        categoryId: '5',
        order: 3,
        published: true
      },
      {
        id: '5-4',
        name: { tr: 'Eko-turizm rotaları', en: 'Eco-tourism Routes' },
        slug: 'eco-routes',
        categoryId: '5',
        order: 4,
        published: true
      },
      {
        id: '5-5',
        name: { tr: 'Doğa ve kültür koruma projeleri', en: 'Nature & Cultural Conservation Projects' },
        slug: 'conservation-projects',
        categoryId: '5',
        order: 5,
        published: true
      }
    ]
  },
  {
    id: '6',
    name: {
      tr: 'Sağlık & Wellness',
      en: 'Health & Wellness'
    },
    slug: 'health-wellness',
    order: 6,
    published: true,
    subcategories: [
      {
        id: '6-1',
        name: { tr: 'Yayla İkliminde Yoga & Meditasyon', en: 'Yoga & Meditation in the Highlands' },
        slug: 'yoga-meditation',
        categoryId: '6',
        order: 1,
        published: true
      },
      {
        id: '6-2',
        name: { tr: 'Nefes Terapisi Kampları', en: 'Breathing Therapy Camps' },
        slug: 'breathing-therapy',
        categoryId: '6',
        order: 2,
        published: true
      },
      {
        id: '6-3',
        name: { tr: 'Doğal Şifa Atölyeleri', en: 'Natural Healing Workshops' },
        slug: 'natural-healing',
        categoryId: '6',
        order: 3,
        published: true
      },
      {
        id: '6-4',
        name: { tr: 'Ayder Kaplıcaları', en: 'Ayder Thermal Springs' },
        slug: 'ayder-springs',
        categoryId: '6',
        order: 4,
        published: true
      }
    ]
  },
  {
    id: '7',
    name: {
      tr: 'Fotoğraf & Sanat',
      en: 'Photography & Art'
    },
    slug: 'photography-art',
    order: 7,
    published: true,
    subcategories: [
      {
        id: '7-1',
        name: { tr: 'Mevsimsel Fotoğraf Rotaları', en: 'Seasonal Photography Routes' },
        slug: 'photography-routes',
        categoryId: '7',
        order: 1,
        published: true
      },
      {
        id: '7-2',
        name: { tr: 'Sanatçı Atölyeleri & Açık Hava Sergileri', en: 'Artist Workshops & Open-Air Exhibitions' },
        slug: 'art-workshops',
        categoryId: '7',
        order: 2,
        published: true
      },
      {
        id: '7-3',
        name: { tr: 'Artist in Residence Programları', en: 'Artist in Residence Programs' },
        slug: 'artist-residence',
        categoryId: '7',
        order: 3,
        published: true
      }
    ]
  },
  {
    id: '8',
    name: {
      tr: 'Eğitim & Araştırma Turizmi',
      en: 'Educational & Research Tourism'
    },
    slug: 'educational-research',
    order: 8,
    published: true,
    subcategories: [
      {
        id: '8-1',
        name: { tr: 'Biyoloji & Botanik Gözlem Turları', en: 'Biology & Botany Observation Tours' },
        slug: 'biology-botany',
        categoryId: '8',
        order: 1,
        published: true
      },
      {
        id: '8-2',
        name: { tr: 'Kuş Gözlemi', en: 'Birdwatching' },
        slug: 'birdwatching',
        categoryId: '8',
        order: 2,
        published: true
      },
      {
        id: '8-3',
        name: { tr: 'Jeoloji & Buzul Gölleri Araştırma Gezileri', en: 'Geology & Glacier Lake Research Trips' },
        slug: 'geology-research',
        categoryId: '8',
        order: 3,
        published: true
      },
      {
        id: '8-4',
        name: { tr: 'Zanaat Eğitim Programları', en: 'Craftsmanship Training Programs' },
        slug: 'craftsmanship-programs',
        categoryId: '8',
        order: 4,
        published: true
      }
    ]
  },
  {
    id: '9',
    name: {
      tr: 'Etkinlik & Festivaller',
      en: 'Events & Festivals'
    },
    slug: 'events-festivals',
    order: 9,
    published: true,
    subcategories: [
      {
        id: '9-1',
        name: { tr: 'Yayla Şenlikleri', en: 'Highland Festivals' },
        slug: 'highland-festivals',
        categoryId: '9',
        order: 1,
        published: true
      },
      {
        id: '9-2',
        name: { tr: 'Horon Festivalleri', en: 'Horon Festivals' },
        slug: 'horon-festivals',
        categoryId: '9',
        order: 2,
        published: true
      },
      {
        id: '9-3',
        name: { tr: 'Çay Hasadı Festivali', en: 'Tea Harvest Festival' },
        slug: 'tea-festival',
        categoryId: '9',
        order: 3,
        published: true
      },
      {
        id: '9-4',
        name: { tr: 'Yerel Ürün Pazarları & Gastronomi Günleri', en: 'Local Product Markets & Gastronomy Days' },
        slug: 'local-markets',
        categoryId: '9',
        order: 4,
        published: true
      }
    ]
  }
];

export const content: ContentItem[] = [
  {
    id: 'hiking-intro',
    title: {
      tr: 'Kaçkar\'da Yürüyüş & Trekking',
      en: 'Hiking & Trekking in Kaçkar'
    },
    description: {
      tr: 'Kaçkar Dağları\'nda her seviyeye uygun yürüyüş parkurları sizi bekliyor.',
      en: 'Hiking trails suitable for all levels await you in the Kaçkar Mountains.'
    },
    content: {
      tr: 'Kaçkar Dağları\'nda her seviyeye uygun yürüyüş parkurları sizi bekliyor. Yaylalar arası geçişler, buzul gölleri ve derin vadilerde doğayla iç içe keşifler yapabilirsiniz.',
      en: 'Hiking trails suitable for all levels await you in the Kaçkar Mountains. You can explore plateau transitions, glacial lakes, and deep valleys in harmony with nature.'
    },
    category: '1',
    subcategory: '1-1',
    order: 1,
    published: true,
    images: ['treking1.jpg', 'Kackar_HiRes-nodumsports_moritzklee-MK_02101-2.jpg', 'Kackar_HiRes-nodumsports_moritzklee-MK_02200-2.jpg'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'utmb-intro',
    title: {
      tr: 'Kaçkar by UTMB® Koşu Rotaları',
      en: 'Kaçkar by UTMB® Running Routes'
    },
    description: {
      tr: 'Dünyanın önde gelen ultra maraton organizasyonlarından biri.',
      en: 'One of the world\'s leading ultra marathon organizations.'
    },
    content: {
      tr: 'Dünyanın önde gelen ultra maraton organizasyonlarından biri olan Kaçkar by UTMB®, sporculara zorlu ve manzaralı parkurlar sunuyor. Hazırlık koşularından yarış rotalarına kadar tüm detaylar burada.',
      en: 'Kaçkar by UTMB®, one of the world\'s leading ultra marathon organizations, offers challenging and scenic routes for athletes. All details from preparation runs to race routes are here.'
    },
    category: '1',
    subcategory: '1-2',
    order: 1,
    published: true,
    images: ['Kackar_HiRes-nodumsports_moritzklee-MK_02209-2.jpg', 'Kackar_HiRes-nodumsports_moritzklee-MK_02388-2.jpg', 'Kackar_HiRes-nodumsports_moritzklee-MK_02496-2.jpg'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'hemsin-culture-intro',
    title: {
      tr: 'Hemşin Kültürü',
      en: 'Hemşin Culture'
    },
    description: {
      tr: 'Kendine özgü dili, müziği ve mutfağıyla Hemşin kültürü.',
      en: 'Hemşin culture with its unique language, music, and cuisine.'
    },
    content: {
      tr: 'Kendine özgü dili, müziği ve mutfağıyla Hemşin kültürü, Kaçkar\'ın zengin mirasının önemli bir parçasıdır. Yaylacılık geleneği ve yerel yaşam biçimi burada hâlâ canlı.',
      en: 'Hemşin culture, with its unique language, music, and cuisine, is an important part of Kaçkar\'s rich heritage. The yayla tradition and local way of life are still vibrant here.'
    },
    category: '2',
    subcategory: '2-1',
    order: 1,
    published: true,
    images: ['rev-01.jpg', 'rev-02.jpg', 'rev-03.jpg'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

export const mockSiteContent: SiteContent = {
  categories,
  content
};