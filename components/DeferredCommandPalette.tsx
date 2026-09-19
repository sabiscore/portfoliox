'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Keep the palette implementation code-split and out of the critical first-paint
// path. The quick-actions affordance is non-critical; mounting after idle keeps
// its Framer Motion/command data bundle from competing with the hero LCP.
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
    let mounted = true;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;

    const mount = () => {
      if (mounted) setShouldMount(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(mount, { timeout: 1200 });
    } else {
      timeoutId = globalThis.setTimeout(mount, 900);
    }

    return () => {
      mounted = false;
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return shouldMount ? <CommandPalette /> : null;
}
