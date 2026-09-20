// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// FIXED: Was incorrectly populated with WritingPostPage (slug page) content.
//   /writing route was calling notFound() on every request since params.slug
//   is undefined at the non-dynamic segment. This is the correct list page.
// Mobile-native: single-column list → 2-col on sm+.
// Lagos, Nigeria → Global.

import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticSectionIntro } from '@/components/shared/StaticSectionIntro';
import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Writing · Oscar Ndugbu',
  description:
    'Practical writing on architecture decisions, ML trade-offs, and the engineering choices that hold up in production — by Oscar Ndugbu.',
  alternates: { canonical: 'https://www.scardubu.dev/writing' },
  openGraph: {
    title: 'Writing · Oscar Ndugbu',
    description: 'Architecture decisions, ML trade-offs, and practical lessons from production engineering.',
    url: 'https://www.scardubu.dev/writing',
    type: 'website',
  },
};

export default async function WritingPage() {
  const posts = await getWritingPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="pt-[calc(var(--nav-height)+var(--space-12))] pb-[var(--section-py)]">
          <div className="container">
            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="mb-10 sm:mb-14">
              <StaticSectionIntro
                eyebrowNumber="05"
                eyebrowLabel="Writing"
                headingId="writing-list-heading"
                title={<>Writing that makes engineering decisions clear.</>}
                description="Architecture decisions, ML trade-offs, and practical lessons from building and operating production systems."
                eyebrowClassName="mb-[var(--space-2)]"
                titleClassName="text-color-text-primary mt-[var(--space-2)] max-w-[22ch]"
                descriptionClassName="text-color-text-secondary mt-4 max-w-[56ch] text-base leading-8"
              />

              <p className="text-color-text-muted mt-2 font-mono text-xs tracking-widest uppercase">
                {posts.length} articles
              </p>
            </div>

            {/* ── Featured post ────────────────────────────────────────────── */}
            {featured && (
              <article className="glass-full mb-4 rounded-[var(--radius-xl)] p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="pill pill-cyan">Featured</span>
                  <span className="text-color-text-muted font-mono text-xs">
                    {featured.readingTime} min read
                  </span>
                </div>

                <h2 className="text-color-text-primary mt-5 max-w-[28ch] text-xl leading-snug font-bold tracking-tight sm:text-2xl">
                  {featured.title}
                </h2>

                <p className="text-color-text-secondary mt-4 max-w-[64ch] text-base leading-8">
                  {featured.summary}
                </p>

                <div className="text-color-text-muted mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <time dateTime={featured.date} className="font-mono uppercase">
                    {formatDate(featured.date)}
                  </time>
                  {featured.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="pill">
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/writing/${featured.slug}`}
                  className="text-color-film-teal mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[var(--color-cyan-surface)] px-5 py-2.5 text-sm transition focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none sm:w-auto sm:justify-start"
                >
                  Read article →
                </Link>
              </article>
            )}

            {/* ── Article list ─────────────────────────────────────────────── */}
            {rest.length > 0 && (
              <div className="bg-color-border grid gap-px overflow-hidden rounded-[var(--radius-lg)]">
                {rest.map((post) => (
                  <div key={post.slug} className="bg-color-bg">
                    <Link href={`/writing/${post.slug}`} className="block">
                      <article className="writing-row flex min-h-[60px] items-center gap-4 px-4 py-3.5 sm:px-0">
                        {/* Date: hidden on mobile — shown inline */}
                        <time
                          dateTime={post.date}
                          className="text-color-text-muted hidden min-w-28 shrink-0 font-mono text-xs sm:block"
                        >
                          {formatDate(post.date)}
                        </time>

                        <div className="min-w-0 flex-1">
                          <span className="writing-title text-color-text-primary block truncate text-sm font-medium">
                            {post.title}
                          </span>
                          <time
                            dateTime={post.date}
                            className="text-color-text-muted mt-0.5 block font-mono text-[10px] sm:hidden"
                          >
                            {formatDate(post.date)}
                          </time>
                        </div>

                        <div className="ml-3 flex shrink-0 items-center gap-3">
                          {post.tags.slice(0, 1).map((tag) => (
                            <span key={tag} className="pill hidden sm:inline">
                              {tag}
                            </span>
                          ))}
                          <span className="text-color-text-muted text-xs whitespace-nowrap">
                            {post.readingTime} min
                          </span>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {posts.length === 0 && (
              <p className="text-color-text-muted mt-10 text-base">
                No articles published yet. Check back soon.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
