import React from 'react';
import Link from 'next/link';
import { IdentityCard } from '@/components/IdentityCard';
import { IdentityCardMotion } from '@/components/IdentityCardMotion';
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
  { label: 'AI systems', terms: ['Local GGUF', 'Inference', 'Model pipelines'] },
  { label: 'Engineering', terms: ['Fail-closed', 'Observable', 'Recoverable'] },
] as const;

interface DesignTheme {
  code: string;
  title: string;
  spec: string;
  focusTag: string;
}

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
        <div key={row.label} className="flex flex-col bg-obsidian-base p-3.5 sm:p-4">
          <dt className="font-mono text-2xs font-medium uppercase tracking-kicker text-zinc-400">
            {row.label}
          </dt>
          {row.terms.map((term, index) => (
            <dd
              key={term}
              className={`font-mono text-xs font-semibold leading-5 text-zinc-100 ${index === 0 ? 'mt-2' : ''}`}
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
      className="relative w-full overflow-hidden border-b border-white/10 bg-obsidian-base text-white selection:bg-accent-cyan/20 selection:text-accent-cyan"
    >
      {/* 1px coordinate grid + single low-intensity radial wash */}
      <div
        aria-hidden="true"
        className="hero-grid-overlay pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="hero-radial-wash pointer-events-none absolute inset-0"
      />

      <div className="relative z-10 mx-auto max-w-hero px-4 pt-10 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20">
        {/* Editorial split: 7 columns narrative + 5 columns identity ledger */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2.5 border border-accent-cyan/40 bg-obsidian-surface/90 px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent-cyan">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-cyan" />
              STAFF BACKEND &amp; PLATFORM ENGINEER
            </p>

            <h1
              id="hero-heading"
              className="type-display mt-6 max-w-heading font-display font-bold text-white"
            >
              Systems you can trust at <span className="text-accent-cyan">2&nbsp;AM.</span>
            </h1>

            <p className="type-lede mt-6 max-w-prose text-zinc-300">
              <strong className="font-semibold text-white">Oscar Ndugbu</strong> builds backend
              services, data platforms, AI infrastructure, and fintech systems with explicit
              failure boundaries, observable behavior, and deliberate recovery paths.
            </p>

            {/* Primary and secondary calls to action: 48px minimum touch geometry */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="#projects"
                className="group inline-flex min-h-cta min-w-touch w-full items-center justify-center gap-3 border border-accent-cyan bg-accent-cyan px-6 py-3 font-sans text-sm font-semibold text-obsidian-base transition-colors hover:border-accent-cyanHover hover:bg-accent-cyanHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-base motion-safe:active:translate-y-px sm:w-auto"
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
                className="inline-flex min-h-cta min-w-touch w-full items-center justify-center border border-white/20 bg-obsidian-surface/90 px-6 py-3 font-sans text-sm font-medium text-zinc-100 transition-colors hover:border-accent-cyan/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan sm:w-auto"
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
                  className="group inline-flex min-h-touch items-center gap-1.5 px-1 text-zinc-300 transition-colors hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-accent-cyan">
                    Résumé (PDF)
                  </span>
                  <span
                    aria-hidden="true"
                    className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-touch items-center gap-1.5 px-1 text-zinc-300 transition-colors hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-accent-cyan">
                    GitHub @Scardubu
                  </span>
                  <span
                    aria-hidden="true"
                    className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-touch items-center gap-1.5 px-1 text-zinc-300 transition-colors hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                >
                  <span className="underline decoration-white/25 underline-offset-4 group-hover:decoration-accent-cyan">
                    LinkedIn
                  </span>
                  <span
                    aria-hidden="true"
                    className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right column: structured identity ledger (no repeated bio prose) */}
          <div id="identity" className="scroll-mt-24 lg:col-span-5">
            <IdentityCardMotion>
              <IdentityCard>
                <CapabilityLedger />
              </IdentityCard>
            </IdentityCardMotion>
          </div>
        </div>

        {/* Cross-project design themes */}
        <div className="mt-14 border-t border-white/10 pt-8 lg:mt-16">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <h2
              id="design-focus-heading"
              className="font-mono text-xs font-semibold uppercase tracking-section text-zinc-300"
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
              <li key={theme.code} className="flex flex-col bg-obsidian-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden="true" className="font-mono text-xs text-accent-cyan">
                    {theme.code}
                  </span>
                  <span className="border border-white/10 bg-obsidian-base px-1.5 py-0.5 font-mono text-2xs tracking-wide text-zinc-400">
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
