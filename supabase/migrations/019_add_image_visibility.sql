-- Add is_visible field to images table for hiding/showing images
ALTER TABLE public.images 
ADD COLUMN is_visible BOOLEAN DEFAULT true;

-- Update existing images to be visible by default
UPDATE public.images SET is_visible = true WHERE is_visible IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.images.is_visible IS 'Controls whether the image is visible in public galleries (true) or hidden (false)';
