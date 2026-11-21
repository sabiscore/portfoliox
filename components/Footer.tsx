import React from 'react';
import Link from 'next/link';

import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';

const footerLinkClass =
  'min-h-[44px] px-3.5 inline-flex items-center gap-1.5 border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-xs uppercase tracking-wider text-white/80 hover:text-[#00D9FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]';

export function Footer(): React.JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#08090C] text-white border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1.5">
          <div className="font-display text-sm font-bold tracking-[0.25em] text-white">
            SCARDUBU // OSCAR NDUGBU
          </div>
          <p className="font-mono text-xs text-white/60">
            BACKEND SYSTEMS · PLATFORM INFRASTRUCTURE · AI ENGINEERING
          </p>
          <p className="pt-2 font-mono text-[11px] text-zinc-400">
            © {year} Oscar Ndugbu · Lagos, Nigeria
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-2">
          <a href={`mailto:${CONTACT_EMAIL}`} className={footerLinkClass}>
            EMAIL
          </a>
          <a href={CV_ASSET_PATH} target="_blank" rel="noopener noreferrer" className={footerLinkClass}>
            RÉSUMÉ ↗
          </a>
          <a
            href="https://github.com/scardubu"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            GITHUB ↗
          </a>
          <a
            href="https://sabiscore.app"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            SABISCORE.APP ↗
          </a>
          <Link href="/writing" className={footerLinkClass}>
            WRITING
          </Link>
          <a
            href="https://github.com/sabiscore/portfoliox"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            SITE SOURCE ↗
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
