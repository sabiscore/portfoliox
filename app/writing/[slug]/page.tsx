import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { ReadingProgress } from '@/components/ReadingProgress';
import { StaticSectionIntro } from '@/components/shared/StaticSectionIntro';
import { getWritingPost, getWritingPosts } from '@/lib/content';
import { SITE_URL } from '@/lib/config';
import { formatDate } from '@/lib/utils';

interface WritingPostSummary {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readingTime: number | string;
  tags: string[];
}

interface RankedWritingPost extends WritingPostSummary {
  sharedTags: number;
}

interface WritingPostFrontmatter {
  title: string;
  summary: string;
  date: string;
  tags?: string[];
}

interface WritingPostDetail {
  frontmatter: WritingPostFrontmatter;
  readingTime: number | string;
  content: ReactNode;
}

function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  posts: WritingPostSummary[]
): RankedWritingPost[] {
  return posts
    .filter((entry: WritingPostSummary) => entry.slug !== currentSlug)
    .map(
      (entry: WritingPostSummary): RankedWritingPost => ({
        ...entry,
        sharedTags: (entry.tags ?? []).filter((tag: string) => currentTags.includes(tag)).length,
      })
    )
    .sort((left: RankedWritingPost, right: RankedWritingPost) => {
      if (right.sharedTags !== left.sharedTags) {
        return right.sharedTags - left.sharedTags;
      }

      return new Date(right.date).getTime() - new Date(left.date).getTime();
    })
    .slice(0, 2);
}

type WritingPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = (await getWritingPosts()) as WritingPostSummary[];
  return posts.map((post: WritingPostSummary) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getWritingPost(slug)) as WritingPostDetail | null;

  if (!post) {
    return { title: 'Writing' };
  }

  return {
    // Root layout.tsx title.template appends " · Oscar Ndugbu" once.
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    alternates: { canonical: `${SITE_URL}/writing/${slug}` },
    openGraph: {
      title: `${post.frontmatter.title} · Oscar Ndugbu`,
      description: post.frontmatter.summary,
      url: `${SITE_URL}/writing/${slug}`,
      type: 'article',
      publishedTime: post.frontmatter.date,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${post.frontmatter.title} · Oscar Ndugbu`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.frontmatter.title} · Oscar Ndugbu`,
      description: post.frontmatter.summary,
      images: ['/twitter-image'],
    },
  };
}

