import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArchDecision,
  type ArchDecisionProps,
} from '@/components/ArchDecision';
import { TechTag } from '@/components/shared/Techtag';
// TODO(wire-existing): Verify canonical work/case-study loader among lib/projects.ts, lib/work-meta.ts, or lib/content.ts
import { getAllCaseStudies, getCaseStudyBySlug } from '@/lib/projects';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export interface CaseStudyDetail {
  slug: string;
  title: string;
  summary: string;
  role: string;
  status: string;
  category?: string;
  timeframe?: string;
  stack: readonly string[];
  metrics?: ReadonlyArray<{ label: string; value: string }>;
  decisions?: readonly ArchDecisionProps[];
  liveUrl?: string;
  repoUrl?: string;
  content: React.ReactNode;
}

function normalizeSnapshotStatus(status: string, category?: string): string {
  const cleanStatus = status.trim();
  const cleanCategory = category?.trim();
  if (!cleanCategory) return cleanStatus;
  if (cleanStatus.toLowerCase().includes(cleanCategory.toLowerCase())) {
    return cleanStatus;
  }
  return `${cleanCategory} · ${cleanStatus}`;
}

export async function generateStaticParams() {
  const studies = await getAllCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study: CaseStudyDetail | null = await getCaseStudyBySlug(slug);

  if (!study) {
    return { title: 'Case Study Not Found' };
  }

  return {
    // Root layout.tsx appends " · Oscar Ndugbu" once
    title: study.title,
    description: study.summary,
    alternates: {
      canonical: `/work/${study.slug}`,
    },
    openGraph: {
      type: 'article',
      title: study.title,
      description: study.summary,
      url: `/work/${study.slug}`,
      images: [`/work/${study.slug}/og`],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study: CaseStudyDetail | null = await getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const snapshotLabel = normalizeSnapshotStatus(study.status, study.category);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/#work"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-zinc-400 transition-colors duration-200 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Selected Systems
        </Link>
      </nav>

      <article>
        <header className="border-b border-white/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
            {snapshotLabel}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            {study.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {study.summary}
          </p>

          {/* Snapshot Metadata Grid */}
          <dl className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-zinc-950/90 p-5 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium text-zinc-100">
                {study.role}
              </dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                Status
              </dt>
              <dd className="mt-1 text-sm font-medium text-emerald-300">
                {study.status}
              </dd>
            </div>

            {study.timeframe && (
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Timeline
                </dt>
                <dd className="mt-1 font-mono text-sm tabular-nums text-zinc-100">
                  {study.timeframe}
                </dd>
              </div>
            )}
          </dl>

          {/* Stack & Action Links */}
          {study.stack.length > 0 && (
            <ul
              aria-label={`${study.title} stack`}
              className="mt-5 flex flex-wrap gap-2"
            >
              {study.stack.map((tech) => (
                <li key={tech}>
                  <TechTag label={tech} />
                </li>
              ))}
            </ul>
          )}

          {(study.liveUrl || study.repoUrl) && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {study.liveUrl && (
                <a
                  href={study.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-400 px-5 py-2.5 font-mono text-xs font-semibold text-zinc-950 transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
                >
                  Open Live System
                </a>
              )}

              {study.repoUrl && (
                <a
                  href={study.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 px-5 py-2.5 font-mono text-xs font-medium text-zinc-100 transition-colors duration-200 hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
                >
                  Inspect Repository
                </a>
              )}
            </div>
          )}
        </header>

        {/* Verified Proof Metrics */}
        {study.metrics && study.metrics.length > 0 && (
          <section aria-labelledby="case-metrics-heading" className="mt-8">
            <h2
              id="case-metrics-heading"
              className="font-mono text-xs uppercase tracking-widest text-zinc-400"
            >
              Verified Evidence
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {study.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-zinc-900/70 px-4 py-3.5"
                >
                  <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                    {metric.label}
                  </dt>
                  <dd className="mt-1 font-mono text-base font-semibold tabular-nums text-zinc-50">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Structured Architectural Decisions */}
        {study.decisions && study.decisions.length > 0 && (
          <section aria-labelledby="case-decisions-heading" className="mt-10">
            <h2
              id="case-decisions-heading"
              className="font-mono text-xs uppercase tracking-widest text-zinc-400"
            >
              Key Architectural Decisions
            </h2>
            <div className="mt-3">
              {study.decisions.map((decision, index) => (
                <ArchDecision
                  key={decision.title ?? `${study.slug}-decision-${index}`}
                  {...decision}
                />
              ))}
            </div>
          </section>
        )}

        {/* MDX Case Study Narrative */}
        <div className="prose prose-invert prose-zinc mt-10 max-w-none prose-headings:tracking-tight prose-a:text-cyan-400 prose-code:font-mono">
          {study.content}
        </div>
      </article>

      {/* Conversion Footer */}
      <aside className="mt-16 rounded-xl border border-white/10 bg-zinc-950/90 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
            Next Step
          </p>
          <p className="mt-1 text-base font-semibold text-zinc-100">
            Working through similar reliability or scale constraints?
          </p>
        </div>

        <Link
          href="/#contact"
          className="mt-4 inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-cyan-400 px-5 py-2.5 font-mono text-xs font-semibold text-zinc-950 transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:mt-0 motion-reduce:transition-none"
        >
          Discuss a System
        </Link>
      </aside>
    </main>
  );
}
