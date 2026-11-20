'use client';

import React from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface GradientMeshMotionProps {
  className?: string;
}

export function GradientMeshMotion({
  className = '',
}: GradientMeshMotionProps): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`gradient-mesh-motion pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#08090C] ${className}`}
    >
      {/* Primary Coordinate Grid Layer */}
      <div className="absolute inset-0 bg-kinetic-grid bg-[size:36px_36px] opacity-60" />

      {/* Top Cyan Telemetry Horizon */}
      <div
        className={`absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#00D9FF]/[0.04] blur-3xl ${
          prefersReducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Mid Emerald Quantitative Node */}
      <div
        className={`absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-[#00FF66]/[0.03] blur-3xl ${
          prefersReducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Bottom Dark Glass Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#08090C] via-[#08090C]/80 to-transparent" />
    </div>
  );
}

export default GradientMeshMotion;
