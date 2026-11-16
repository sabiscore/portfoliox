"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[FAIL-CLOSED BOUNDARY]:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-base px-4 py-12 text-obsidian-text">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-6">
        <div
          className="absolute inset-x-0 top-0 h-px bg-illuminate-cyan"
          aria-hidden="true"
        />

        <div className="mb-4 inline-flex items-center gap-2 rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-accent-cyan">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>RUNTIME FAULT ISOLATED</span>
        </div>

        <h1 className="mb-2 font-sans text-2xl font-bold tracking-tight text-obsidian-text">
          Subsystem boundary tripped.
        </h1>

        <p className="mb-4 font-sans text-sm leading-relaxed text-obsidian-muted">
          The view encountered an unexpected state and failed closed to preserve
          session integrity.
        </p>

        {error?.digest && (
          <div className="mb-6 rounded-lg border border-obsidian-border bg-obsidian-base p-3 font-mono text-micro text-obsidian-dim">
            DIGEST: <span className="text-obsidian-text">{error.digest}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-touch flex-1 items-center justify-center gap-2 rounded-lg border border-accent-emerald bg-accent-emerald px-4 font-sans text-sm font-semibold text-obsidian-base transition-colors hover:bg-accent-cyan hover:border-accent-cyan"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry state transition</span>
          </button>

          <Link
            href="/"
            className="inline-flex min-h-touch flex-1 items-center justify-center gap-2 rounded-lg border border-obsidian-border bg-obsidian-elevated px-4 font-sans text-sm font-medium text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          >
            <Home className="h-4 w-4 text-accent-cyan" />
            <span>Return to base</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
