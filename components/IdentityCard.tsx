import Image from 'next/image';
import Link from 'next/link';

export interface IdentityMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface IdentityCardProps {
  name?: string;
  role?: string;
  availability?: string;
  locationLabel?: string;
  headshotSrc?: string;
  resumeHref?: string;
  metrics: readonly IdentityMetric[];
  coreDomains?: readonly string[];
  className?: string;
}

export function IdentityCard({
  name = 'Oscar Ndugbu',
  role = 'Full-Stack Systems & Quantitative ML Engineer',
  availability = 'Available for Staff / Senior Systems & Advisory',
  locationLabel = 'UTC+1 · Remote Worldwide',
  headshotSrc = '/headshot.webp',
  resumeHref = '/oscar-scardubu-resume.pdf',
  metrics,
  coreDomains = ['Distributed Backends', 'Quantitative ML', 'Next.js / TypeScript'],
  className = '',
}: IdentityCardProps) {
  return (
    <aside
      aria-label="Engineer profile and verified telemetry"
      className={`rounded-xl border border-white/10 bg-zinc-950/90 p-5 sm:p-6 backdrop-blur-md ${className}`}
    >
      {/* Top Row: Portrait + Identity + Availability */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-zinc-900">
            <Image
              src={headshotSrc}
              alt={`Portrait of ${name}`}
              width={56}
              height={56}
              priority
              sizes="56px"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <p className="text-base font-semibold tracking-tight text-zinc-50">
                {name}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-300">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                />
                Active
              </span>
            </div>
            <p className="mt-0.5 text-sm text-zinc-300">{role}</p>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              {locationLabel}
            </p>
          </div>
        </div>

        <p className="font-mono text-xs text-cyan-300 sm:text-right">
          {availability}
        </p>
      </div>

      {/* Middle Row: 2x2 Verified Telemetry Grid (Strictly Data-Driven from Claim Ledger) */}
      {metrics.length > 0 && (
        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-white/10 bg-zinc-900/70 px-4 py-3"
            >
              <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                {item.label}
              </dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-zinc-50">
                {item.value}
              </dd>
              {item.detail && (
                <p className="mt-0.5 text-xs text-zinc-400">{item.detail}</p>
              )}
            </div>
          ))}
        </dl>
      )}

      {/* Core Domains */}
      {coreDomains.length > 0 && (
        <ul
          aria-label="Core engineering domains"
          className="mt-4 flex flex-wrap gap-2"
        >
          {coreDomains.map((domain) => (
            <li
              key={domain}
              className="rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300"
            >
              {domain}
            </li>
          ))}
        </ul>
      )}

      {/* Bottom Action Bar: Single Canonical Resume + Direct Anchor */}
      <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={resumeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 px-4 py-2 font-mono text-xs font-medium text-zinc-100 transition-colors duration-200 hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
        >
          Download CV (PDF)
        </a>

        <Link
          href="#contact"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-400 px-4 py-2 font-mono text-xs font-semibold text-zinc-950 transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
        >
          Initiate Technical Discussion
        </Link>
      </div>
    </aside>
  );
}

export default IdentityCard;