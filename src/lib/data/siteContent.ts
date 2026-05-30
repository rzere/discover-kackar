/**
 * Static site content (exported from Supabase).
 * Re-run `node scripts/export-static-data.js` after CMS/database updates.
 */
import raw from './static/content.json';
import type { Locale } from '@/lib/utils/translations';

export type SiteLocale = Locale;

export interface StaticPage {
  slug: string;
  locale: string;
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  content: Record<string, unknown>;
}

export interface StaticCategory {
  id: string;
  slug: string;
  locale: string;
  name: string;
  description: string | null;
  content?: {
    header?: string;
    bullets?: string[];
    body?: string;
  } | null;
  icon_name: string | null;
  color_theme: string | null;
  sort_order: number;
  is_active: boolean;
  hero_image_id?: string | null;
  hero_image?: {
    id: string;
    file_path: string;
    alt_text?: string | null;
  } | null;
  subcategories?: StaticSubcategory[];
}

export interface StaticSubcategory {
  id: string;
  category_id: string;
  slug: string;
  locale?: string;
  title: string | Record<string, string>;
  body_text?: string | Record<string, string> | null;
  image_id?: string | null;
  image?: {
    id: string;
    file_path: string;
    alt_text?: string | null;
    caption?: string | null;
  } | null;
  sort_order: number;
  is_active: boolean;
}

export interface StaticFooter {
  locale: string;
  company_name: string;
  company_description: string;
  address: string;
  phone: string;
  email: string;
  social_links: Record<string, string>;
  quick_links: Array<{ title: string; url: string }>;
  legal_links: Array<{ title: string; url: string }>;
  copyright_text: string;
}

export interface StaticCtaCard {
  id: string;
  slug: string;
  title: Record<string, string>;
  description?: Record<string, string> | null;
  button_text: Record<string, string>;
  button_url: string;
  is_active: boolean;
}

export interface StaticContactPage {
  locale: string;
  hero_background_image_url?: string | null;
  hero_title: Record<string, string> | string;
  hero_subtitle: Record<string, string> | string;
  form_title: Record<string, string> | string;
  form_description: Record<string, string> | string;
  info_title: Record<string, string> | string;
  info_description: Record<string, string> | string;
  email_title: Record<string, string> | string;
  email_value: string;
  phone_title: Record<string, string> | string;
  phone_value: string;
  response_title: Record<string, string> | string;
  response_value: Record<string, string> | string;
}

export interface StaticGalleryImage {
  id: string;
  file_path: string;
  alt_text?: string | null;
  caption?: string | null;
  category?: string | null;
}

const data = raw as unknown as {
  pages: StaticPage[];
  categories: Record<string, StaticCategory[]>;
  footer: Record<string, StaticFooter>;
  ctaCards: StaticCtaCard[];
  contactPages: Record<string, StaticContactPage>;
  galleryImages: StaticGalleryImage[];
  exportedAt: string;
};

export const contentExportedAt = data.exportedAt;

export function getPage(slug: string, locale: SiteLocale): StaticPage | null {
  return data.pages.find((p) => p.slug === slug && p.locale === locale) ?? null;
}

export function getHomePage(locale: SiteLocale): StaticPage | null {
  return getPage('home', locale);
}

export function getCategories(locale: SiteLocale): StaticCategory[] {
  return data.categories[locale] ?? [];
}

export function getCategoryBySlug(slug: string, locale: SiteLocale): StaticCategory | null {
  return getCategories(locale).find((c) => c.slug === slug) ?? null;
}

export function getFooter(locale: SiteLocale): StaticFooter | null {
  return data.footer[locale] ?? null;
}

export function getCtaCard(slug: string, locale: SiteLocale) {
  const card = data.ctaCards.find((c) => c.slug === slug && c.is_active);
  if (!card) return null;
  return {
    id: card.id,
    slug: card.slug,
    title: card.title[locale] ?? card.title.en,
    description: card.description?.[locale] ?? card.description?.en,
    buttonText: card.button_text[locale] ?? card.button_text.en,
    buttonUrl: card.button_url,
    isActive: card.is_active,
  };
}

export function getContactPage(locale: SiteLocale): StaticContactPage | null {
  return data.contactPages[locale] ?? null;
}

export function getGalleryImages(): StaticGalleryImage[] {
  return data.galleryImages;
}

/** Resolve JSONB or plain string fields from contact_pages */
export function getLocalizedField(
  field: Record<string, string> | string | null | undefined,
  locale: SiteLocale,
  fallback = ''
): string {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  return field[locale] ?? field.en ?? field.tr ?? fallback;
}
