'use client';

import dynamic from 'next/dynamic';

// Keep the palette code-split, but mount its client shell immediately. The
// previous interaction-gated mount could miss the first Cmd/Ctrl+K event while
// the deferred effect was registering, making the palette nondeterministic in
// Playwright/WebKit and on cold mobile loads. ssr:false still keeps the
// command-palette implementation out of the server HTML.
const CommandPalette = dynamic(
  () => import('@/components/CommandPalette').then((mod) => mod.CommandPalette),
  {
    ssr: false,
    loading: () => null,
  }
);

export function DeferredCommandPalette() {
  return <CommandPalette />;
}
