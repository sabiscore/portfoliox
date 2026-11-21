'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import { CV_ASSET_PATH } from '@/lib/config';

interface NavRoute {
  label: string;
  href: string;
  /** Section code shown only when the destination carries the same code on the page. */
  code?: string;
  /** Static asset opened in a new tab rather than routed client-side. */
  asset?: boolean;
}

// Numbered entries mirror the numbered homepage sections (01 Projects, 02
// Engineering decisions). Contact (03) is the persistent CTA on the right.
const NAV_ROUTES: ReadonlyArray<NavRoute> = [
  { code: '01', label: 'PROJECTS', href: '/#projects' },
  { code: '02', label: 'ENGINEERING', href: '/#failure-modes' },
  { label: 'WRITING', href: '/writing' },
  { label: 'RÉSUMÉ', href: CV_ASSET_PATH, asset: true },
];

const isRouteActive = (route: NavRoute, pathname: string | null): boolean => {
  if (route.asset || !pathname) return false;
  if (route.href === '/#projects') return pathname.startsWith('/work');
  return !route.href.includes('#') && pathname.startsWith(route.href);
};

// Homepage sections tracked for the in-view indicator, in document order.
const TRACKED_SECTIONS = ['projects', 'failure-modes', 'contact'] as const;
const sectionIdOf = (href: string): string | null =>
  href.startsWith('/#') ? href.slice(2) : null;

/** Highlights the homepage section crossing the middle of the viewport. */
function useSectionInView(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const targets = TRACKED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null
    );
    if (targets.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActive(TRACKED_SECTIONS.find((id) => visible.has(id)) ?? null);
      },
      // A thin band just above the vertical centre of the viewport.
      { rootMargin: '-45% 0px -50% 0px' }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Navbar(): React.JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { scrollToSection } = useScrollCinema();
  const sectionInView = useSectionInView(pathname === '/');

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleSamePageAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string, closeDrawer = false) => {
      if (closeDrawer) closeMobileMenu();
      const targetId = sectionIdOf(href);
      if (pathname !== '/' || !targetId) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return;
      }
      event.preventDefault();
      window.history.pushState(null, '', `/#${targetId}`);
      scrollToSection(targetId);
    },
    [closeMobileMenu, pathname, scrollToSection]
  );

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
            aria-label="Scardubu — home"
            className="min-h-[44px] inline-flex items-center gap-3 font-display text-base sm:text-lg font-bold tracking-[0.28em] text-white hover:text-[#00D9FF] transition-colors"
          >
            <span>SCARDUBU</span>
          </Link>

          <span className="hidden xl:inline-flex items-center border border-white/10 bg-[#0E0E10] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            ENGINEERING PORTFOLIO
          </span>
        </div>

        {/* Desktop Navigation Links — from lg so the contact CTA never overflows on tablets */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ROUTES.map((route) => {
            const active = isRouteActive(route, pathname);
            const inView = sectionIdOf(route.href) === sectionInView && sectionInView !== null;
            const className = `group min-h-[44px] px-3.5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider hover:text-[#00D9FF] hover:bg-white/[0.03] transition-[color,background-color,box-shadow] duration-200 ${
              active || inView ? 'text-[#00D9FF] shadow-[inset_0_-1px_0_#00D9FF]' : 'text-white/75'
            }`;
            const content = (
              <>
                {route.code ? <span className="text-[#00D9FF]/70">{route.code}</span> : null}
                <span>{route.label}</span>
                {route.asset ? (
                  <span
                    aria-hidden="true"
                    className="text-[#00D9FF]/70 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                ) : null}
              </>
            );
            return route.asset ? (
              <a
                key={route.href}
                href={route.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Résumé (PDF, opens in a new tab)"
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link
                key={route.href}
                href={route.href}
                onClick={(event) => handleSamePageAnchorClick(event, route.href)}
                aria-current={active && !route.href.includes('#') ? 'page' : active || inView ? 'true' : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>

        {/* Right Controls: Docked Contact Trigger & 44px Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            onClick={(event) => handleSamePageAnchorClick(event, '/#contact')}
            aria-label="Go to the contact section"
            aria-current={sectionInView === 'contact' ? 'true' : undefined}
            className={`min-h-[44px] min-w-[44px] px-3.5 inline-flex items-center justify-center gap-2 border hover:border-[#00D9FF] motion-safe:active:translate-y-px ${
              sectionInView === 'contact' ? 'border-[#00D9FF]' : 'border-white/15'
            } bg-[#0E0E10] font-mono text-xs font-semibold uppercase tracking-wider text-white hover:text-[#00D9FF] transition-colors`}
          >
            <span className="text-[#00D9FF]" aria-hidden="true">
              ✉
            </span>
            <span>CONTACT</span>
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-sm text-white hover:text-[#00D9FF] transition-colors"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile High-Glare Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-white/10 bg-[#0E0E10]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              SITE NAVIGATION
            </span>
            <span className="font-mono text-[11px] text-[#00FF66]">
              ● LAGOS · UTC+1
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {NAV_ROUTES.map((route) => {
              const active = isRouteActive(route, pathname);
              const inView = sectionIdOf(route.href) === sectionInView && sectionInView !== null;
              const isCurrent = active || inView;
              const className = `min-h-[48px] px-4 flex items-center justify-between border bg-[#08090C] font-mono text-xs font-semibold uppercase tracking-wider hover:border-[#00D9FF]/50 hover:text-[#00D9FF] transition-colors ${
                isCurrent ? 'border-[#00D9FF]/50 text-[#00D9FF]' : 'border-white/10 text-white'
              }`;
              const label = (
                <span className="flex items-center gap-2.5">
                  {route.code ? <span className="text-[#00D9FF]">{route.code}</span> : null}
                  <span>{route.asset ? `${route.label} (PDF)` : route.label}</span>
                </span>
              );
              return route.asset ? (
                <a
                  key={route.href}
                  href={route.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className={className}
                >
                  {label}
                  <span aria-hidden="true" className="text-[#00D9FF]">
                    ↗
                  </span>
                </a>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={(event) => handleSamePageAnchorClick(event, route.href, true)}
                  aria-current={active && !route.href.includes('#') ? 'page' : isCurrent ? 'true' : undefined}
                  className={className}
                >
                  {label}
                  <span aria-hidden="true" className="text-[#00D9FF]">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
