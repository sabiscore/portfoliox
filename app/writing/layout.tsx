import type { ReactNode } from 'react';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

/**
 * Shared chrome for /writing and /writing/[slug]. Intentionally omits a
 * `metadata.title` override so child routes inherit the root `app/layout.tsx`
 * title template once without duplicating " · Oscar Ndugbu".
 */
export default function WritingLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
