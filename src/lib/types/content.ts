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
  name: {
    tr: string;
    en: string;
  };
  description?: {
    tr: string;
    en: string;
  };
  slug: string;
  order: number;
  published: boolean;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: {
    tr: string;
    en: string;
  };
  description?: {
    tr: string;
    en: string;
  };
  slug: string;
  categoryId: string;
  order: number;
  published: boolean;
}

export interface SiteContent {
  categories: Category[];
  content: ContentItem[];
}

export type Language = 'tr' | 'en';