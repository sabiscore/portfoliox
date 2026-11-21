'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

import { CONTACT_EMAIL } from '@/lib/config';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  useEffect(() => {
    console.error('[FAIL-CLOSED BOUNDARY]:', error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-[#08090C] px-4 py-16 text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
    >
      <div className="w-full max-w-lg border border-white/10 border-t-2 border-t-[#00D9FF]/60 bg-[#0E0E10] p-6 sm:p-8">
        <p className="inline-flex items-center gap-2 border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00D9FF]">
          RUNTIME FAULT ISOLATED
        </p>

        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Something interrupted this view.
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          The page encountered an unexpected runtime error and stopped rendering to avoid broken
          state. You can retry the view or return to the homepage.
        </p>

        {error?.digest ? (
          <div className="mt-5 border border-white/10 bg-[#08090C] px-3.5 py-2.5 font-mono text-xs text-zinc-400">
            DIGEST: <span className="text-zinc-100">{error.digest}</span>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center bg-[#00D9FF] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#08090C] transition-colors hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10]"
          >
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center border border-white/20 bg-[#08090C] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            Back to portfolio
          </Link>
        </div>

        <p className="mt-5 border-t border-white/10 pt-4 font-mono text-xs text-zinc-400">
          Need to reach Oscar directly?{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[#00D9FF] underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  );
}
