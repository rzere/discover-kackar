-- Copy hero_image_id from English categories to French and German categories
-- This ensures all locales use the same hero images

DO $$
DECLARE
    category_record RECORD;
    en_hero_image_id UUID;
BEGIN
    -- Loop through all English categories
    FOR category_record IN 
        SELECT slug, hero_image_id 
        FROM public.categories 
        WHERE locale = 'en' 
        AND hero_image_id IS NOT NULL
    LOOP
        -- Get the hero_image_id from English category
        en_hero_image_id := category_record.hero_image_id;
        
        -- Update French category with the same hero_image_id
        UPDATE public.categories 
        SET hero_image_id = en_hero_image_id
        WHERE slug = category_record.slug 
        AND locale = 'fr';
        
        -- Update German category with the same hero_image_id
        UPDATE public.categories 
        SET hero_image_id = en_hero_image_id
        WHERE slug = category_record.slug 
        AND locale = 'de';
        
        RAISE NOTICE 'Updated hero_image_id for %: % -> fr, de', category_record.slug, en_hero_image_id;
    END LOOP;
    
    RAISE NOTICE 'Hero image copying completed successfully';
END $$;
