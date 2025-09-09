-- Insert subcategories for each main category
-- This script populates subcategories based on the content from discover-kackar_full.md

-- Get category IDs for reference
DO $$
DECLARE
    nature_en_id UUID;
    nature_tr_id UUID;
    culture_en_id UUID;
    culture_tr_id UUID;
    gastronomy_en_id UUID;
    gastronomy_tr_id UUID;
    music_dance_en_id UUID;
    music_dance_tr_id UUID;
    sustainable_en_id UUID;
    sustainable_tr_id UUID;
    health_en_id UUID;
    health_tr_id UUID;
    photography_en_id UUID;
    photography_tr_id UUID;
    educational_en_id UUID;
    educational_tr_id UUID;
    events_en_id UUID;
    events_tr_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO nature_en_id FROM public.categories WHERE slug = 'nature' AND locale = 'en';
    SELECT id INTO nature_tr_id FROM public.categories WHERE slug = 'nature' AND locale = 'tr';
    SELECT id INTO culture_en_id FROM public.categories WHERE slug = 'culture' AND locale = 'en';
    SELECT id INTO culture_tr_id FROM public.categories WHERE slug = 'culture' AND locale = 'tr';
    SELECT id INTO gastronomy_en_id FROM public.categories WHERE slug = 'gastronomy' AND locale = 'en';
    SELECT id INTO gastronomy_tr_id FROM public.categories WHERE slug = 'gastronomy' AND locale = 'tr';
    SELECT id INTO music_dance_en_id FROM public.categories WHERE slug = 'music-dance' AND locale = 'en';
    SELECT id INTO music_dance_tr_id FROM public.categories WHERE slug = 'music-dance' AND locale = 'tr';
    SELECT id INTO sustainable_en_id FROM public.categories WHERE slug = 'sustainable-tourism' AND locale = 'en';
    SELECT id INTO sustainable_tr_id FROM public.categories WHERE slug = 'sustainable-tourism' AND locale = 'tr';
    SELECT id INTO health_en_id FROM public.categories WHERE slug = 'health-wellness' AND locale = 'en';
    SELECT id INTO health_tr_id FROM public.categories WHERE slug = 'health-wellness' AND locale = 'tr';
    SELECT id INTO photography_en_id FROM public.categories WHERE slug = 'photography-art' AND locale = 'en';
    SELECT id INTO photography_tr_id FROM public.categories WHERE slug = 'photography-art' AND locale = 'tr';
    SELECT id INTO educational_en_id FROM public.categories WHERE slug = 'educational-research' AND locale = 'en';
    SELECT id INTO educational_tr_id FROM public.categories WHERE slug = 'educational-research' AND locale = 'tr';
    SELECT id INTO events_en_id FROM public.categories WHERE slug = 'events-festivals' AND locale = 'en';
    SELECT id INTO events_tr_id FROM public.categories WHERE slug = 'events-festivals' AND locale = 'tr';

    -- Insert Nature & Adventure subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (nature_en_id, 'hiking-trekking', 'en', 'Hiking & Trekking', 'Hiking in the Kaçkar Mountains is not just a sport but joining the rhythm of clouds and valleys. From forest trails to glacial lakes, you may vanish into mist only to find yourself walking above the clouds. Each path reveals endemic plants, waterfalls and centuries-old stone bridges.', 1, true),
    (nature_tr_id, 'hiking-trekking', 'tr', 'Yürüyüş & Trekking', 'Kaçkar Dağları''nda yürüyüş, sadece bir spor değil, bulutların ve vadilerin ritmine katılmaktır. Orman içi patikalardan buzul göllerine uzanan rotalarda sisin içinde kaybolup bir anda bulutların üzerinde yürümek mümkündür. Her parkurda endemik bitkiler, şelaleler ve taş köprüler yolunuza eşlik eder.', 1, true),
    
    (nature_en_id, 'trail-running', 'en', 'Trail Running (Kaçkar by UTMB®)', 'Kaçkar''s trails form a natural stage for endurance running. Climbing from valleys to high plateaus, you encounter village life on one side and mountain silence on the other. The journey from misty passes to sunlit peaks transforms a run into an unforgettable experience.', 2, true),
    (nature_tr_id, 'trail-running', 'tr', 'Koşu Rotaları (Kaçkar by UTMB®)', 'Kaçkar''ın patikaları, dayanıklılık koşularına meydan okuyan doğal bir sahnedir. Vadilerden geçip yaylalara uzanan bu rotalarda yükselirken, bir yanda köy yaşamı diğer yanda dağların sessizliği size eşlik eder. Sisle kaplı geçitlerden güneşli zirvelere uzanan yolculuk, koşuyu unutulmaz bir deneyime dönüştürür.', 2, true),
    
    (nature_en_id, 'cycling-mtb', 'en', 'Cycling & MTB', 'Roads climbing from valleys to highlands offer unique challenges for both road and mountain bikers. Routes starting in the Çağlayan and Fırtına valleys pass through dense forests and open plateaus, each with varying levels of difficulty. Every ascent opens a new view over the Black Sea''s sea of clouds.', 3, true),
    (nature_tr_id, 'cycling-mtb', 'tr', 'Bisiklet & MTB', 'Vadilerden yaylalara yükselen yollar, hem yol bisikleti hem de dağ bisikleti için eşsiz seçenekler sunar. Çağlayan ve Fırtına vadilerinden başlayan rotalar, sık ormanlar ve açık yayla düzlükleriyle farklı zorluk derecelerine sahiptir. Her tırmanışta Karadeniz''in sis denizine doğru yeni bir manzara açılır.', 3, true),
    
    (nature_en_id, 'water-sports', 'en', 'Water Sports (Rafting & Canoeing)', 'The Fırtına River, with its powerful currents, is one of Turkey''s finest spots for rafting and canoeing. The natural course offers short sections for beginners and challenging stretches for experienced paddlers. With each stroke you feel the force of nature more vividly.', 4, true),
    (nature_tr_id, 'water-sports', 'tr', 'Su Sporları (Rafting & Kano)', 'Fırtına Deresi, coşkulu akıntılarıyla rafting ve kano için Türkiye''nin en özel noktalarından biridir. Doğal parkur, hem yeni başlayanlara uygun kısa etaplar hem de deneyimli sporculara meydan okuyan zorlu bölümler sunar. Her kürek darbesiyle doğanın gücü daha yakından hissedilir.', 4, true),
    
    (nature_en_id, 'winter-activities', 'en', 'Winter Activities', 'In winter, Kaçkar turns into a white silence. Snow trekking routes lead through pine forests to glacial valleys. Around Ayder and Kavrun, heliskiing has become a world-class attraction.', 5, true),
    (nature_tr_id, 'winter-activities', 'tr', 'Kış Aktiviteleri', 'Kışın Kaçkar, bembeyaz bir sessizliğe bürünür. Kar yürüyüşleri için ideal rotalar, çam ormanlarının arasından buzul vadilerine çıkar. Ayder ve Kavrun çevresi, heliski tutkunları için dünya ölçeğinde bir cazibe merkezidir.', 5, true),
    
    (nature_en_id, 'adventure-sports', 'en', 'Adventure Sports', 'For adrenaline seekers, Kaçkar offers paragliding, ziplining, rock climbing and canyoning. Each activity provides a new perspective on the wild beauty of the mountains.', 6, true),
    (nature_tr_id, 'adventure-sports', 'tr', 'Macera Sporları', 'Adrenalin tutkunları için Kaçkar, yamaç paraşütünden zipline''a, kaya tırmanışından canyoning''e kadar farklı seçenekler sunar. Her aktivite, dağların vahşi doğasını farklı bir açıdan tanıma fırsatı verir.', 6, true);

    -- Insert Culture & Local Life subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (culture_en_id, 'hemshin-culture', 'en', 'Hemshin Culture', 'Highland transhumance, timber and stone architecture, and the tulum define Hemshin culture. Even today, dairying, communal traditions and hospitality remain vivid in the plateaus.', 1, true),
    (culture_tr_id, 'hemshin-culture', 'tr', 'Hemşin Kültürü', 'Yaylacılık geleneği, ahşap/taş mimari ve tulum ezgileri Hemşin kimliğinin temel öğeleridir. Bugün dahi yaylalarda süt ürünleri üretimi, imece kültürü ve misafirperverlik canlı şekilde yaşatılır.', 1, true),
    
    (culture_en_id, 'laz-culture', 'en', 'Laz Culture', 'Laz language thrives with horon dances accompanied by tulum and kemençe. In Laz villages, music, dance and community ties shape daily life.', 2, true),
    (culture_tr_id, 'laz-culture', 'tr', 'Laz Kültürü', 'Laz dili, tulum ve kemençe eşliğinde hızlı horonlarla yaşar. Laz köylerinde müzik, dans ve topluluk bağları günlük hayatın bir parçasıdır.', 2, true),
    
    (culture_en_id, 'village-life', 'en', 'Village Life & Transhumance', 'Spring migration to the highlands and autumn return define local rhythm. Stone houses, wooden barns and collective production are parts of this cycle.', 3, true),
    (culture_tr_id, 'village-life', 'tr', 'Köy Yaşamı & Yaylacılık', 'İlkbaharda yaylaya göç, sonbaharda dönüş geleneksel yaşamın ritmini belirler. Taş evler, ahşap ambarlar ve ortaklaşa üretim bu döngünün parçalarıdır.', 3, true),
    
    (culture_en_id, 'historical-mansions', 'en', 'Historical Mansions & Families', 'Centuries-old mansions of stone and timber reflect family heritage and craftsmanship. Many of these mansions are preserved as cultural heritage.', 4, true),
    (culture_tr_id, 'historical-mansions', 'tr', 'Tarihi Konaklar & Aileler', 'Yüzyıllık taş ve ahşap konaklar, aile tarihini ve zanaatkârlığın inceliğini yansıtır. Birçok konak bugün kültürel miras olarak korunmaktadır.', 4, true),
    
    (culture_en_id, 'traditional-music', 'en', 'Our Music: Tulum, Horon, Kemençe', 'The soul of the Black Sea lives in the vibrant tunes of tulum and kemençe. Horon dance chains embody the region''s energy from weddings to highland festivals.', 5, true),
    (culture_tr_id, 'traditional-music', 'tr', 'Müziğimiz: Tulum, Horon, Kemençe', 'Karadeniz''in ruhu, tulum ve kemençenin coşkulu ezgilerinde hayat bulur. Horon zincirleri, düğünlerden yayla şenliklerine kadar bölgenin enerjisini yansıtır.', 5, true),
    
    (culture_en_id, 'traditional-crafts', 'en', 'Traditional Handicrafts', 'Rize cloth, basketry, woodcarving and copperwork are passed down through generations. Each reflects a life in harmony with nature.', 6, true),
    (culture_tr_id, 'traditional-crafts', 'tr', 'Geleneksel El Sanatları', 'Rize bezi, sepetçilik, ahşap oyma ve bakır işçiliği gibi zanaatlar kuşaktan kuşağa aktarılır. Her biri, doğa ile uyumlu yaşamın izlerini taşır.', 6, true);

    -- Insert Gastronomy & Local Flavours subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (gastronomy_en_id, 'gi-products', 'en', 'Geographical Indication Products', 'Rize Tea, Anzer Honey, Rize Simit, Rize Baston Bread and Hemshin Socks are geographically indicated products. They represent the region''s unique nature and cultural identity.', 1, true),
    (gastronomy_tr_id, 'gi-products', 'tr', 'Coğrafi İşaretli Ürünler', 'Rize Çayı, Anzer Balı, Rize Simidi, Rize Baston Ekmek ve Hemşin Çorabı coğrafi işaretli ürünlerdir. Bu ürünler bölgenin özgün doğasını ve kültürel kimliğini temsil eder.', 1, true),
    
    (gastronomy_en_id, 'must-try-dishes', 'en', 'Must-Try Dishes', 'Muhlama, anchovy bread, Laz pastry and black cabbage soup are table favorites. The local cuisine is both hearty and deeply rooted in tradition.', 2, true),
    (gastronomy_tr_id, 'must-try-dishes', 'tr', '"Yemeden Gitme" Lezzetleri', 'Muhlama, hamsili ekmek, laz böreği ve karalahana çorbası sofraların baş tacıdır. Yerel mutfak, hem doyurucu hem de köklü geleneklere sahiptir.', 2, true),
    
    (gastronomy_en_id, 'tea-experience', 'en', 'Tea Harvest & Brewing Experience', 'Joining the tea harvest in gardens is a chance to share the same labor as locals. Traditional brewing methods are an inseparable part of the culture.', 3, true),
    (gastronomy_tr_id, 'tea-experience', 'tr', 'Çay Hasadı & Demleme Deneyimi', 'Çay bahçelerinde hasada katılmak, bölge insanıyla aynı emeği paylaşma fırsatı sunar. Çayın geleneksel yöntemlerle demlenişi, kültürün ayrılmaz bir parçasıdır.', 3, true),
    
    (gastronomy_en_id, 'local-cuisines', 'en', 'Hemshin & Laz Cuisine', 'Cornmeal, dairy and leafy greens form the core of these cuisines. Fish and forest products add seasonal diversity.', 4, true),
    (gastronomy_tr_id, 'local-cuisines', 'tr', 'Hemşin & Laz Mutfakları', 'Mısır unu, süt ürünleri ve yeşil yapraklı sebzeler mutfakların temelidir. Balık ve orman ürünleri ise mevsime göre çeşitlilik katar.', 4, true),
    
    (gastronomy_en_id, 'gastronomy-workshops', 'en', 'Gastronomy Workshops', 'Cooking muhlama or baking cornbread with local masters offers an unforgettable experience.', 5, true),
    (gastronomy_tr_id, 'gastronomy-workshops', 'tr', 'Gastronomi Atölyeleri', 'Yerel ustalar eşliğinde muhlama pişirmek veya mısır ekmeği yapmak, ziyaretçiye unutulmaz bir deneyim sunar.', 5, true);

    -- Insert Music & Dance subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (music_dance_en_id, 'horon-types', 'en', 'Types of Horon', 'Horon, danced with varying steps in each valley and village, reflects the Black Sea''s dynamism.', 1, true),
    (music_dance_tr_id, 'horon-types', 'tr', 'Horon Çeşitleri', 'Her vadi ve köyde farklı adımlarla icra edilen horon, Karadeniz''in dinamizmini yansıtır.', 1, true),
    
    (music_dance_en_id, 'tulum-kemence', 'en', 'Tulum & Kemençe Performances', 'The deep sound of tulum and the lively melody of kemençe are indispensable regional tunes.', 2, true),
    (music_dance_tr_id, 'tulum-kemence', 'tr', 'Tulum & Kemençe Dinletileri', 'Tulumun derin sesi ve kemençenin kıvrak melodisi, bölgenin vazgeçilmez ezgileridir.', 2, true),
    
    (music_dance_en_id, 'workshops', 'en', 'Workshops (Instrument Making, Dance Steps)', 'Learning horon steps or witnessing tulum making is both educational and enjoyable for visitors.', 3, true),
    (music_dance_tr_id, 'workshops', 'tr', 'Atölyeler (Çalgı Yapımı, Adımlar)', 'Horon adımlarını öğrenmek veya tulum yapımına tanıklık etmek ziyaretçiler için öğretici ve keyifli bir deneyimdir.', 3, true),
    
    (music_dance_en_id, 'festivals-weddings', 'en', 'Festivals & Wedding Traditions', 'Highland festivals and weddings are the moments when music and dance are celebrated most vibrantly.', 4, true),
    (music_dance_tr_id, 'festivals-weddings', 'tr', 'Şenlikler & Düğün Kültürü', 'Yayla şenlikleri ve düğünler, müziğin ve dansın en coşkulu şekilde yaşandığı anlardır.', 4, true);

    -- Insert Sustainable Tourism subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (sustainable_en_id, 'leave-no-trace', 'en', 'Leave No Trace Principles', 'Leave no trace principles are followed to explore Kaçkar respectfully.', 1, true),
    (sustainable_tr_id, 'leave-no-trace', 'tr', 'İz Bırakmama İlkeleri', 'Kaçkar''ı keşfederken doğaya saygılı olmak için iz bırakmama prensipleri uygulanır.', 1, true),
    
    (sustainable_en_id, 'local-producer-support', 'en', 'Local Producer Support List', 'Shopping at local markets supports both producers and the economy.', 2, true),
    (sustainable_tr_id, 'local-producer-support', 'tr', 'Yerel Üretici Destek Listesi', 'Yerel pazarlardan alışveriş yapmak, hem üreticiye hem de ekonomiye katkı sağlar.', 2, true),
    
    (sustainable_en_id, 'eco-accommodation', 'en', 'Eco-Friendly Accommodation', 'Small-scale guesthouses and eco-friendly routes should be preferred.', 3, true),
    (sustainable_tr_id, 'eco-accommodation', 'tr', 'Doğa Dostu Konaklama', 'Küçük ölçekli pansiyonlar ve doğayla uyumlu rotalar tercih edilmelidir.', 3, true),
    
    (sustainable_en_id, 'eco-routes', 'en', 'Eco-Tourism Routes', 'Alternative eco-routes stand out for nature-friendly travel.', 4, true),
    (sustainable_tr_id, 'eco-routes', 'tr', 'Eko-turizm Rotaları', 'Doğayla uyumlu seyahatler için alternatif eko-rotalar öne çıkar.', 4, true),
    
    (sustainable_en_id, 'conservation-projects', 'en', 'Nature & Cultural Conservation Projects', 'Kaçkar''s wildlife is protected through conservation projects.', 5, true),
    (sustainable_tr_id, 'conservation-projects', 'tr', 'Doğa & Kültür Koruma Projeleri', 'Kaçkar''ın yaban hayatı, koruma projeleriyle güvence altına alınmaktadır.', 5, true);

    -- Insert Health & Wellness subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (health_en_id, 'yoga-meditation', 'en', 'Yoga & Meditation in the Highlands', 'The silence and clean air of the plateaus are ideal for yoga and meditation.', 1, true),
    (health_tr_id, 'yoga-meditation', 'tr', 'Yayla İkliminde Yoga & Meditasyon', 'Yaylalardaki sessizlik ve temiz hava, yoga ve meditasyon için ideal bir ortamdır.', 1, true),
    
    (health_en_id, 'breathing-therapy', 'en', 'Breathing Therapy Camps', 'Breathing exercises and herbal workshops stand out in the humid forest ecosystem.', 2, true),
    (health_tr_id, 'breathing-therapy', 'tr', 'Nefes Terapisi Kampları', 'Nemli orman ekosisteminde nefes egzersizleri ve bitkisel atölyeler öne çıkar.', 2, true),
    
    (health_en_id, 'natural-healing', 'en', 'Natural Healing Workshops', 'Workshops focus on herbal remedies and natural healing methods.', 3, true),
    (health_tr_id, 'natural-healing', 'tr', 'Doğal Şifa Atölyeleri', 'Bitkisel tedavi ve doğal şifa yöntemleri üzerine eğitimler sunulur.', 3, true),
    
    (health_en_id, 'thermal-springs', 'en', 'Ayder Thermal Springs', 'With its 50°C thermal waters, Ayder offers healing and relaxation.', 4, true),
    (health_tr_id, 'thermal-springs', 'tr', 'Ayder Kaplıcaları', '50°C termal sularıyla Ayder, ziyaretçilere şifa ve dinlenme sunar.', 4, true);

    -- Insert Photography & Art subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (photography_en_id, 'seasonal-photography', 'en', 'Seasonal Photography Routes', 'Each season offers unique photographic opportunities in Kaçkar. Spring brings wildflowers, summer offers clear mountain views, autumn provides colorful foliage, and winter creates dramatic snowscapes.', 1, true),
    (photography_tr_id, 'seasonal-photography', 'tr', 'Mevsimsel Fotoğraf Rotaları', 'Kaçkar''da her mevsim benzersiz fotoğraf fırsatları sunar. İlkbahar yabani çiçekler, yaz berrak dağ manzaraları, sonbahar renkli yapraklar, kış ise dramatik kar manzaraları getirir.', 1, true),
    
    (photography_en_id, 'artist-workshops', 'en', 'Artist Workshops & Open-Air Exhibitions', 'Local and visiting artists conduct workshops in the inspiring mountain environment. Open-air exhibitions showcase the region''s artistic heritage.', 2, true),
    (photography_tr_id, 'artist-workshops', 'tr', 'Sanatçı Atölyeleri & Açık Hava Sergileri', 'Yerel ve misafir sanatçılar, ilham verici dağ ortamında atölyeler düzenler. Açık hava sergileri bölgenin sanatsal mirasını sergiler.', 2, true),
    
    (photography_en_id, 'artist-residence', 'en', 'Artist-in-Residence Programs', 'Artists from around the world come to Kaçkar for extended stays, creating works inspired by the natural beauty and cultural richness of the region.', 3, true),
    (photography_tr_id, 'artist-residence', 'tr', 'Artist-in-Residence Programları', 'Dünyanın dört bir yanından sanatçılar, bölgenin doğal güzelliği ve kültürel zenginliğinden ilham alarak eserler üretmek için Kaçkar''a gelir.', 3, true);

    -- Insert Educational & Research Tourism subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (educational_en_id, 'biology-botany', 'en', 'Biology & Botany Observation Tours', 'Kaçkar is home to numerous endemic plant species and diverse wildlife. Guided tours offer opportunities to study the region''s unique biodiversity.', 1, true),
    (educational_tr_id, 'biology-botany', 'tr', 'Biyoloji & Botanik Gözlem Turları', 'Kaçkar, sayısız endemik bitki türü ve çeşitli yaban hayatına ev sahipliği yapar. Rehberli turlar bölgenin benzersiz biyolojik çeşitliliğini inceleme fırsatı sunar.', 1, true),
    
    (educational_en_id, 'birdwatching', 'en', 'Birdwatching', 'The diverse habitats of Kaçkar attract numerous bird species. From alpine meadows to forested valleys, birdwatchers can observe both resident and migratory species.', 2, true),
    (educational_tr_id, 'birdwatching', 'tr', 'Kuş Gözlemi', 'Kaçkar''ın çeşitli habitatları sayısız kuş türünü çeker. Alpine çayırlardan ormanlık vadilere kadar, kuş gözlemcileri hem yerleşik hem de göçmen türleri gözlemleyebilir.', 2, true),
    
    (educational_en_id, 'geology-research', 'en', 'Geology & Glacier Lake Research', 'The glacial lakes and geological formations of Kaçkar provide excellent opportunities for geological study and research.', 3, true),
    (educational_tr_id, 'geology-research', 'tr', 'Jeoloji & Buzul Gölü Araştırmaları', 'Kaçkar''ın buzul gölleri ve jeolojik oluşumları, jeolojik çalışma ve araştırma için mükemmel fırsatlar sunar.', 3, true),
    
    (educational_en_id, 'craftsmanship-programs', 'en', 'Craftsmanship Training Programs', 'Learn traditional crafts from local masters, including woodworking, weaving, and other traditional skills passed down through generations.', 4, true),
    (educational_tr_id, 'craftsmanship-programs', 'tr', 'Zanaat Eğitim Programları', 'Yerel ustalardan ahşap işçiliği, dokumacılık ve nesiller boyunca aktarılan diğer geleneksel becerileri öğrenin.', 4, true);

    -- Insert Events & Festivals subcategories
    INSERT INTO public.subcategories (category_id, slug, locale, title, body_text, sort_order, is_active) VALUES
    (events_en_id, 'highland-festivals', 'en', 'Highland Festivals', 'Throughout the summer, various highland festivals celebrate local culture, music, and traditions. These events bring together communities from across the region.', 1, true),
    (events_tr_id, 'highland-festivals', 'tr', 'Yayla Şenlikleri', 'Yaz boyunca çeşitli yayla şenlikleri yerel kültür, müzik ve gelenekleri kutlar. Bu etkinlikler bölgenin dört bir yanından toplulukları bir araya getirir.', 1, true),
    
    (events_en_id, 'horon-festivals', 'en', 'Horon Festivals', 'Dedicated horon festivals showcase the traditional dance forms of the region, with competitions and performances by local dance groups.', 2, true),
    (events_tr_id, 'horon-festivals', 'tr', 'Horon Festivalleri', 'Özel horon festivalleri bölgenin geleneksel dans formlarını sergiler, yerel dans gruplarının yarışmaları ve gösterileriyle.', 2, true),
    
    (events_en_id, 'tea-festival', 'en', 'Tea Harvest Festival', 'The annual tea harvest festival celebrates the region''s most important agricultural product, with traditional ceremonies and cultural performances.', 3, true),
    (events_tr_id, 'tea-festival', 'tr', 'Çay Hasadı Festivali', 'Yıllık çay hasadı festivali bölgenin en önemli tarım ürününü kutlar, geleneksel törenler ve kültürel gösterilerle.', 3, true),
    
    (events_en_id, 'local-markets', 'en', 'Local Product Markets & Gastronomy Days', 'Regular markets and gastronomy events showcase local products, traditional foods, and culinary traditions of the region.', 4, true),
    (events_tr_id, 'local-markets', 'tr', 'Yerel Ürün Pazarları & Gastronomi Günleri', 'Düzenli pazarlar ve gastronomi etkinlikleri yerel ürünleri, geleneksel yemekleri ve bölgenin mutfak geleneklerini sergiler.', 4, true);

END $$;
