-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.categories;

-- Create a new policy that allows public access to all fields of active categories
CREATE POLICY "Public can view active categories with all fields" ON public.categories 
FOR SELECT 
USING (is_active = true);

-- Also ensure the table has RLS enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
