import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/config';
import { getWorkCases, getWritingPosts } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workCases, writingPosts] = await Promise.all([getWorkCases(), getWritingPosts()]);

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/writing`, changeFrequency: 'weekly', priority: 0.8 },
    ...workCases.map((workCase) => ({
      url: `${SITE_URL}/work/${workCase.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...writingPosts.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      ...(post.date && !Number.isNaN(Date.parse(post.date))
        ? { lastModified: new Date(post.date) }
        : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
