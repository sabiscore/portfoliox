import type { JSX, ReactNode } from 'react';

type IdentityCardMotionProps = {
  children: ReactNode;
  className?: string;
};

export function IdentityCardMotion({
  children,
  className = '',
}: IdentityCardMotionProps): JSX.Element {
  return (
    <div className={['identity-card-motion', className].join(' ')}>
      {children}
    </div>
  );
}
