/**
 * Export all public site content from Supabase into src/lib/data/static/
 * Run: node scripts/export-static-data.js
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local without dotenv
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const OUT_DIR = path.join(__dirname, '../src/lib/data/static');
const LOCALES = ['en', 'tr', 'fr', 'de'];

async function fetchCategoriesWithSubcategories(locale) {
  const { data: categories, error } = await supabase
    .from('categories')
    .select(`*, hero_image:images!categories_hero_image_id_fkey(*)`)
    .eq('locale', locale)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`categories ${locale}: ${error.message}`);

  const { data: enCats, error: enErr } = await supabase
    .from('categories')
    .select(`slug, subcategories(*)`)
    .eq('locale', 'en')
    .eq('is_active', true);

  if (enErr) throw new Error(`subcategories: ${enErr.message}`);

  const subMap = new Map();
  (enCats || []).forEach((c) => {
    if (c.subcategories?.length) subMap.set(c.slug, c.subcategories);
  });

  const imageIds = new Set();
  (enCats || []).forEach((c) => {
    (c.subcategories || []).forEach((s) => {
      if (s.image_id) imageIds.add(s.image_id);
    });
  });

  let imagesMap = new Map();
  if (imageIds.size > 0) {
    const { data: images } = await supabase
      .from('images')
      .select('*')
      .in('id', Array.from(imageIds));
    (images || []).forEach((img) => imagesMap.set(img.id, img));
  }

  return (categories || []).map((cat) => {
    const subs = (subMap.get(cat.slug) || []).map((sub) => ({
      ...sub,
      image: sub.image_id ? imagesMap.get(sub.image_id) || null : null,
    }));
    return { ...cat, subcategories: subs };
  });
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const exportData = {
    exportedAt: new Date().toISOString(),
    pages: [],
    categories: {},
    footer: {},
    ctaCards: [],
    contactPages: {},
    galleryImages: [],
  };

  const { data: pages, error: pagesErr } = await supabase.from('pages').select('*');
  if (pagesErr) throw pagesErr;
  exportData.pages = pages || [];

  for (const locale of LOCALES) {
    exportData.categories[locale] = await fetchCategoriesWithSubcategories(locale);
    console.log(`✓ categories ${locale}: ${exportData.categories[locale].length}`);
  }

  const { data: footer, error: footerErr } = await supabase.from('footer').select('*');
  if (footerErr) throw footerErr;
  (footer || []).forEach((f) => {
    exportData.footer[f.locale] = f;
  });
  console.log(`✓ footer: ${Object.keys(exportData.footer).length} locales`);

  const { data: ctaCards, error: ctaErr } = await supabase.from('cta_cards').select('*');
  if (ctaErr) throw ctaErr;
  exportData.ctaCards = ctaCards || [];
  console.log(`✓ cta_cards: ${exportData.ctaCards.length}`);

  const { data: contactPages, error: cpErr } = await supabase.from('contact_pages').select('*');
  if (cpErr) throw cpErr;
  (contactPages || []).forEach((cp) => {
    exportData.contactPages[cp.locale] = cp;
  });
  console.log(`✓ contact_pages: ${Object.keys(exportData.contactPages).length}`);

  const { data: galleryImages, error: imgErr } = await supabase
    .from('images')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });
  if (imgErr) throw imgErr;
  exportData.galleryImages = galleryImages || [];
  console.log(`✓ gallery images: ${exportData.galleryImages.length}`);

  const jsonPath = path.join(OUT_DIR, 'content.json');
  fs.writeFileSync(jsonPath, JSON.stringify(exportData, null, 2));
  console.log(`\nWrote ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
