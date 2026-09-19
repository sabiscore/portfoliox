'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const GradientMeshMotion = dynamic(
  () => import('./GradientMeshMotion').then((module) => module.GradientMeshMotion),
  {
    ssr: false,
    loading: () => null,
  }
);

const ORBITAL_STYLES = `
  @keyframes orb-spin-cw  { to { transform: rotate( 360deg); } }
  @keyframes orb-spin-ccw { to { transform: rotate(-360deg); } }
  .orb-cw  { animation: orb-spin-cw  25s linear infinite; transform-origin: center; }
  .orb-ccw { animation: orb-spin-ccw 35s linear infinite; transform-origin: center; }
  .orb-slow { animation: orb-spin-cw 45s linear infinite; transform-origin: center; }
  @media (prefers-reduced-motion: reduce) {
    .orb-cw, .orb-ccw, .orb-slow { animation: none; }
  }
`;

function StaticOrbs() {
  return (
    <>
      <div className="gradient-mesh-wrap gradient-mesh-wrap--indigo">
        <div className="gradient-mesh-orb gradient-mesh-orb--indigo">
          <div className="orb-cw h-full w-full" />
        </div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--green">
        <div className="gradient-mesh-orb gradient-mesh-orb--green">
          <div className="orb-ccw h-full w-full" />
        </div>
      </div>

      <div className="gradient-mesh-wrap gradient-mesh-wrap--amber">
        <div className="gradient-mesh-orb gradient-mesh-orb--amber">
          <div className="orb-slow h-full w-full" />
        </div>
      </div>
    </>
  );
}

export function GradientMesh() {
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!pointerQuery.matches) return;

    let active = true;
    let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let idleId: number | null = null;

    const promote = () => {
      if (active) setEnhanced(true);
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(promote, { timeout: 1200 });
    } else {
      timeoutId = globalThis.setTimeout(promote, 700);
    }

    return () => {
      active = false;
      if (idleId !== null) window.cancelIdleCallback(idleId);
      if (timeoutId !== null) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="gradient-mesh">
      <style dangerouslySetInnerHTML={{ __html: ORBITAL_STYLES }} />
      {enhanced ? <GradientMeshMotion /> : <StaticOrbs />}
    </div>
  );
}
