import Link from 'next/link';
import React from 'react';

import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';

const footerLinkClass =
  'min-h-11 px-3 inline-flex items-center justify-center gap-1.5 border border-white/15 hover:border-accent-cyan bg-obsidian-surface font-mono text-micro uppercase tracking-wider text-zinc-200 hover:text-accent-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan whitespace-nowrap';

export function Footer(): React.JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-obsidian-base w-full border-t border-white/10 text-white">
      <div className="max-w-hero mx-auto flex flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="shrink-0 space-y-1.5">
          <div className="font-display tracking-brand text-sm font-bold text-white">
            SCARDUBU // OSCAR NDUGBU
          </div>
          <p className="font-mono text-xs text-zinc-400">
            BACKEND SYSTEMS · PLATFORM INFRASTRUCTURE · AI ENGINEERING
          </p>
          <p className="font-mono text-xs text-zinc-200">Systems you can trust at 2 AM.</p>
          <p className="text-micro pt-1 font-mono text-zinc-400">
            © {year} Oscar Ndugbu · Lagos, Nigeria
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <a href={`mailto:${CONTACT_EMAIL}`} className={footerLinkClass}>
            EMAIL
          </a>
          <a
            href={CV_ASSET_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
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
            href="https://linkedin.com/in/oscardubu"
            target="_blank"
            rel="noopener noreferrer"
            className={footerLinkClass}
          >
            LINKEDIN ↗
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
          <a href="/rss.xml" className={footerLinkClass}>
            RSS
          </a>
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
