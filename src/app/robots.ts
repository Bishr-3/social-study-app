import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'], // Protect admin routes and internal APIs
    },
    sitemap: 'https://socialstudyncs.space/sitemap.xml',
  };
}
