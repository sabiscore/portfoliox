import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { ArticleOutline } from '@/components/ArticleOutline';
import { ReadingProgress } from '@/components/ReadingProgress';
import { StaticSectionIntro } from '@/components/shared/StaticSectionIntro';
import { SITE_URL } from '@/lib/config';
import { getWritingPost, getWritingPosts, type ContentHeading } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import { getRelatedWorkForWriting, STATUS_TONE } from '@/lib/work-meta';

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
  headings: ContentHeading[];
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
  const relatedWork = getRelatedWorkForWriting(slug);
  const currentIndex = allPosts.findIndex((entry) => entry.slug === slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

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
        className="min-h-screen bg-obsidian-base text-white selection:bg-accent-cyan/20 selection:text-accent-cyan"
      >
        <section className="pt-10 pb-20 sm:pt-14">
          <div className="mx-auto max-w-hero px-4 sm:px-6 lg:px-8">
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
                ).replace(/</g, '\u003c'),
              }}
            />

            <Link
              href="/writing"
              className="inline-flex min-h-touch min-w-touch items-center gap-2 border border-white/10 bg-obsidian-surface/90 px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-accent-cyan backdrop-blur-md transition-colors hover:border-accent-cyan/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span aria-hidden="true">←</span>
              <span>BACK TO WRITING</span>
            </Link>

            <div className="work-detail-grid mt-8 grid gap-10 lg:items-start lg:gap-12">
              <div className="min-w-0">
                <header className="mb-10 max-w-prose border-b border-white/10 pb-8">
                  <StaticSectionIntro
                    eyebrowLabel="Engineering Note"
                    headingId="writing-article-heading"
                    title={<>{post.frontmatter.title}</>}
                    description={post.frontmatter.summary}
                    titleClassName="type-section mt-3 font-display font-bold text-white"
                    descriptionClassName="type-lede mt-4 text-zinc-300"
                  />
                  <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400">
                    <time dateTime={post.frontmatter.date} className="text-accent-cyan">
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <span aria-hidden="true" className="text-white/20">
                      //
                    </span>
                    <span className="border border-accent-emerald/30 bg-accent-emerald/10 px-2 py-0.5 text-accent-emerald">
                      {post.readingTime} MIN READ
                    </span>
                    {relatedWork[0] ? (
                      <Link
                        href={`/work/${relatedWork[0].slug}`}
                        className="group inline-flex items-center gap-1.5 border border-white/15 bg-obsidian-surface px-2.5 py-0.5 text-zinc-200 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                      >
                        <span>SYSTEM: {relatedWork[0].title}</span>
                        <span aria-hidden="true" className="text-accent-cyan">
                          ↗
                        </span>
                      </Link>
                    ) : null}
                  </div>
                </header>

                <article className="min-w-0 max-w-prose pb-12">{post.content}</article>

                {(newerPost || olderPost) ? (
                  <nav
                    aria-label="Engineering note pagination"
                    className="mb-12 grid max-w-prose grid-cols-1 gap-3 border-t border-white/10 pt-8 sm:grid-cols-2"
                  >
                    {newerPost ? (
                      <Link
                        href={`/writing/${newerPost.slug}`}
                        className="group flex min-h-touch flex-col justify-between border border-white/10 bg-obsidian-surface p-4 transition-colors hover:border-accent-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                      >
                        <span className="font-mono text-2xs uppercase tracking-kicker text-zinc-400">
                          ← Newer note
                        </span>
                        <span className="mt-2 font-display text-sm font-semibold leading-snug text-white group-hover:text-accent-cyan">
                          {newerPost.title}
                        </span>
                      </Link>
                    ) : (
                      <div aria-hidden="true" className="hidden sm:block" />
                    )}

                    {olderPost ? (
                      <Link
                        href={`/writing/${olderPost.slug}`}
                        className="group flex min-h-touch flex-col justify-between border border-white/10 bg-obsidian-surface p-4 text-left transition-colors hover:border-accent-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:text-right"
                      >
                        <span className="font-mono text-2xs uppercase tracking-kicker text-zinc-400">
                          Previous note ›
                        </span>
                        <span className="mt-2 font-display text-sm font-semibold leading-snug text-white group-hover:text-accent-cyan">
                          {olderPost.title}
                        </span>
                      </Link>
                    ) : null}
                  </nav>
                ) : null}

                {relatedPosts.length > 0 ? (
                  <aside
                    aria-labelledby="related-writing-heading"
                    className="mb-16 border border-white/10 bg-obsidian-surface/90 p-6 backdrop-blur-xl"
                  >
                    <span className="font-mono text-xs uppercase tracking-widest text-accent-cyan">
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
                          className="flex flex-col justify-between border border-white/10 bg-obsidian-base/90 p-5 transition-colors hover:border-accent-cyan/40"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-400">
                              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                              <span aria-hidden="true">•</span>
                              <span className="text-accent-emerald">
                                {entry.readingTime} min read
                              </span>
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
                            className="group mt-5 inline-flex min-h-touch items-center justify-between border border-white/10 bg-obsidian-surface px-4 py-2.5 font-mono text-xs font-medium text-accent-cyan transition-colors hover:border-accent-cyan/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
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
                <ArticleOutline headings={post.headings} />

                {relatedWork.length > 0 ? (
                  <div className="border border-white/10 border-t-2 border-t-accent-cyan/60 bg-obsidian-surface p-5">
                    <span className="font-mono text-2xs font-semibold uppercase tracking-kicker text-accent-cyan">
                      RELATED SYSTEM CASE STUDY
                    </span>
                    <ul className="mt-3 divide-y divide-white/10 border-t border-white/10">
                      {relatedWork.map((workItem) => (
                        <li key={workItem.slug}>
                          <Link
                            href={`/work/${workItem.slug}`}
                            className="group flex min-h-touch flex-col justify-center py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                          >
                            <span className="flex items-center justify-between gap-2">
                              <span className="font-display text-sm font-semibold text-white group-hover:text-accent-cyan">
                                {workItem.title}
                              </span>
                              <span
                                aria-hidden="true"
                                className="font-mono text-xs text-accent-cyan motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                              >
                                ↗
                              </span>
                            </span>
                            <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider text-zinc-400">
                              <span
                                aria-hidden="true"
                                className={`h-1.5 w-1.5 rounded-full ${STATUS_TONE[workItem.status].dot}`}
                              />
                              <span>{workItem.status}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="border border-white/10 bg-obsidian-surface/90 p-5 backdrop-blur-xl">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                    AT A GLANCE
                  </span>
                  <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                    {articleMeta.map((item: { label: string; value: string }) => (
                      <div key={item.label} className="space-y-1">
                        <p className="font-mono text-2xs uppercase tracking-domain text-zinc-400">
                          {item.label}
                        </p>
                        <p className="font-mono text-xs font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {tags.length > 0 ? (
                  <div className="border border-white/10 bg-obsidian-surface/90 p-5 backdrop-blur-xl">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                      TOPICS
                    </span>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      {tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex min-h-chip items-center border border-white/10 bg-obsidian-base px-2.5 py-1 font-mono text-xs text-zinc-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <Link
                  href="/?intent=consulting#contact"
                  className="inline-flex min-h-touch w-full items-center justify-center border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-cyan transition-colors hover:bg-accent-cyan/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  DISCUSS A SYSTEM
                </Link>

                <Link
                  href="/writing"
                  className="inline-flex min-h-touch w-full items-center justify-center border border-white/15 bg-obsidian-surface px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
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
