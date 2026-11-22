import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { generateProjectSchema } from '@/app/lib/structured-data';
import { ArticleOutline } from '@/components/ArticleOutline';
import { ReadingProgress } from '@/components/ReadingProgress';
import { SITE_URL } from '@/lib/config';
import { getWorkCase, getWorkCases, getWritingPosts } from '@/lib/content';
import {
  getRelatedWritingSlugsForWork,
  STATUS_TONE,
  WORK_CASE_META,
  WORK_CASE_ORDER,
} from '@/lib/work-meta';

type WorkPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const workCases = await getWorkCases();
  return workCases.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workCase = await getWorkCase(slug);

  if (!workCase) {
    return { title: 'Case study not found' };
  }

  const title = workCase.frontmatter.title;
  const description = workCase.frontmatter.summary;
  const canonical = `${SITE_URL}/work/${slug}`;
  const ogImageUrl = `/work/${slug}/og`;

  return {
    // Root layout.tsx title.template appends " · Oscar Ndugbu" once.
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: `${title} · Oscar Ndugbu`,
      description,
      url: canonical,
      siteName: 'Oscar Ndugbu — Staff Backend and Platform Engineer',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — Engineering Case Study by Oscar Ndugbu`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · Oscar Ndugbu`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function WorkCasePage({ params }: WorkPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const [workCase, workCases, writingPosts] = await Promise.all([
    getWorkCase(slug),
    getWorkCases(),
    getWritingPosts(),
  ]);

  if (!workCase) {
    notFound();
  }

  const { title, summary, tags = [] } = workCase.frontmatter;
  const recordMeta = WORK_CASE_META[slug];
  const statusTone = recordMeta ? STATUS_TONE[recordMeta.status] : null;
  const canonical = `${SITE_URL}/work/${slug}`;

  const orderedCases = [...workCases].sort((left, right) => {
    const leftRank = WORK_CASE_ORDER.indexOf(left.slug);
    const rightRank = WORK_CASE_ORDER.indexOf(right.slug);
    return (leftRank === -1 ? 99 : leftRank) - (rightRank === -1 ? 99 : rightRank);
  });
  const currentCaseIndex = orderedCases.findIndex((entry) => entry.slug === slug);
  const previousCase = currentCaseIndex > 0 ? orderedCases[currentCaseIndex - 1] : null;
  const nextCase =
    currentCaseIndex >= 0 && currentCaseIndex < orderedCases.length - 1
      ? orderedCases[currentCaseIndex + 1]
      : null;
  const moreCases = orderedCases.filter((entry) => entry.slug !== slug);

  const relatedWritingSlugs = new Set(getRelatedWritingSlugsForWork(slug));
  const relatedNotes = writingPosts.filter((post) => relatedWritingSlugs.has(post.slug));

  const structuredData =
    slug === 'ml-consulting'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: title,
          description: summary,
          url: canonical,
          provider: {
            '@type': 'Person',
            name: 'Oscar Ndugbu',
            url: SITE_URL,
            jobTitle: 'Staff Backend and Platform Engineer',
          },
        }
      : generateProjectSchema({
          name: title,
          description: summary,
          url: recordMeta?.demoHref ?? canonical,
          category: recordMeta?.domain ?? 'Software Engineering',
          techStack: tags,
          ...(recordMeta?.sourceHref ? { codeRepository: recordMeta.sourceHref } : {}),
        });

  return (
    <>
      <ReadingProgress />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-obsidian-base pb-20 text-white selection:bg-accent-cyan/20 selection:text-accent-cyan"
      >
        <div className="mx-auto max-w-hero px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
            }}
          />

          <Link
            href="/#projects"
            className="inline-flex min-h-touch items-center gap-2 border border-white/15 bg-obsidian-surface px-4 py-2.5 font-mono text-xs tracking-wider text-accent-cyan transition-colors hover:border-accent-cyan/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-base"
          >
            <span aria-hidden="true">←</span>
            <span>BACK TO PROJECTS</span>
          </Link>

          <header className="mt-10 max-w-4xl border-b border-white/10 pb-10 sm:mt-12 sm:pb-12">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-micro font-semibold uppercase tracking-section text-accent-cyan">
                {recordMeta ? recordMeta.domain : 'ENGINEERING CASE STUDY'}
              </p>
              {recordMeta && statusTone ? (
                <span
                  className={`inline-flex min-h-6 items-center gap-1.5 border px-2 py-1 font-mono text-2xs font-semibold uppercase tracking-wider ${statusTone.chip}`}
                >
                  <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${statusTone.dot}`} />
                  {recordMeta.status}
                </span>
              ) : null}
            </div>

            <h1 className="type-display mt-4 max-w-heading font-display font-bold text-white">
              {title}
            </h1>
            <p className="type-lede mt-5 max-w-prose text-zinc-300">{summary}</p>

            {(recordMeta?.demoHref || recordMeta?.sourceHref) ? (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {recordMeta.demoHref ? (
                  <a
                    href={recordMeta.demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-cta items-center justify-center gap-2 bg-accent-cyan px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-obsidian-base transition-colors hover:bg-accent-cyanHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-base"
                  >
                    <span>Live demo</span>
                    <span
                      aria-hidden="true"
                      className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                ) : null}
                {recordMeta.sourceHref ? (
                  <a
                    href={recordMeta.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-cta items-center justify-center gap-2 border border-white/20 bg-obsidian-surface px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent-cyan/60 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                  >
                    <span>View source</span>
                    <span
                      aria-hidden="true"
                      className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}

            {tags.length > 0 ? (
              <ul aria-label="Technologies and topics" className="mt-7 flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <li
                    key={tag}
                    className="inline-flex min-h-chip items-center border border-white/10 bg-obsidian-surface px-2.5 py-1 font-mono text-micro text-zinc-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <div className="work-detail-grid grid gap-12 pt-10 lg:gap-16 lg:pt-14">
            <div className="min-w-0 max-w-prose">
              <article>{workCase.content}</article>

              {(previousCase || nextCase) ? (
                <nav
                  aria-label="Case study pagination"
                  className="mt-14 grid grid-cols-1 gap-3 border-t border-white/10 pt-8 sm:grid-cols-2"
                >
                  {previousCase ? (
                    <Link
                      href={`/work/${previousCase.slug}`}
                      className="group flex min-h-touch flex-col justify-between border border-white/10 bg-obsidian-surface p-4 transition-colors hover:border-accent-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                    >
                      <span className="font-mono text-2xs uppercase tracking-kicker text-zinc-400">
                        ← Previous case study
                      </span>
                      <span className="mt-2 font-display text-base font-semibold text-white group-hover:text-accent-cyan">
                        {previousCase.title}
                      </span>
                      {WORK_CASE_META[previousCase.slug] ? (
                        <span className="mt-1 font-mono text-2xs uppercase tracking-domain text-zinc-400">
                          {WORK_CASE_META[previousCase.slug].domain}
                        </span>
                      ) : null}
                    </Link>
                  ) : (
                    <div aria-hidden="true" className="hidden sm:block" />
                  )}

                  {nextCase ? (
                    <Link
                      href={`/work/${nextCase.slug}`}
                      className="group flex min-h-touch flex-col justify-between border border-white/10 bg-obsidian-surface p-4 text-left transition-colors hover:border-accent-cyan/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:text-right"
                    >
                      <span className="font-mono text-2xs uppercase tracking-kicker text-zinc-400">
                        Next case study ›
                      </span>
                      <span className="mt-2 font-display text-base font-semibold text-white group-hover:text-accent-cyan">
                        {nextCase.title}
                      </span>
                      {WORK_CASE_META[nextCase.slug] ? (
                        <span className="mt-1 font-mono text-2xs uppercase tracking-domain text-zinc-400">
                          {WORK_CASE_META[nextCase.slug].domain}
                        </span>
                      ) : null}
                    </Link>
                  ) : null}
                </nav>
              ) : null}
            </div>

            <aside className="h-fit space-y-6 border-t border-white/10 pt-6 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <ArticleOutline headings={workCase.headings} />

              {recordMeta ? (
                <div className="border border-white/10 bg-obsidian-surface p-4">
                  <p className="font-mono text-2xs font-semibold uppercase tracking-kicker text-accent-cyan">
                    EVIDENCE BOUNDARY
                  </p>
                  <p className="mt-2 text-xs leading-5 text-zinc-300">{recordMeta.evidence}</p>
                </div>
              ) : null}

              {relatedNotes.length > 0 ? (
                <div className="border border-white/10 bg-obsidian-surface p-4">
                  <p className="font-mono text-2xs font-semibold uppercase tracking-kicker text-accent-cyan">
                    RELATED ENGINEERING NOTES
                  </p>
                  <ul className="mt-2 divide-y divide-white/10">
                    {relatedNotes.map((note) => (
                      <li key={note.slug}>
                        <Link
                          href={`/writing/${note.slug}`}
                          className="group flex min-h-touch items-center justify-between gap-2 py-2.5 text-xs leading-5 text-zinc-200 transition-colors hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                        >
                          <span>{note.title}</span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 font-mono text-accent-cyan motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                          >
                            ↗
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div>
                <p className="font-mono text-2xs font-semibold uppercase tracking-kicker text-zinc-400">
                  PROJECT INDEX
                </p>
                <nav aria-label="Other engineering case studies" className="mt-3">
                  <ul className="divide-y divide-white/10 border-t border-b border-white/10">
                    {moreCases.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={`/work/${entry.slug}`}
                          className="group flex min-h-touch items-center justify-between gap-2 py-2.5 text-sm text-zinc-300 transition-colors hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                        >
                          <span className="truncate">{entry.title}</span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 font-mono text-xs text-zinc-400 transition-colors group-hover:text-accent-cyan"
                          >
                            ↗
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <Link
                href="/?intent=consulting#contact"
                className="inline-flex min-h-touch w-full items-center justify-center border border-accent-cyan/40 bg-accent-cyan/10 px-4 py-3 font-mono text-micro font-semibold uppercase tracking-wider text-accent-cyan transition-colors hover:bg-accent-cyan/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
              >
                DISCUSS A SYSTEM
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
