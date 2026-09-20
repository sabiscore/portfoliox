'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LiveActivityBar = dynamic(
  () => import('./Liveactivitybar').then((mod) => ({ default: mod.LiveActivityBar })),
  {
    loading: () => <LiveActivityBarSkeleton />,
  }
);

function deferMount(callback: () => void, timeout: number) {
  let cleanupScheduledMount = () => {};

  const scheduleMount = () => {
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(callback, { timeout });

      cleanupScheduledMount = () => {
        window.cancelIdleCallback?.(handle);
      };
      return;
    }

    const timer = window.setTimeout(callback, Math.min(timeout, 480));
    cleanupScheduledMount = () => {
      window.clearTimeout(timer);
    };
  };

  if (document.readyState === 'complete') {
    scheduleMount();

    return () => {
      cleanupScheduledMount();
    };
  }

  const onLoad = () => {
    scheduleMount();
  };

  window.addEventListener('load', onLoad, { once: true });
  return () => {
    window.removeEventListener('load', onLoad);
    cleanupScheduledMount();
  };
}

function LiveActivityBarSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="live-bar-text flex min-h-6 items-center gap-2 overflow-hidden"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-white/20" />
      <span className="h-3 w-44 animate-pulse rounded bg-white/10 sm:w-56" />
    </div>
  );
}

export function DeferredLiveActivityBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    return deferMount(() => setMounted(true), 1400);
  }, []);

  if (!mounted) {
    return <LiveActivityBarSkeleton />;
  }

  return <LiveActivityBar />;
}
