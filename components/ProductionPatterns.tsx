import type { JSX } from 'react';
import Link from 'next/link';

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
            className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl"
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
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
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
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Evidence boundary
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">{pattern.evidenceBoundary}</p>
                <Link
                  href={pattern.href}
                  className="mt-4 inline-flex min-h-[44px] w-full items-center justify-between border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <span>READ {pattern.evidenceRecord}</span>
                  <span aria-hidden="true" className="text-[#00D9FF]">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductionPatterns;
