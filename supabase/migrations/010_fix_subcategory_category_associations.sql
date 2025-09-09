-- Fix subcategory associations to work with both English and Turkish categories
-- Since categories are still separate records per language, we need to duplicate subcategories
-- for each language version of the category

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
    
    -- Variables for existing subcategories
    existing_subcategory RECORD;
BEGIN
    -- Get all category IDs for both languages
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

    -- For each existing subcategory, create a copy for the Turkish category
    FOR existing_subcategory IN 
        SELECT * FROM public.subcategories WHERE category_id IN (
            nature_en_id, culture_en_id, gastronomy_en_id, music_dance_en_id, 
            sustainable_en_id, health_en_id, photography_en_id, educational_en_id, events_en_id
        )
    LOOP
        -- Determine which Turkish category this subcategory should be associated with
        DECLARE
            turkish_category_id UUID;
        BEGIN
            CASE existing_subcategory.category_id
                WHEN nature_en_id THEN turkish_category_id := nature_tr_id;
                WHEN culture_en_id THEN turkish_category_id := culture_tr_id;
                WHEN gastronomy_en_id THEN turkish_category_id := gastronomy_tr_id;
                WHEN music_dance_en_id THEN turkish_category_id := music_dance_tr_id;
                WHEN sustainable_en_id THEN turkish_category_id := sustainable_tr_id;
                WHEN health_en_id THEN turkish_category_id := health_tr_id;
                WHEN photography_en_id THEN turkish_category_id := photography_tr_id;
                WHEN educational_en_id THEN turkish_category_id := educational_tr_id;
                WHEN events_en_id THEN turkish_category_id := events_tr_id;
            END CASE;
            
            -- Insert a copy of the subcategory for the Turkish category
            INSERT INTO public.subcategories (
                category_id, slug, title, body_text, image_id, sort_order, is_active, created_by, updated_by, created_at, updated_at
            ) VALUES (
                turkish_category_id,
                existing_subcategory.slug,
                existing_subcategory.title,
                existing_subcategory.body_text,
                existing_subcategory.image_id,
                existing_subcategory.sort_order,
                existing_subcategory.is_active,
                existing_subcategory.created_by,
                existing_subcategory.updated_by,
                existing_subcategory.created_at,
                existing_subcategory.updated_at
            );
        END;
    END LOOP;
END $$;
