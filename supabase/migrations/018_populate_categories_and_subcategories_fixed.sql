-- Update existing categories to match the 9 main categories from categories.md
-- Using separate UPDATE statements to avoid CASE statement issues with JSON

-- Update Nature category (slug: nature) - English
UPDATE public.categories SET 
  name = 'Nature & Adventure',
  description = 'Discover the pure power of nature on trails rising from valleys to Kaçkar''s peaks.',
  content = '{"header": "Discover the Untamed Beauty of Kaçkar Mountains", "bullets": ["Over 50 pristine alpine lakes", "3,937m highest peak - Kaçkar Dağı", "Endemic flora and fauna", "Ancient forests and meadows", "Crystal clear mountain streams"], "body": "The Kaçkar Mountains offer an unparalleled natural experience with their pristine wilderness, glacial lakes, and diverse ecosystems. From the highest peak at 3,937 meters to the crystal-clear alpine lakes, every corner of this region tells a story of natural wonder."}',
  icon_name = 'Leaf',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 1
WHERE slug = 'nature' AND locale = 'en';

-- Update Nature category (slug: nature) - Turkish
UPDATE public.categories SET 
  name = 'Doğa & Macera',
  description = 'Kaçkar''ın vadilerinden zirvelerine uzanan patikalarda doğanın saf gücünü keşfedin.',
  content = '{"header": "Kaçkar Dağları''nın Vahşi Güzelliğini Keşfedin", "bullets": ["50''den fazla pristine alpine göl", "3,937m en yüksek zirve - Kaçkar Dağı", "Endemik flora ve fauna", "Antik ormanlar ve çayırlar", "Kristal berraklığında dağ dereleri"], "body": "Kaçkar Dağları, pristine vahşi doğası, buzul gölleri ve çeşitli ekosistemleri ile eşsiz bir doğa deneyimi sunar. 3,937 metre yüksekliğindeki en yüksek zirveden kristal berraklığındaki alpine göllere kadar, bu bölgenin her köşesi doğal harikaların hikayesini anlatır."}',
  icon_name = 'Leaf',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 1
WHERE slug = 'nature' AND locale = 'tr';

-- Update Culture category (slug: culture) - English
UPDATE public.categories SET 
  name = 'Culture & Local Life',
  description = 'Witness the heartfelt stories of highlands, mansions and timeless traditions.',
  content = '{"header": "Immerse Yourself in Ancient Traditions", "bullets": ["Traditional Laz and Hemshin communities", "Ancient monasteries and churches", "Local handicrafts and textiles", "Traditional music and dance", "Authentic village life"], "body": "The Kaçkar region is a cultural treasure trove where ancient traditions have been preserved for centuries. The local Laz and Hemshin communities maintain their unique customs, language, and way of life."}',
  icon_name = 'Users',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 2
WHERE slug = 'culture' AND locale = 'en';

-- Update Culture category (slug: culture) - Turkish
UPDATE public.categories SET 
  name = 'Kültür & Yerel Hayat',
  description = 'Yaylaların, konakların ve köklü geleneklerin içten hikâyesine tanık olun.',
  content = '{"header": "Antik Geleneklerin İçine Dalın", "bullets": ["Geleneksel Laz ve Hemşin toplulukları", "Antik manastırlar ve kiliseler", "Yerel el sanatları ve tekstiller", "Geleneksel müzik ve dans", "Otantik köy yaşamı"], "body": "Kaçkar bölgesi, antik geleneklerin yüzyıllardır korunduğu kültürel bir hazine sandığıdır. Yerel Laz ve Hemşin toplulukları, benzersiz geleneklerini, dillerini ve yaşam tarzlarını sürdürürler."}',
  icon_name = 'Users',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 2
WHERE slug = 'culture' AND locale = 'tr';

-- Update Gastronomy category (slug: gastronomy) - English
UPDATE public.categories SET 
  name = 'Gastronomy & Local Flavours',
  description = 'Taste Kaçkar through its GI products and unforgettable local flavours.',
  content = '{"header": "Savor the Authentic Flavors of Black Sea Cuisine", "bullets": ["Fresh mountain trout and seafood", "Traditional corn bread and local cheeses", "Organic honey and mountain herbs", "Traditional tea ceremonies", "Local wine and spirits"], "body": "The culinary traditions of the Kaçkar region reflect the unique blend of mountain and coastal influences. Fresh ingredients from the mountains and the Black Sea create a distinctive cuisine that has been perfected over generations."}',
  icon_name = 'ForkKnife',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 3
WHERE slug = 'gastronomy' AND locale = 'en';

