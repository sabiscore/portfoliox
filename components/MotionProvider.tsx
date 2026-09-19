'use client';

/**
 * CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
 * Major Reset • Lagos → Global • Production Conviction Architecture
 *
 * MotionProvider — LazyMotion wrapper.

 * Global MotionConfig is applied in app/providers.tsx so transition and
 * reduced-motion behavior are managed from a single top-level entrypoint.
 */

import { LazyMotion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';

type MotionFeatures = typeof import('./motion-features').default;

const staticFeatures = {} as MotionFeatures;

let featurePromise: Promise<MotionFeatures> | null = null;

const loadFeatures = () => {
  featurePromise ??= import('./motion-features').then((module) => module.default);
  return featurePromise;
};

export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [features, setFeatures] = useState<MotionFeatures>(staticFeatures);

  useEffect(() => {
    let active = true;
    let started = false;
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const removeIntentListeners = () => {
      window.removeEventListener('scroll', loadOnIntent);
      window.removeEventListener('pointerdown', loadOnIntent);
      window.removeEventListener('touchstart', loadOnIntent);
      window.removeEventListener('keydown', loadOnIntent);
      finePointerQuery.removeEventListener('change', loadForFinePointer);
      reducedMotionQuery.removeEventListener('change', loadForFinePointer);
    };

    const startLoading = () => {
      if (started || reducedMotionQuery.matches) return;
      started = true;
      removeIntentListeners();

      void loadFeatures().then(
        (loadedFeatures) => {
          if (active) setFeatures(loadedFeatures);
        },
        () => {
          // Static content is already rendered; animation features are optional.
        }
      );
    };

    function loadOnIntent() {
      startLoading();
    }

    function loadForFinePointer() {
      if (
        !reducedMotionQuery.matches &&
        (finePointerQuery.matches || window.scrollY > 20)
      ) {
        startLoading();
      }
    }

    if (finePointerQuery.matches && !reducedMotionQuery.matches) {
      // Framer's animation feature bundle is non-critical for the initial
      // render. Give the hero a clean paint window, while keeping interaction
      // listeners able to promote the bundle immediately when the visitor
      // actually interacts.
      let idleId: number;
      let idleCallback = false;

      if ('requestIdleCallback' in window) {
        idleCallback = true;
        idleId = window.requestIdleCallback(() => startLoading(), { timeout: 900 });
      } else {
        idleId = globalThis.setTimeout(startLoading, 600);
      }

      return () => {
        if (idleCallback) {
          window.cancelIdleCallback(idleId);
        } else {
          globalThis.clearTimeout(idleId);
        }
        active = false;
        removeIntentListeners();
      };
    } else {
      window.addEventListener('scroll', loadOnIntent, { passive: true, once: true });
      window.addEventListener('pointerdown', loadOnIntent, { passive: true, once: true });
      window.addEventListener('touchstart', loadOnIntent, { passive: true, once: true });
      window.addEventListener('keydown', loadOnIntent, { once: true });
      finePointerQuery.addEventListener('change', loadForFinePointer);
      reducedMotionQuery.addEventListener('change', loadForFinePointer);
    }

    return () => {
      active = false;
      removeIntentListeners();
    };
  }, []);

  return (
    <LazyMotion features={features}>
      {children}
    </LazyMotion>
  );
}
