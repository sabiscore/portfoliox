import React from "react";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-base px-4 py-12 text-obsidian-text">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-6">
        <div
          className="absolute inset-x-0 top-0 h-px bg-illuminate-emerald"
          aria-hidden="true"
        />

        <div className="mb-4 inline-flex items-center gap-2 rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-accent-emerald">
          <Terminal className="h-3.5 w-3.5" />
          <span>HTTP 404 // ROUTE UNMAPPED</span>
        </div>

        <h1 className="mb-2 font-sans text-2xl font-bold tracking-tight text-obsidian-text">
          Requested specification not found.
        </h1>

        <p className="mb-6 font-sans text-sm leading-relaxed text-obsidian-muted">
          The URI does not match any active case study, architectural pattern,
          or engineering guide in the ledger.
        </p>

        <Link
          href="/"
          className="inline-flex min-h-touch w-full items-center justify-center gap-2 rounded-lg border border-accent-emerald bg-accent-emerald px-5 font-sans text-sm font-semibold text-obsidian-base transition-colors hover:bg-accent-cyan hover:border-accent-cyan"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to primary portfolio</span>
        </Link>
      </div>
    </div>
  );
}
