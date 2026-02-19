import { getAllContent } from '@/lib/content'

const SITE_URL = 'https://flipchecker.io'

export default function sitemap() {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/comparison`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/auth/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/auth/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]

  const contentTypes = [
    { type: 'blog', basePath: '/blog', priority: 0.7 },
    { type: 'guide', basePath: '/guide', priority: 0.7 },
    { type: 'comparison', basePath: '/comparison', priority: 0.7 },
    { type: 'categories', basePath: '/categories', priority: 0.6 },
  ]

  const contentPages = contentTypes.flatMap(({ type, basePath, priority }) => {
    const items = getAllContent(type)
    return items.map(item => ({
      url: `${SITE_URL}${basePath}/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.publishedAt || new Date()),
      changeFrequency: 'monthly',
      priority,
    }))
  })

  return [...staticPages, ...contentPages]
}
