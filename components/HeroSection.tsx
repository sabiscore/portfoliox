import React from 'react';
import Link from 'next/link';
import { IdentityCard } from '@/components/IdentityCard';
import { CV_ASSET_PATH } from '@/lib/config';

// Canonical public profiles (verified against structured data and repository records).
// The `sabiscore` account hosts this portfolio's repository, not the SabiScore product source.
const GITHUB_PROFILE_URL = 'https://github.com/Scardubu';
const LINKEDIN_PROFILE_URL = 'https://linkedin.com/in/oscardubu';

interface CapabilityRow {
  label: string;
  terms: readonly string[];
}

const CAPABILITY_LEDGER: readonly CapabilityRow[] = [
  { label: 'Backend', terms: ['Fastify', 'Python', 'TypeScript'] },
  { label: 'Data', terms: ['PostgreSQL', 'Redis', 'DuckDB'] },
  { label: 'AI systems', terms: ['Inference', 'Model pipelines'] },
  { label: 'Engineering', terms: ['Fail-closed', 'Observable', 'Recoverable'] },
] as const;

interface DesignTheme {
  code: string;
  title: string;
  spec: string;
  focusTag: string;
}

// Cross-project themes (moved from the identity card, copy unchanged). Rendered
// on the server as a full-width strip so the hero split stays balanced.
const DESIGN_THEMES: readonly DesignTheme[] = [
  {
    code: '01',
    title: 'Local model inference',
    spec: 'Quantized GGUF workflows with local execution paths where the project environment supports them.',
    focusTag: 'LOCAL INFERENCE',
  },
  {
    code: '02',
    title: 'Out-of-core data processing',
    spec: 'Polars, PyArrow, and DuckDB pipelines for analytical workloads with explicit memory constraints.',
    focusTag: 'BOUNDED DATA',
  },
  {
    code: '03',
    title: 'Quantitative model evaluation',
    spec: 'Market de-vigging, Dixon-Coles modelling, calibration checks, and conservative decision rules.',
    focusTag: 'MODEL EVALUATION',
  },
  {
    code: '04',
    title: 'Resilient fintech workflows',
    spec: 'Offline-first mobile queues, runtime schema validation, and idempotent API boundaries; provider integrations are tracked explicitly.',
    focusTag: 'RECOVERY DESIGN',
  },
] as const;

function CapabilityLedger(): React.JSX.Element {
  return (
    <dl className="grid grid-cols-2 gap-px border border-white/10 bg-white/10">
      {CAPABILITY_LEDGER.map((row) => (
        <div key={row.label} className="bg-[#08090C] p-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            {row.label}
          </dt>
          {/* One term per line: no separators to orphan at narrow cell widths */}
          {row.terms.map((term, index) => (
            <dd
              key={term}
              className={`font-mono text-xs font-semibold leading-5 text-zinc-100 ${index === 0 ? 'mt-1.5' : ''}`}
            >
              {term}
            </dd>
          ))}
        </div>
      ))}
    </dl>
  );
}

export function HeroSection(): React.JSX.Element {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#08090C] text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
    >
      {/* 1px coordinate grid + single low-intensity radial wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_circle_at_20%_15%,rgba(0,217,255,0.06),transparent_75%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20">
        {/* Editorial split: 7 columns narrative + 5 columns identity ledger */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2.5 border border-[#00D9FF]/40 bg-[#0E0E10]/90 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-[#00D9FF]">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#00D9FF]" />
              STAFF BACKEND &amp; PLATFORM ENGINEER
            </p>

            <h1
              id="hero-heading"
              className="type-display mt-6 max-w-[15ch] font-display font-bold text-white"
            >
              Systems you can trust at <span className="text-[#00D9FF]">2&nbsp;AM.</span>
            </h1>

            <p className="type-lede mt-6 max-w-[60ch] text-zinc-300">
              <strong className="font-semibold text-white">Oscar Ndugbu</strong> builds backend
              services, data platforms, AI infrastructure, and fintech systems with explicit
              failure boundaries, observable behavior, and deliberate recovery paths.
            </p>

            {/* Primary and secondary calls to action: 48px minimum touch geometry */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="#projects"
                className="group inline-flex min-h-[48px] min-w-[44px] w-full items-center justify-center gap-3 border border-[#00D9FF] bg-[#00D9FF] px-6 py-3 font-sans text-sm font-semibold text-[#08090C] transition-colors hover:border-[#7AEAFF] hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090C] motion-safe:active:translate-y-px sm:w-auto"
              >
                <span>Explore selected work</span>
                <span
                  aria-hidden="true"
                  className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </Link>

              <Link
                href="/writing"
                className="inline-flex min-h-[48px] min-w-[44px] w-full items-center justify-center border border-white/20 bg-[#0E0E10]/90 px-6 py-3 font-sans text-sm font-medium text-zinc-100 transition-colors hover:border-[#00D9FF]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] sm:w-auto"
              >
                Read engineering notes
              </Link>
            </div>

            {/* Tertiary evidence links */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-5 font-mono text-xs">
              <li>
                <a
                  href={CV_ASSET_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-1.5 px-1 text-zinc-300 transition-colors hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-[#00D9FF]">Résumé (PDF)</span>
                  <span aria-hidden="true" className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-1.5 px-1 text-zinc-300 transition-colors hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-[#00D9FF]">GitHub @Scardubu</span>
                  <span aria-hidden="true" className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-1.5 px-1 text-zinc-300 transition-colors hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-[#00D9FF]">LinkedIn</span>
                  <span aria-hidden="true" className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right column: identity, capability ledger, direct actions */}
          <div id="identity" className="scroll-mt-24 lg:col-span-5">
            <IdentityCard>
              <CapabilityLedger />
            </IdentityCard>
          </div>
        </div>

        {/* Cross-project design themes */}
        <div className="mt-14 border-t border-white/10 pt-8 lg:mt-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2
              id="design-focus-heading"
              className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300"
            >
              Design focus
            </h2>
            <p className="text-sm text-zinc-400">
              The recurring engineering themes across the project records.
            </p>
          </div>
          <ol
            aria-labelledby="design-focus-heading"
            className="mt-6 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {DESIGN_THEMES.map((theme) => (
              <li key={theme.code} className="flex flex-col bg-[#0E0E10] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden="true" className="font-mono text-xs text-[#00D9FF]">
                    {theme.code}
                  </span>
                  <span className="border border-white/10 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-zinc-400">
                    {theme.focusTag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold leading-snug text-white">
                  {theme.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{theme.spec}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
