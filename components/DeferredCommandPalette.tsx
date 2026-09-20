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

    // Listen on both targets because older builds dispatched the custom event on
    // document while the canonical path now dispatches it on window. Keeping the
    // listener tolerant makes the deferred boundary robust across cached chunks.
    window.addEventListener('command-palette:open', onGlobalOpen);
    document.addEventListener('command-palette:open', onGlobalOpen);
    // Capture at window so the deferred boundary sees Cmd/Ctrl+K before any
    // document-level handler can consume the shortcut. This is the earliest
    // React-independent point in the event path available to the component.
    window.addEventListener('keydown', onKeyDown, { capture: true });

    return () => {
      cleanupDeferredMount();
      window.removeEventListener('command-palette:open', onGlobalOpen);
      document.removeEventListener('command-palette:open', onGlobalOpen);
      window.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, []);

  if (!shouldMount) {
    return null;
  }

  return <CommandPalette />;
}
