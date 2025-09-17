-- Fix images with null is_visible values
-- Set them to false (hidden) by default since they weren't explicitly marked as visible

UPDATE public.images 
SET is_visible = false 
WHERE is_visible IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.images.is_visible IS 'Controls whether the image is visible in public galleries (true) or hidden (false). NULL values are treated as hidden.';
