import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://denizwatch.com';
const LOCALES = ['fa', 'en'] as const;

const staticPages = [
  { path: '', priority: 1.0, changeFreq: 'weekly' as const },
  { path: '/about', priority: 0.7, changeFreq: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFreq: 'monthly' as const },
  { path: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
  { path: '/collection', priority: 0.9, changeFreq: 'weekly' as const },
  { path: '/warranty', priority: 0.4, changeFreq: 'monthly' as const },
  { path: '/careers', priority: 0.4, changeFreq: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    }
  }

  const [collections, products, posts] = await Promise.all([
    prisma.collection.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.product.findMany({ select: { id: true, updatedAt: true } }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  for (const locale of LOCALES) {
    for (const c of collections) {
      entries.push({
        url: `${SITE_URL}/${locale}/collection/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
    for (const p of products) {
      entries.push({
        url: `${SITE_URL}/${locale}/product/${p.id}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
