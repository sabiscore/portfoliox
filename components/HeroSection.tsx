import Link from 'next/link';
import { IdentityCard, type IdentityMetric } from '@/components/IdentityCard';
import { LiveActivityBar } from '@/components/Liveactivitybar';

export interface HeroSectionProps {
  /** Pass verified claim-ledger metrics from app/page.tsx */
  identityMetrics: readonly IdentityMetric[];
  resumeHref?: string;
  locationLabel?: string;
}

export function HeroSection({
  identityMetrics,
  resumeHref = '/oscar-scardubu-resume.pdf',
  locationLabel = 'UTC+1 · Remote Worldwide',
}: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto w-full max-w-5xl px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:pb-20 lg:pt-20"
    >
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
          Principal-Grade Systems &amp; Quantitative Engineering
        </p>

        <h1
          id="hero-heading"
          className="mt-3 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl"
        >
          Systems you can trust at{' '}
          <span className="text-cyan-400">2 AM.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          I architect resilient backends, quantitative ML pipelines, and
          production web platforms where failure modes are explicit, recovery is
          deliberate, and day-to-day operations stay clear under pressure.
        </p>

        {/* Primary & Secondary Conversion Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="#work"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-400 px-5 py-2.5 font-mono text-xs font-semibold text-zinc-950 transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
          >
            Review Production Evidence
          </Link>

          <Link
            href="#contact"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 px-5 py-2.5 font-mono text-xs font-medium text-zinc-100 transition-colors duration-200 hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
          >
            Discuss a System
          </Link>

          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-transparent px-3 py-2.5 font-mono text-xs font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
          >
            Download CV (PDF)
          </a>
        </div>

        {/* Filtered Live Engineering Signal */}
        <div className="mt-6 max-w-xl">
          <LiveActivityBar />
        </div>
      </div>

      {/* Structured Telemetry Card (No Repeated Bio Prose) */}
      <div className="mt-10">
        <IdentityCard
          metrics={identityMetrics}
          resumeHref={resumeHref}
          locationLabel={locationLabel}
        />
      </div>
    </section>
  );
}

export default HeroSection;
