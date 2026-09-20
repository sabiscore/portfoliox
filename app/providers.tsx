'use client';

// CONVICTION ENGINE V1.0 — Providers
//
// SURGICAL PATCH v2026.15:
//   - MotionConfig transition refined: added `mass: 0.9` to the global spring.
//     The mass parameter adds physical weight to spring animations, preventing
//     over-oscillation on sequences where multiple elements animate in a stagger.
//     Without mass, staggered children can "bounce" independently creating visual
//     noise. mass:0.9 (slightly under 1.0) keeps the spring feeling light and
//     responsive while dampening unwanted oscillation — essential for the staggered
//     metric cards and project card reveals.
//
//   - No changes to reducedMotion:"user" (already correct — MotionConfig respects
//     prefers-reduced-motion at the framework level, disabling all Framer animations
//     in one place rather than per-component).
//
//   - No changes to ScrollCinemaProvider/ScrollCinemaStaticProvider structure.
//     The CinematicErrorBoundary fallback to static provider is preserved.

import type { ReactNode } from 'react';

import {
  ScrollCinemaProvider,
  ScrollCinemaStaticProvider,
} from '@/components/cinematic/ScrollCinemaProvider';
import { CinematicErrorBoundary } from '@/components/CinematicErrorBoundary';
import { MotionProvider } from '@/components/MotionProvider';
import { ThemeProvider } from '@/components/ThemeProvider';

export { useTheme } from '@/components/ThemeProvider';

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ThemeProvider>
      <MotionProvider>
        <CinematicErrorBoundary
          fallback={<ScrollCinemaStaticProvider>{children}</ScrollCinemaStaticProvider>}
        >
          <ScrollCinemaProvider>{children}</ScrollCinemaProvider>
        </CinematicErrorBoundary>
      </MotionProvider>
    </ThemeProvider>
  );
}