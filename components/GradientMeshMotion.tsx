'use client';

import React from 'react';

export interface GradientMeshMotionProps {
  className?: string;
}

/**
 * Static GPU-composited atmospheric backdrop.
 * Eliminates continuous opacity-pulse repaints across large blur layers while
 * preserving the V16 strict-containment contract and OLED visual atmosphere.
 */
export function GradientMeshMotion({
  className = '',
}: GradientMeshMotionProps): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={`gradient-mesh-motion pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#08090C] ${className}`}
    >
      {/* Primary Coordinate Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-60" />

      {/* Top Cyan Telemetry Horizon */}
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#00D9FF]/[0.04] blur-3xl" />

      {/* Mid Emerald Quantitative Node */}
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-[#00FF66]/[0.025] blur-3xl" />

      {/* Bottom Dark Glass Vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#08090C] via-[#08090C]/80 to-transparent" />
    </div>
  );
}

export default GradientMeshMotion;