import React from 'react';
import Link from 'next/link';

export function Footer(): React.JSX.Element {
  return (
    <footer className="w-full bg-[#08090C] text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="font-heading text-sm font-bold tracking-[0.25em] text-white">
            SCARDUBU // OSCAR NDUGBU
          </div>
          <p className="font-mono text-xs text-white/50">
            FAIL-CLOSED SYSTEMS · ZERO-USD EDGE AI · QUANTITATIVE INFRASTRUCTURE
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://github.com/scardubu"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 inline-flex items-center border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-xs uppercase tracking-wider text-white/80 hover:text-[#00D9FF] transition-colors"
          >
            GITHUB ↗
          </a>
          <a
            href="https://sabiscore.app"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 inline-flex items-center border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-xs uppercase tracking-wider text-white/80 hover:text-[#00D9FF] transition-colors"
          >
            SABISCORE.APP ↗
          </a>
          <Link
            href="/writing"
            className="min-h-[44px] px-3.5 inline-flex items-center border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-xs uppercase tracking-wider text-white/80 hover:text-[#00D9FF] transition-colors"
          >
            WRITING →
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
