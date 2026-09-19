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
    const timer = globalThis.setTimeout(() => setShouldMount(true), 1200);
    return () => globalThis.clearTimeout(timer);
  }, []);

  return shouldMount ? <CommandPalette /> : null;
}
