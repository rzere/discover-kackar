-- Create subcategories table
CREATE TABLE public.subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  body_text TEXT,
  image_id UUID REFERENCES public.images(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug, locale)
);

-- Create indexes for better performance
CREATE INDEX idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX idx_subcategories_slug_locale ON public.subcategories(slug, locale);
CREATE INDEX idx_subcategories_active ON public.subcategories(is_active);
CREATE INDEX idx_subcategories_sort_order ON public.subcategories(sort_order);

-- Create updated_at trigger for subcategories
CREATE TRIGGER update_subcategories_updated_at 
  BEFORE UPDATE ON public.subcategories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Subcategories policies
CREATE POLICY "Anyone can view active subcategories" ON public.subcategories 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can view all subcategories" ON public.subcategories 
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Editors can manage subcategories" ON public.subcategories 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Add comment to table
COMMENT ON TABLE public.subcategories IS 'Subcategories for main categories with multilingual support';
COMMENT ON COLUMN public.subcategories.title IS 'Subcategory title (displayed in ALL CAPS)';
COMMENT ON COLUMN public.subcategories.body_text IS 'Detailed description text for the subcategory';
COMMENT ON COLUMN public.subcategories.image_id IS 'Optional image for the subcategory';
COMMENT ON COLUMN public.subcategories.sort_order IS 'Order of display within the category';
