-- Add French and German translations for the missing subcategories
-- This migration adds translations for Adventure, Accommodation, and Transportation subcategories

DO $$
BEGIN
    -- Update Adventure subcategories with French and German translations
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Randonnée & Trekking", "de": "Wandern & Trekking"}',
        body_text = body_text || '{"fr": "La randonnée dans les montagnes de Kaçkar n''est pas seulement un sport mais une participation au rythme des nuages et des vallées. Des sentiers forestiers aux lacs glaciaires, vous pouvez disparaître dans la brume pour vous retrouver marchant au-dessus des nuages. Chaque sentier révèle des plantes endémiques, des cascades et des ponts de pierre séculaires.", "de": "Wandern in den Kaçkar-Bergen ist nicht nur ein Sport, sondern das Eintauchen in den Rhythmus von Wolken und Tälern. Von Waldwegen zu Gletscherseen können Sie im Nebel verschwinden, nur um sich über den Wolken zu finden. Jeder Pfad offenbart endemische Pflanzen, Wasserfälle und jahrhundertealte Steinbrücken."}'
    WHERE slug = 'hiking-trekking';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Course sur Sentier (Kaçkar by UTMB®)", "de": "Trailrunning (Kaçkar by UTMB®)"}',
        body_text = body_text || '{"fr": "Les sentiers de Kaçkar forment une scène naturelle pour la course d''endurance. En grimpant des vallées aux hauts plateaux, vous rencontrez la vie villageoise d''un côté et le silence des montagnes de l''autre. Le voyage des cols brumeux aux sommets ensoleillés transforme une course en une expérience inoubliable.", "de": "Kaçkars Pfade bilden eine natürliche Bühne für Ausdauerläufe. Beim Aufstieg von Tälern zu Hochplateaus begegnen Sie auf der einen Seite dem Dorfleben und auf der anderen der Stille der Berge. Die Reise von nebligen Pässen zu sonnigen Gipfeln verwandelt einen Lauf in ein unvergessliches Erlebnis."}'
    WHERE slug = 'trail-running';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Cyclisme & VTT", "de": "Radfahren & MTB"}',
        body_text = body_text || '{"fr": "Les routes qui montent des vallées aux hautes terres offrent des défis uniques pour les cyclistes sur route et les vététistes. Les itinéraires partant des vallées de Çağlayan et Fırtına passent par des forêts denses et des plateaux ouverts, chacun avec des niveaux de difficulté variables. Chaque montée ouvre une nouvelle vue sur la mer de nuages de la mer Noire.", "de": "Straßen, die von Tälern zu Hochländern aufsteigen, bieten einzigartige Herausforderungen für Straßen- und Mountainbiker. Routen, die in den Çağlayan- und Fırtına-Tälern beginnen, führen durch dichte Wälder und offene Plateaus, jede mit unterschiedlichen Schwierigkeitsgraden. Jeder Aufstieg eröffnet eine neue Aussicht über das Wolkenmeer des Schwarzen Meeres."}'
    WHERE slug = 'cycling-mtb';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Sports Nautiques (Rafting & Canoë)", "de": "Wassersport (Rafting & Kanu)"}',
        body_text = body_text || '{"fr": "La rivière Fırtına, avec ses courants puissants, est l''un des meilleurs endroits de Turquie pour le rafting et le canoë. Le parcours naturel offre des sections courtes pour les débutants et des tronçons difficiles pour les pagayeurs expérimentés. À chaque coup de pagaie, vous ressentez plus vivement la force de la nature.", "de": "Der Fırtına-Fluss mit seinen mächtigen Strömungen ist einer der besten Orte der Türkei für Rafting und Kanufahren. Der natürliche Kurs bietet kurze Abschnitte für Anfänger und herausfordernde Strecken für erfahrene Paddler. Mit jedem Schlag spüren Sie die Kraft der Natur lebendiger."}'
    WHERE slug = 'water-sports';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Activités Hivernales", "de": "Winteraktivitäten"}',
        body_text = body_text || '{"fr": "En hiver, Kaçkar se transforme en un silence blanc. Les sentiers de randonnée dans la neige mènent à travers les forêts de pins vers les vallées glaciaires. Autour d''Ayder et Kavrun, l''héliski est devenu une attraction de classe mondiale.", "de": "Im Winter verwandelt sich Kaçkar in ein weißes Schweigen. Schneewanderwege führen durch Kiefernwälder zu Gletschertälern. Rund um Ayder und Kavrun ist Heliskiing zu einer Weltklasse-Attraktion geworden."}'
    WHERE slug = 'winter-activities';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Sports d''Aventure", "de": "Abenteuersport"}',
        body_text = body_text || '{"fr": "Pour les amateurs d''adrénaline, Kaçkar offre le parapente, la tyrolienne, l''escalade et le canyoning. Chaque activité offre une nouvelle perspective sur la beauté sauvage des montagnes.", "de": "Für Adrenalinjunkies bietet Kaçkar Paragliding, Ziplining, Klettern und Canyoning. Jede Aktivität bietet eine neue Perspektive auf die wilde Schönheit der Berge."}'
    WHERE slug = 'adventure-sports';

    -- Update Accommodation subcategories with French and German translations
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Maisons d''Hôtes Traditionnelles", "de": "Traditionelle Gästehäuser"}',
        body_text = body_text || '{"fr": "Découvrez l''hospitalité authentique de montagne dans des maisons d''hôtes traditionnelles qui allient confort et culture locale. Des maisons d''hôtes accueillantes dans les villages de montagne aux maisons traditionnelles de haute altitude, chaque hébergement offre une perspective unique sur la vie locale.", "de": "Erleben Sie authentische Berggastfreundschaft in traditionellen Gästehäusern, die Komfort mit lokaler Kultur verbinden. Von gemütlichen Gästehäusern in Bergdörfern bis hin zu traditionellen Hochlandhäusern bietet jede Unterkunft eine einzigartige Perspektive auf das lokale Leben."}'
    WHERE slug = 'traditional-guesthouses';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Maisons de Haute Altitude", "de": "Hochlandhäuser"}',
        body_text = body_text || '{"fr": "Séjournez dans des maisons traditionnelles de haute altitude qui offrent une expérience montagnarde unique. Ces hébergements offrent un accès direct à la beauté naturelle de la région de Kaçkar tout en conservant les éléments architecturaux traditionnels.", "de": "Übernachten Sie in traditionellen Hochlandhäusern, die ein einzigartiges Bergerlebnis bieten. Diese Unterkünfte bieten direkten Zugang zur natürlichen Schönheit der Kaçkar-Region und bewahren gleichzeitig traditionelle architektonische Elemente."}'
    WHERE slug = 'highland-houses';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Camping de Montagne", "de": "Bergcamping"}',
        body_text = body_text || '{"fr": "Découvrez la nature sauvage avec des sites de camping de montagne qui offrent un accès direct à la nature. Campez sous les étoiles dans des zones désignées qui offrent sécurité tout en maintenant l''expérience authentique de plein air.", "de": "Erleben Sie die Wildnis mit Bergcampingplätzen, die direkten Zugang zur Natur bieten. Zelten Sie unter den Sternen in ausgewiesenen Bereichen, die Sicherheit bieten und gleichzeitig das authentische Outdoor-Erlebnis bewahren."}'
    WHERE slug = 'mountain-camping';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Lodges Écologiques", "de": "Umweltfreundliche Lodges"}',
        body_text = body_text || '{"fr": "Séjournez dans des lodges respectueux de l''environnement qui minimisent l''impact sur l''environnement naturel tout en offrant confort et expériences authentiques. Ces hébergements sont conçus pour se fondre harmonieusement avec la nature environnante.", "de": "Übernachten Sie in umweltbewussten Lodges, die die Auswirkungen auf die natürliche Umwelt minimieren und gleichzeitig Komfort und authentische Erfahrungen bieten. Diese Unterkünfte sind so konzipiert, dass sie sich nahtlos in die umgebende Natur einfügen."}'
    WHERE slug = 'eco-lodges';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Expériences d''Hébergement chez l''Habitant", "de": "Homestay-Erlebnisse"}',
        body_text = body_text || '{"fr": "Plongez-vous dans la culture locale avec des expériences d''hébergement chez l''habitant où vous pouvez apprendre les traditions locales et déguster des repas faits maison préparés avec des ingrédients frais et locaux.", "de": "Tauchen Sie in die lokale Kultur ein mit Homestay-Erlebnissen, bei denen Sie lokale Traditionen lernen und hausgemachte Mahlzeiten mit frischen, lokalen Zutaten genießen können."}'
    WHERE slug = 'homestay-experiences';

    -- Update Transportation subcategories with French and German translations
    UPDATE public.subcategories 
    SET title = title || '{"fr": "Vols & Accès Aéroport", "de": "Flüge & Flughafenzugang"}',
        body_text = body_text || '{"fr": "La région est bien connectée par avion, avec des vol directs vers les aéroports de Trabzon et Rize. De là, des routes panoramiques serpentent à travers les montagnes, offrant des vues à couper le souffle en cours de route.", "de": "Die Region ist gut per Flugzeug verbunden, mit Direktflügen zu den Flughäfen von Trabzon und Rize. Von dort aus winden sich malerische Straßen durch die Berge und bieten atemberaubende Aussichten unterwegs."}'
    WHERE slug = 'flights-access';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Routes Panoramiques", "de": "Panoramastraßen"}',
        body_text = body_text || '{"fr": "Les routes panoramiques depuis les grandes villes serpentent à travers les montagnes, offrant des vues à couper le souffle en cours de route. Ces routes offrent un accès même aux villages de montagne les plus reculés.", "de": "Panoramastraßen von Großstädten winden sich durch die Berge und bieten atemberaubende Aussichten unterwegs. Diese Routen bieten Zugang zu sogar den abgelegensten Bergdörfern."}'
    WHERE slug = 'scenic-routes';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Services de Bus & Minibus Locaux", "de": "Lokale Bus- & Minibus-Services"}',
        body_text = body_text || '{"fr": "Les services de transport local offrent un accès pratique même aux villages de montagne les plus reculés. Les services réguliers de bus et minibus relient les grandes villes aux petits villages de toute la région.", "de": "Lokale Transportdienste bieten bequemen Zugang zu sogar den abgelegensten Bergdörfern. Regelmäßige Bus- und Minibus-Services verbinden große Städte mit kleineren Dörfern in der gesamten Region."}'
    WHERE slug = 'local-transport';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Options de Transfert Privé", "de": "Private Transfer-Optionen"}',
        body_text = body_text || '{"fr": "Les options de transfert privé offrent un transport confortable et pratique vers votre destination. Ces services offrent flexibilité et service personnalisé pour votre voyage vers les montagnes de Kaçkar.", "de": "Private Transfer-Optionen bieten komfortable und bequeme Beförderung zu Ihrem Ziel. Diese Services bieten Flexibilität und personalisierten Service für Ihre Reise zu den Kaçkar-Bergen."}'
    WHERE slug = 'private-transfers';

    UPDATE public.subcategories 
    SET title = title || '{"fr": "Accessibilité des Routes de Montagne", "de": "Gebirgsstraßen-Zugänglichkeit"}',
        body_text = body_text || '{"fr": "Les routes de montagne offrent un accès à diverses destinations dans toute la région de Kaçkar. Bien que certaines routes puissent être difficiles, elles offrent un accès aux zones les plus belles et reculées des montagnes.", "de": "Gebirgsstraßen bieten Zugang zu verschiedenen Zielen in der gesamten Kaçkar-Region. Obwohl einige Routen herausfordernd sein können, bieten sie Zugang zu den schönsten und abgelegensten Gebieten der Berge."}'
    WHERE slug = 'mountain-road-access';

END $$;
