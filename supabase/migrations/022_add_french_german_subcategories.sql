-- Add French and German translations to existing subcategories
-- This migration updates all existing subcategories to include French (fr) and German (de) translations
-- Based on discover-kackar_full.md content

DO $$
BEGIN
    -- Update Nature & Adventure subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Lacs Alpins", "de": "Alpine Seen"}',
        body_text = body_text || '{"fr": "Découvrez plus de 50 lacs alpins vierges dispersés dans les montagnes de Kaçkar. Ces lacs glaciaires cristallins offrent des endroits parfaits pour la photographie, la pêche et la contemplation paisible.", "de": "Entdecken Sie über 50 unberührte alpine Seen, die über die Kaçkar-Berge verstreut sind. Diese kristallklaren Gletscherseen bieten perfekte Orte für Fotografie, Angeln und friedliche Kontemplation."}'
    WHERE slug = 'alpine-lakes';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Pics de Montagne", "de": "Berggipfel"}',
        body_text = body_text || '{"fr": "Défiez-vous sur les plus hauts sommets de la chaîne de Kaçkar, y compris l''iconique Kaçkar Dağı à 3 937 mètres. Vivez des vues panoramiques à couper le souffle et des aventures alpines.", "de": "Fordern Sie sich auf den höchsten Gipfeln der Kaçkar-Kette heraus, einschließlich des ikonischen Kaçkar Dağı auf 3.937 Metern. Erleben Sie atemberaubende Panoramablicke und alpine Abenteuer."}'
    WHERE slug = 'mountain-peaks';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Sentiers Forestiers", "de": "Waldwege"}',
        body_text = body_text || '{"fr": "Promenez-vous dans les forêts anciennes et découvrez des sentiers cachés qui mènent à des vallées isolées et des villages traditionnels. Découvrez la riche biodiversité de la région.", "de": "Wandern Sie durch uralte Wälder und entdecken Sie versteckte Pfade, die zu abgelegenen Tälern und traditionellen Dörfern führen. Erleben Sie die reiche Artenvielfalt der Region."}'
    WHERE slug = 'forest-trails';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Observation de la Faune", "de": "Wildtierbeobachtung"}',
        body_text = body_text || '{"fr": "Observez les espèces endémiques et la faune diversifiée dans leur habitat naturel. La région de Kaçkar abrite une flore et une faune uniques que l''on ne trouve nulle part ailleurs dans le monde.", "de": "Beobachten Sie endemische Arten und vielfältige Wildtiere in ihrem natürlichen Lebensraum. Die Kaçkar-Region beherbergt eine einzigartige Flora und Fauna, die nirgendwo sonst auf der Welt zu finden ist."}'
    WHERE slug = 'wildlife-watching';

    -- Update Culture & Local Life subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Communautés Traditionnelles", "de": "Traditionelle Gemeinschaften"}',
        body_text = body_text || '{"fr": "Rencontrez les communautés locales Laz et Hemshin qui ont préservé leurs traditions, leur langue et leur mode de vie uniques pendant des siècles dans les hautes terres de Kaçkar.", "de": "Treffen Sie die lokalen Laz- und Hemshin-Gemeinschaften, die ihre einzigartigen Traditionen, Sprache und Lebensweise seit Jahrhunderten in den Kaçkar-Hochländern bewahrt haben."}'
    WHERE slug = 'traditional-communities';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Monuments Historiques", "de": "Historische Denkmäler"}',
        body_text = body_text || '{"fr": "Explorez les anciens monastères, églises et sites historiques qui racontent l''histoire du riche patrimoine culturel et de la diversité religieuse de la région.", "de": "Erkunden Sie alte Klöster, Kirchen und historische Stätten, die die Geschichte des reichen kulturellen Erbes und der religiösen Vielfalt der Region erzählen."}'
    WHERE slug = 'historical-monuments';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Artisanat Local", "de": "Lokales Handwerk"}',
        body_text = body_text || '{"fr": "Découvrez l''artisanat traditionnel incluant le tissage, la poterie et la menuiserie. Apprenez les techniques transmises de génération en génération et soutenez les artisans locaux.", "de": "Entdecken Sie traditionelles Handwerk einschließlich Weben, Töpferei und Holzarbeit. Lernen Sie über Techniken, die von Generation zu Generation weitergegeben wurden, und unterstützen Sie lokale Handwerker."}'
    WHERE slug = 'local-handicrafts';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Vie de Village Authentique", "de": "Authentisches Dorfleben"}',
        body_text = body_text || '{"fr": "Vivez la vie de village authentique en séjournant avec des familles locales, en participant aux activités quotidiennes et en apprenant les coutumes et pratiques traditionnelles.", "de": "Erleben Sie authentisches Dorfleben, indem Sie bei lokalen Familien wohnen, an täglichen Aktivitäten teilnehmen und traditionelle Bräuche und Praktiken lernen."}'
    WHERE slug = 'village-life';

END $$;
