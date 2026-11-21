import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { generateProjectSchema } from '@/app/lib/structured-data';
import { ReadingProgress } from '@/components/ReadingProgress';
import { getWorkCase, getWorkCases } from '@/lib/content';
import { SITE_URL } from '@/lib/config';
import { STATUS_TONE, WORK_CASE_META, WORK_CASE_ORDER } from '@/lib/work-meta';

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
    title: `${title} — Engineering Case Study`,
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
  const [workCase, workCases] = await Promise.all([getWorkCase(slug), getWorkCases()]);

  if (!workCase) {
    notFound();
  }

  const { title, summary, tags = [] } = workCase.frontmatter;
  const recordMeta = WORK_CASE_META[slug];
  const statusTone = recordMeta ? STATUS_TONE[recordMeta.status] : null;
  const canonical = `${SITE_URL}/work/${slug}`;

  const moreCases = workCases
    .filter((entry) => entry.slug !== slug)
    .sort((left, right) => {
      const leftRank = WORK_CASE_ORDER.indexOf(left.slug);
      const rightRank = WORK_CASE_ORDER.indexOf(right.slug);
      return (leftRank === -1 ? 99 : leftRank) - (rightRank === -1 ? 99 : rightRank);
    });

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
        className="min-h-screen bg-[#08090C] pb-20 text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
      >
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
            }}
          />

          <Link
            href="/#projects"
            className="inline-flex min-h-[44px] items-center gap-2 border border-white/15 bg-[#0E0E10] px-4 py-2.5 font-mono text-xs tracking-wider text-[#00D9FF] transition-colors hover:border-[#00D9FF]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
          >
            <span aria-hidden="true">←</span>
            <span>BACK TO PROJECTS</span>
          </Link>

          <header className="mt-10 max-w-4xl border-b border-white/10 pb-10 sm:mt-12 sm:pb-12">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00D9FF]">
                {recordMeta ? recordMeta.domain : 'ENGINEERING CASE STUDY'}
              </p>
              {recordMeta && statusTone ? (
                <span
                  className={`inline-flex min-h-6 items-center gap-1.5 border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${statusTone.chip}`}
                >
                  <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${statusTone.dot}`} />
                  {recordMeta.status}
                </span>
              ) : null}
            </div>

            <h1 className="type-display mt-4 max-w-[18ch] font-display font-bold text-white">
              {title}
            </h1>
            <p className="type-lede mt-5 max-w-[68ch] text-zinc-300">{summary}</p>

            {(recordMeta?.demoHref || recordMeta?.sourceHref) ? (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {recordMeta.demoHref ? (
                  <a
                    href={recordMeta.demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#00D9FF] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#08090C] transition-colors hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
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
                    className="group inline-flex min-h-[48px] items-center justify-center gap-2 border border-white/20 bg-[#0E0E10] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/60 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
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
                    className="inline-flex min-h-[32px] items-center border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16 lg:pt-14">
            <article className="min-w-0 max-w-[72ch]">{workCase.content}</article>

            <aside className="h-fit space-y-6 border-t border-white/10 pt-6 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              {recordMeta ? (
                <div className="border border-white/10 bg-[#0E0E10] p-4">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00D9FF]">
                    EVIDENCE BOUNDARY
                  </p>
                  <p className="mt-2 text-xs leading-5 text-zinc-300">{recordMeta.evidence}</p>
                </div>
              ) : null}

              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  PROJECT INDEX
                </p>
                <nav aria-label="Other engineering case studies" className="mt-3">
                  <ul className="divide-y divide-white/10 border-t border-b border-white/10">
                    {moreCases.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={`/work/${entry.slug}`}
                          className="group flex min-h-[44px] items-center justify-between gap-2 py-2.5 text-sm text-zinc-300 transition-colors hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                        >
                          <span className="truncate">{entry.title}</span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 font-mono text-xs text-zinc-500 transition-colors group-hover:text-[#00D9FF]"
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
                href="/#contact"
                className="inline-flex min-h-[44px] w-full items-center justify-center border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00D9FF] transition-colors hover:bg-[#00D9FF]/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
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
