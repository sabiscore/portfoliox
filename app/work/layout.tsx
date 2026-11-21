import type { ReactNode } from 'react';

import { Navbar } from '@/components/Navbar';

// Case-study routes share the homepage navigation so a visitor arriving from
// search or a shared link can reach projects, writing, résumé, and contact.
export default function WorkLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
