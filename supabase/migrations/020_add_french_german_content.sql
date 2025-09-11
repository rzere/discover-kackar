-- Migration to add French and German content to the database
-- This migration adds French (fr) and German (de) translations for all existing content

-- Update site settings to include new locales
UPDATE public.site_settings 
SET value = '["en", "tr", "fr", "de"]'::jsonb
WHERE key = 'supported_locales';

-- Add French categories
INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
('nature', 'fr', 'Nature & Aventure', 'Découvrez la puissance pure de la nature sur les sentiers qui s''élèvent des vallées vers les sommets du Kaçkar.', '{"header": "Découvrez la Beauté Sauvage des Montagnes de Kaçkar", "bullets": ["Plus de 50 lacs alpins vierges", "3,937m pic le plus haut - Kaçkar Dağı", "Flore et faune endémiques", "Forêts et prairies anciennes", "Ruisseaux de montagne cristallins"], "body": "Les montagnes de Kaçkar offrent une expérience naturelle inégalée avec leur nature sauvage vierge, leurs lacs glaciaires et leurs écosystèmes diversifiés. Du pic le plus haut à 3,937 mètres aux lacs alpins cristallins, chaque coin de cette région raconte une histoire de merveille naturelle."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 1, true),
('culture', 'fr', 'Culture & Vie Locale', 'Témoignez des histoires sincères des hauts plateaux, des manoirs et des traditions intemporelles.', '{"header": "Plongez dans les Traditions Anciennes", "bullets": ["Communautés traditionnelles Laz et Hemshin", "Anciens monastères et églises", "Artisanat et textiles locaux", "Musique et danse traditionnelles", "Vie de village authentique"], "body": "La région de Kaçkar est un trésor culturel où les traditions anciennes ont été préservées pendant des siècles. Les communautés locales Laz et Hemshin maintiennent leurs coutumes, leur langue et leur mode de vie uniques."}', 'Users', 'from-[#0E4542] to-[#0E4542]', 2, true),
('gastronomy', 'fr', 'Gastronomie & Saveurs Locales', 'Goûtez Kaçkar à travers ses produits IGP et ses saveurs locales inoubliables.', '{"header": "Savourez les Saveurs Authentiques de la Cuisine de la Mer Noire", "bullets": ["Truite de montagne fraîche et fruits de mer", "Pain de maïs traditionnel et fromages locaux", "Miel biologique et herbes de montagne", "Cérémonies de thé traditionnelles", "Vins et spiritueux locaux"], "body": "Les traditions culinaires de la région de Kaçkar reflètent le mélange unique d''influences montagnardes et côtières. Les ingrédients frais des montagnes et de la Mer Noire créent une cuisine distinctive qui a été perfectionnée au fil des générations."}', 'ForkKnife', 'from-[#0E4542] to-[#0E4542]', 3, true),
('adventure', 'fr', 'Aventure', 'Randonnée, alpinisme, tours des hauts plateaux, expériences de camping et activités d''adrénaline.', '{"header": "Partez à l''Aventure Épique en Montagne", "bullets": ["Itinéraires de randonnée multi-jours", "Alpinisme jusqu''au pic de 3,937m", "Expériences de camping en haute altitude", "Escalade et bloc", "Expéditions photographiques"], "body": "Pour les amateurs d''aventure, les montagnes de Kaçkar offrent certaines des expériences de plein air les plus difficiles et gratifiantes de Turquie. Des itinéraires de randonnée multi-jours à travers la nature sauvage vierge aux expéditions d''alpinisme vers les plus hauts sommets, la région offre des opportunités infinies d''aventures pleines d''adrénaline."}', 'Mountains', 'from-[#0E4542] to-[#0E4542]', 4, true),
('accommodation', 'fr', 'Hébergement', 'Maisons d''hôtes traditionnelles, maisons de haute altitude, sites de camping et options d''hébergement confortables.', '{"header": "Séjournez dans des Hébergements de Montagne Authentiques", "bullets": ["Maisons traditionnelles de haute altitude", "Maisons d''hôtes accueillantes avec charme local", "Sites de camping de montagne", "Lodges écologiques", "Expériences d''hébergement chez l''habitant"], "body": "Découvrez l''hospitalité authentique de montagne dans des hébergements traditionnels qui allient confort et culture locale. Des maisons d''hôtes accueillantes dans les villages de montagne aux maisons traditionnelles de haute altitude, chaque hébergement offre une perspective unique sur la vie locale."}', 'House', 'from-[#0E4542] to-[#0E4542]', 5, true),
('transportation', 'fr', 'Transport', 'Comment atteindre Kaçkar, transport local, services de transfert et informations pratiques.', '{"header": "Planifiez Votre Voyage vers les Montagnes", "bullets": ["Vols directs vers Trabzon et Rize", "Routes panoramiques depuis les grandes villes", "Services de bus et minibus locaux", "Options de transfert privé", "Accessibilité des routes de montagne"], "body": "Atteindre les montagnes de Kaçkar est plus facile que vous ne le pensez, avec plusieurs options de transport disponibles. La région est bien connectée par avion, avec des vol directs vers les aéroports de Trabzon et Rize. De là, des routes panoramiques serpentent à travers les montagnes, offrant des vues à couper le souffle en cours de route."}', 'Car', 'from-[#0E4542] to-[#0E4542]', 6, true)
ON CONFLICT (slug, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  color_theme = EXCLUDED.color_theme,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Add German categories
INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
('nature', 'de', 'Natur & Abenteuer', 'Entdecken Sie die reine Kraft der Natur auf Pfaden, die von Tälern zu Kaçkars Gipfeln aufsteigen.', '{"header": "Entdecken Sie die Wilde Schönheit der Kaçkar-Berge", "bullets": ["Über 50 unberührte alpine Seen", "3,937m höchster Gipfel - Kaçkar Dağı", "Endemische Flora und Fauna", "Uralte Wälder und Wiesen", "Kristallklare Gebirgsbäche"], "body": "Die Kaçkar-Berge bieten ein unvergleichliches Naturerlebnis mit ihrer unberührten Wildnis, Gletscherseen und vielfältigen Ökosystemen. Vom höchsten Gipfel auf 3,937 Metern bis zu den kristallklaren alpinen Seen erzählt jeder Winkel dieser Region eine Geschichte natürlicher Wunder."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 1, true),
('culture', 'de', 'Kultur & Lokales Leben', 'Erleben Sie die herzlichen Geschichten der Hochländer, Herrenhäuser und zeitlosen Traditionen.', '{"header": "Tauchen Sie ein in Alte Traditionen", "bullets": ["Traditionelle Laz- und Hemshin-Gemeinschaften", "Uralte Klöster und Kirchen", "Lokales Handwerk und Textilien", "Traditionelle Musik und Tanz", "Authentisches Dorfleben"], "body": "Die Kaçkar-Region ist ein kultureller Schatz, in dem alte Traditionen über Jahrhunderte bewahrt wurden. Die lokalen Laz- und Hemshin-Gemeinschaften bewahren ihre einzigartigen Bräuche, Sprache und Lebensweise."}', 'Users', 'from-[#0E4542] to-[#0E4542]', 2, true),
('gastronomy', 'de', 'Gastronomie & Lokale Aromen', 'Schmecken Sie Kaçkar durch seine g.U.-Produkte und unvergessliche lokale Aromen.', '{"header": "Genießen Sie die Authentischen Aromen der Schwarzmeer-Küche", "bullets": ["Frische Bergforelle und Meeresfrüchte", "Traditionelles Maisbrot und lokale Käsesorten", "Bio-Honig und Bergkräuter", "Traditionelle Teezeremonien", "Lokale Weine und Spirituosen"], "body": "Die kulinarischen Traditionen der Kaçkar-Region spiegeln die einzigartige Mischung aus Berg- und Küsteneinflüssen wider. Frische Zutaten aus den Bergen und dem Schwarzen Meer schaffen eine unverwechselbare Küche, die über Generationen perfektioniert wurde."}', 'ForkKnife', 'from-[#0E4542] to-[#0E4542]', 3, true),
('adventure', 'de', 'Abenteuer', 'Wandern, Bergsteigen, Hochlandtouren, Camping-Erlebnisse und Adrenalin-Aktivitäten.', '{"header": "Begeben Sie sich auf Epische Bergabenteuer", "bullets": ["Mehrtägige Wanderrouten", "Bergsteigen zum 3,937m Gipfel", "Hochland-Camping-Erlebnisse", "Klettern und Bouldern", "Fotografie-Expeditionen"], "body": "Für Abenteuerlustige bieten die Kaçkar-Berge einige der herausforderndsten und lohnendsten Outdoor-Erlebnisse der Türkei. Von mehrtägigen Wanderrouten durch unberührte Wildnis bis hin zu Bergsteiger-Expeditionen zu den höchsten Gipfeln bietet die Region endlose Möglichkeiten für adrenalingeladene Abenteuer."}', 'Mountains', 'from-[#0E4542] to-[#0E4542]', 4, true),
('accommodation', 'de', 'Unterkunft', 'Traditionelle Gästehäuser, Hochlandhäuser, Campingplätze und komfortable Unterkunftsmöglichkeiten.', '{"header": "Übernachten Sie in Authentischen Bergunterkünften", "bullets": ["Traditionelle Hochlandhäuser", "Gemütliche Gästehäuser mit lokalem Charme", "Berg-Campingplätze", "Umweltfreundliche Lodges", "Homestay-Erlebnisse"], "body": "Erleben Sie authentische Berggastfreundschaft in traditionellen Unterkünften, die Komfort mit lokaler Kultur verbinden. Von gemütlichen Gästehäusern in Bergdörfern bis hin zu traditionellen Hochlandhäusern bietet jede Unterkunft eine einzigartige Perspektive auf das lokale Leben."}', 'House', 'from-[#0E4542] to-[#0E4542]', 5, true),
('transportation', 'de', 'Transport', 'Wie man Kaçkar erreicht, lokaler Transport, Transferdienste und praktische Informationen.', '{"header": "Planen Sie Ihre Reise in die Berge", "bullets": ["Direktflüge nach Trabzon und Rize", "Panoramastraßen von Großstädten", "Lokale Bus- und Minibus-Services", "Private Transfer-Optionen", "Gebirgsstraßen-Zugänglichkeit"], "body": "Die Kaçkar-Berge zu erreichen ist einfacher als Sie denken, mit mehreren Transportoptionen verfügbar. Die Region ist gut per Flugzeug verbunden, mit Direktflügen zu den Flughäfen von Trabzon und Rize. Von dort aus winden sich malerische Straßen durch die Berge und bieten atemberaubende Aussichten unterwegs."}', 'Car', 'from-[#0E4542] to-[#0E4542]', 6, true)
ON CONFLICT (slug, locale) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  icon_name = EXCLUDED.icon_name,
  color_theme = EXCLUDED.color_theme,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Add French pages
INSERT INTO public.pages (slug, locale, title, meta_title, meta_description, h1, content, status) VALUES
('home', 'fr', 'Découvrez Kaçkar', 'Découvrez Kaçkar - Le Paradis Montagnard Caché de la Turquie', 'Explorez la nature sauvage vierge, les cultures anciennes et les paysages à couper le souffle du joyau caché de la Turquie dans la région de la Mer Noire.', 'Découvrez Kaçkar', '{"subtitle": "Le Paradis Montagnard Caché de la Turquie", "description": "Explorez la nature sauvage vierge, les cultures anciennes et les paysages à couper le souffle du joyau caché de la Turquie dans la région de la Mer Noire.", "cta_primary": "Explorer la Nature", "cta_secondary": "Découvrir la Culture", "stats": [{"value": "3,937m", "label": "Pic le Plus Haut"}, {"value": "50+", "label": "Lacs Alpins"}, {"value": "100+", "label": "Spots Photo"}]}', 'published'),
('contact', 'fr', 'Contact', 'Contact - Découvrez Kaçkar', 'Contactez-nous pour planifier votre parfaite aventure dans les montagnes de Kaçkar. Nous sommes là pour vous aider à découvrir la beauté de la région nord-est de la Turquie.', 'Contactez-nous', '{"subtitle": "Prêt à explorer les magnifiques montagnes de Kaçkar ? Laissez-nous vous aider à planifier l''aventure parfaite.", "description": "Vous avez des questions sur Kaçkar ? Nous serions ravis de vous aider à planifier votre aventure parfaite.", "form_title": "Entrez en contact", "info_title": "Informations de contact", "info_description": "Nous sommes là pour vous aider à planifier votre parfaite aventure Kaçkar"}', 'published')
ON CONFLICT (slug, locale) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Add German pages
INSERT INTO public.pages (slug, locale, title, meta_title, meta_description, h1, content, status) VALUES
('home', 'de', 'Entdecken Sie Kaçkar', 'Entdecken Sie Kaçkar - Türkeis Verstecktes Bergparadies', 'Erkunden Sie die unberührte Wildnis, alte Kulturen und atemberaubende Landschaften von Türkeis verstecktem Juwel in der Schwarzmeer-Region.', 'Entdecken Sie Kaçkar', '{"subtitle": "Türkeis Verstecktes Bergparadies", "description": "Erkunden Sie die unberührte Wildnis, alte Kulturen und atemberaubende Landschaften von Türkeis verstecktem Juwel in der Schwarzmeer-Region.", "cta_primary": "Natur Erkunden", "cta_secondary": "Kultur Entdecken", "stats": [{"value": "3,937m", "label": "Höchster Gipfel"}, {"value": "50+", "label": "Alpine Seen"}, {"value": "100+", "label": "Foto-Spots"}]}', 'published'),
('contact', 'de', 'Kontakt', 'Kontakt - Entdecken Sie Kaçkar', 'Kontaktieren Sie uns, um Ihr perfektes Kaçkar-Berge-Abenteuer zu planen. Wir sind hier, um Ihnen zu helfen, die Schönheit der nordöstlichen Region der Türkei zu entdecken.', 'Kontaktieren Sie uns', '{"subtitle": "Bereit, die wunderschönen Kaçkar-Berge zu erkunden? Lassen Sie uns Ihnen helfen, das perfekte Abenteuer zu planen.", "description": "Haben Sie Fragen zu Kaçkar? Wir helfen Ihnen gerne dabei, Ihr perfektes Abenteuer zu planen.", "form_title": "Kontakt aufnehmen", "info_title": "Kontaktinformationen", "info_description": "Wir sind hier, um Ihnen zu helfen, Ihr perfektes Kaçkar-Abenteuer zu planen"}', 'published')
ON CONFLICT (slug, locale) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Add French contact pages
INSERT INTO public.contact_pages (
  locale,
  hero_title,
  hero_subtitle,
  form_title,
  form_description,
  info_title,
  info_description,
  email_title,
  email_value,
  phone_title,
  phone_value,
  response_title,
  response_value
) VALUES (
  'fr',
  '{"en": "Contact Us", "tr": "İletişime Geçin", "fr": "Contactez-nous", "de": "Kontaktieren Sie uns"}',
  '{"en": "Get in touch with us for any questions about your Kaçkar adventure", "tr": "Kaçkar maceranız hakkında sorularınız için bizimle iletişime geçin", "fr": "Prêt à explorer les magnifiques montagnes de Kaçkar ?", "de": "Bereit, die wunderschönen Kaçkar-Berge zu erkunden?"}',
  '{"en": "Send us a Message", "tr": "Bize Mesaj Gönderin", "fr": "Entrez en contact", "de": "Kontakt aufnehmen"}',
  '{"en": "Fill out the form below and we''ll get back to you within 24 hours", "tr": "Aşağıdaki formu doldurun, 24 saat içinde size dönüş yapacağız", "fr": "Vous avez des questions sur Kaçkar ? Nous serions ravis de vous aider à planifier votre aventure parfaite.", "de": "Haben Sie Fragen zu Kaçkar? Wir helfen Ihnen gerne dabei, Ihr perfektes Abenteuer zu planen."}',
  '{"en": "Get in Touch", "tr": "İletişime Geçin", "fr": "Informations de contact", "de": "Kontaktinformationen"}',
  '{"en": "We''re here to help you plan your perfect Kaçkar adventure", "tr": "Mükemmel Kaçkar maceranızı planlamanıza yardımcı olmak için buradayız", "fr": "Nous sommes là pour vous aider à planifier votre parfaite aventure Kaçkar", "de": "Wir sind hier, um Ihnen zu helfen, Ihr perfektes Kaçkar-Abenteuer zu planen"}',
  '{"en": "Email Us", "tr": "E-posta Gönderin", "fr": "Envoyez-nous un e-mail", "de": "E-Mail senden"}',
  'info@discoverkackar.com',
  '{"en": "Call Us", "tr": "Bizi Arayın", "fr": "Appelez-nous", "de": "Anrufen"}',
  '+90 (555) 123-4567',
  '{"en": "Response Time", "tr": "Yanıt Süresi", "fr": "Temps de réponse", "de": "Antwortzeit"}',
  '{"en": "Within 24 hours", "tr": "24 saat içinde", "fr": "Dans les 24 heures", "de": "Innerhalb von 24 Stunden"}'
)
ON CONFLICT (locale) DO UPDATE SET
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  form_title = EXCLUDED.form_title,
  form_description = EXCLUDED.form_description,
  info_title = EXCLUDED.info_title,
  info_description = EXCLUDED.info_description,
  email_title = EXCLUDED.email_title,
  email_value = EXCLUDED.email_value,
  phone_title = EXCLUDED.phone_title,
  phone_value = EXCLUDED.phone_value,
  response_title = EXCLUDED.response_title,
  response_value = EXCLUDED.response_value,
  updated_at = NOW();

-- Add German contact pages
INSERT INTO public.contact_pages (
  locale,
  hero_title,
  hero_subtitle,
  form_title,
  form_description,
  info_title,
  info_description,
  email_title,
  email_value,
  phone_title,
  phone_value,
  response_title,
  response_value
) VALUES (
  'de',
  '{"en": "Contact Us", "tr": "İletişime Geçin", "fr": "Contactez-nous", "de": "Kontaktieren Sie uns"}',
  '{"en": "Get in touch with us for any questions about your Kaçkar adventure", "tr": "Kaçkar maceranız hakkında sorularınız için bizimle iletişime geçin", "fr": "Prêt à explorer les magnifiques montagnes de Kaçkar ?", "de": "Bereit, die wunderschönen Kaçkar-Berge zu erkunden?"}',
  '{"en": "Send us a Message", "tr": "Bize Mesaj Gönderin", "fr": "Entrez en contact", "de": "Kontakt aufnehmen"}',
  '{"en": "Fill out the form below and we''ll get back to you within 24 hours", "tr": "Aşağıdaki formu doldurun, 24 saat içinde size dönüş yapacağız", "fr": "Vous avez des questions sur Kaçkar ? Nous serions ravis de vous aider à planifier votre aventure parfaite.", "de": "Haben Sie Fragen zu Kaçkar? Wir helfen Ihnen gerne dabei, Ihr perfektes Abenteuer zu planen."}',
  '{"en": "Get in Touch", "tr": "İletişime Geçin", "fr": "Informations de contact", "de": "Kontaktinformationen"}',
  '{"en": "We''re here to help you plan your perfect Kaçkar adventure", "tr": "Mükemmel Kaçkar maceranızı planlamanıza yardımcı olmak için buradayız", "fr": "Nous sommes là pour vous aider à planifier votre parfaite aventure Kaçkar", "de": "Wir sind hier, um Ihnen zu helfen, Ihr perfektes Kaçkar-Abenteuer zu planen"}',
  '{"en": "Email Us", "tr": "E-posta Gönderin", "fr": "Envoyez-nous un e-mail", "de": "E-Mail senden"}',
  'info@discoverkackar.com',
  '{"en": "Call Us", "tr": "Bizi Arayın", "fr": "Appelez-nous", "de": "Anrufen"}',
  '+90 (555) 123-4567',
  '{"en": "Response Time", "tr": "Yanıt Süresi", "fr": "Temps de réponse", "de": "Antwortzeit"}',
  '{"en": "Within 24 hours", "tr": "24 saat içinde", "fr": "Dans les 24 heures", "de": "Innerhalb von 24 Stunden"}'
)
ON CONFLICT (locale) DO UPDATE SET
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  form_title = EXCLUDED.form_title,
  form_description = EXCLUDED.form_description,
  info_title = EXCLUDED.info_title,
  info_description = EXCLUDED.info_description,
  email_title = EXCLUDED.email_title,
  email_value = EXCLUDED.email_value,
  phone_title = EXCLUDED.phone_title,
  phone_value = EXCLUDED.phone_value,
  response_title = EXCLUDED.response_title,
  response_value = EXCLUDED.response_value,
  updated_at = NOW();

-- Update footer table constraint to allow new locales
ALTER TABLE public.footer DROP CONSTRAINT IF EXISTS footer_locale_check;
ALTER TABLE public.footer ADD CONSTRAINT footer_locale_check CHECK (locale IN ('en', 'tr', 'fr', 'de'));

-- Add French footer content
INSERT INTO public.footer (locale, company_name, company_description, address, phone, email, social_links, quick_links, legal_links, copyright_text) VALUES
('fr', 
 'Découvrez Kaçkar', 
 'Votre passerelle vers le paradis montagnard caché de la Turquie dans la région de la Mer Noire.',
 'Montagnes de Kaçkar, Région de la Mer Noire, Turquie',
 '+90 (555) 123-4567',
 'info@discoverkackar.com',
 '{"facebook": "https://facebook.com/discoverkackar", "instagram": "https://instagram.com/discoverkackar", "twitter": "https://twitter.com/discoverkackar"}',
 '[{"title": "À propos", "url": "/about"}, {"title": "Contact", "url": "/contact"}, {"title": "Blog", "url": "/blog"}]',
 '[{"title": "Politique de confidentialité", "url": "/privacy"}, {"title": "Conditions d''utilisation", "url": "/terms"}]',
 '© 2024 Découvrez Kaçkar. Tous droits réservés.'
)
ON CONFLICT (locale) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  company_description = EXCLUDED.company_description,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  social_links = EXCLUDED.social_links,
  quick_links = EXCLUDED.quick_links,
  legal_links = EXCLUDED.legal_links,
  copyright_text = EXCLUDED.copyright_text,
  updated_at = NOW();

-- Add German footer content
INSERT INTO public.footer (locale, company_name, company_description, address, phone, email, social_links, quick_links, legal_links, copyright_text) VALUES
('de', 
 'Entdecken Sie Kaçkar', 
 'Ihr Tor zu Türkeis verstecktem Bergparadies in der Schwarzmeer-Region.',
 'Kaçkar-Berge, Schwarzmeer-Region, Türkei',
 '+90 (555) 123-4567',
 'info@discoverkackar.com',
 '{"facebook": "https://facebook.com/discoverkackar", "instagram": "https://instagram.com/discoverkackar", "twitter": "https://twitter.com/discoverkackar"}',
 '[{"title": "Über uns", "url": "/about"}, {"title": "Kontakt", "url": "/contact"}, {"title": "Blog", "url": "/blog"}]',
 '[{"title": "Datenschutzrichtlinie", "url": "/privacy"}, {"title": "Nutzungsbedingungen", "url": "/terms"}]',
 '© 2024 Entdecken Sie Kaçkar. Alle Rechte vorbehalten.'
)
ON CONFLICT (locale) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  company_description = EXCLUDED.company_description,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  social_links = EXCLUDED.social_links,
  quick_links = EXCLUDED.quick_links,
  legal_links = EXCLUDED.legal_links,
  copyright_text = EXCLUDED.copyright_text,
  updated_at = NOW();

-- Update existing CTA cards to include French and German translations
UPDATE public.cta_cards SET 
  title = '{"en": "Plan Your Trip", "tr": "Seyahatinizi Planlayın", "fr": "Planifiez Votre Voyage", "de": "Planen Sie Ihre Reise"}',
  description = '{"en": "Ready to explore the beautiful Kaçkar Mountains? Let us help you plan the perfect adventure.", "tr": "Güzel Kaçkar Dağları''nı keşfetmeye hazır mısınız? Mükemmel macerayı planlamanıza yardımcı olalım.", "fr": "Prêt à explorer les magnifiques montagnes de Kaçkar ? Laissez-nous vous aider à planifier l''aventure parfaite.", "de": "Bereit, die wunderschönen Kaçkar-Berge zu erkunden? Lassen Sie uns Ihnen helfen, das perfekte Abenteuer zu planen."}',
  button_text = '{"en": "Contact Us", "tr": "İletişime Geçin", "fr": "Contactez-nous", "de": "Kontaktieren Sie uns"}',
  updated_at = NOW()
WHERE slug = 'plan-your-trip';

-- Add new French CTA cards
INSERT INTO public.cta_cards (slug, title, description, button_text, button_url, is_active) VALUES 
(
  'adventure-fr',
  '{"en": "Ready for Adventure?", "tr": "Macera için Hazır mısınız?", "fr": "Prêt pour l''Aventure ?", "de": "Bereit für Abenteuer?"}',
  '{"en": "Discover the most epic hiking trails of the Kaçkar Mountains and create unforgettable memories.", "tr": "Kaçkar Dağları''nın en epik yürüyüş parkurlarını keşfedin ve unutulmaz anılar yaratın.", "fr": "Découvrez les sentiers de randonnée les plus épiques des montagnes de Kaçkar et créez des souvenirs inoubliables.", "de": "Entdecken Sie die epischsten Wanderwege der Kaçkar-Berge und schaffen Sie unvergessliche Erinnerungen."}',
  '{"en": "Start Adventure", "tr": "Maceraya Başla", "fr": "Commencer l''Aventure", "de": "Abenteuer Beginnen"}',
  '/fr/category/nature',
  true
),
(
  'culture-fr',
  '{"en": "Explore Local Culture", "tr": "Yerel Kültürü Keşfedin", "fr": "Explorez la Culture Locale", "de": "Erkunden Sie die Lokale Kultur"}',
  '{"en": "Dive into ancient traditions and discover the authentic hospitality of mountain communities.", "tr": "Antik geleneklere dalın ve dağ topluluklarının otantik misafirperverliğini keşfedin.", "fr": "Plongez dans les traditions anciennes et découvrez l''hospitalité authentique des communautés de montagne.", "de": "Tauchen Sie ein in alte Traditionen und entdecken Sie die authentische Gastfreundschaft der Berggemeinschaften."}',
  '{"en": "Discover Culture", "tr": "Kültürü Keşfet", "fr": "Découvrir la Culture", "de": "Kultur Entdecken"}',
  '/fr/category/culture',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  button_text = EXCLUDED.button_text,
  button_url = EXCLUDED.button_url,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
