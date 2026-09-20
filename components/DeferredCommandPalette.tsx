'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Keep the full command palette code-split and off the critical path. The small
// quick-actions shell remains interactive so users can request the palette
// immediately without paying the full palette cost during first paint.
const CommandPalette = dynamic(
  () => import('@/components/CommandPalette').then((mod) => mod.CommandPalette),
  {
    ssr: false,
    loading: () => null,
  }
);

export function DeferredCommandPalette() {
  const [shouldMount, setShouldMount] = useState(false);
  const [paletteRequested, setPaletteRequested] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => setShouldMount(true), 1200);
    return () => globalThis.clearTimeout(timer);
  }, []);

  const requestPalette = () => {
    setPaletteRequested(true);
    setShouldMount(true);
  };

  if (shouldMount) {
    return <CommandPalette initialOpen={paletteRequested} />;
  }

  return (
    <div
      role="group"
      aria-label="Quick actions"
      className="fixed right-4 z-[80] flex flex-col items-end gap-2"
      style={{
        bottom:
          'max(1.25rem, calc(var(--bottom-nav-height, 0px) + 1.25rem + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      {quickActionsOpen && (
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => {
              window.location.hash = 'section-contact';
              setQuickActionsOpen(false);
            }}
            className="border-color-border text-color-text-primary flex min-h-[44px] items-center gap-2 rounded-full border bg-[oklch(14%_0.008_264_/_0.92)] px-4 py-2 font-mono text-[11px] tracking-wide"
            aria-label="Discuss a system"
          >
            Discuss a system
          </button>
          <button
            type="button"
            onClick={requestPalette}
            className="border-color-border text-color-text-primary flex min-h-[44px] items-center gap-2 rounded-full border bg-[oklch(14%_0.008_264_/_0.92)] px-4 py-2 font-mono text-[11px] tracking-wide"
            aria-label="Open command palette"
          >
            Open command palette
            <kbd className="border-color-border text-color-text-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setQuickActionsOpen((value) => !value)}
        aria-label={quickActionsOpen ? 'Collapse quick actions' : 'Open quick actions'}
        aria-expanded={quickActionsOpen}
        aria-controls="quick-actions-menu"
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/85 text-white/80"
      >
        <span aria-hidden="true">{quickActionsOpen ? '×' : '✉'}</span>
      </button>
    </div>
  );
}
