-- Add hero_image_id column to categories table if it doesn't exist
-- This ensures the column exists for linking categories to their hero images

-- Check if the column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'categories' 
        AND column_name = 'hero_image_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.categories 
        ADD COLUMN hero_image_id UUID REFERENCES public.images(id);
        
        -- Add comment
        COMMENT ON COLUMN public.categories.hero_image_id IS 'Reference to the hero image for this category';
    END IF;
END $$;

-- Update the unique constraint to include hero_image_id if needed
-- (This is already handled in the initial schema, but ensuring it exists)
DO $$
BEGIN
    -- Drop existing unique constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'categories_slug_locale_unique'
        AND table_name = 'categories'
        AND table_schema = 'public'
    ) THEN
        -- Constraint already exists, do nothing
        NULL;
    ELSE
        -- Add the unique constraint
        ALTER TABLE public.categories 
        ADD CONSTRAINT categories_slug_locale_unique UNIQUE (slug, locale);
    END IF;
END $$;
