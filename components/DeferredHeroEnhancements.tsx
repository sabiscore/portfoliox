'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  LiveActivityBarSkeleton,
  type LiveActivityBarProps,
} from './Liveactivitybar';

const LiveActivityBar = dynamic<LiveActivityBarProps>(
  () =>
    import('./Liveactivitybar').then((mod) => ({
      default: mod.LiveActivityBar,
    })),
  {
    loading: () => <LiveActivityBarSkeleton />,
    ssr: false,
  }
);

export interface DeferredHeroEnhancementsProps {
  className?: string;
}

export function DeferredHeroEnhancements({
  className = '',
}: DeferredHeroEnhancementsProps): React.JSX.Element {
  return (
    <div className={`w-full ${className}`}>
      <LiveActivityBar />
    </div>
  );
}

export default DeferredHeroEnhancements;
