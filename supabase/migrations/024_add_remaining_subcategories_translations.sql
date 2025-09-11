-- Add remaining French and German translations to subcategories
-- This migration continues updating subcategories for Gastronomy, Music, Sustainable Tourism, Health, Photography, Educational, and Events

DO $$
BEGIN
    -- Update Gastronomy & Local Flavours subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Fruits de Mer Frais", "de": "Frische Meeresfrüchte"}',
        body_text = body_text || '{"fr": "Savourez la truite de montagne la plus fraîche et les fruits de mer de la mer Noire préparés avec des méthodes traditionnelles. Découvrez les saveurs uniques de la richesse aquatique de la région.", "de": "Genießen Sie die frischeste Bergforelle und Meeresfrüchte des Schwarzen Meeres, die mit traditionellen Methoden zubereitet werden. Erleben Sie die einzigartigen Aromen des aquatischen Reichtums der Region."}'
    WHERE slug = 'fresh-seafood';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Pain & Fromage Traditionnels", "de": "Traditionelles Brot & Käse"}',
        body_text = body_text || '{"fr": "Goûtez le pain de maïs authentique et les fromages locaux fabriqués avec des recettes ancestrales. Apprenez le processus traditionnel de fabrication du pain et les méthodes de production de fromage.", "de": "Probieren Sie authentisches Maisbrot und lokale Käsesorten, die mit uralten Rezepten hergestellt werden. Lernen Sie über den traditionellen Brotbackprozess und Käseproduktionsmethoden."}'
    WHERE slug = 'traditional-bread';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Herbes de Montagne & Miel", "de": "Bergkräuter & Honig"}',
        body_text = body_text || '{"fr": "Découvrez le miel biologique et les herbes médicinales de montagne utilisées dans la cuisine traditionnelle et les pratiques de guérison. Découvrez les saveurs naturelles des hautes terres.", "de": "Entdecken Sie Bio-Honig und heilende Bergkräuter, die in der traditionellen Küche und Heilpraktiken verwendet werden. Erleben Sie die natürlichen Aromen der Hochländer."}'
    WHERE slug = 'mountain-herbs';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Cérémonies du Thé", "de": "Teezeremonien"}',
        body_text = body_text || '{"fr": "Participez aux cérémonies traditionnelles du thé et apprenez l''importance culturelle du thé dans la région. Goûtez les variétés de thé cultivées localement.", "de": "Nehmen Sie an traditionellen Teezeremonien teil und lernen Sie über die kulturelle Bedeutung des Tees in der Region. Probieren Sie lokal angebaute Teesorten."}'
    WHERE slug = 'tea-ceremonies';

    -- Update Music & Dance subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Instruments Traditionnels", "de": "Traditionelle Instrumente"}',
        body_text = body_text || '{"fr": "Écoutez les sons émouvants du tulum et du kemençe, instruments traditionnels qui capturent l''esprit de la région de la mer Noire. Apprenez leur histoire et leur artisanat.", "de": "Hören Sie die seelenvollen Klänge von Tulum und Kemençe, traditionelle Instrumente, die den Geist der Schwarzmeerregion einfangen. Lernen Sie über ihre Geschichte und Handwerkskunst."}'
    WHERE slug = 'traditional-instruments';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Danse Horon", "de": "Horon-Tanz"}',
        body_text = body_text || '{"fr": "Vivez la danse horon énergique, une danse traditionnelle en cercle qui incarne l''esprit de la région. Apprenez les pas et rejoignez la célébration.", "de": "Erleben Sie den energischen Horon-Tanz, einen traditionellen Kreistanz, der den Geist der Region verkörpert. Lernen Sie die Schritte und nehmen Sie an der Feier teil."}'
    WHERE slug = 'horon-dance';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Traditions de Festival", "de": "Festivaltraditionen"}',
        body_text = body_text || '{"fr": "Rejoignez les festivals et célébrations vibrants où la musique et la danse rassemblent les communautés. Vivez la joie et l''unité des rassemblements traditionnels.", "de": "Nehmen Sie an lebendigen Festivals und Feiern teil, bei denen Musik und Tanz Gemeinschaften zusammenbringen. Erleben Sie die Freude und Einheit traditioneller Versammlungen."}'
    WHERE slug = 'festival-traditions';

    -- Update Sustainable Tourism subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Hébergement Écologique", "de": "Umweltfreundliche Unterkunft"}',
        body_text = body_text || '{"fr": "Séjournez dans des hébergements respectueux de l''environnement qui minimisent l''impact sur l''environnement naturel tout en offrant confort et expériences authentiques.", "de": "Übernachten Sie in umweltbewussten Unterkünften, die die Auswirkungen auf die natürliche Umwelt minimieren und gleichzeitig Komfort und authentische Erfahrungen bieten."}'
    WHERE slug = 'eco-friendly-accommodation';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Soutien aux Producteurs Locaux", "de": "Unterstützung lokaler Produzenten"}',
        body_text = body_text || '{"fr": "Soutenez les communautés locales en achetant directement aux producteurs, en séjournant dans des hébergements familiaux et en participant aux initiatives de tourisme communautaire.", "de": "Unterstützen Sie lokale Gemeinschaften, indem Sie direkt von Produzenten kaufen, in familiengeführten Unterkünften übernachten und an gemeindebasierten Tourismusinitiativen teilnehmen."}'
    WHERE slug = 'local-producer-support';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Projets de Conservation", "de": "Schutzprojekte"}',
        body_text = body_text || '{"fr": "Apprenez et participez aux efforts de conservation qui protègent le patrimoine naturel de la région pour les générations futures. Contribuez aux pratiques de tourisme durable.", "de": "Lernen Sie über und beteiligen Sie sich an Naturschutzbemühungen, die das natürliche Erbe der Region für zukünftige Generationen schützen. Tragen Sie zu nachhaltigen Tourismuspraktiken bei."}'
    WHERE slug = 'conservation-projects';

    -- Update Health & Wellness subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Yoga & Méditation", "de": "Yoga & Meditation"}',
        body_text = body_text || '{"fr": "Pratiquez le yoga et la méditation dans l''air pur des montagnes des hautes terres de Kaçkar. Trouvez la paix intérieure entouré de beauté naturelle et de tranquillité.", "de": "Praktizieren Sie Yoga und Meditation in der sauberen Bergluft der Kaçkar-Hochländer. Finden Sie inneren Frieden umgeben von natürlicher Schönheit und Ruhe."}'
    WHERE slug = 'yoga-meditation';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Sources Thermales", "de": "Thermalquellen"}',
        body_text = body_text || '{"fr": "Détendez-vous et régénérez-vous dans les sources thermales naturelles d''Ayder. Découvrez les propriétés curatives des eaux riches en minéraux dans un cadre montagnard époustouflant.", "de": "Entspannen und regenerieren Sie sich in den natürlichen Thermalquellen von Ayder. Erleben Sie die heilenden Eigenschaften mineralstoffreicher Gewässer in einer atemberaubenden Bergkulisse."}'
    WHERE slug = 'thermal-springs';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Thérapie Respiratoire", "de": "Atemtherapie"}',
        body_text = body_text || '{"fr": "Participez aux séances de thérapie respiratoire et aux retraites bien-être conçues pour restaurer l''équilibre et la vitalité dans l''environnement pur des montagnes.", "de": "Nehmen Sie an Atemtherapiesitzungen und Wellness-Retreats teil, die darauf ausgelegt sind, Gleichgewicht und Vitalität in der reinen Bergumgebung wiederherzustellen."}'
    WHERE slug = 'breathing-therapy';

    -- Update Photography & Art subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Routes de Photographie Saisonnières", "de": "Saisonale Fotografierouten"}',
        body_text = body_text || '{"fr": "Chaque saison offre des opportunités photographiques uniques à Kaçkar. Le printemps apporte des fleurs sauvages, l''été offre des vues claires des montagnes, l''automne fournit un feuillage coloré et l''hiver crée des paysages de neige dramatiques.", "de": "Jede Jahreszeit bietet einzigartige fotografische Möglichkeiten in Kaçkar. Der Frühling bringt Wildblumen, der Sommer bietet klare Bergblicke, der Herbst liefert buntes Laub und der Winter schafft dramatische Schneelandschaften."}'
    WHERE slug = 'seasonal-photography';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Ateliers d''Artistes", "de": "Künstlerworkshops"}',
        body_text = body_text || '{"fr": "Rejoignez les ateliers d''artistes et les expositions en plein air qui célèbrent la beauté naturelle de Kaçkar. Apprenez des artistes locaux et visiteurs dans des cadres montagnards inspirants.", "de": "Nehmen Sie an Künstlerworkshops und Freiluftausstellungen teil, die die natürliche Schönheit von Kaçkar feiern. Lernen Sie von lokalen und besuchenden Künstlern in inspirierenden Bergkulissen."}'
    WHERE slug = 'artist-workshops';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Art Inspiré par la Nature", "de": "Von der Natur inspirierte Kunst"}',
        body_text = body_text || '{"fr": "Explorez comment la lumière changeante et les saisons de Kaçkar inspirent l''expression artistique. Découvrez le côté créatif de ce magnifique paysage à travers diverses formes d''art.", "de": "Erkunden Sie, wie das sich verändernde Licht und die Jahreszeiten von Kaçkar künstlerischen Ausdruck inspirieren. Entdecken Sie die kreative Seite dieser herrlichen Landschaft durch verschiedene Kunstformen."}'
    WHERE slug = 'nature-inspired-art';

    -- Update Educational & Research Tourism subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Tours de Biologie & Botanique", "de": "Biologie- & Botaniktouren"}',
        body_text = body_text || '{"fr": "Rejoignez les visites guidées axées sur la flore et la faune uniques de la région. Apprenez sur les espèces endémiques et les écosystèmes délicats des montagnes de Kaçkar.", "de": "Nehmen Sie an geführten Touren teil, die sich auf die einzigartige Flora und Fauna der Region konzentrieren. Lernen Sie über endemische Arten und die empfindlichen Ökosysteme der Kaçkar-Berge."}'
    WHERE slug = 'biology-botany';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Expéditions d''Observation d''Oiseaux", "de": "Vogelbeobachtungsexpeditionen"}',
        body_text = body_text || '{"fr": "Observez diverses espèces d''oiseaux dans leur habitat naturel. La région de Kaçkar est un paradis pour les ornithologues avec sa diversité aviaire unique et ses routes de migration.", "de": "Beobachten Sie verschiedene Vogelarten in ihrem natürlichen Lebensraum. Die Kaçkar-Region ist ein Paradies für Vogelbeobachter mit ihrer einzigartigen Vogelvielfalt und Zugrouten."}'
    WHERE slug = 'birdwatching';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Recherche en Géologie & Glaciers", "de": "Geologie- & Gletscherforschung"}',
        body_text = body_text || '{"fr": "Étudiez les formations géologiques et les lacs glaciaires qui rendent Kaçkar unique. Apprenez l''histoire géologique de la région et les projets de recherche en cours.", "de": "Studieren Sie die geologischen Formationen und Gletscherseen, die Kaçkar einzigartig machen. Lernen Sie über die geologische Geschichte der Region und laufende Forschungsprojekte."}'
    WHERE slug = 'geology-research';

    -- Update Events & Festivals subcategories
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Festivals des Hautes Terres", "de": "Hochlandfestivals"}',
        body_text = body_text || '{"fr": "Vivez les festivals vibrants des hautes terres qui célèbrent la culture et les traditions de la région. Rejoignez les festivités avec musique, danse et délices locaux.", "de": "Erleben Sie die lebendigen Hochlandfestivals, die die Kultur und Traditionen der Region feiern. Nehmen Sie an den Feierlichkeiten mit Musik, Tanz und lokalen Köstlichkeiten teil."}'
    WHERE slug = 'highland-festivals';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Festival de la Récolte du Thé", "de": "Teeerntefestival"}',
        body_text = body_text || '{"fr": "Célébrez la récolte annuelle du thé avec des cérémonies traditionnelles et des festivités locales. Apprenez sur la culture du thé et participez aux activités de récolte.", "de": "Feiern Sie die jährliche Teeernte mit traditionellen Zeremonien und lokalen Festlichkeiten. Lernen Sie über Teeanbau und nehmen Sie an Ernteaktivitäten teil."}'
    WHERE slug = 'tea-harvest-festival';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Célébrations Culturelles", "de": "Kulturelle Feiern"}',
        body_text = body_text || '{"fr": "Rejoignez diverses célébrations culturelles tout au long de l''année qui mettent en valeur le riche patrimoine de la région. Vivez la musique traditionnelle, la danse et les coutumes locales.", "de": "Nehmen Sie an verschiedenen kulturellen Feiern das ganze Jahr über teil, die das reiche Erbe der Region präsentieren. Erleben Sie traditionelle Musik, Tanz und lokale Bräuche."}'
    WHERE slug = 'cultural-celebrations';

END $$;
