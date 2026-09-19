'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import {
  IDENTITY_CARD_CONTENT_CLASSNAME,
  IDENTITY_CARD_FRAME_CLASSNAME,
  IDENTITY_CARD_META_ROW_CLASSNAME,
  IDENTITY_CARD_PORTRAIT_CLASSNAME,
  IDENTITY_CARD_PROFILE_GRID_CLASSNAME,
  IDENTITY_CARD_SURFACE_CLASSNAME,
  IDENTITY_CARD_TRUST_SIGNAL_CLASSNAME,
  IDENTITY_CARD_TRUST_SIGNALS_GRID_CLASSNAME,
} from '@/components/identityCardStyles';

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

function IdentityCardSkeleton({ className = '' }: Readonly<IdentityCardPlaceholderProps>) {
  return (
    <div
      aria-hidden="true"
      className={[
        IDENTITY_CARD_FRAME_CLASSNAME,
        'sm:backdrop-blur-2xl',
        className,
      ].join(' ')}
    >
      <div className={IDENTITY_CARD_SURFACE_CLASSNAME}>
        <div className={IDENTITY_CARD_CONTENT_CLASSNAME}>
          <div className={IDENTITY_CARD_META_ROW_CLASSNAME}>
            <div className="h-7 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-white/10" />
          </div>

          <div className={IDENTITY_CARD_PROFILE_GRID_CLASSNAME}>
            <div className={`${IDENTITY_CARD_PORTRAIT_CLASSNAME} bg-white/10`} />
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="h-10 w-full animate-pulse rounded bg-white/10" />
              <div className="h-16 w-full animate-pulse rounded bg-white/10" />
            </div>
          </div>

          <div className={IDENTITY_CARD_TRUST_SIGNALS_GRID_CLASSNAME}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`${IDENTITY_CARD_TRUST_SIGNAL_CLASSNAME} bg-white/8`}>
                <div className="h-3 w-10 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-8 w-full animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>

          <div className="mt-4 hidden h-4 w-56 animate-pulse rounded bg-white/10 sm:block" />
        </div>
      </div>
    </div>
  );
}

export function DeferredHeroIdentityCard({
  className,
}: Readonly<IdentityCardPlaceholderProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <IdentityCardSkeleton className={className} />;
  }

  return <IdentityCard className={className} />;
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
