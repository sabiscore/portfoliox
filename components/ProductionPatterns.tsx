import type { JSX } from 'react';
import Link from 'next/link';

import { getWritingPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

interface FailureBoundaryPattern {
  id: string;
  domain: string;
  boundaryName: string;
  failureMode: string;
  rejectedDefault: string;
  chosenBoundary: string;
  evidenceRecord: string;
  href: string;
}

const FAILURE_BOUNDARY_PATTERNS: readonly FailureBoundaryPattern[] = [
  {
    id: 'cgroup-ooc-boundary',
    domain: 'QUANTITATIVE ML · SERVING',
    boundaryName: 'Out-of-core + fallback',
    failureMode: 'Silent model drift and upstream feed loss during live match windows.',
    rejectedDefault:
      'Synchronous REST calls with unversioned caching that keep serving stale predictions after a retrain or upstream outage.',
    chosenBoundary:
      'Out-of-core Polars and DuckDB feature joins, model-versioned Redis namespaces, and a labeled lower-confidence fallback path.',
    evidenceRecord: 'SabiScore case study',
    href: '/work/sabiscore',
  },
  {
    id: 'rls-queue-boundary',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    boundaryName: 'Tenant scope + idempotency',
    failureMode: 'Cross-tenant leaks from missed query filters or duplicate filings on retry.',
    rejectedDefault:
      'Application-layer WHERE clauses paired with naive retries that double-submit whenever mobile links or tax gateways time out.',
    chosenBoundary:
      'Transaction-scoped PostgreSQL Row-Level Security, submission-keyed BullMQ workers, and a local SQLite sync queue.',
    evidenceRecord: 'TaxBridge case study',
    href: '/work/taxbridge',
  },
  {
    id: 'checkpoint-recovery-boundary',
    domain: 'AI WORKFLOWS · MEDIA PIPELINE',
    boundaryName: 'Checkpointed stage recovery',
    failureMode: 'Multi-step generation jobs dying midway under tight CPU and RAM limits.',
    rejectedDefault:
      'Monolithic generation scripts that discard completed inference and voice synthesis whenever a downstream step restarts.',
    chosenBoundary:
      'Content-addressed stage checkpoints, schema-validated intermediate outputs, and local GGUF model routing.',
    evidenceRecord: 'Yap Engine case study',
    href: '/work/yap-engine',
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
          className="font-mono text-xs font-semibold uppercase tracking-section text-zinc-300"
        >
          The reasoning, written down
        </h3>
        <Link
          href="/writing"
          className="group inline-flex min-h-touch items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent-cyan transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
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
              className="writing-list-row group grid gap-1 py-4 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-cyan sm:items-baseline sm:gap-6 sm:px-2"
            >
              <span className="font-display text-base font-semibold leading-snug text-white group-hover:text-accent-cyan">
                {note.title}
              </span>
              <span className="font-mono text-micro uppercase tracking-wider text-zinc-400">
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
      className="w-full border-b border-white/10 bg-obsidian-base px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-hero space-y-10">
        <header className="max-w-prose space-y-3">
          <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-section">
            <span className="font-bold text-accent-cyan">02</span>
            <span className="text-zinc-400">ENGINEERING // DECISIONS</span>
          </p>
          <h2
            id="failure-modes-heading"
            className="type-section font-display font-bold text-white"
          >
            Failure modes, designed deliberately.
          </h2>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            How routine infrastructure faults are contained before becoming 2 AM outages — comparing
            the common shortcut against the boundary built into each system.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {FAILURE_BOUNDARY_PATTERNS.map((pattern, index) => (
            <article
              key={pattern.id}
              className="flex min-w-0 flex-col border border-white/10 border-t-2 border-t-accent-cyan/60 bg-obsidian-surface p-5 transition-colors hover:border-accent-cyan/35 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-2xs uppercase tracking-domain text-zinc-400">
                  {pattern.domain}
                </p>
                <span className="font-mono text-2xs text-accent-cyan">0{index + 1}</span>
              </div>
              <p className="mt-4 font-mono text-sm font-semibold text-accent-cyan">
                {pattern.boundaryName}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                {pattern.failureMode}
              </h3>

              <dl className="mt-4 flex-1 space-y-3.5 border-t border-white/10 pt-4 text-sm leading-6">
                <div>
                  <dt className="font-mono text-2xs font-semibold uppercase tracking-domain text-zinc-400">
                    Naive default (rejected)
                    <span className="sr-only">: </span>
                  </dt>
                  <dd className="mt-1 text-zinc-400">{pattern.rejectedDefault}</dd>
                </div>
                <div>
                  <dt className="font-mono text-2xs font-semibold uppercase tracking-domain text-accent-cyan">
                    Chosen boundary
                    <span className="sr-only">: </span>
                  </dt>
                  <dd className="mt-1 text-zinc-200">{pattern.chosenBoundary}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-white/10 pt-4">
                <Link
                  href={pattern.href}
                  className="group inline-flex min-h-touch w-full items-center justify-between border border-white/15 bg-obsidian-base px-4 py-2.5 font-mono text-micro font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <span>READ {pattern.evidenceRecord}</span>
                  <span
                    aria-hidden="true"
                    className="text-accent-cyan motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
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
