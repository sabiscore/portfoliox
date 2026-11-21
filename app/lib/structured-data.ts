import { SITE_URL } from '@/lib/config';

export interface ProjectData {
  name: string;
  description: string;
  url: string;
  category: string;
  techStack: string[];
  datePublished?: string;
  codeRepository?: string;
}

/**
 * SoftwareApplication schema deliberately contains no fabricated offers,
 * aggregate ratings, user counts, or operational metrics.
 */
export function generateProjectSchema(project: ProjectData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
    url: project.url,
    applicationCategory: project.category,
    operatingSystem: 'Cross-platform',
    author: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: SITE_URL,
      jobTitle: 'Staff Backend and Platform Engineer',
      sameAs: ['https://github.com/scardubu', 'https://linkedin.com/in/oscardubu'],
    },
    ...(project.codeRepository
      ? {
          codeRepository: project.codeRepository,
          programmingLanguage: project.techStack,
        }
      : {}),
    ...(project.datePublished ? { datePublished: project.datePublished } : {}),
  };
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Oscar Ndugbu',
    alternateName: 'Scardubu',
    jobTitle: 'Staff Backend and Platform Engineer',
    description:
      'Staff backend and platform engineer building backend services, platform infrastructure, AI systems, and reliable fintech products. Based in Lagos, Nigeria.',
    url: SITE_URL,
    image: `${SITE_URL}/headshot.webp`,
    sameAs: ['https://github.com/scardubu', 'https://linkedin.com/in/oscardubu'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Lagos',
    },
    knowsAbout: [
      'Backend engineering',
      'Platform engineering',
      'Distributed systems',
      'Machine learning infrastructure',
      'FastAPI',
      'PostgreSQL',
      'TypeScript',
      'Python',
    ],
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  image?: string;
  readingTime?: number;
}) {
  const url = `${SITE_URL}/writing/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: SITE_URL,
    },
    image: post.image || `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(post.readingTime ? { timeRequired: `PT${post.readingTime}M` } : {}),
  };
}
