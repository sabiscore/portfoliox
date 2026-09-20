'use client';

import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';

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
    if (!window.matchMedia('(max-width: 767px)').matches) {
      setHeroCardReady(true);
      return;
    }

    const timer = window.setTimeout(() => setHeroCardReady(true), 1400);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={['identity-card-motion', className].join(' ')}
      data-hero-card-ready={heroCardReady ? 'true' : 'false'}
    >
      {children}
    </div>
  );
}
