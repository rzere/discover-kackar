-- Remove duplicate contact pages from the pages table
-- These are duplicates since we already have a dedicated contact_pages table

-- Delete French contact page
DELETE FROM public.pages 
WHERE slug = 'contact' AND locale = 'fr';

-- Delete German contact page  e con
DELETE FROM public.pages 
WHERE slug = 'contact' AND locale = 'de';

-- Verify the deletion
-- Should only have home pages left for all locales
SELECT slug, locale, title FROM public.pages ORDER BY locale, slug;
