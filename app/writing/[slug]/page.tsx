import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ReadingProgress } from '@/components/ReadingProgress';
import { StaticSectionIntro } from '@/components/shared/StaticSectionIntro';
import { getWritingPost, getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  posts: Awaited<ReturnType<typeof getWritingPosts>>
) {
  return posts
    .filter((entry) => entry.slug !== currentSlug)
    .map((entry) => ({
      ...entry,
      sharedTags: entry.tags.filter((tag) => currentTags.includes(tag)).length,
    }))
    .sort((left, right) => {
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

export async function generateStaticParams() {
  const posts = await getWritingPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingPost(slug);

  if (!post) {
    return { title: 'Writing' };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    alternates: { canonical: `https://www.scardubu.dev/writing/${slug}` },
    openGraph: {
      title: `${post.frontmatter.title} · Oscar Ndugbu (Scardubu)`,
      description: post.frontmatter.summary,
      url: `https://www.scardubu.dev/writing/${slug}`,
      type: 'article',
    },
  };
}

function articleJsonLd(title: string, summary: string, date: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: summary,
    datePublished: date,
    url: `https://www.scardubu.dev/writing/${slug}`,
    author: {
      '@type': 'Person',
      name: 'Oscar Ndugbu (Scardubu)',
      url: 'https://www.scardubu.dev',
    },
  };
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = await getWritingPost(slug);
  const allPosts = await getWritingPosts();

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.frontmatter.tags ?? [], allPosts);
  const articleMeta = [
    { label: 'Published', value: formatDate(post.frontmatter.date) },
    { label: 'Reading time', value: `${post.readingTime} min read` },
    { label: 'Surface', value: 'Technical writing' },
  ];

  return (
    <>
      <ReadingProgress />
      <main id="main-content" tabIndex={-1}>
        <section className="pt-[calc(var(--nav-height)+var(--space-12))]">
          <div className="container">
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
                ),
              }}
            />
            <Link href="/writing" className="pill pill-cyan">
              Back to writing
            </Link>
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
              <div className="min-w-0">
                <header className="mt-(--space-8) mb-(--space-10) max-w-[60ch]">
                  <StaticSectionIntro
                    eyebrowLabel="Writing"
                    headingId="writing-article-heading"
                    title={<>{post.frontmatter.title}</>}
                    description={post.frontmatter.summary}
                    titleClassName="text-color-text-primary mt-(--space-2)"
                    descriptionClassName="text-color-text-secondary mt-(--space-4) text-(length:--text-lg)"
                  />
                  <div className="mt-(--space-6) flex flex-wrap gap-(--space-3) text-(--color-text-muted)">
                    <time dateTime={post.frontmatter.date}>
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <span aria-hidden="true">•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </header>

                <article className="prose max-w-none pb-(--space-20)">{post.content}</article>

                {relatedPosts.length ? (
                  <aside
                    aria-labelledby="related-writing-heading"
                    className="glass-no-hover mb-(--space-20) rounded-(--radius-xl) border border-white/10 p-6"
                  >
                    <span className="label">Continue reading</span>
                    <h2 id="related-writing-heading" className="mt-(--space-2)">
                      Related articles
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {relatedPosts.map((entry) => (
                        <article
                          key={entry.slug}
                          className="rounded-(--radius-lg) border border-white/10 p-5"
                        >
                          <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                            <span aria-hidden="true">•</span>
                            <span>{entry.readingTime} min read</span>
                          </div>
                          <h3 className="mt-3 text-white">{entry.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-white/65">{entry.summary}</p>
                          <Link
                            href={`/writing/${entry.slug}`}
                            className="mt-5 inline-flex items-center gap-2 text-sm text-cyan-200 transition hover:text-white"
                          >
                            Read article →
                          </Link>
                        </article>
                      ))}
                    </div>
                  </aside>
                ) : null}
              </div>

              <aside className="space-y-4 xl:sticky xl:top-[calc(var(--nav-height)+var(--space-8))]">
                <div className="glass-no-hover rounded-(--radius-xl) border border-white/10 p-5">
                  <span className="label">At a glance</span>
                  <div className="mt-4 space-y-4">
                    {articleMeta.map((item) => (
                      <div key={item.label} className="space-y-1">
                        <p className="text-color-text-muted text-xs tracking-[0.14em] uppercase">
                          {item.label}
                        </p>
                        <p className="text-sm text-white/80">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {(post.frontmatter.tags ?? []).length ? (
                  <div className="glass-no-hover rounded-(--radius-xl) border border-white/10 p-5">
                    <span className="label">Topics</span>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(post.frontmatter.tags ?? []).map((tag: string) => (
                        <span key={tag} className="pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <Link href="/writing" className="pill pill-cyan inline-flex w-full justify-center">
                  Browse all writing
                </Link>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
