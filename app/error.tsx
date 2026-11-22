'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { CONTACT_EMAIL } from '@/lib/config';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.JSX.Element {
  const [digestCopied, setDigestCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.error('[FAIL-CLOSED BOUNDARY]:', error);
  }, [error]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleCopyDigest = useCallback(async () => {
    if (
      !error?.digest ||
      typeof navigator === 'undefined' ||
      typeof navigator.clipboard?.writeText !== 'function'
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(error.digest);
      setDigestCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDigestCopied(false), 2000);
    } catch {
      setDigestCopied(false);
    }
  }, [error?.digest]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-obsidian-base px-4 py-16 text-white selection:bg-accent-cyan/20 selection:text-accent-cyan"
    >
      <div className="w-full max-w-prose border border-white/10 border-t-2 border-t-accent-cyan/60 bg-obsidian-surface p-6 sm:p-8">
        <p className="inline-flex items-center gap-2 border border-accent-cyan/40 bg-accent-cyan/10 px-2.5 py-1 font-mono text-micro font-semibold uppercase tracking-wider text-accent-cyan">
          RUNTIME FAULT ISOLATED
        </p>

        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Something interrupted this view.
        </h1>

        <p className="mt-3 text-sm leading-6 text-zinc-300">
          The page encountered an unexpected runtime error and stopped rendering to avoid broken
          state. Retry the view or jump directly to another section.
        </p>

        {error?.digest ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-obsidian-base px-3.5 py-2.5 font-mono text-xs text-zinc-400">
            <span className="min-w-0 break-all">
              DIGEST: <span className="text-zinc-100">{error.digest}</span>
            </span>
            <button
              type="button"
              onClick={() => void handleCopyDigest()}
              className={`inline-flex min-h-touch min-w-24 shrink-0 items-center justify-center border px-3 py-1.5 font-mono text-2xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
                digestCopied
                  ? 'border-accent-emerald/55 bg-accent-emerald/10 text-accent-emerald'
                  : 'border-white/15 bg-obsidian-surface text-zinc-200 hover:border-accent-cyan/50 hover:text-accent-cyan'
              }`}
            >
              {digestCopied ? 'COPIED ✓' : 'COPY DIGEST'}
            </button>
            <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {digestCopied ? 'Error digest copied to clipboard.' : ''}
            </span>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-cta flex-1 items-center justify-center bg-accent-cyan px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-obsidian-base transition-colors hover:bg-accent-cyanHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-surface"
          >
            Try again
          </button>

          <Link
            href="/#projects"
            className="inline-flex min-h-cta flex-1 items-center justify-center border border-white/20 bg-obsidian-base px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            Selected work
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-xs text-zinc-400">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/writing"
              className="inline-flex min-h-touch items-center text-zinc-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent-cyan hover:decoration-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              Engineering notes
            </Link>
            <Link
              href="/#contact"
              className="inline-flex min-h-touch items-center text-zinc-300 underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent-cyan hover:decoration-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              Contact
            </Link>
          </div>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-touch items-center text-accent-cyan underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </main>
  );
}
