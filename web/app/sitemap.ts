import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://deep-brain-markets.vercel.app'
  const languages = ['es', 'en']
  const routes = ['', '/contacto', '/servicios/legal-contable', '/servicios/legal-contable/aduanas-comercio-exterior', '/servicios/legal-contable/derecho-mercantil', '/blog']

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Static routes for each language
  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
      })
    })

    // Blog posts for each language
    const slugs = getAllSlugs(lang as 'es' | 'en')
    slugs.forEach((slug) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })
  })

  return sitemapEntries
}
