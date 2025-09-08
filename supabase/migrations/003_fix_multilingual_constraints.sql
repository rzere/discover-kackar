-- Fix multilingual constraints to support multiple language versions
-- Drop existing unique constraints on slug only
ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_slug_key;

-- Add new unique constraints on (slug, locale) combination
ALTER TABLE public.categories ADD CONSTRAINT categories_slug_locale_unique UNIQUE (slug, locale);
ALTER TABLE public.pages ADD CONSTRAINT pages_slug_locale_unique UNIQUE (slug, locale);

-- Update indexes to reflect the new constraint structure
DROP INDEX IF EXISTS idx_categories_slug_locale;
DROP INDEX IF EXISTS idx_pages_slug_locale;

CREATE INDEX idx_categories_slug_locale ON public.categories(slug, locale);
CREATE INDEX idx_pages_slug_locale ON public.pages(slug, locale);
