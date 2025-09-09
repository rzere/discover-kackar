export interface ContentItem {
  id: string;
  title: {
    tr: string;
    en: string;
  };
  description?: {
    tr: string;
    en: string;
  };
  content?: {
    tr: string;
    en: string;
  };
  category: string;
  subcategory?: string;
  image?: string;
  images?: string[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  slug: string;
  locale: string;
  name: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  content?: {
    header?: string;
    bullets?: string[];
    body?: string;
  };
  hero_image_id?: string;
  hero_image?: {
    id: string;
    file_path: string;
    alt_text?: string;
  };
  icon_name: string;
  color_theme: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  category_id: string;
  slug: string;
  title: {
    en: string;
    tr: string;
  };
  body_text?: {
    en: string;
    tr: string;
  };
  image_id?: string;
  image?: {
    id: string;
    file_path: string;
    alt_text?: string;
    caption?: string;
  };
  sort_order: number;
  is_active: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  categories: Category[];
  content: ContentItem[];
}

export type Language = 'tr' | 'en';