import React from "react";

export default function RootLoadingSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading system specification"
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6"
    >
      <div className="mb-6 h-5 w-48 animate-pulse rounded bg-obsidian-surface" />
      <div className="mb-4 h-12 w-3/4 animate-pulse rounded bg-obsidian-surface" />
      <div className="mb-8 h-20 w-full max-w-2xl animate-pulse rounded bg-obsidian-surface" />
      <div className="h-64 w-full animate-pulse rounded-xl border border-obsidian-border bg-obsidian-surface" />
    </div>
  );
}
