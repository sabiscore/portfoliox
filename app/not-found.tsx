import React from 'react';
import Link from 'next/link';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#08090C] text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]">
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-lg border border-white/10 border-t-2 border-t-[#00D9FF]/60 bg-[#0E0E10] p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00D9FF]">
            HTTP 404 // ROUTE UNMAPPED
          </p>

          <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Requested page not found.
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            This address does not match an active case study, engineering note, or portfolio
            section.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-[#00D9FF] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#08090C] transition-colors hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10]"
            >
              <span aria-hidden="true">←</span>
              <span>Back to portfolio</span>
            </Link>

            <Link
              href="/writing"
              className="inline-flex min-h-[48px] items-center justify-center border border-white/20 bg-[#08090C] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
            >
              Engineering notes
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
