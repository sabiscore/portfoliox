import type { Metadata } from 'next';
import Link from 'next/link';

import { StaticSectionIntro } from '@/components/shared/StaticSectionIntro';
import { SITE_URL } from '@/lib/config';
import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import { getRelatedWorkForWriting } from '@/lib/work-meta';

export const metadata: Metadata = {
  // Root layout.tsx title.template appends " · Oscar Ndugbu" once.
  title: 'Writing',
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
  const featuredWorkLinks = featured ? getRelatedWorkForWriting(featured.slug) : [];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen bg-obsidian-base pb-20 text-white selection:bg-accent-cyan/20 selection:text-accent-cyan"
    >
      <section
        aria-labelledby="writing-list-heading"
        className="mx-auto max-w-hero px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8"
      >
        <header className="flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <StaticSectionIntro
            eyebrowLabel="Engineering notes"
            headingId="writing-list-heading"
            title={<>Writing that makes engineering decisions clear.</>}
            description="Architecture decisions, ML trade-offs, and practical lessons from building and operating production systems."
            className="max-w-prose"
            titleClassName="type-section mt-3 font-display font-bold text-white"
            descriptionClassName="type-lede mt-4 max-w-prose text-zinc-300"
          />

          <div className="flex shrink-0 items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              {posts.length} articles
            </p>
            <a
              href="/rss.xml"
              className="group inline-flex min-h-touch items-center gap-1.5 border border-white/15 bg-obsidian-surface px-3.5 py-2 font-mono text-micro uppercase tracking-wider text-zinc-300 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span>RSS</span>
              <span
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </div>
        </header>

        {featured && (
          <article className="writing-featured-grid mt-10 grid gap-6 border border-white/10 border-t-2 border-t-accent-cyan/60 bg-obsidian-surface p-5 sm:p-8 lg:gap-10">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-3 font-mono text-micro uppercase tracking-domain">
                <span aria-hidden="true" className="text-accent-cyan/80">
                  01
                </span>
                <span className="border border-accent-cyan/40 bg-accent-cyan/10 px-2 py-1 font-semibold text-accent-cyan">
                  Featured
                </span>
                <time dateTime={featured.date} className="text-zinc-400">
                  {formatDate(featured.date)}
                </time>
              </p>

              <h2 className="mt-5 max-w-prose font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
                {featured.title}
              </h2>

              <p className="mt-4 max-w-prose text-base leading-7 text-zinc-300">
                {featured.summary}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={`/writing/${featured.slug}`}
                  className="group inline-flex min-h-cta w-full items-center justify-center gap-3 bg-accent-cyan px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-obsidian-base transition-colors hover:bg-accent-cyanHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-surface sm:w-auto"
                >
                  <span>Read article</span>
                  <span
                    aria-hidden="true"
                    className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>

                {featuredWorkLinks[0] ? (
                  <Link
                    href={`/work/${featuredWorkLinks[0].slug}`}
                    className="group inline-flex min-h-cta w-full items-center justify-center gap-2 border border-white/20 bg-obsidian-base px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:w-auto"
                  >
                    <span>Case study: {featuredWorkLinks[0].title}</span>
                    <span
                      aria-hidden="true"
                      className="text-accent-cyan motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </Link>
                ) : null}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-px self-start border border-white/10 bg-white/10 font-mono text-xs lg:grid-cols-1">
              <div className="bg-obsidian-base p-3.5">
                <dt className="text-2xs uppercase tracking-wider text-zinc-400">Reading time</dt>
                <dd className="mt-1 font-semibold text-zinc-100">{featured.readingTime} min</dd>
              </div>
              <div className="bg-obsidian-base p-3.5">
                <dt className="text-2xs uppercase tracking-wider text-zinc-400">Topics</dt>
                <dd className="mt-1 font-semibold leading-5 text-zinc-100">
                  {featured.tags.slice(0, 3).join(' · ')}
                </dd>
              </div>
            </dl>
          </article>
        )}

        {rest.length > 0 && (
          <ol className="mt-10 border-t border-white/10" aria-label="All articles">
            {rest.map((post, index) => {
              const linkedSystems = getRelatedWorkForWriting(post.slug);
              return (
                <li key={post.slug} className="border-b border-white/10">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="writing-index-row group grid gap-x-4 gap-y-2 py-6 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cyan sm:px-2"
                  >
                    <span aria-hidden="true" className="pt-1 font-mono text-xs text-accent-cyan/80">
                      {String(index + 2).padStart(2, '0')}
                    </span>
                    <article className="min-w-0">
                      <h2 className="font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-accent-cyan sm:text-xl">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 max-w-prose text-sm leading-6 text-zinc-400">
                        {post.summary}
                      </p>
                      {linkedSystems.length > 0 ? (
                        <p className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-2xs uppercase tracking-wider text-zinc-400">
                          <span className="text-accent-cyan">System record:</span>
                          <span>{linkedSystems.map((item) => item.title).join(' · ')}</span>
                        </p>
                      ) : null}
                    </article>
                    {/* Single semantic <time> node styled via responsive grid placement */}
                    <p className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-micro uppercase tracking-wider text-zinc-400 sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end sm:pt-1 sm:text-right">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>{post.readingTime} min read</span>
                    </p>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {posts.length === 0 && (
          <p className="mt-10 text-base text-zinc-400">No articles published yet.</p>
        )}
      </section>
    </main>
  );
}
