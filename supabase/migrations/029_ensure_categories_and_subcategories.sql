-- Ensure categories exist and add subcategories for Adventure, Accommodation, and Transportation
-- This migration handles the case where categories might not exist yet

DO $$
DECLARE
    adventure_id UUID;
    accommodation_id UUID;
    transportation_id UUID;
BEGIN
    -- First, ensure the categories exist by inserting them if they don't
    -- Adventure category
    INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
    ('adventure', 'en', 'Adventure', 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities', '{"header": "Embark on Epic Mountain Adventures", "bullets": ["Multi-day trekking routes", "Mountaineering to 3,937m peak", "Highland camping experiences", "Rock climbing and bouldering", "Photography expeditions"], "body": "For adventure seekers, the Kaçkar Mountains offer some of Turkey''s most challenging and rewarding outdoor experiences. From multi-day trekking routes through pristine wilderness to mountaineering expeditions to the highest peaks, the region provides endless opportunities for adrenaline-fueled adventures. Whether you''re a seasoned mountaineer or a beginner hiker, there''s an adventure waiting for you."}', 'Mountains', 'from-[#0E4542] to-[#0E4542]', 4, true)
    ON CONFLICT (slug, locale) DO NOTHING;
    
    -- Accommodation category
    INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
    ('accommodation', 'en', 'Accommodation', 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options', '{"header": "Stay in Authentic Mountain Accommodations", "bullets": ["Traditional highland houses", "Cozy guesthouses with local charm", "Mountain camping sites", "Eco-friendly lodges", "Homestay experiences"], "body": "Experience authentic mountain hospitality in traditional accommodations that blend comfort with local culture. From cozy guesthouses in mountain villages to traditional highland houses, each accommodation offers a unique perspective on local life. Many places provide homestay experiences where you can learn about local traditions and enjoy home-cooked meals prepared with fresh, local ingredients."}', 'House', 'from-[#0E4542] to-[#0E4542]', 5, true)
    ON CONFLICT (slug, locale) DO NOTHING;
    
    -- Transportation category
    INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
    ('transportation', 'en', 'Transportation', 'How to reach Kaçkar, local transportation, transfer services and practical information', '{"header": "Plan Your Journey to the Mountains", "bullets": ["Direct flights to Trabzon and Rize", "Scenic road routes from major cities", "Local bus and minibus services", "Private transfer options", "Mountain road accessibility"], "body": "Reaching the Kaçkar Mountains is easier than you might think, with multiple transportation options available. The region is well-connected by air, with direct flights to Trabzon and Rize airports. From there, scenic road routes wind through the mountains, offering breathtaking views along the way. Local transportation services provide convenient access to even the most remote mountain villages."}', 'Car', 'from-[#0E4542] to-[#0E4542]', 6, true)
    ON CONFLICT (slug, locale) DO NOTHING;

    -- Now get the category IDs
    SELECT id INTO adventure_id FROM public.categories WHERE slug = 'adventure' AND locale = 'en';
    SELECT id INTO accommodation_id FROM public.categories WHERE slug = 'accommodation' AND locale = 'en';
    SELECT id INTO transportation_id FROM public.categories WHERE slug = 'transportation' AND locale = 'en';

    -- Insert Adventure subcategories (only if they don't exist)
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (adventure_id, 'hiking-trekking', 
     '{"en": "Hiking & Trekking", "tr": "Yürüyüş & Trekking"}',
     '{"en": "Hiking in the Kaçkar Mountains is not just a sport but joining the rhythm of clouds and valleys. From forest trails to glacial lakes, you may vanish into mist only to find yourself walking above the clouds. Each path reveals endemic plants, waterfalls and centuries-old stone bridges.", "tr": "Kaçkar Dağları''nda yürüyüş, sadece bir spor değil, bulutların ve vadilerin ritmine katılmaktır. Orman içi patikalardan buzul göllerine uzanan rotalarda sisin içinde kaybolup bir anda bulutların üzerinde yürümek mümkündür. Her parkurda endemik bitkiler, şelaleler ve taş köprüler yolunuza eşlik eder."}',
     1, true),
    (adventure_id, 'trail-running', 
     '{"en": "Trail Running (Kaçkar by UTMB®)", "tr": "Koşu Rotaları (Kaçkar by UTMB®)"}',
     '{"en": "Kaçkar''s trails form a natural stage for endurance running. Climbing from valleys to high plateaus, you encounter village life on one side and mountain silence on the other. The journey from misty passes to sunlit peaks transforms a run into an unforgettable experience.", "tr": "Kaçkar''ın patikaları, dayanıklılık koşularına meydan okuyan doğal bir sahnedir. Vadilerden geçip yaylalara uzanan bu rotalarda yükselirken, bir yanda köy yaşamı diğer yanda dağların sessizliği size eşlik eder. Sisle kaplı geçitlerden güneşli zirvelere uzanan yolculuk, koşuyu unutulmaz bir deneyime dönüştürür."}',
     2, true),
    (adventure_id, 'cycling-mtb', 
     '{"en": "Cycling & MTB", "tr": "Bisiklet & MTB"}',
     '{"en": "Roads climbing from valleys to highlands offer unique challenges for both road and mountain bikers. Routes starting in the Çağlayan and Fırtına valleys pass through dense forests and open plateaus, each with varying levels of difficulty. Every ascent opens a new view over the Black Sea''s sea of clouds.", "tr": "Vadilerden yaylalara yükselen yollar, hem yol bisikleti hem de dağ bisikleti için eşsiz seçenekler sunar. Çağlayan ve Fırtına vadilerinden başlayan rotalar, sık ormanlar ve açık yayla düzlükleriyle farklı zorluk derecelerine sahiptir. Her tırmanışta Karadeniz''in sis denizine doğru yeni bir manzara açılır."}',
     3, true),
    (adventure_id, 'water-sports', 
     '{"en": "Water Sports (Rafting & Canoeing)", "tr": "Su Sporları (Rafting & Kano)"}',
     '{"en": "The Fırtına River, with its powerful currents, is one of Turkey''s finest spots for rafting and canoeing. The natural course offers short sections for beginners and challenging stretches for experienced paddlers. With each stroke you feel the force of nature more vividly.", "tr": "Fırtına Deresi, coşkulu akıntılarıyla rafting ve kano için Türkiye''nin en özel noktalarından biridir. Doğal parkur, hem yeni başlayanlara uygun kısa etaplar hem de deneyimli sporculara meydan okuyan zorlu bölümler sunar. Her kürek darbesiyle doğanın gücü daha yakından hissedilir."}',
     4, true),
    (adventure_id, 'winter-activities', 
     '{"en": "Winter Activities", "tr": "Kış Aktiviteleri"}',
     '{"en": "In winter, Kaçkar turns into a white silence. Snow trekking routes lead through pine forests to glacial valleys. Around Ayder and Kavrun, heliskiing has become a world-class attraction.", "tr": "Kışın Kaçkar, bembeyaz bir sessizliğe bürünür. Kar yürüyüşleri için ideal rotalar, çam ormanlarının arasından buzul vadilerine çıkar. Ayder ve Kavrun çevresi, heliski tutkunları için dünya ölçeğinde bir cazibe merkezidir."}',
     5, true),
    (adventure_id, 'adventure-sports', 
     '{"en": "Adventure Sports", "tr": "Macera Sporları"}',
     '{"en": "For adrenaline seekers, Kaçkar offers paragliding, ziplining, rock climbing and canyoning. Each activity provides a new perspective on the wild beauty of the mountains.", "tr": "Adrenalin tutkunları için Kaçkar, yamaç paraşütünden zipline''a, kaya tırmanışından canyoning''e kadar farklı seçenekler sunar. Her aktivite, dağların vahşi doğasını farklı bir açıdan tanıma fırsatı verir."}',
     6, true)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert Accommodation subcategories (only if they don't exist)
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (accommodation_id, 'traditional-guesthouses', 
     '{"en": "Traditional Guesthouses", "tr": "Geleneksel Ev Pansiyonları"}',
     '{"en": "Experience authentic mountain hospitality in traditional guesthouses that blend comfort with local culture. From cozy guesthouses in mountain villages to traditional highland houses, each accommodation offers a unique perspective on local life.", "tr": "Geleneksel ev pansiyonlarında otantik dağ misafirperverliğini deneyimleyin; konforu yerel kültürle harmanlar. Dağ köylerindeki şirin pansiyonlardan geleneksel yayla evlerine kadar, her konaklama yerel yaşama benzersiz bir bakış açısı sunar."}',
     1, true),
    (accommodation_id, 'highland-houses', 
     '{"en": "Highland Houses", "tr": "Yayla Evleri"}',
     '{"en": "Stay in traditional highland houses that offer a unique mountain experience. These accommodations provide direct access to the natural beauty of the Kaçkar region while maintaining traditional architectural elements.", "tr": "Benzersiz dağ deneyimi sunan geleneksel yayla evlerinde kalın. Bu konaklamalar, geleneksel mimari unsurları korurken Kaçkar bölgesinin doğal güzelliğine doğrudan erişim sağlar."}',
     2, true),
    (accommodation_id, 'mountain-camping', 
     '{"en": "Mountain Camping", "tr": "Dağ Kampı"}',
     '{"en": "Experience the wilderness with mountain camping sites that offer direct access to nature. Camp under the stars in designated areas that provide safety while maintaining the authentic outdoor experience.", "tr": "Doğaya doğrudan erişim sunan dağ kamp alanlarıyla vahşi doğayı deneyimleyin. Güvenlik sağlarken otantik açık hava deneyimini koruyan belirlenmiş alanlarda yıldızların altında kamp yapın."}',
     3, true),
    (accommodation_id, 'eco-lodges', 
     '{"en": "Eco-Friendly Lodges", "tr": "Çevre Dostu Kulübeler"}',
     '{"en": "Stay in environmentally conscious lodges that minimize impact on the natural environment while providing comfort and authentic experiences. These accommodations are designed to blend seamlessly with the surrounding nature.", "tr": "Doğal çevreye etkisini minimize ederken konfor ve otantik deneyimler sunan çevre bilincine sahip kulübelerde kalın. Bu konaklamalar çevredeki doğayla sorunsuz bir şekilde harmanlanacak şekilde tasarlanmıştır."}',
     4, true),
    (accommodation_id, 'homestay-experiences', 
     '{"en": "Homestay Experiences", "tr": "Ev Sahipliği Deneyimleri"}',
     '{"en": "Immerse yourself in local culture with homestay experiences where you can learn about local traditions and enjoy home-cooked meals prepared with fresh, local ingredients.", "tr": "Yerel gelenekler hakkında bilgi edinebileceğiniz ve taze, yerel malzemelerle hazırlanmış ev yapımı yemeklerin tadını çıkarabileceğiniz ev sahipliği deneyimleriyle yerel kültüre dalın."}',
     5, true)
    ON CONFLICT (category_id, slug) DO NOTHING;

    -- Insert Transportation subcategories (only if they don't exist)
    INSERT INTO public.subcategories (category_id, slug, title, body_text, sort_order, is_active) VALUES
    (transportation_id, 'flights-access', 
     '{"en": "Flights & Airport Access", "tr": "Uçuşlar & Havaalanı Erişimi"}',
     '{"en": "The region is well-connected by air, with direct flights to Trabzon and Rize airports. From there, scenic road routes wind through the mountains, offering breathtaking views along the way.", "tr": "Bölge havayolu ile iyi bağlantılıdır, Trabzon ve Rize havaalanlarına direkt uçuşlar vardır. Oradan, manzaralı karayolu rotaları dağların arasından geçer ve yol boyunca nefes kesici manzaralar sunar."}',
     1, true),
    (transportation_id, 'scenic-routes', 
     '{"en": "Scenic Road Routes", "tr": "Manzaralı Karayolu Rotaları"}',
     '{"en": "Scenic road routes from major cities wind through the mountains, offering breathtaking views along the way. These routes provide access to even the most remote mountain villages.", "tr": "Büyük şehirlerden manzaralı karayolu rotaları dağların arasından geçer ve yol boyunca nefes kesici manzaralar sunar. Bu rotalar en uzak dağ köylerine bile erişim sağlar."}',
     2, true),
    (transportation_id, 'local-transport', 
     '{"en": "Local Bus & Minibus Services", "tr": "Yerel Otobüs & Minibüs Hizmetleri"}',
     '{"en": "Local transportation services provide convenient access to even the most remote mountain villages. Regular bus and minibus services connect major towns with smaller villages throughout the region.", "tr": "Yerel ulaşım hizmetleri, en uzak dağ köylerine bile uygun erişim sağlar. Düzenli otobüs ve minibüs hizmetleri büyük kasabaları bölge genelindeki küçük köylerle bağlar."}',
     3, true),
    (transportation_id, 'private-transfers', 
     '{"en": "Private Transfer Options", "tr": "Özel Transfer Seçenekleri"}',
     '{"en": "Private transfer options provide comfortable and convenient transportation to your destination. These services offer flexibility and personalized service for your journey to the Kaçkar Mountains.", "tr": "Özel transfer seçenekleri hedefinize rahat ve uygun ulaşım sağlar. Bu hizmetler Kaçkar Dağları''na yolculuğunuz için esneklik ve kişiselleştirilmiş hizmet sunar."}',
     4, true),
    (transportation_id, 'mountain-road-access', 
     '{"en": "Mountain Road Accessibility", "tr": "Dağ Yolu Erişilebilirliği"}',
     '{"en": "Mountain roads provide access to various destinations throughout the Kaçkar region. While some routes may be challenging, they offer access to the most beautiful and remote areas of the mountains.", "tr": "Dağ yolları Kaçkar bölgesi genelinde çeşitli destinasyonlara erişim sağlar. Bazı rotalar zorlu olabilir, ancak dağların en güzel ve uzak alanlarına erişim sunarlar."}',
     5, true)
    ON CONFLICT (category_id, slug) DO NOTHING;

END $$;