-- Update Gastronomy category (slug: gastronomy) - Turkish
UPDATE public.categories SET 
  name = 'Gastronomi & Yerel Lezzetler',
  description = 'Coğrafi işaretli ürünler ve unutulmaz lezzetlerle Kaçkar''ın tadına varın.',
  content = '{"header": "Karadeniz Mutfağının Otantik Lezzetlerini Tadın", "bullets": ["Taze dağ alabalığı ve deniz ürünleri", "Geleneksel mısır ekmeği ve yerel peynirler", "Organik bal ve dağ otları", "Geleneksel çay seremonileri", "Yerel şarap ve içkiler"], "body": "Kaçkar bölgesinin mutfak gelenekleri, dağ ve kıyı etkilerinin benzersiz karışımını yansıtır. Dağlardan ve Karadeniz''den taze malzemeler, nesiller boyunca mükemmelleştirilmiş ayırt edici bir mutfak yaratır."}',
  icon_name = 'ForkKnife',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 3
WHERE slug = 'gastronomy' AND locale = 'tr';

-- Update Adventure category (slug: adventure) - English
UPDATE public.categories SET 
  name = 'Adventure',
  description = 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities',
  content = '{"header": "Embark on Epic Mountain Adventures", "bullets": ["Multi-day trekking routes", "Mountaineering to 3,937m peak", "Highland camping experiences", "Rock climbing and bouldering", "Photography expeditions"], "body": "For adventure seekers, the Kaçkar Mountains offer some of Turkey''s most challenging and rewarding outdoor experiences. From multi-day trekking routes through pristine wilderness to mountaineering expeditions to the highest peaks."}',
  icon_name = 'Mountains',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 4
WHERE slug = 'adventure' AND locale = 'en';

-- Update Adventure category (slug: adventure) - Turkish
UPDATE public.categories SET 
  name = 'Macera',
  description = 'Trekking, dağcılık, yayla turları, kamp deneyimleri ve adrenalin dolu aktiviteler',
  content = '{"header": "Epik Dağ Maceralarına Çıkın", "bullets": ["Çok günlük trekking rotaları", "3,937m zirveye dağcılık", "Yayla kamp deneyimleri", "Kaya tırmanışı ve bouldering", "Fotoğraf keşif gezileri"], "body": "Macera arayanlar için Kaçkar Dağları, Türkiye''nin en zorlu ve ödüllendirici açık hava deneyimlerinden bazılarını sunar. Pristine vahşi doğada çok günlük trekking rotalarından en yüksek zirvelere dağcılık keşif gezilerine kadar."}',
  icon_name = 'Mountains',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 4
WHERE slug = 'adventure' AND locale = 'tr';

-- Update Accommodation category (slug: accommodation) - English
UPDATE public.categories SET 
  name = 'Accommodation',
  description = 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options',
  content = '{"header": "Stay in Authentic Mountain Accommodations", "bullets": ["Traditional highland houses", "Cozy guesthouses with local charm", "Mountain camping sites", "Eco-friendly lodges", "Homestay experiences"], "body": "Experience authentic mountain hospitality in traditional accommodations that blend comfort with local culture. From cozy guesthouses in mountain villages to traditional highland houses, each accommodation offers a unique perspective on local life."}',
  icon_name = 'House',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 5
WHERE slug = 'accommodation' AND locale = 'en';

-- Update Accommodation category (slug: accommodation) - Turkish
UPDATE public.categories SET 
  name = 'Konaklama',
  description = 'Geleneksel ev pansiyonları, yayla evleri, kamp alanları ve konforlu konaklama seçenekleri',
  content = '{"header": "Otantik Dağ Konaklamalarında Kalın", "bullets": ["Geleneksel yayla evleri", "Yerel cazibeli şirin pansiyonlar", "Dağ kamp alanları", "Çevre dostu kulübeler", "Ev sahipliği deneyimleri"], "body": "Geleneksel konaklamalarda otantik dağ misafirperverliğini deneyimleyin; konforu yerel kültürle harmanlar. Dağ köylerindeki şirin pansiyonlardan geleneksel yayla evlerine kadar, her konaklama yerel yaşama benzersiz bir bakış açısı sunar."}',
  icon_name = 'House',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 5
WHERE slug = 'accommodation' AND locale = 'tr';

-- Update Transportation category (slug: transportation) - English
UPDATE public.categories SET 
  name = 'Transportation',
  description = 'How to reach Kaçkar, local transportation, transfer services and practical information',
  content = '{"header": "Plan Your Journey to the Mountains", "bullets": ["Direct flights to Trabzon and Rize", "Scenic road routes from major cities", "Local bus and minibus services", "Private transfer options", "Mountain road accessibility"], "body": "Reaching the Kaçkar Mountains is easier than you might think, with multiple transportation options available. The region is well-connected by air, with direct flights to Trabzon and Rize airports."}',
  icon_name = 'Car',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 6
WHERE slug = 'transportation' AND locale = 'en';

