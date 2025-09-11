-- Fix French and German categories - remove duplicates and add only missing ones
-- This migration removes the 6 duplicate categories and adds only the 3 missing ones

-- First, remove the duplicate categories that were incorrectly added
DELETE FROM public.categories 
WHERE locale IN ('fr', 'de') 
AND slug IN ('music-dance', 'sustainable-tourism', 'health-wellness', 'photography-art', 'educational-research', 'events-festivals');

-- Now add only the 3 missing categories for French and German
-- These should have sort_order 7, 8, 9 (not 7-12)

-- Add missing French categories (only the 3 that are missing)
INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
('music-dance', 'fr', 'Musique & Danse', 'Ressentez l''esprit de la mer Noire avec le son du tulum et le rythme du horon.', '{"header": "Ressentez l''Esprit de la Mer Noire", "bullets": ["Variétés de danse horon", "Performances de tulum et kemençe", "Ateliers de fabrication d''instruments", "Festivals et traditions de mariage", "Célébrations culturelles vibrantes"], "body": "La musique et la danse sont au cœur de la culture de la région de Kaçkar. Le tulum et le kemençe créent des mélodies envoûtantes qui capturent l''essence de la mer Noire, tandis que les danses horon énergiques expriment la joie et l''unité de la communauté."}', 'MusicNote', 'from-[#0E4542] to-[#0E4542]', 7, true),
('sustainable-tourism', 'fr', 'Tourisme Durable', 'Un voyage de découverte qui respecte la nature et soutient la vie locale.', '{"header": "Explorez de Manière Responsable", "bullets": ["Principes de ne laisser aucune trace", "Soutien aux producteurs locaux", "Hébergement respectueux de l''environnement", "Routes d''écotourisme", "Projets de conservation"], "body": "Le tourisme durable dans la région de Kaçkar signifie voyager de manière responsable, en minimisant l''impact sur l''environnement et en maximisant les bénéfices pour les communautés locales. Découvrez comment explorer cette région magnifique tout en préservant sa beauté naturelle pour les générations futures."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 8, true),
('health-wellness', 'fr', 'Santé & Bien-être', 'Rafraîchissez votre corps et votre âme dans l''air pur des hautes terres.', '{"header": "Retrouvez l''Équilibre dans la Nature", "bullets": ["Yoga et méditation en altitude", "Thérapie respiratoire", "Ateliers de guérison naturelle", "Sources thermales d''Ayder", "Retraites de bien-être"], "body": "Les hautes terres de Kaçkar offrent l''environnement parfait pour la relaxation et la guérison. L''air pur de montagne, les sources thermales naturelles et la tranquillité de la nature créent un sanctuaire idéal pour retrouver l''équilibre physique et mental."}', 'Heart', 'from-[#0E4542] to-[#0E4542]', 9, true)
ON CONFLICT (slug, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  color_theme = EXCLUDED.color_theme,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Add missing German categories (only the 3 that are missing)
INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
('music-dance', 'de', 'Musik & Tanz', 'Fühlen Sie den Geist des Schwarzen Meeres mit dem Klang des Tulum und dem Rhythmus des Horon.', '{"header": "Fühlen Sie den Geist des Schwarzen Meeres", "bullets": ["Horon-Tanz-Variationen", "Tulum- und Kemençe-Aufführungen", "Instrumentenbau-Workshops", "Festivals und Hochzeitstraditionen", "Lebendige kulturelle Feiern"], "body": "Musik und Tanz stehen im Herzen der Kultur der Kaçkar-Region. Tulum und Kemençe schaffen bezaubernde Melodien, die das Wesen des Schwarzen Meeres einfangen, während die energischen Horon-Tänze die Freude und Einheit der Gemeinschaft ausdrücken."}', 'MusicNote', 'from-[#0E4542] to-[#0E4542]', 7, true),
('sustainable-tourism', 'de', 'Nachhaltiger Tourismus', 'Eine Entdeckungsreise, die die Natur respektiert und das lokale Leben unterstützt.', '{"header": "Erkunden Sie Verantwortungsvoll", "bullets": ["Leave-No-Trace-Prinzipien", "Unterstützung lokaler Produzenten", "Umweltfreundliche Unterkünfte", "Ökotourismus-Routen", "Schutzprojekte"], "body": "Nachhaltiger Tourismus in der Kaçkar-Region bedeutet verantwortungsvolles Reisen, das die Auswirkungen auf die Umwelt minimiert und den Nutzen für lokale Gemeinschaften maximiert. Entdecken Sie, wie Sie diese wunderschöne Region erkunden können, während Sie ihre natürliche Schönheit für zukünftige Generationen bewahren."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 8, true),
('health-wellness', 'de', 'Gesundheit & Wellness', 'Erfrischen Sie Körper und Seele in der sauberen Luft der Hochländer.', '{"header": "Finden Sie Gleichgewicht in der Natur", "bullets": ["Yoga und Meditation in der Höhe", "Atemtherapie", "Natürliche Heilungsworkshops", "Ayder-Thermalquellen", "Wellness-Retreats"], "body": "Die Kaçkar-Hochländer bieten die perfekte Umgebung für Entspannung und Heilung. Die saubere Bergluft, natürliche Thermalquellen und die Ruhe der Natur schaffen ein ideales Heiligtum, um körperliches und geistiges Gleichgewicht wiederzufinden."}', 'Heart', 'from-[#0E4542] to-[#0E4542]', 9, true)
ON CONFLICT (slug, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  color_theme = EXCLUDED.color_theme,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
