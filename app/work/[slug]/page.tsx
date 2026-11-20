import type { Metadata } from 'next';
import type { JSX } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Footer } from '@/components/Footer';
import { getWorkCase, getWorkCases } from '@/lib/content';
import { SITE_URL } from '@/lib/config';

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
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · Oscar Ndugbu`,
      description,
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
  const moreCases = workCases.filter((entry) => entry.slug !== slug).slice(0, 3);

  return (
    <>
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen bg-[#08090C] pb-20 text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
      >
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <Link
            href="/#projects"
            className="inline-flex min-h-[44px] items-center gap-2 border border-white/15 bg-[#0E0E10] px-4 py-2.5 font-mono text-xs tracking-wider text-[#00D9FF] transition-colors hover:border-[#00D9FF]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C]"
          >
            <span aria-hidden="true">←</span>
            <span>BACK TO PROJECTS</span>
          </Link>

          <header className="mt-10 max-w-4xl border-b border-white/10 pb-10 sm:mt-14 sm:pb-12">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00D9FF]">
              ENGINEERING CASE STUDY
            </p>
            <h1 className="mt-4 max-w-[18ch] font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-[68ch] text-base leading-8 text-zinc-300 sm:text-lg">
              {summary}
            </p>
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

          <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16 lg:pt-14">
            <article className="prose prose-invert max-w-[72ch] prose-headings:font-display prose-headings:tracking-tight prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h2:text-white prose-h3:text-[#00D9FF] prose-p:leading-8 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-a:text-[#00D9FF] prose-a:underline-offset-4 hover:prose-a:text-white prose-pre:overflow-x-auto prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#0E0E10] prose-code:before:content-none prose-code:after:content-none">
              {workCase.content}
            </article>

            <aside className="h-fit border-t border-white/10 pt-6 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                PROJECT INDEX
              </p>
              <nav aria-label="Other engineering case studies" className="mt-4">
                <ul className="space-y-2">
                  {moreCases.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/work/${entry.slug}`}
                        className="block min-h-[44px] border-b border-white/10 py-3 text-sm text-zinc-300 transition-colors hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                      >
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Link
                href="/#contact"
                className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-3 font-mono text-[11px] font-semibold tracking-wider text-[#00D9FF] transition-colors hover:bg-[#00D9FF]/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
              >
                DISCUSS A SYSTEM
              </Link>
              <p className="mt-4 text-xs leading-6 text-zinc-500">
                Implementation notes and evidence boundaries are stated in the project record. Private
                operational artifacts are not presented as public benchmarks.
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
