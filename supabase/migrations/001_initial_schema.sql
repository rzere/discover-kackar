-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE image_category AS ENUM ('hero', 'category', 'content', 'gallery', 'admin_upload');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table for optimized image storage
CREATE TABLE public.images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  category image_category NOT NULL,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[],
  is_optimized BOOLEAN DEFAULT false,
  optimization_data JSONB, -- stores mobile/tablet/desktop sizes
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages table for dynamic content management
CREATE TABLE public.pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  h1 TEXT,
  content JSONB, -- flexible content structure
  hero_image_id UUID REFERENCES public.images(id),
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table for dynamic category management
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  description TEXT,
  content JSONB,
  hero_image_id UUID REFERENCES public.images(id),
  icon_name TEXT, -- Phosphor icon name
  color_theme TEXT, -- CSS color for category
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content items table for detailed content management
CREATE TABLE public.content_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content JSONB,
  featured_image_id UUID REFERENCES public.images(id),
  gallery_image_ids UUID[],
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug, locale)
);

-- Site settings table for global configuration
CREATE TABLE public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO settings table for page-specific SEO
CREATE TABLE public.seo_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_type TEXT NOT NULL, -- 'home', 'category', 'content', 'custom'
  page_id UUID, -- references pages, categories, or content_items
  locale TEXT NOT NULL DEFAULT 'en',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image_id UUID REFERENCES public.images(id),
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT,
  robots_meta TEXT,
  schema_markup JSONB,
  updated_by UUID REFERENCES public.profiles(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_type, page_id, locale)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_images_category ON public.images(category);
CREATE INDEX idx_images_uploaded_by ON public.images(uploaded_by);
CREATE INDEX idx_pages_slug_locale ON public.pages(slug, locale);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_categories_slug_locale ON public.categories(slug, locale);
CREATE INDEX idx_categories_active ON public.categories(is_active);
CREATE INDEX idx_content_items_category ON public.content_items(category_id);
CREATE INDEX idx_content_items_status ON public.content_items(status);
CREATE INDEX idx_seo_settings_page ON public.seo_settings(page_type, page_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON public.images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON public.content_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON public.seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Images policies
CREATE POLICY "Anyone can view published images" ON public.images FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload images" ON public.images FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own images" ON public.images FOR UPDATE USING (uploaded_by = auth.uid());
CREATE POLICY "Admins can update all images" ON public.images FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admins can delete images" ON public.images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages policies
CREATE POLICY "Anyone can view published pages" ON public.pages FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can view all pages" ON public.pages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage pages" ON public.pages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Categories policies
CREATE POLICY "Anyone can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can view all categories" ON public.categories FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Content items policies
CREATE POLICY "Anyone can view published content" ON public.content_items FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can view all content" ON public.content_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Editors can manage content" ON public.content_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Site settings policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- SEO settings policies
CREATE POLICY "Anyone can view SEO settings" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Editors can manage SEO settings" ON public.seo_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
