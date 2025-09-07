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
INSERT INTO public.categories (slug, locale, name, description, content, icon_name, color_theme, sort_order, is_active) VALUES
('nature', 'en', 'Nature', 'Pristine nature of Kaçkar Mountains, glacial lakes, endemic flora and breathtaking landscapes', '{"header": "Discover the Untamed Beauty of Kaçkar Mountains", "bullets": ["Over 50 pristine alpine lakes", "3,937m highest peak - Kaçkar Dağı", "Endemic flora and fauna", "Ancient forests and meadows", "Crystal clear mountain streams"], "body": "The Kaçkar Mountains offer an unparalleled natural experience with their pristine wilderness, glacial lakes, and diverse ecosystems. From the highest peak at 3,937 meters to the crystal-clear alpine lakes, every corner of this region tells a story of natural wonder. The area is home to endemic species found nowhere else in the world, making it a paradise for nature enthusiasts and wildlife photographers."}', 'Leaf', 'from-[#0E4542] to-[#0E4542]', 1, true),
('culture', 'en', 'Culture', 'Multicultural heritage, historic villages, traditional architecture and ancient traditions', '{"header": "Immerse Yourself in Ancient Traditions", "bullets": ["Traditional Laz and Hemshin communities", "Ancient monasteries and churches", "Local handicrafts and textiles", "Traditional music and dance", "Authentic village life"], "body": "The Kaçkar region is a cultural treasure trove where ancient traditions have been preserved for centuries. The local Laz and Hemshin communities maintain their unique customs, language, and way of life. Visitors can experience authentic village life, witness traditional ceremonies, and learn about the rich cultural heritage that has shaped this mountain region."}', 'Users', 'from-[#0E4542] to-[#0E4542]', 2, true),
('gastronomy', 'en', 'Gastronomy', 'Flavors of Black Sea cuisine, local products, traditional dishes and organic tastes', '{"header": "Savor the Authentic Flavors of Black Sea Cuisine", "bullets": ["Fresh mountain trout and seafood", "Traditional corn bread and local cheeses", "Organic honey and mountain herbs", "Traditional tea ceremonies", "Local wine and spirits"], "body": "The culinary traditions of the Kaçkar region reflect the unique blend of mountain and coastal influences. Fresh ingredients from the mountains and the Black Sea create a distinctive cuisine that has been perfected over generations. From the famous mountain trout to traditional corn bread and local cheeses, every meal tells the story of this rich culinary heritage."}', 'ForkKnife', 'from-[#0E4542] to-[#0E4542]', 3, true),
('adventure', 'en', 'Adventure', 'Trekking, mountaineering, highland tours, camping experiences and adrenaline activities', '{"header": "Embark on Epic Mountain Adventures", "bullets": ["Multi-day trekking routes", "Mountaineering to 3,937m peak", "Highland camping experiences", "Rock climbing and bouldering", "Photography expeditions"], "body": "For adventure seekers, the Kaçkar Mountains offer some of Turkey''s most challenging and rewarding outdoor experiences. From multi-day trekking routes through pristine wilderness to mountaineering expeditions to the highest peaks, the region provides endless opportunities for adrenaline-fueled adventures. Whether you''re a seasoned mountaineer or a beginner hiker, there''s an adventure waiting for you."}', 'Mountains', 'from-[#0E4542] to-[#0E4542]', 4, true),
('accommodation', 'en', 'Accommodation', 'Traditional guesthouses, highland houses, camping sites and comfortable accommodation options', '{"header": "Stay in Authentic Mountain Accommodations", "bullets": ["Traditional highland houses", "Cozy guesthouses with local charm", "Mountain camping sites", "Eco-friendly lodges", "Homestay experiences"], "body": "Experience authentic mountain hospitality in traditional accommodations that blend comfort with local culture. From cozy guesthouses in mountain villages to traditional highland houses, each accommodation offers a unique perspective on local life. Many places provide homestay experiences where you can learn about local traditions and enjoy home-cooked meals prepared with fresh, local ingredients."}', 'House', 'from-[#0E4542] to-[#0E4542]', 5, true),
('transportation', 'en', 'Transportation', 'How to reach Kaçkar, local transportation, transfer services and practical information', '{"header": "Plan Your Journey to the Mountains", "bullets": ["Direct flights to Trabzon and Rize", "Scenic road routes from major cities", "Local bus and minibus services", "Private transfer options", "Mountain road accessibility"], "body": "Reaching the Kaçkar Mountains is easier than you might think, with multiple transportation options available. The region is well-connected by air, with direct flights to Trabzon and Rize airports. From there, scenic road routes wind through the mountains, offering breathtaking views along the way. Local transportation services provide convenient access to even the most remote mountain villages."}', 'Car', 'from-[#0E4542] to-[#0E4542]', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
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
each