import Link from 'next/link';

export interface BrandWordmarkProps {
  href?: string;
  brandLabel?: string;
  monogram?: string;
  className?: string;
}

export function BrandWordmark({
  href = '/',
  brandLabel = 'Scardubu',
  monogram = 'ON',
  className = '',
}: BrandWordmarkProps) {
  return (
    <Link
      href={href}
      aria-label={`${brandLabel} — Oscar Ndugbu Home`}
      className={`group inline-flex min-h-11 items-center gap-2.5 rounded-md px-1.5 text-zinc-50 transition-colors duration-200 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none ${className}`}
    >
      {/* Decorative emblem — hidden from screen readers and text crawlers */}
      <span
        aria-hidden="true"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-cyan-400/30 bg-zinc-900 font-mono text-xs font-bold tracking-tight text-cyan-400 transition-colors duration-200 group-hover:border-cyan-300 group-hover:bg-cyan-400/10 motion-reduce:transition-none"
      >
        {monogram}
      </span>

      {/* Visible brand mark — aria-hidden because root Link carries the canonical accessible name */}
      <span
        aria-hidden="true"
        className="font-mono text-sm font-semibold tracking-tight text-zinc-50 transition-colors duration-200 group-hover:text-cyan-300 motion-reduce:transition-none"
      >
        {brandLabel}
      </span>
    </Link>
  );
}

export default BrandWordmark;
