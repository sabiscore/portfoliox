import React from 'react';
import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian-base text-white selection:bg-accent-cyan/20 selection:text-accent-cyan">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-prose border border-white/10 border-t-2 border-t-accent-cyan/60 bg-obsidian-surface p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 border border-accent-cyan/40 bg-accent-cyan/10 px-2.5 py-1 font-mono text-micro font-semibold uppercase tracking-wider text-accent-cyan">
            HTTP 404 // ROUTE UNMAPPED
          </p>

          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Requested page not found.
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            This address does not match an active case study, engineering note, or portfolio
            section. Use a verified destination below to continue.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#projects"
              className="inline-flex min-h-cta flex-1 items-center justify-center gap-2 bg-accent-cyan px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-obsidian-base transition-colors hover:bg-accent-cyanHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-surface"
            >
              <span aria-hidden="true">←</span>
              <span>Selected work</span>
            </Link>

            <Link
              href="/writing"
              className="inline-flex min-h-cta flex-1 items-center justify-center border border-white/20 bg-obsidian-base px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              Engineering notes
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-xs text-zinc-400">
            <Link
              href="/"
              className="inline-flex min-h-touch items-center text-zinc-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent-cyan hover:decoration-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              Portfolio home
            </Link>
            <Link
              href="/#contact"
              className="inline-flex min-h-touch items-center gap-1.5 text-accent-cyan underline decoration-accent-cyan/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              <span>Discuss a system</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
