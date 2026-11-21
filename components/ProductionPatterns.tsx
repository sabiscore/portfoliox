import type { JSX } from 'react';
import Link from 'next/link';

import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

interface FailureBoundaryPattern {
  id: string;
  domain: string;
  boundaryName: string;
  headline: string;
  mechanism: string;
  evidenceBoundary: string;
  evidenceRecord: string;
  href: string;
}

const FAILURE_BOUNDARY_PATTERNS: readonly FailureBoundaryPattern[] = [
  {
    id: 'rls-queue-boundary',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    boundaryName: 'Tenant scope + idempotency',
    headline: 'Tenant context and retry behavior are treated as explicit boundaries.',
    mechanism:
      'TaxBridge combines PostgreSQL row-level security, transaction-scoped organization context, and idempotent background jobs. Database policy configuration and NRS integration remain active validation work.',
    evidenceBoundary:
      'Active build. NRS DigiTax integration and tenant-policy validation remain in progress.',
    evidenceRecord: 'TaxBridge engineering case study',
    href: '/work/taxbridge',
  },
  {
    id: 'cgroup-ooc-boundary',
    domain: 'QUANTITATIVE ML · FEATURE ENGINEERING',
    boundaryName: 'Out-of-core + fallback',
    headline: 'Resource pressure and upstream data failures have an explicit design response.',
    mechanism:
      'SabiScore uses Polars and DuckDB for analytical feature processing, model-aware cache versioning, and a lower-confidence fallback path when preferred dependencies are unavailable.',
    evidenceBoundary:
      'Public product demo. Operational uptime, memory, latency, and calibration reports are not published as public benchmarks.',
    evidenceRecord: 'SabiScore architecture and evaluation notes',
    href: '/work/sabiscore',
  },
  {
    id: 'checkpoint-recovery-boundary',
    domain: 'AI WORKFLOWS · MEDIA PIPELINE',
    boundaryName: 'Checkpointed stage recovery',
    headline: 'Long-running work is divided into stages with reviewable recovery points.',
    mechanism:
      'The Yap Engine record describes content-addressed stage inputs, intermediate artifact persistence, local model routing, and deterministic media assembly to avoid replaying completed stages.',
    evidenceBoundary:
      'Public source and architecture record. No production throughput or availability SLO is asserted here.',
    evidenceRecord: 'SwarmXQ and Yap Engine case study',
    href: '/work/swarmxq',
  },
];

/** Newest three published notes (content/writing, sorted by date in lib/content). */
async function LatestNotes(): Promise<JSX.Element | null> {
  const latestNotes = (await getWritingPosts()).slice(0, 3);
  if (latestNotes.length === 0) return null;

  return (
      <div className="border-t border-white/10 pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3
            id="latest-notes-heading"
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300"
          >
            The reasoning, written down
          </h3>
          <Link
            href="/writing"
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#00D9FF] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            <span>All engineering notes</span>
            <span
              aria-hidden="true"
              className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
        <ol
          aria-labelledby="latest-notes-heading"
          className="mt-4 divide-y divide-white/10 border-y border-white/10"
        >
          {latestNotes.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/writing/${note.slug}`}
                className="group grid gap-1 py-4 transition-colors hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00D9FF] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline sm:gap-6 sm:px-2"
              >
                <span className="font-display text-base font-semibold leading-snug text-white group-hover:text-[#00D9FF]">
                  {note.title}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                  <time dateTime={note.date}>{formatDate(note.date)}</time>
                  {' · '}
                  {note.readingTime} min read
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
  );
}

export function ProductionPatterns(): JSX.Element {
  return (
    <section
      id="failure-modes"
      aria-labelledby="failure-modes-heading"
      className="w-full border-b border-white/10 bg-[#08090C] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="max-w-3xl space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00D9FF]">
            02 // ENGINEERING DECISIONS
          </p>
          <h2
            id="failure-modes-heading"
            className="type-section font-display font-bold text-white"
          >
            Failure modes, designed deliberately.
          </h2>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            The project records focus on what can fail, which boundary contains the failure, and
            what evidence is available to review. Design intent is distinguished from measured
            production outcomes.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {FAILURE_BOUNDARY_PATTERNS.map((pattern, index) => (
            <article
              key={pattern.id}
              className="flex min-w-0 flex-col border border-white/10 border-t-2 border-t-[#00D9FF]/60 bg-[#0E0E10] p-5 transition-colors hover:border-[#00D9FF]/35 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                  {pattern.domain}
                </p>
                <span className="font-mono text-[10px] text-[#00D9FF]">0{index + 1}</span>
              </div>
              <p className="mt-5 font-mono text-sm font-semibold text-[#00D9FF]">
                {pattern.boundaryName}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-white">
                {pattern.headline}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-6 text-zinc-300">{pattern.mechanism}</p>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Evidence boundary
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">{pattern.evidenceBoundary}</p>
                <Link
                  href={pattern.href}
                  className="group mt-4 inline-flex min-h-[44px] w-full items-center justify-between border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <span>READ {pattern.evidenceRecord}</span>
                  <span aria-hidden="true" className="text-[#00D9FF] motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <LatestNotes />
      </div>
    </section>
  );
}

export default ProductionPatterns;
