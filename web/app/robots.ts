import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/es/admin',
        '/en/admin',
        '/es/admin/*',
        '/en/admin/*',
        '/api/*',
      ],
    },
    sitemap: 'https://deep-brain-markets.vercel.app/sitemap.xml',
  }
}
