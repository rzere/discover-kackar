-- Create contact_pages table for dynamic multilingual contact page content
CREATE TABLE IF NOT EXISTS contact_pages (
  id SERIAL PRIMARY KEY,
  locale VARCHAR(5) NOT NULL,
  hero_title JSONB NOT NULL, -- Multilingual hero title
  hero_subtitle JSONB NOT NULL, -- Multilingual hero subtitle
  form_title JSONB NOT NULL, -- Multilingual form title
  form_description JSONB NOT NULL, -- Multilingual form description
  info_title JSONB NOT NULL, -- Multilingual info section title
  info_description JSONB NOT NULL, -- Multilingual info section description
  email_title JSONB NOT NULL, -- Multilingual email title
  email_value VARCHAR(255) NOT NULL, -- Email address
  phone_title JSONB NOT NULL, -- Multilingual phone title
  phone_value VARCHAR(50) NOT NULL, -- Phone number
  response_title JSONB NOT NULL, -- Multilingual response time title
  response_value JSONB NOT NULL, -- Multilingual response time value
  hero_background_image_id VARCHAR(255), -- Background image for hero section
  hero_background_image_url VARCHAR(500), -- Direct URL to background image
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(locale)
);

-- Insert default English content
INSERT INTO contact_pages (
  locale,
  hero_title,
  hero_subtitle,
  form_title,
  form_description,
  info_title,
  info_description,
  email_title,
  email_value,
  phone_title,
  phone_value,
  response_title,
  response_value
) VALUES (
  'en',
  '{"en": "Contact Us", "tr": "İletişime Geçin"}',
  '{"en": "Get in touch with us for any questions about your Kaçkar adventure", "tr": "Kaçkar maceranız hakkında sorularınız için bizimle iletişime geçin"}',
  '{"en": "Send us a Message", "tr": "Bize Mesaj Gönderin"}',
  '{"en": "Fill out the form below and we''ll get back to you within 24 hours", "tr": "Aşağıdaki formu doldurun, 24 saat içinde size dönüş yapacağız"}',
  '{"en": "Get in Touch", "tr": "İletişime Geçin"}',
  '{"en": "We''re here to help you plan your perfect Kaçkar adventure", "tr": "Mükemmel Kaçkar maceranızı planlamanıza yardımcı olmak için buradayız"}',
  '{"en": "Email Us", "tr": "E-posta Gönderin"}',
  'info@discoverkackar.com',
  '{"en": "Call Us", "tr": "Bizi Arayın"}',
  '+90 (555) 123-4567',
  '{"en": "Response Time", "tr": "Yanıt Süresi"}',
  '{"en": "Within 24 hours", "tr": "24 saat içinde"}'
);

-- Insert default Turkish content
INSERT INTO contact_pages (
  locale,
  hero_title,
  hero_subtitle,
  form_title,
  form_description,
  info_title,
  info_description,
  email_title,
  email_value,
  phone_title,
  phone_value,
  response_title,
  response_value
) VALUES (
  'tr',
  '{"en": "Contact Us", "tr": "İletişime Geçin"}',
  '{"en": "Get in touch with us for any questions about your Kaçkar adventure", "tr": "Kaçkar maceranız hakkında sorularınız için bizimle iletişime geçin"}',
  '{"en": "Send us a Message", "tr": "Bize Mesaj Gönderin"}',
  '{"en": "Fill out the form below and we''ll get back to you within 24 hours", "tr": "Aşağıdaki formu doldurun, 24 saat içinde size dönüş yapacağız"}',
  '{"en": "Get in Touch", "tr": "İletişime Geçin"}',
  '{"en": "We''re here to help you plan your perfect Kaçkar adventure", "tr": "Mükemmel Kaçkar maceranızı planlamanıza yardımcı olmak için buradayız"}',
  '{"en": "Email Us", "tr": "E-posta Gönderin"}',
  'info@discoverkackar.com',
  '{"en": "Call Us", "tr": "Bizi Arayın"}',
  '+90 (555) 123-4567',
  '{"en": "Response Time", "tr": "Yanıt Süresi"}',
  '{"en": "Within 24 hours", "tr": "24 saat içinde"}'
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_pages_updated_at
  BEFORE UPDATE ON contact_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_pages_updated_at();

-- Enable RLS
ALTER TABLE contact_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Contact pages are viewable by everyone" ON contact_pages
  FOR SELECT USING (true);

CREATE POLICY "Contact pages are manageable by admins" ON contact_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
