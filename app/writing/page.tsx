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
import { SITE_URL } from '@/lib/config';
import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Writing · Oscar Ndugbu',
  description:
    'Practical writing on architecture decisions, ML trade-offs, and the engineering choices that hold up in production — by Oscar Ndugbu.',
  alternates: { canonical: `${SITE_URL}/writing` },
  openGraph: {
    title: 'Writing · Oscar Ndugbu',
    description:
      'Architecture decisions, ML trade-offs, and practical lessons from production engineering.',
    url: `${SITE_URL}/writing`,
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Writing · Oscar Ndugbu — Staff Backend and Platform Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing · Oscar Ndugbu',
    description:
      'Architecture decisions, ML trade-offs, and practical lessons from production engineering.',
    images: ['/twitter-image'],
  },
};

export default async function WritingPage() {
  const posts = await getWritingPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-[#08090C] pb-20 text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
    >
      <section
        aria-labelledby="writing-list-heading"
        className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8"
      >
        {/* ── Page header ─────────────────────────────────────────────── */}
        <header className="flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <StaticSectionIntro
            eyebrowLabel="Engineering notes"
            headingId="writing-list-heading"
            title={<>Writing that makes engineering decisions clear.</>}
            description="Architecture decisions, ML trade-offs, and practical lessons from building and operating production systems."
            className="max-w-3xl"
            titleClassName="type-section mt-3 max-w-[22ch] font-display font-bold text-white"
            descriptionClassName="type-lede mt-4 max-w-[56ch] text-zinc-300"
          />

          <div className="flex shrink-0 items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              {posts.length} articles
            </p>
            <a
              href="/rss.xml"
              className="inline-flex min-h-[44px] items-center gap-1.5 border border-white/15 bg-[#0E0E10] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-300 transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
            >
              <span>RSS</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>

        {/* ── Featured post ────────────────────────────────────────────── */}
        {featured && (
          <article className="mt-10 grid gap-6 border border-white/10 border-t-2 border-t-[#00D9FF]/60 bg-[#0E0E10] p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-10">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
                <span aria-hidden="true" className="text-[#00D9FF]/80">
                  01
                </span>
                <span className="border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-2 py-1 font-semibold text-[#00D9FF]">
                  Featured
                </span>
                <time dateTime={featured.date} className="text-zinc-400">
                  {formatDate(featured.date)}
                </time>
              </p>

              <h2 className="mt-5 max-w-[28ch] font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                {featured.title}
              </h2>

              <p className="mt-4 max-w-[64ch] text-base leading-7 text-zinc-300">
                {featured.summary}
              </p>

              <Link
                href={`/writing/${featured.slug}`}
                className="group mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-3 bg-[#00D9FF] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#08090C] transition-colors hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10] sm:w-auto"
              >
                <span>Read article</span>
                <span
                  aria-hidden="true"
                  className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>

            <dl className="grid grid-cols-2 gap-px self-start border border-white/10 bg-white/10 font-mono text-xs lg:grid-cols-1">
              <div className="bg-[#08090C] p-3.5">
                <dt className="text-[10px] uppercase tracking-wider text-zinc-400">Reading time</dt>
                <dd className="mt-1 font-semibold text-zinc-100">{featured.readingTime} min</dd>
              </div>
              <div className="bg-[#08090C] p-3.5">
                <dt className="text-[10px] uppercase tracking-wider text-zinc-400">Topics</dt>
                <dd className="mt-1 font-semibold leading-5 text-zinc-100">
                  {featured.tags.slice(0, 3).join(' · ')}
                </dd>
              </div>
            </dl>
          </article>
        )}

        {/* ── Article index ────────────────────────────────────────────── */}
        {rest.length > 0 && (
          <ol className="mt-10 border-t border-white/10" aria-label="All articles">
            {rest.map((post, index) => (
              <li key={post.slug} className="border-b border-white/10">
                <Link
                  href={`/writing/${post.slug}`}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00D9FF] sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem] sm:px-2"
                >
                  <span aria-hidden="true" className="pt-1 font-mono text-xs text-[#00D9FF]/80">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                  <article className="min-w-0">
                    <h2 className="font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-[#00D9FF] sm:text-xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-[70ch] text-sm leading-6 text-zinc-400">
                      {post.summary}
                    </p>
                  </article>
                  <p className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-zinc-400 sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end sm:pt-1 sm:text-right">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>{post.readingTime} min read</span>
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <p className="mt-10 text-base text-zinc-400">No articles published yet.</p>
        )}
      </section>
    </main>
  );
}