function articleJsonLd(title: string, summary: string, date: string, slug: string) {
  const url = `${SITE_URL}/writing/${slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: summary,
    datePublished: date,
    dateModified: date,
    url,
    image: `${SITE_URL}/opengraph-image`,
    author: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      alternateName: 'Scardubu',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Oscar Ndugbu',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = (await getWritingPost(slug)) as WritingPostDetail | null;
  const allPosts = (await getWritingPosts()) as WritingPostSummary[];

  if (!post) {
    notFound();
  }

  const tags: string[] = post.frontmatter.tags ?? [];
  const relatedPosts = getRelatedPosts(slug, tags, allPosts);
  const articleMeta: Array<{ label: string; value: string }> = [
    { label: 'Published', value: formatDate(post.frontmatter.date) },
    { label: 'Reading time', value: `${post.readingTime} min read` },
    { label: 'Author', value: 'Oscar Ndugbu' },
  ];

  return (
    <>
      <ReadingProgress />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-[#08090C] text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
      >
        <section className="pt-10 pb-20 sm:pt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(
                  articleJsonLd(
                    post.frontmatter.title,
                    post.frontmatter.summary,
                    post.frontmatter.date,
                    slug
                  )
                ).replace(/</g, '\\u003c'),
              }}
            />

            <Link
              href="/writing"
              className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2 border border-white/10 bg-[#0E0E10]/90 px-4 py-2.5 font-mono text-xs font-medium tracking-wider text-[#00D9FF] uppercase backdrop-blur-md transition-colors hover:border-[#00D9FF]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
            >
              <span aria-hidden="true">←</span>
              <span>BACK TO WRITING</span>
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-12">
              <div className="min-w-0">
                <header className="mb-10 max-w-[65ch] border-b border-white/10 pb-8">
                  <StaticSectionIntro
                    eyebrowLabel="Engineering Note"
                    headingId="writing-article-heading"
                    title={<>{post.frontmatter.title}</>}
                    description={post.frontmatter.summary}
                    titleClassName="type-section mt-3 font-display font-bold text-white"
                    descriptionClassName="type-lede mt-4 text-zinc-300"
                  />
                  <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400">
                    <time dateTime={post.frontmatter.date} className="text-[#00D9FF]">
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <span aria-hidden="true" className="text-white/20">
                      //
                    </span>
                    <span className="border border-[#00FF66]/30 bg-[#00FF66]/10 px-2 py-0.5 text-[#00FF66]">
                      {post.readingTime} MIN READ
                    </span>
                  </div>
                </header>

                <article className="min-w-0 max-w-[72ch] pb-16">
                  {post.content}
                </article>

                {relatedPosts.length > 0 ? (
                  <aside
                    aria-labelledby="related-writing-heading"
                    className="mb-16 border border-white/10 bg-[#0E0E10]/90 p-6 backdrop-blur-xl"
                  >
                    <span className="font-mono text-xs tracking-widest text-[#00D9FF] uppercase">
                      CONTINUE READING // RELATED NOTES
                    </span>
                    <h2
                      id="related-writing-heading"
                      className="mt-2 font-display text-2xl font-bold text-white"
                    >
                      Related Engineering Notes
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {relatedPosts.map((entry: RankedWritingPost) => (
                        <article
                          key={entry.slug}
                          className="flex flex-col justify-between border border-white/10 bg-[#08090C]/90 p-5 transition-colors hover:border-[#00D9FF]/40"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-400">
                              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                              <span aria-hidden="true">•</span>
                              <span className="text-[#00FF66]">{entry.readingTime} min read</span>
                            </div>
                            <h3 className="mt-3 font-display text-lg font-bold text-white">
                              {entry.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                              {entry.summary}
                            </p>
                          </div>

                          <Link
                            href={`/writing/${entry.slug}`}
                            className="group mt-5 inline-flex min-h-[44px] items-center justify-between border border-white/10 bg-[#0E0E10] px-4 py-2.5 font-mono text-xs font-medium text-[#00D9FF] transition-colors hover:border-[#00D9FF]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                          >
                            <span>READ ARTICLE</span>
                            <span
                              aria-hidden="true"
                              className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                            >
                              ↗
                            </span>
                          </Link>
                        </article>
                      ))}
                    </div>
                  </aside>
                ) : null}
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="border border-white/10 bg-[#0E0E10]/90 p-5 backdrop-blur-xl">
                  <span className="font-mono text-xs font-semibold tracking-wider text-[#00D9FF] uppercase">
                    AT A GLANCE
                  </span>
                  <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                    {articleMeta.map((item: { label: string; value: string }) => (
                      <div key={item.label} className="space-y-1">
                        <p className="font-mono text-[10px] tracking-[0.14em] text-zinc-400 uppercase">
                          {item.label}
                        </p>
                        <p className="font-mono text-xs font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {tags.length > 0 ? (
                  <div className="border border-white/10 bg-[#0E0E10]/90 p-5 backdrop-blur-xl">
                    <span className="font-mono text-xs font-semibold tracking-wider text-[#00D9FF] uppercase">
                      TOPICS
                    </span>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      {tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex min-h-[32px] items-center border border-white/10 bg-[#08090C] px-2.5 py-1 font-mono text-xs text-zinc-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <Link
                  href="/#contact"
                  className="inline-flex min-h-[44px] w-full items-center justify-center border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-[#00D9FF] uppercase transition-colors hover:bg-[#00D9FF]/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  DISCUSS A SYSTEM
                </Link>

                <Link
                  href="/writing"
                  className="inline-flex min-h-[44px] w-full items-center justify-center border border-white/15 bg-[#0E0E10] px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-zinc-200 uppercase transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  ALL WRITING
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
