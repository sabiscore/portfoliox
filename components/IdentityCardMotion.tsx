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

    const reveal = () => setHeroCardReady(true);
    const idle = window.requestIdleCallback?.(reveal, { timeout: 1500 });
    const timer = window.setTimeout(reveal, 1500);

    return () => {
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
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
