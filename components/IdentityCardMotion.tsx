'use client';

import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { m } from 'framer-motion';

import { IDENTITY_CARD_VARIANTS } from '@/lib/motion';

type IdentityCardMotionProps = {
  children: ReactNode;
  className?: string;
};

export function IdentityCardMotion({
  children,
  className = '',
}: IdentityCardMotionProps): JSX.Element {
  const [heroCardReady, setHeroCardReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !window.matchMedia('(max-width: 767px)').matches) {
      setHeroCardReady(true);
      return;
    }

    const reveal = () => setHeroCardReady(true);
    const idle = window.requestIdleCallback?.(reveal, { timeout: 1200 });
    const timer = window.setTimeout(reveal, 1200);

    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <m.div
      variants={IDENTITY_CARD_VARIANTS}
      initial={false}
      animate={heroCardReady ? 'active' : 'rest'}
      className={['identity-card-motion', className].filter(Boolean).join(' ')}
      data-hero-card-ready={heroCardReady ? 'true' : 'false'}
    >
      {children}
    </m.div>
  );
}
