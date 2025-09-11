-- Fix French and German categories to match Turkish/English structure
-- Remove the incorrect categories and ensure they have the same 9 categories as TR/EN

-- Delete incorrect categories from French
DELETE FROM public.categories 
WHERE locale = 'fr' 
AND slug IN ('adventure', 'accommodation', 'transportation');

-- Delete incorrect categories from German  
DELETE FROM public.categories 
WHERE locale = 'de' 
AND slug IN ('adventure', 'accommodation', 'transportation');

-- Update French categories to match the correct structure
UPDATE public.categories 
SET sort_order = 1 
WHERE locale = 'fr' AND slug = 'nature';

UPDATE public.categories 
SET sort_order = 2 
WHERE locale = 'fr' AND slug = 'culture';

UPDATE public.categories 
SET sort_order = 3 
WHERE locale = 'fr' AND slug = 'gastronomy';

UPDATE public.categories 
SET sort_order = 4 
WHERE locale = 'fr' AND slug = 'music-dance';

UPDATE public.categories 
SET sort_order = 5 
WHERE locale = 'fr' AND slug = 'sustainable-tourism';

UPDATE public.categories 
SET sort_order = 6 
WHERE locale = 'fr' AND slug = 'health-wellness';

UPDATE public.categories 
SET sort_order = 7 
WHERE locale = 'fr' AND slug = 'photography-art';

UPDATE public.categories 
SET sort_order = 8 
WHERE locale = 'fr' AND slug = 'educational-research';

UPDATE public.categories 
SET sort_order = 9 
WHERE locale = 'fr' AND slug = 'events-festivals';

-- Update German categories to match the correct structure
UPDATE public.categories 
SET sort_order = 1 
WHERE locale = 'de' AND slug = 'nature';

UPDATE public.categories 
SET sort_order = 2 
WHERE locale = 'de' AND slug = 'culture';

UPDATE public.categories 
SET sort_order = 3 
WHERE locale = 'de' AND slug = 'gastronomy';

UPDATE public.categories 
SET sort_order = 4 
WHERE locale = 'de' AND slug = 'music-dance';

UPDATE public.categories 
SET sort_order = 5 
WHERE locale = 'de' AND slug = 'sustainable-tourism';

UPDATE public.categories 
SET sort_order = 6 
WHERE locale = 'de' AND slug = 'health-wellness';

UPDATE public.categories 
SET sort_order = 7 
WHERE locale = 'de' AND slug = 'photography-art';

UPDATE public.categories 
SET sort_order = 8 
WHERE locale = 'de' AND slug = 'educational-research';

UPDATE public.categories 
SET sort_order = 9 
WHERE locale = 'de' AND slug = 'events-festivals';

-- Verify the result
SELECT 'FR' as locale, slug, name, sort_order 
FROM public.categories 
WHERE locale = 'fr' 
UNION ALL
SELECT 'DE' as locale, slug, name, sort_order 
FROM public.categories 
WHERE locale = 'de' 
ORDER BY locale, sort_order;
