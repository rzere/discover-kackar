-- Create CTA Cards table for editable contact buttons
CREATE TABLE IF NOT EXISTS cta_cards (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  title JSONB NOT NULL, -- Multilingual title
  description JSONB, -- Multilingual description
  button_text JSONB NOT NULL, -- Multilingual button text
  button_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default Contact Us CTA card
INSERT INTO cta_cards (slug, title, description, button_text, button_url) VALUES 
(
  'plan-your-trip',
  '{"en": "Plan Your Trip", "tr": "Seyahatinizi Planlayın"}',
  '{"en": "Ready to explore the beautiful Kaçkar Mountains? Let us help you plan the perfect adventure.", "tr": "Güzel Kaçkar Dağları\nı keşfetmeye hazır mısınız? Mükemmel macerayı planlamanıza yardımcı olalım."}',
  '{"en": "Contact Us", "tr": "İletişime Geçin"}',
  '/contact'
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cta_cards_updated_at 
    BEFORE UPDATE ON cta_cards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE cta_cards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "CTA cards are viewable by everyone" ON cta_cards
    FOR SELECT USING (is_active = true);

CREATE POLICY "CTA cards are manageable by admins" ON cta_cards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                'admin@discoverkackar.com',
                'ruz@discoverkackar.com'
            )
        )
    );
