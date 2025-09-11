-- Add missing categories for French and German to complete the 9 categories

-- Add missing French categories
INSERT INTO public.categories (locale, slug, name, description, content, hero_image_id, icon_name, color_theme, sort_order, is_active, created_at, updated_at)
VALUES 
('fr', 'photography-art', 'Photographie & Art', 'Capturez des paysages uniques façonnés par la lumière des saisons.', 
 '{"body": "La lumière changeante et les saisons de Kaçkar créent des opportunités infinies pour l''expression artistique. Des routes de photographie saisonnières aux ateliers d''artistes, découvrez le côté créatif de ce magnifique paysage.", "header": "Capturez des Paysages Uniques", "bullets": ["Routes de photographie saisonnières", "Ateliers d''artistes et expositions en plein air", "Programmes d''artistes en résidence", "Art inspiré de la nature", "Expéditions photographiques"]}',
 'ee7502fd-1766-417e-b1a5-8e35fb0ba8d2', 'Camera', 'from-[#0E4542] to-[#0E4542]', 7, true, NOW(), NOW()),

('fr', 'educational-research', 'Éducation & Recherche Tourisme', 'Un laboratoire vivant s''étendant des plantes endémiques aux lacs glaciaires.',
 '{"body": "Kaçkar sert de laboratoire naturel pour les chercheurs et les étudiants. Des plantes endémiques aux lacs glaciaires, la région offre des opportunités uniques pour l''exploration éducative et scientifique.", "header": "Explorez un Laboratoire Vivant", "bullets": ["Tours d''observation de biologie et botanique", "Expéditions d''observation d''oiseaux", "Recherche géologie et lacs glaciaires", "Programmes de formation artisanale", "Opportunités de recherche scientifique"]}',
 '5eaae419-a45c-49f9-8a19-eeb61af257ad', 'GraduationCap', 'from-[#0E4542] to-[#0E4542]', 8, true, NOW(), NOW()),

('fr', 'events-festivals', 'Événements & Festivals', 'Rejoignez des célébrations vibrantes des festivals des hauts plateaux aux récoltes de thé.',
 '{"body": "Tout au long de l''année, Kaçkar prend vie avec des festivals et des célébrations qui mettent en valeur la riche culture de la région. Des festivals des hauts plateaux aux célébrations de récolte de thé, vivez l''esprit vibrant des traditions locales.", "header": "Rejoignez des Célébrations Vibrantes", "bullets": ["Festivals des hauts plateaux", "Festivals Horon", "Festival de récolte de thé", "Marchés de produits locaux", "Célébrations culturelles"]}',
 '29c580f0-4188-46cd-bd16-44339144637f', 'CalendarCheck', 'from-[#0E4542] to-[#0E4542]', 9, true, NOW(), NOW());

-- Add missing German categories
INSERT INTO public.categories (locale, slug, name, description, content, hero_image_id, icon_name, color_theme, sort_order, is_active, created_at, updated_at)
VALUES 
('de', 'photography-art', 'Fotografie & Kunst', 'Erfassen Sie einzigartige Landschaften, die vom Licht der Jahreszeiten geprägt sind.',
 '{"body": "Das sich verändernde Licht und die Jahreszeiten von Kaçkar schaffen endlose Möglichkeiten für künstlerischen Ausdruck. Von saisonalen Fotografierouten bis hin zu Künstlerworkshops entdecken Sie die kreative Seite dieser herrlichen Landschaft.", "header": "Erfassen Sie Einzigartige Landschaften", "bullets": ["Saisonale Fotografierouten", "Künstlerworkshops und Freiluftausstellungen", "Artist-in-Residence-Programme", "Von der Natur inspirierte Kunst", "Fotografie-Expeditionen"]}',
 'ee7502fd-1766-417e-b1a5-8e35fb0ba8d2', 'Camera', 'from-[#0E4542] to-[#0E4542]', 7, true, NOW(), NOW()),

('de', 'educational-research', 'Bildungs- & Forschungstourismus', 'Ein lebendiges Labor, das sich von endemischen Pflanzen bis zu Gletscherseen erstreckt.',
 '{"body": "Kaçkar dient als natürliches Labor für Forscher und Studenten. Von endemischen Pflanzen bis zu Gletscherseen bietet die Region einzigartige Möglichkeiten für Bildungs- und wissenschaftliche Erkundung.", "header": "Erkunden Sie ein Lebendiges Labor", "bullets": ["Biologie- und Botanik-Beobachtungstouren", "Vogelbeobachtungs-Expeditionen", "Geologie- und Gletschersee-Forschung", "Handwerksausbildungsprogramme", "Wissenschaftliche Forschungsmöglichkeiten"]}',
 '5eaae419-a45c-49f9-8a19-eeb61af257ad', 'GraduationCap', 'from-[#0E4542] to-[#0E4542]', 8, true, NOW(), NOW()),

('de', 'events-festivals', 'Veranstaltungen & Festivals', 'Nehmen Sie an lebendigen Feiern von Hochlandfestivals bis zu Teeernten teil.',
 '{"body": "Das ganze Jahr über erwacht Kaçkar mit Festivals und Feiern, die die reiche Kultur der Region zur Schau stellen. Von Hochlandfestivals bis zu Teeernte-Feiern erleben Sie den lebendigen Geist lokaler Traditionen.", "header": "Nehmen Sie an Lebendigen Feiern Teil", "bullets": ["Hochlandfestivals", "Horon-Festivals", "Teeernte-Festival", "Lokale Produktmärkte", "Kulturelle Feiern"]}',
 '29c580f0-4188-46cd-bd16-44339144637f', 'CalendarCheck', 'from-[#0E4542] to-[#0E4542]', 9, true, NOW(), NOW());

-- Verify the result
SELECT 'FR' as locale, slug, name, sort_order 
FROM public.categories 
WHERE locale = 'fr' 
UNION ALL
SELECT 'DE' as locale, slug, name, sort_order 
FROM public.categories 
WHERE locale = 'de' 
ORDER BY locale, sort_order;
