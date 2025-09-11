export const locales = ['tr', 'en', 'fr', 'de'] as const;
export const defaultLocale = 'tr' as const;

export type Locale = (typeof locales)[number];