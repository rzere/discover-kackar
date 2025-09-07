-- Insert default site settings (with conflict resolution)
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', '"Discover Kaçkar"', 'The main site name'),
('site_description', '"Discover the natural beauty, rich culture, and adventure opportunities of the Kaçkar Mountains."', 'Default site description'),
('default_locale', '"en"', 'Default language for the site'),
('supported_locales', '["en", "tr"]', 'Supported languages'),
('contact_email', '"info@discoverkackar.com"', 'Contact email address'),
('social_links', '{"twitter": "", "instagram": "", "facebook": ""}', 'Social media links'),
('hero_settings', '{"auto_rotate": true, "rotation_interval": 8000, "show_indicators": true}', 'Hero section settings'),
('theme_colors', '{"primary": "#0ea5e9", "secondary": "#06b6d4", "navy": "#1e3a8a", "teal": "#0d9488"}', 'Theme color palette')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Insert default categories (with conflict resolution)
INSERT INTO public.categories (slug, locale, name, description, icon_name, color_theme, sort_order, is_active) VALUES
('nature', 'en', 'Nature', 'Pristine nature of Kaçkar Mountains, glacial lakes, endemic flora and breathtaking landscapes', 'Leaf', 'from-green-500 to-emerald-600', 1, true),
('culture', 'en', 'Culture', 'Multicultural heritage, historic villages, traditional architecture and ancient traditions', 'Users', 'from-amber-500 to-orange-600', 2, true),
('gastronomy', 'en', 'Gastronomy', 'Flavors of Black Sea cuisine, local products, traditional dishes and organic tastes', 'ForkKnife', 'from-red-500 to-pink-600', 3, true),
('adventure', 'en', 'Adventure', 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities', 'Mountains', 'from-blue-500 to-indigo-600', 4, true),
('accommodation', 'en', 'Accommodation', 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options', 'House', 'from-purple-500 to-violet-600', 5, true),
('transportation', 'en', 'Transportation', 'How to reach Kaçkar, local transportation, transfer services and practical information', 'Car', 'from-gray-500 to-slate-600', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  color_theme = EXCLUDED.color_theme,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Insert default pages (with conflict resolution)
INSERT INTO public.pages (slug, locale, title, meta_title, meta_description, h1, content, status) VALUES
('home', 'en', 'Discover Kaçkar', 'Discover Kaçkar - Turkey''s Hidden Mountain Paradise', 'Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey''s hidden gem in the Black Sea region.', 'Discover Kaçkar', '{"subtitle": "Turkey''s Hidden Mountain Paradise", "description": "Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey''s hidden gem in the Black Sea region.", "cta_primary": "Explore Nature", "cta_secondary": "Discover Culture", "stats": [{"value": "3,937m", "label": "Highest Peak"}, {"value": "50+", "label": "Alpine Lakes"}, {"value": "100+", "label": "Photo Spots"}]}', 'published')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  h1 = EXCLUDED.h1,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Insert default SEO settings (with conflict resolution)
INSERT INTO public.seo_settings (page_type, page_id, locale, meta_title, meta_description, meta_keywords) VALUES
('home', (SELECT id FROM public.pages WHERE slug = 'home' AND locale = 'en'), 'en', 'Discover Kaçkar - Turkey''s Hidden Mountain Paradise', 'Explore the pristine wilderness, ancient cultures, and breathtaking landscapes of Turkey''s hidden gem in the Black Sea region.', ARRAY['Kaçkar Mountains', 'Turkey', 'Black Sea', 'nature', 'adventure', 'tourism'])
ON CONFLICT (page_type, page_id, locale) DO UPDATE SET
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  updated_at = NOW();

-- Create function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT 'Admin User'
)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Create user in auth.users (this would typically be done through Supabase Auth API)
  -- For now, we'll create a profile that can be linked to an auth user later
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (uuid_generate_v4(), admin_email, admin_name, 'admin')
  RETURNING id INTO user_id;
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role user_role,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.email, p.full_name, p.role, p.avatar_url, p.created_at
  FROM public.profiles p
  WHERE p.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is editor or admin
CREATE OR REPLACE FUNCTION is_editor(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role IN ('admin', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
