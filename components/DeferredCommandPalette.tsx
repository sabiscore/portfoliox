'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CommandPalette = dynamic(
  () => import('@/components/CommandPalette').then((mod) => mod.CommandPalette),
  {
    ssr: false,
    loading: () => null,
  }
);

type CommandPaletteWindow = Window & {
  __commandPaletteRequested?: boolean;
};

export function DeferredCommandPalette() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const commandWindow = window as CommandPaletteWindow;
    let cleanupDeferredMount = () => {};

    const mountPalette = () => {
      setShouldMount(true);
    };

    const requestMount = () => {
      commandWindow.__commandPaletteRequested = true;
      mountPalette();
    };

    const onGlobalOpen = () => {
      requestMount();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        requestMount();
      }
    };

    if (commandWindow.__commandPaletteRequested) {
      mountPalette();
    } else if (window.matchMedia('(pointer: coarse)').matches) {
      const scheduleMount = () => {
        if (typeof window.requestIdleCallback === 'function') {
          const handle = window.requestIdleCallback(mountPalette, { timeout: 1200 });

          cleanupDeferredMount = () => {
            window.cancelIdleCallback?.(handle);
          };
          return;
        }

        const timer = window.setTimeout(mountPalette, 480);
        cleanupDeferredMount = () => {
          window.clearTimeout(timer);
        };
      };

      if (document.readyState === 'complete') {
        scheduleMount();
      } else {
        const onLoad = () => {
          scheduleMount();
        };

        window.addEventListener('load', onLoad, { once: true });
        cleanupDeferredMount = () => {
          window.removeEventListener('load', onLoad);
        };
      }
    }

    globalThis.addEventListener('command-palette:open', onGlobalOpen);
    document.addEventListener('keydown', onKeyDown, { capture: true });

    return () => {
      cleanupDeferredMount();
      globalThis.removeEventListener('command-palette:open', onGlobalOpen);
      document.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, []);

  if (!shouldMount) {
    return null;
  }

  return <CommandPalette />;
}
