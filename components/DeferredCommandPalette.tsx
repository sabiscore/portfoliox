'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const markPalette = (name: string) => {
  if (typeof performance !== 'undefined') performance.mark(name);
};

const CommandPalette = dynamic(
  () => {
    markPalette('command-palette:chunk-requested');
    return import('@/components/CommandPalette').then((mod) => {
      markPalette('command-palette:chunk-resolved');
      return mod.CommandPalette;
    });
  },
  {
    ssr: false,
    loading: () => null,
  }
);

type CommandPaletteWindow = Window & {
  __commandPaletteRequested?: boolean;
};

export function DeferredCommandPalette() {
  // The bootstrap in app/layout.tsx can capture Cmd/Ctrl+K before React hydrates.
  // Seed from that flag during the first client render so the request cannot be
  // lost in the hydration/effect gap. Coarse-pointer devices also need the
  // palette mounted before the quick-actions trigger can exist; keep the heavy
  // command implementation itself dynamically split.
  const [shouldMount, setShouldMount] = useState(() => {
    if (typeof window === 'undefined') return false;
    const commandWindow = window as CommandPaletteWindow;
    return Boolean(
      commandWindow.__commandPaletteRequested ||
        window.matchMedia('(pointer: coarse)').matches
    );
  });

  useEffect(() => {
    const commandWindow = window as CommandPaletteWindow;
    markPalette('command-palette:boundary-mounted');
    let cleanupDeferredMount = () => {};

    const mountPalette = () => {
      setShouldMount(true);
    };

    const requestMount = () => {
      markPalette('command-palette:mount-requested');
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
      markPalette('command-palette:pending-request-consumed');
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
