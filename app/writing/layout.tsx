import type { ReactNode } from 'react';

interface WritingLayoutProps {
  children: ReactNode;
}

/**
 * Intentionally omits a `metadata.title` override so child routes
 * (`/writing` and `/writing/[slug]`) inherit the root `app/layout.tsx`
 * title template once without duplicating " · Oscar Ndugbu".
 */
export default function WritingLayout({ children }: WritingLayoutProps) {
  return <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>;
}