-- Update Transportation category (slug: transportation) - Turkish
UPDATE public.categories SET 
  name = 'Ulaşım',
  description = 'Kaçkar''a nasıl ulaşılır, yerel ulaşım, transfer hizmetleri ve pratik bilgiler',
  content = '{"header": "Dağlara Yolculuğunuzu Planlayın", "bullets": ["Trabzon ve Rize''ye direkt uçuşlar", "Büyük şehirlerden manzaralı karayolu rotaları", "Yerel otobüs ve minibüs hizmetleri", "Özel transfer seçenekleri", "Dağ yolu erişilebilirliği"], "body": "Kaçkar Dağları''na ulaşmak düşündüğünüzden daha kolaydır, birden fazla ulaşım seçeneği mevcuttur. Bölge havayolu ile iyi bağlantılıdır, Trabzon ve Rize havaalanlarına direkt uçuşlar vardır."}',
  icon_name = 'Car',
  color_theme = 'from-[#0E4542] to-[#0E4542]',
  sort_order = 6
WHERE slug = 'transportation' AND locale = 'tr';

-- Insert new categories for the remaining 3 categories
INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
-- Music & Dance
('music-dance', 'en', 'Music & Dance', 'Feel the Black Sea''s spirit with the tulum''s sound and horon''s rhythm.', '{"header": "Feel the Black Sea''s Spirit", "bullets": ["Traditional tulum and kemençe performances", "Various horon dance styles", "Instrument making workshops", "Festival and wedding traditions", "Cultural music experiences"], "body": "The soul of the Black Sea lives in the vibrant tunes of tulum and kemençe. Horon dance chains embody the region''s energy from weddings to highland festivals."}', 'MusicNote', 'from-[#0E4542] to-[#0E4542]', 7, true),
('music-dance', 'tr', 'Müzik & Dans', 'Tulumun sesi ve horonun ritmiyle Karadeniz''in ruhunu hissedin.', '{"header": "Karadeniz''in Ruhunu Hissedin", "bullets": ["Geleneksel tulum ve kemençe dinletileri", "Çeşitli horon dans türleri", "Çalgı yapımı atölyeleri", "Şenlik ve düğün gelenekleri", "Kültürel müzik deneyimleri"], "body": "Karadeniz''in ruhu, tulum ve kemençenin coşkulu ezgilerinde hayat bulur. Horon zincirleri, düğünlerden yayla şenliklerine kadar bölgenin enerjisini yansıtır."}', 'MusicNote', 'from-[#0E4542] to-[#0E4542]', 7, true),

-- Sustainable Tourism
('sustainable-tourism', 'en', 'Sustainable Tourism', 'A journey of discovery that respects nature and supports local life.', '{"header": "Respectful and Sustainable Exploration", "bullets": ["Leave no trace principles", "Local producer support", "Eco-friendly accommodation", "Eco-tourism routes", "Nature conservation projects"], "body": "Explore Kaçkar in a way that preserves its natural beauty for future generations. Our sustainable tourism approach ensures that your visit benefits local communities while protecting the environment."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 8, true),
('sustainable-tourism', 'tr', 'Sürdürülebilir Turizm', 'Doğaya saygılı, yerel halka faydalı bir keşif yolculuğu.', '{"header": "Saygılı ve Sürdürülebilir Keşif", "bullets": ["İz bırakmama ilkeleri", "Yerel üretici desteği", "Çevre dostu konaklama", "Eko-turizm rotaları", "Doğa koruma projeleri"], "body": "Kaçkar''ı gelecek nesiller için doğal güzelliğini koruyacak şekilde keşfedin. Sürdürülebilir turizm yaklaşımımız, ziyaretinizin çevreyi korurken yerel topluluklara fayda sağlamasını garanti eder."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 8, true),

-- Health & Wellness
('health-wellness', 'en', 'Health & Wellness', 'Refresh your body and soul in the clear air of the highlands.', '{"header": "Rejuvenate in Nature''s Embrace", "bullets": ["Yoga and meditation in highlands", "Breathing therapy camps", "Natural healing workshops", "Thermal springs at Ayder", "Wellness retreats"], "body": "The pristine air and natural beauty of the Kaçkar highlands provide the perfect setting for wellness and healing. Experience traditional and modern wellness practices in harmony with nature."}', 'Heart', 'from-[#0E4542] to-[#0E4542]', 9, true),
('health-wellness', 'tr', 'Sağlık & Wellness', 'Yaylaların temiz havasında ruhunuzu ve bedeninizi yenileyin.', '{"header": "Doğanın Kucağında Yenilenin", "bullets": ["Yaylalarda yoga ve meditasyon", "Nefes terapisi kampları", "Doğal şifa atölyeleri", "Ayder kaplıcaları", "Wellness tatilleri"], "body": "Kaçkar yaylalarının temiz havası ve doğal güzelliği, wellness ve şifa için mükemmel bir ortam sağlar. Doğayla uyum içinde geleneksel ve modern wellness uygulamalarını deneyimleyin."}', 'Heart', 'from-[#0E4542] to-[#0E4542]', 9, true)
ON CONFLICT (slug, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  color_theme = EXCLUDED.color_theme,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
