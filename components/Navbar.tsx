'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

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
const sectionIdOf = (href: string): string | null => (href.startsWith('/#') ? href.slice(2) : null);

/**
 * Highlights the homepage section crossing the upper-middle viewport band,
 * with bottom-of-page fallback so #contact activates reliably on tall displays.
 */
function useSectionInView(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;
    const targets = TRACKED_SECTIONS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null
    );
    if (targets.length === 0) return;

    const visible = new Set<string>();
    const syncBottomFallback = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 48;
      if (nearBottom) {
        setActive('contact');
      } else {
        setActive(TRACKED_SECTIONS.find((id) => visible.has(id)) ?? null);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        syncBottomFallback();
      },
      { rootMargin: '-25% 0px -45% 0px' }
    );

    targets.forEach((target) => observer.observe(target));
    window.addEventListener('scroll', syncBottomFallback, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', syncBottomFallback);
    };
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

  const openCommandPalette = useCallback(() => {
    const commandWindow = window as Window & { __commandPaletteRequested?: boolean };
    commandWindow.__commandPaletteRequested = true;
    window.dispatchEvent(new CustomEvent('command-palette:open'));
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
    <header className="bg-obsidian-base/95 sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl">
      <nav
        aria-label="Primary system navigation"
        className="max-w-hero mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        {/* Brand Wordmark */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Oscar Ndugbu — Home"
            className="min-h-touch font-display tracking-brand hover:text-accent-cyan inline-flex items-center gap-3 text-base font-bold text-white transition-colors sm:text-lg"
          >
            <span aria-hidden="true">SCARDUBU</span>
          </Link>

          <span className="bg-obsidian-surface text-2xs hidden items-center border border-white/10 px-2.5 py-1 font-mono font-semibold tracking-widest text-zinc-300 uppercase xl:inline-flex">
            STAFF BACKEND &amp; PLATFORM
          </span>
        </div>

        {/* Desktop Navigation Links — from lg so the contact CTA never overflows on tablets */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_ROUTES.map((route) => {
            const active = isRouteActive(route, pathname);
            const inView = sectionIdOf(route.href) === sectionInView && sectionInView !== null;
            const isCurrent = active || inView;
            const className = `group inline-flex min-h-touch items-center gap-1.5 px-3.5 font-mono text-xs uppercase tracking-wider transition-colors duration-200 hover:bg-white/5 hover:text-accent-cyan ${
              isCurrent ? 'nav-link-active bg-white/5 text-accent-cyan' : 'text-zinc-200'
            }`;
            const content = (
              <>
                {route.code ? <span className="text-accent-cyan/80">{route.code}</span> : null}
                <span>{route.label}</span>
                {route.asset ? (
                  <span
                    aria-hidden="true"
                    className="text-accent-cyan/80 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
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
                aria-current={
                  active && !route.href.includes('#') ? 'page' : isCurrent ? 'true' : undefined
                }
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
            className={`min-h-touch min-w-touch hover:border-accent-cyan hover:text-accent-cyan inline-flex items-center justify-center gap-2 border px-3.5 font-mono text-xs font-semibold tracking-wider uppercase transition-colors motion-safe:active:translate-y-px ${
              sectionInView === 'contact'
                ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan'
                : 'bg-obsidian-surface border-white/20 text-white'
            }`}
          >
            <span className="text-accent-cyan" aria-hidden="true">
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
            className="min-h-touch min-w-touch bg-obsidian-surface hover:border-accent-cyan hover:text-accent-cyan inline-flex items-center justify-center border border-white/20 font-mono text-sm text-white transition-colors lg:hidden"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open quick navigation palette (Command K)"
            className="min-h-touch bg-obsidian-surface hover:border-accent-cyan hover:text-accent-cyan hidden items-center gap-1.5 border border-white/15 px-3 font-mono text-xs tracking-wider text-zinc-300 transition-colors motion-safe:active:translate-y-px lg:order-first lg:inline-flex"
          >
            <span>JUMP</span>
            <kbd className="border border-white/15 bg-obsidian-base px-1.5 py-0.5 text-2xs text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>

      {/* Click-outside backdrop & Mobile High-Glare Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={closeMobileMenu}
            className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
          <div
            id="mobile-navigation-drawer"
            className="bg-obsidian-surface/95 relative z-50 space-y-2 border-t border-white/10 px-4 pt-3 pb-5 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-micro font-mono tracking-widest text-zinc-300 uppercase">
                SITE NAVIGATION
              </span>
              <span className="text-micro text-accent-emerald font-mono">● LAGOS · UTC+1</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {NAV_ROUTES.map((route) => {
                const active = isRouteActive(route, pathname);
                const inView = sectionIdOf(route.href) === sectionInView && sectionInView !== null;
                const isCurrent = active || inView;
                const className = `flex min-h-cta items-center justify-between border bg-obsidian-base px-4 font-mono text-xs font-semibold uppercase tracking-wider transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan ${
                  isCurrent
                    ? 'border-accent-cyan/50 text-accent-cyan'
                    : 'border-white/10 text-white'
                }`;
                const label = (
                  <span className="flex items-center gap-2.5">
                    {route.code ? <span className="text-accent-cyan">{route.code}</span> : null}
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
                    <span aria-hidden="true" className="text-accent-cyan">
                      ↗
                    </span>
                  </a>
                ) : (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={(event) => handleSamePageAnchorClick(event, route.href, true)}
                    aria-current={
                      active && !route.href.includes('#') ? 'page' : isCurrent ? 'true' : undefined
                    }
                    className={className}
                  >
                    {label}
                    <span aria-hidden="true" className="text-accent-cyan">
                      ›
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Navbar;
