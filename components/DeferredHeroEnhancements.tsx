'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const IdentityCard = dynamic(() => import('./IdentityCard'), {
  loading: () => <IdentityCardSkeleton />,
});

const LiveActivityBar = dynamic(
  () => import('./Liveactivitybar').then((mod) => ({ default: mod.LiveActivityBar })),
  {
    loading: () => <LiveActivityBarSkeleton />,
  }
);

type IdentityCardPlaceholderProps = {
  className?: string;
};

function deferMount(callback: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(callback, { timeout: 300 });

    return () => {
      window.cancelIdleCallback?.(handle);
    };
  }

  const timer = window.setTimeout(callback, 120);

  return () => {
    window.clearTimeout(timer);
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

function IdentityCardSkeleton({ className = '' }: Readonly<IdentityCardPlaceholderProps>) {
  return (
    <div
      aria-hidden="true"
      className={[
        'mx-auto w-full max-w-[25rem] rounded-[2rem] border border-white/10 bg-white/[0.055] p-2.5 shadow-2xl shadow-sky-950/35 sm:backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-slate-950/72 p-3.5 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
          <div className="h-7 w-32 animate-pulse rounded-full bg-white/10" />
          <div className="h-7 w-16 animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="grid grid-cols-[7.25rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[0.82fr_1fr] sm:items-end sm:gap-5">
          <div className="aspect-[4/5] rounded-[1.15rem] bg-white/10 sm:rounded-[1.35rem]" />
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-10 w-full animate-pulse rounded bg-white/10" />
            <div className="h-16 w-full animate-pulse rounded bg-white/10" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl bg-white/8 px-2 py-2 sm:px-3 sm:py-2.5">
              <div className="h-3 w-10 animate-pulse rounded bg-white/10" />
              <div className="mt-2 h-8 w-full animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="mt-4 hidden h-4 w-56 animate-pulse rounded bg-white/10 sm:block" />
      </div>
    </div>
  );
}

export function DeferredHeroIdentityCard({
  className,
}: Readonly<IdentityCardPlaceholderProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    return deferMount(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <IdentityCardSkeleton className={className} />;
  }

  return <IdentityCard className={className} />;
}

export function DeferredLiveActivityBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    return deferMount(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <LiveActivityBarSkeleton />;
  }

  return <LiveActivityBar />;
}
