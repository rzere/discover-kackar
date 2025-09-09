-- Populate subcategories with proper JSONB multilingual structure
DO $$
DECLARE
    nature_id UUID;
    culture_id UUID;
    gastronomy_id UUID;
    music_dance_id UUID;
    sustainable_id UUID;
    health_id UUID;
    photography_id UUID;
    educational_id UUID;
    events_id UUID;
BEGIN
    -- Get category IDs (we only need one per category since they're now unified)
    SELECT id INTO nature_id FROM public.categories WHERE slug = 'nature' AND locale = 'en';
    SELECT id INTO culture_id FROM public.categories WHERE slug = 'culture' AND locale = 'en';
    SELECT id INTO gastronomy_id FROM public.categories WHERE slug = 'gastronomy' AND locale = 'en';
    SELECT id INTO music_dance_id FROM public.categories WHERE slug = 'music-dance' AND locale = 'en';
    SELECT id INTO sustainable_id FROM public.categories WHERE slug = 'sustainable-tourism' AND locale = 'en';
    SELECT id INTO health_id FROM public.categories WHERE slug = 'health-wellness' AND locale = 'en';
    SELECT id INTO photography_id FROM public.categories WHERE slug = 'photography-art' AND locale = 'en';
    SELECT id INTO educational_id FROM public.categories WHERE slug = 'educational-research' AND locale = 'en';
    SELECT id INTO events_id FROM public.categories WHERE slug = 'events-festivals' AND locale = 'en';

    -- Insert Nature & Adventure subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (nature_id, 'alpine-lakes', 
     '{"en": "Alpine Lakes", "tr": "Alpin Göller"}',
     '{"en": "Discover over 50 pristine alpine lakes scattered across the Kaçkar Mountains. These crystal-clear glacial lakes offer perfect spots for photography, fishing, and peaceful contemplation.", "tr": "Kaçkar Dağları''na serpiştirilmiş 50''den fazla pristine alpine gölü keşfedin. Bu kristal berraklığındaki buzul gölleri fotoğrafçılık, balıkçılık ve huzurlu tefekkür için mükemmel noktalar sunar."}',
     1, true),
    (nature_id, 'mountain-peaks', 
     '{"en": "Mountain Peaks", "tr": "Dağ Zirveleri"}',
     '{"en": "Challenge yourself on the highest peaks of the Kaçkar range, including the iconic Kaçkar Dağı at 3,937 meters. Experience breathtaking panoramic views and alpine adventures.", "tr": "3,937 metre yüksekliğindeki ikonik Kaçkar Dağı dahil olmak üzere Kaçkar sırasının en yüksek zirvelerinde kendinizi test edin. Nefes kesici panoramik manzaralar ve alpine maceralar yaşayın."}',
     2, true),
    (nature_id, 'forest-trails', 
     '{"en": "Forest Trails", "tr": "Orman Patikaları"}',
     '{"en": "Wander through ancient forests and discover hidden trails that lead to secluded valleys and traditional villages. Experience the rich biodiversity of the region.", "tr": "Antik ormanlarda dolaşın ve ücra vadiler ve geleneksel köylere giden gizli patikaları keşfedin. Bölgenin zengin biyolojik çeşitliliğini deneyimleyin."}',
     3, true),
    (nature_id, 'wildlife-watching', 
     '{"en": "Wildlife Watching", "tr": "Yaban Hayatı Gözlemi"}',
     '{"en": "Observe endemic species and diverse wildlife in their natural habitat. The Kaçkar region is home to unique flora and fauna found nowhere else in the world.", "tr": "Endemik türleri ve çeşitli yaban hayatını doğal habitatlarında gözlemleyin. Kaçkar bölgesi dünyada başka hiçbir yerde bulunmayan benzersiz flora ve faunaya ev sahipliği yapar."}',
     4, true);

    -- Insert Culture & Local Life subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (culture_id, 'traditional-communities', 
     '{"en": "Traditional Communities", "tr": "Geleneksel Topluluklar"}',
     '{"en": "Meet the local Laz and Hemshin communities who have preserved their unique traditions, language, and way of life for centuries in the Kaçkar highlands.", "tr": "Kaçkar yaylalarında yüzyıllardır benzersiz geleneklerini, dillerini ve yaşam tarzlarını koruyan yerel Laz ve Hemşin topluluklarıyla tanışın."}',
     1, true),
    (culture_id, 'historical-monuments', 
     '{"en": "Historical Monuments", "tr": "Tarihi Anıtlar"}',
     '{"en": "Explore ancient monasteries, churches, and historical sites that tell the story of the region''s rich cultural heritage and religious diversity.", "tr": "Bölgenin zengin kültürel mirasını ve dini çeşitliliğini anlatan antik manastırlar, kiliseler ve tarihi yerleri keşfedin."}',
     2, true),
    (culture_id, 'local-handicrafts', 
     '{"en": "Local Handicrafts", "tr": "Yerel El Sanatları"}',
     '{"en": "Discover traditional crafts including weaving, pottery, and woodworking. Learn about the techniques passed down through generations and support local artisans.", "tr": "Dokumacılık, çömlekçilik ve ahşap işçiliği dahil geleneksel el sanatlarını keşfedin. Nesiller boyunca aktarılan teknikleri öğrenin ve yerel zanaatkarları destekleyin."}',
     3, true),
    (culture_id, 'village-life', 
     '{"en": "Authentic Village Life", "tr": "Otantik Köy Yaşamı"}',
     '{"en": "Experience authentic village life by staying with local families, participating in daily activities, and learning about traditional customs and practices.", "tr": "Yerel ailelerle kalarak, günlük aktivitelere katılarak ve geleneksel gelenekleri ve uygulamaları öğrenerek otantik köy yaşamını deneyimleyin."}',
     4, true);

    -- Insert Gastronomy & Local Flavours subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (gastronomy_id, 'fresh-seafood', 
     '{"en": "Fresh Seafood", "tr": "Taze Deniz Ürünleri"}',
     '{"en": "Savor the freshest mountain trout and Black Sea seafood prepared with traditional methods. Experience the unique flavors of the region''s aquatic bounty.", "tr": "Geleneksel yöntemlerle hazırlanan en taze dağ alabalığı ve Karadeniz deniz ürünlerinin tadını çıkarın. Bölgenin sucul zenginliğinin benzersiz lezzetlerini deneyimleyin."}',
     1, true),
    (gastronomy_id, 'traditional-bread', 
     '{"en": "Traditional Bread & Cheese", "tr": "Geleneksel Ekmek & Peynir"}',
     '{"en": "Taste authentic corn bread and local cheeses made using age-old recipes. Learn about the traditional bread-making process and cheese production methods.", "tr": "Asırlık tariflerle yapılan otantik mısır ekmeği ve yerel peynirlerin tadını çıkarın. Geleneksel ekmek yapım süreci ve peynir üretim yöntemleri hakkında bilgi edinin."}',
     2, true),
    (gastronomy_id, 'mountain-herbs', 
     '{"en": "Mountain Herbs & Honey", "tr": "Dağ Otları & Bal"}',
     '{"en": "Discover organic honey and medicinal mountain herbs used in traditional cooking and healing practices. Experience the natural flavors of the highlands.", "tr": "Geleneksel yemek pişirme ve şifa uygulamalarında kullanılan organik bal ve şifalı dağ otlarını keşfedin. Yaylaların doğal lezzetlerini deneyimleyin."}',
     3, true),
    (gastronomy_id, 'tea-ceremonies', 
     '{"en": "Tea Ceremonies", "tr": "Çay Seremonileri"}',
     '{"en": "Participate in traditional tea ceremonies and learn about the cultural significance of tea in the region. Taste locally grown tea varieties.", "tr": "Geleneksel çay seremonilerine katılın ve çayın bölgedeki kültürel önemini öğrenin. Yerel olarak yetiştirilen çay çeşitlerinin tadını çıkarın."}',
     4, true);

    -- Insert Music & Dance subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (music_dance_id, 'traditional-instruments', 
     '{"en": "Traditional Instruments", "tr": "Geleneksel Çalgılar"}',
     '{"en": "Listen to the soulful sounds of tulum and kemençe, traditional instruments that capture the spirit of the Black Sea region. Learn about their history and craftsmanship.", "tr": "Karadeniz bölgesinin ruhunu yakalayan geleneksel çalgılar tulum ve kemençenin ruhani seslerini dinleyin. Tarihleri ve zanaatkarlıkları hakkında bilgi edinin."}',
     1, true),
    (music_dance_id, 'horon-dance', 
     '{"en": "Horon Dance", "tr": "Horon Dansı"}',
     '{"en": "Experience the energetic horon dance, a traditional circle dance that embodies the region''s spirit. Learn the steps and join in the celebration.", "tr": "Bölgenin ruhunu yansıtan geleneksel halka dansı horon dansının enerjik deneyimini yaşayın. Adımları öğrenin ve kutlamaya katılın."}',
     2, true),
    (music_dance_id, 'festival-traditions', 
     '{"en": "Festival Traditions", "tr": "Festival Gelenekleri"}',
     '{"en": "Join vibrant festivals and celebrations where music and dance bring communities together. Experience the joy and unity of traditional gatherings.", "tr": "Müzik ve dansın toplulukları bir araya getirdiği canlı festivaller ve kutlamalara katılın. Geleneksel toplantıların neşesini ve birliğini deneyimleyin."}',
     3, true);

    -- Insert Sustainable Tourism subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (sustainable_id, 'eco-friendly-accommodation', 
     '{"en": "Eco-Friendly Accommodation", "tr": "Çevre Dostu Konaklama"}',
     '{"en": "Stay in environmentally conscious accommodations that minimize impact on the natural environment while providing comfort and authentic experiences.", "tr": "Doğal çevreye etkisini minimize ederken konfor ve otantik deneyimler sunan çevre bilincine sahip konaklama yerlerinde kalın."}',
     1, true),
    (sustainable_id, 'local-producer-support', 
     '{"en": "Local Producer Support", "tr": "Yerel Üretici Desteği"}',
     '{"en": "Support local communities by purchasing directly from producers, staying in family-run accommodations, and participating in community-based tourism initiatives.", "tr": "Üreticilerden doğrudan satın alarak, aile işletmesi konaklama yerlerinde kalarak ve topluluk temelli turizm girişimlerine katılarak yerel toplulukları destekleyin."}',
     2, true),
    (sustainable_id, 'conservation-projects', 
     '{"en": "Conservation Projects", "tr": "Koruma Projeleri"}',
     '{"en": "Learn about and participate in conservation efforts that protect the region''s natural heritage for future generations. Contribute to sustainable tourism practices.", "tr": "Bölgenin doğal mirasını gelecek nesiller için koruyan koruma çalışmaları hakkında bilgi edinin ve bunlara katılın. Sürdürülebilir turizm uygulamalarına katkıda bulunun."}',
     3, true);

    -- Insert Health & Wellness subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (health_id, 'yoga-meditation', 
     '{"en": "Yoga & Meditation", "tr": "Yoga & Meditasyon"}',
     '{"en": "Practice yoga and meditation in the pristine mountain air of the Kaçkar highlands. Find inner peace surrounded by natural beauty and tranquility.", "tr": "Kaçkar yaylalarının temiz dağ havasında yoga ve meditasyon yapın. Doğal güzellik ve huzurla çevrili iç huzuru bulun."}',
     1, true),
    (health_id, 'thermal-springs', 
     '{"en": "Thermal Springs", "tr": "Kaplıcalar"}',
     '{"en": "Relax and rejuvenate in the natural thermal springs at Ayder. Experience the healing properties of mineral-rich waters in a stunning mountain setting.", "tr": "Ayder''daki doğal kaplıcalarda rahatlayın ve yenilenin. Muhteşem dağ ortamında mineral açısından zengin suların şifa verici özelliklerini deneyimleyin."}',
     2, true),
    (health_id, 'breathing-therapy', 
     '{"en": "Breathing Therapy", "tr": "Nefes Terapisi"}',
     '{"en": "Participate in breathing therapy sessions and wellness retreats designed to restore balance and vitality in the pure mountain environment.", "tr": "Saf dağ ortamında denge ve canlılığı geri kazandırmak için tasarlanmış nefes terapisi seansları ve wellness tatillerine katılın."}',
     3, true);

    -- Insert Photography & Art subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (photography_id, 'seasonal-photography', 
     '{"en": "Seasonal Photography Routes", "tr": "Mevsimsel Fotoğraf Rotaları"}',
     '{"en": "Each season offers unique photographic opportunities in Kaçkar. Spring brings wildflowers, summer offers clear mountain views, autumn provides colorful foliage, and winter creates dramatic snowscapes.", "tr": "Kaçkar''da her mevsim benzersiz fotoğraf fırsatları sunar. İlkbahar yabani çiçekler, yaz berrak dağ manzaraları, sonbahar renkli yapraklar, kış ise dramatik kar manzaraları getirir."}',
     1, true),
    (photography_id, 'artist-workshops', 
     '{"en": "Artist Workshops", "tr": "Sanatçı Atölyeleri"}',
     '{"en": "Join artist workshops and open-air exhibitions that celebrate the natural beauty of Kaçkar. Learn from local and visiting artists in inspiring mountain settings.", "tr": "Kaçkar''ın doğal güzelliğini kutlayan sanatçı atölyeleri ve açık hava sergilerine katılın. İlham verici dağ ortamlarında yerel ve misafir sanatçılardan öğrenin."}',
     2, true),
    (photography_id, 'nature-inspired-art', 
     '{"en": "Nature-Inspired Art", "tr": "Doğadan İlham Alan Sanat"}',
     '{"en": "Explore how the changing light and seasons of Kaçkar inspire artistic expression. Discover the creative side of this magnificent landscape through various art forms.", "tr": "Kaçkar''ın değişen ışığı ve mevsimlerinin sanatsal ifadeyi nasıl ilham verdiğini keşfedin. Bu muhteşem manzaranın yaratıcı yanını çeşitli sanat formları aracılığıyla keşfedin."}',
     3, true);

    -- Insert Educational & Research Tourism subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (educational_id, 'biology-botany', 
     '{"en": "Biology & Botany Tours", "tr": "Biyoloji & Botanik Turları"}',
     '{"en": "Join guided tours focused on the region''s unique flora and fauna. Learn about endemic species and the delicate ecosystems of the Kaçkar Mountains.", "tr": "Bölgenin benzersiz flora ve faunasına odaklanan rehberli turlara katılın. Endemik türler ve Kaçkar Dağları''nın hassas ekosistemleri hakkında bilgi edinin."}',
     1, true),
    (educational_id, 'birdwatching', 
     '{"en": "Birdwatching Expeditions", "tr": "Kuş Gözlemi Keşif Gezileri"}',
     '{"en": "Observe diverse bird species in their natural habitat. The Kaçkar region is a paradise for birdwatchers with its unique avian diversity and migration routes.", "tr": "Çeşitli kuş türlerini doğal habitatlarında gözlemleyin. Kaçkar bölgesi benzersiz kuş çeşitliliği ve göç yollarıyla kuş gözlemcileri için bir cennettir."}',
     2, true),
    (educational_id, 'geology-research', 
     '{"en": "Geology & Glacier Research", "tr": "Jeoloji & Buzul Araştırması"}',
     '{"en": "Study the geological formations and glacial lakes that make Kaçkar unique. Learn about the region''s geological history and ongoing research projects.", "tr": "Kaçkar''ı benzersiz kılan jeolojik oluşumları ve buzul göllerini inceleyin. Bölgenin jeolojik tarihi ve devam eden araştırma projeleri hakkında bilgi edinin."}',
     3, true);

    -- Insert Events & Festivals subcategories
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (events_id, 'highland-festivals', 
     '{"en": "Highland Festivals", "tr": "Yayla Şenlikleri"}',
     '{"en": "Experience the vibrant highland festivals that celebrate the region''s culture and traditions. Join in the festivities with music, dance, and local delicacies.", "tr": "Bölgenin kültürünü ve geleneklerini kutlayan canlı yayla şenliklerini deneyimleyin. Müzik, dans ve yerel lezzetlerle kutlamalara katılın."}',
     1, true),
    (events_id, 'tea-harvest-festival', 
     '{"en": "Tea Harvest Festival", "tr": "Çay Hasadı Festivali"}',
     '{"en": "Celebrate the annual tea harvest with traditional ceremonies and local festivities. Learn about tea cultivation and participate in harvest activities.", "tr": "Geleneksel seremoniler ve yerel kutlamalarla yıllık çay hasadını kutlayın. Çay yetiştiriciliği hakkında bilgi edinin ve hasat aktivitelerine katılın."}',
     2, true),
    (events_id, 'cultural-celebrations', 
     '{"en": "Cultural Celebrations", "tr": "Kültürel Kutlamalar"}',
     '{"en": "Join various cultural celebrations throughout the year that showcase the region''s rich heritage. Experience traditional music, dance, and local customs.", "tr": "Bölgenin zengin mirasını sergileyen yıl boyunca çeşitli kültürel kutlamalara katılın. Geleneksel müzik, dans ve yerel gelenekleri deneyimleyin."}',
     3, true);

END $$;
