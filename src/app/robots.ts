import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://discoverkackar.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/temp/',
        '/scripts/',
        '*.json',
        '*.sql',
        '*.md'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
