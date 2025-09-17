import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://discoverkackar.com'
  const locales = ['tr', 'en', 'fr', 'de']
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/routes',
    '/contact'
  ]

  // Generate sitemap entries for all locales and static pages
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add homepage for each locale
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    })
  })

  // Add other static pages for each locale
  staticPages.slice(1).forEach(page => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  })

  // Add category pages (these would be dynamic in a real implementation)
  // For now, we'll add some common categories
  const categories = [
    'nature',
    'culture', 
    'gastronomy',
    'music-dance',
    'sustainable-tourism',
    'adventure',
    'photography',
    'wellness',
    'heritage'
  ]

  categories.forEach(category => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  })

  return sitemapEntries
}
