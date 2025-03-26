import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://tojson.mechabreak.click/sitemap.xml',
    host: 'https://tojson.mechabreak.click',
  }
} 