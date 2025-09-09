-- Create footer table for customizable footer content
CREATE TABLE IF NOT EXISTS footer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale VARCHAR(5) NOT NULL CHECK (locale IN ('en', 'tr')),
  company_name VARCHAR(255),
  company_description TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  social_links JSONB DEFAULT '{}',
  quick_links JSONB DEFAULT '[]',
  legal_links JSONB DEFAULT '[]',
  copyright_text TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(locale)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_footer_locale ON footer(locale);
CREATE INDEX IF NOT EXISTS idx_footer_active ON footer(is_active);

-- Insert default footer data for English
INSERT INTO footer (locale, company_name, company_description, address, phone, email, social_links, quick_links, legal_links, copyright_text) VALUES
('en', 
 'Discover Kaçkar', 
 'Your gateway to Turkey''s hidden mountain paradise in the Black Sea region.',
 'Kaçkar Mountains, Black Sea Region, Turkey',
 '+90 (555) 123-4567',
 'info@discoverkackar.com',
 '{"facebook": "https://facebook.com/discoverkackar", "instagram": "https://instagram.com/discoverkackar", "twitter": "https://twitter.com/discoverkackar"}',
 '[{"title": "About Us", "url": "/about"}, {"title": "Contact", "url": "/contact"}, {"title": "Blog", "url": "/blog"}]',
 '[{"title": "Privacy Policy", "url": "/privacy"}, {"title": "Terms of Service", "url": "/terms"}]',
 '© 2024 Discover Kaçkar. All rights reserved.'
);

-- Insert default footer data for Turkish
INSERT INTO footer (locale, company_name, company_description, address, phone, email, social_links, quick_links, legal_links, copyright_text) VALUES
('tr', 
 'Discover Kaçkar', 
 'Karadeniz bölgesindeki Türkiye''nin gizli dağ cennetine açılan kapınız.',
 'Kaçkar Dağları, Karadeniz Bölgesi, Türkiye',
 '+90 (555) 123-4567',
 'info@discoverkackar.com',
 '{"facebook": "https://facebook.com/discoverkackar", "instagram": "https://instagram.com/discoverkackar", "twitter": "https://twitter.com/discoverkackar"}',
 '[{"title": "Hakkımızda", "url": "/about"}, {"title": "İletişim", "url": "/contact"}, {"title": "Blog", "url": "/blog"}]',
 '[{"title": "Gizlilik Politikası", "url": "/privacy"}, {"title": "Kullanım Şartları", "url": "/terms"}]',
 '© 2024 Discover Kaçkar. Tüm hakları saklıdır.'
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_footer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_footer_updated_at
  BEFORE UPDATE ON footer
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_updated_at();
