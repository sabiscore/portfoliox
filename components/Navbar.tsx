'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavRoute {
  label: string;
  href: string;
  code: string;
}

const NAV_ROUTES: ReadonlyArray<NavRoute> = [
  { code: '01', label: 'WORK', href: '/#projects' },
  { code: '02', label: 'ENGINEERING', href: '/#failure-modes' },
  { code: '03', label: 'PROFILE', href: '/#identity' },
  { code: '04', label: 'WRITING', href: '/writing' },
];

export function Navbar(): React.JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      closeMobileMenu();
      menuButtonRef.current?.focus();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090C]/90 backdrop-blur-xl">
      <nav
        aria-label="Primary system navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
      >
        {/* Brand Wordmark */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center gap-3 font-heading text-base sm:text-lg font-bold tracking-[0.28em] text-white hover:text-[#00D9FF] transition-colors"
          >
            <span>SCARDUBU</span>
          </Link>

          <span className="hidden sm:inline-flex items-center border border-white/10 bg-[#0E0E10] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            ENGINEERING PORTFOLIO
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="min-h-[44px] px-3.5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white/75 hover:text-[#00D9FF] hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-[#00D9FF]/70">{route.code}</span>
              <span>{route.label}</span>
            </Link>
          ))}
        </div>

        {/* Right Controls: Docked Contact Trigger & 44px Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            aria-label="Go to the contact section"
            className="min-h-[44px] min-w-[44px] px-3.5 inline-flex items-center justify-center gap-2 border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-xs font-semibold uppercase tracking-wider text-white hover:text-[#00D9FF] transition-colors"
          >
            <span className="text-[#00D9FF]" aria-hidden="true">
              ✉
            </span>
            <span className="hidden sm:inline">INQUIRE</span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-sm text-white hover:text-[#00D9FF] transition-colors"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile High-Glare Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden border-t border-white/10 bg-[#0E0E10]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
              SITE NAVIGATION
            </span>
            <span className="font-mono text-[11px] text-[#00FF66]">
              ● LAGOS · UTC+1
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {NAV_ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={closeMobileMenu}
                className="min-h-[48px] px-4 flex items-center justify-between border border-white/10 hover:border-[#00D9FF]/50 bg-[#08090C] font-mono text-xs font-semibold uppercase tracking-wider text-white hover:text-[#00D9FF] transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-[#00D9FF]">{route.code}</span>
                  <span>{route.label}</span>
                </span>
                <span aria-hidden="true" className="text-[#00D9FF]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
