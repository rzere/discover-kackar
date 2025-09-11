-- Fix English categories - remove duplicates and ensure only 9 categories with correct sort_order
-- Based on Turkish categories as the reference

-- First, delete the incorrect extra categories that were added
DELETE FROM public.categories 
WHERE locale = 'en' 
AND slug IN ('adventure', 'accommodation', 'transportation');

-- Update sort_order for the remaining categories to match Turkish structure
UPDATE public.categories 
SET sort_order = 1 
WHERE locale = 'en' AND slug = 'nature';

UPDATE public.categories 
SET sort_order = 2 
WHERE locale = 'en' AND slug = 'culture';

UPDATE public.categories 
SET sort_order = 3 
WHERE locale = 'en' AND slug = 'gastronomy';

UPDATE public.categories 
SET sort_order = 4 
WHERE locale = 'en' AND slug = 'music-dance';

UPDATE public.categories 
SET sort_order = 5 
WHERE locale = 'en' AND slug = 'sustainable-tourism';

UPDATE public.categories 
SET sort_order = 6 
WHERE locale = 'en' AND slug = 'health-wellness';

UPDATE public.categories 
SET sort_order = 7 
WHERE locale = 'en' AND slug = 'photography-art';

UPDATE public.categories 
SET sort_order = 8 
WHERE locale = 'en' AND slug = 'educational-research';

UPDATE public.categories 
SET sort_order = 9 
WHERE locale = 'en' AND slug = 'events-festivals';

-- Verify the result
SELECT locale, slug, name, sort_order 
FROM public.categories 
WHERE locale = 'en' 
ORDER BY sort_order;
