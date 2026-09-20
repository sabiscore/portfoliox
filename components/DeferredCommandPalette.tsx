'use client';

import { useEffect, useState } from 'react';

// Keep the full command palette code-split and off the critical path. The small
// quick-actions shell remains interactive so users can request the palette
// immediately without paying the full palette cost during first paint.
type CommandPaletteComponent = typeof import('@/components/CommandPalette').CommandPalette;

const loadCommandPalette = () => import('@/components/CommandPalette').then((mod) => mod.CommandPalette);

export function DeferredCommandPalette() {
  const [shouldMount, setShouldMount] = useState(false);
  const [paletteRequested, setPaletteRequested] = useState(false);
  const [CommandPaletteView, setCommandPaletteView] = useState<CommandPaletteComponent | null>(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      void loadCommandPalette().then((Component) => {
        setCommandPaletteView(() => Component);
        setShouldMount(true);
      });
    }, 5000);
    return () => globalThis.clearTimeout(timer);
  }, []);

  const preloadCommandPalette = () => {
    // Warm the lazy chunk on explicit user intent, before the second tap opens it.
    // This preserves the deferred initial bundle while removing a cold-import race
    // in constrained browsers and CI WebKit/Chromium runs.
    void loadCommandPalette();
  };

  const requestPalette = async () => {
    // Do not mount the dynamic component until its chunk is actually warm.
    // This prevents WebKit/Chromium from rendering the dynamic fallback forever
    // when the intent tap and dynamic import resolve on different task turns.
    const Component = await loadCommandPalette();
    setCommandPaletteView(() => Component);
    setPaletteRequested(true);
    setShouldMount(true);
  };

  if (shouldMount && CommandPaletteView) {
    return <CommandPaletteView initialOpen={paletteRequested} />;
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
            onClick={() => {
              void requestPalette();
            }}
            className="border-color-border text-color-text-primary flex min-h-[44px] items-center gap-2 rounded-full border bg-[oklch(14%_0.008_264_/_0.92)] px-4 py-2 font-mono text-[11px] tracking-wide"
            aria-label="Open command palette"
            data-testid="open-command-palette"
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
        onClick={() => {
          preloadCommandPalette();
          setQuickActionsOpen((value) => !value);
        }}
        aria-label={quickActionsOpen ? 'Collapse quick actions' : 'Open quick actions'}
        data-testid="quick-actions-toggle"
        aria-expanded={quickActionsOpen}
        aria-controls="quick-actions-menu"
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/85 text-white/80"
      >
        <span aria-hidden="true">{quickActionsOpen ? '×' : '✉'}</span>
      </button>
    </div>
  );
}
