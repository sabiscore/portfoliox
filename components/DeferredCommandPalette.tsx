'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Keep the palette implementation code-split and out of the critical first-paint
// path. A bounded post-paint delay preserves the accessible quick-actions affordance
// without making requestIdleCallback scheduling part of test/runtime determinism.
const CommandPalette = dynamic(
  () => import('@/components/CommandPalette').then((mod) => mod.CommandPalette),
  {
    ssr: false,
    loading: () => null,
  }
);

export function DeferredCommandPalette() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // Mount immediately after the first paint rather than after a fixed delay.
    // The palette implementation remains code-split (ssr:false), so this does
    // not add its markup or event handlers to the server-rendered critical path,
    // while keeping the quick-actions affordance deterministic for keyboard,
    // touch, and automated interaction flows.
    const frame = globalThis.requestAnimationFrame(() => setShouldMount(true));
    return () => globalThis.cancelAnimationFrame(frame);
  }, []);

  return shouldMount ? <CommandPalette /> : null;
}
