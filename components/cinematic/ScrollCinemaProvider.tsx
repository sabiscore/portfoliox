'use client';

import type Lenis from 'lenis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';

import { trackSectionView } from '@/app/lib/analytics';
import type { ChapterId } from '@/lib/cinematic/chapters';
import { CHAPTERS } from '@/lib/cinematic/chapters';
import { loadScrollCinemaRuntime } from '@/lib/cinematic/load-scroll-cinema';

type ScrollCinemaContextValue = {
  reducedMotion: boolean;
  activeChapter: ChapterId;
  activeChapterRef: MutableRefObject<ChapterId>;
  lenisRef: MutableRefObject<Lenis | null>;
  scrollYRef: MutableRefObject<number>;
  scrollProgressRef: MutableRefObject<number>;
  setActiveChapter: (chapter: ChapterId) => void;
  scrollToSection: (sectionId: string) => void;
};

const ScrollCinemaContext = createContext<ScrollCinemaContextValue | null>(null);

function getSectionOffset() {
  if (typeof window === 'undefined') return -88;
  const navHeightToken = getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-height')
    .trim();
  const navHeight = Number.parseFloat(navHeightToken);
  return Number.isFinite(navHeight) ? -(navHeight + 16) : -88;
}

export function useScrollCinema() {
  const value = useContext(ScrollCinemaContext);
  if (!value) throw new Error('useScrollCinema must be used within ScrollCinemaProvider');
  return value;
}

export function ScrollCinemaStaticProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeChapter, setActiveChapterState] = useState<ChapterId>('prologue');
  const activeChapterRef = useRef<ChapterId>('prologue');
  const lenisRef = useRef<Lenis | null>(null);
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);

  const setActiveChapter = useCallback((chapter: ChapterId) => {
    activeChapterRef.current = chapter;
    setActiveChapterState(chapter);
    if (typeof document !== 'undefined') document.documentElement.dataset.activeChapter = chapter;
  }, []);

  const syncNativeScrollProgress = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    const viewportHeight = window.innerHeight || doc.clientHeight || 0;
    const limit = Math.max(scrollHeight - viewportHeight, 0);
    scrollYRef.current = Math.max(0, scrollTop);
    scrollProgressRef.current = limit > 0 ? Math.min(1, Math.max(0, scrollTop / limit)) : 0;
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (typeof document === 'undefined' || typeof window === 'undefined') return;
      const element = document.getElementById(sectionId);
      if (!element) return;
      const top = element.getBoundingClientRect().top + window.scrollY + getSectionOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? 'auto' : 'smooth' });
    },
    [reducedMotion]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      const reduce = media.matches;
      setReducedMotion(reduce);
      document.documentElement.dataset.reducedMotion = reduce ? 'true' : 'false';
    };
    syncMotion();
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.dataset.activeChapter = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    document.documentElement.dataset.scrollEngine = 'static';
    const onNativeScroll = () => syncNativeScrollProgress();
    onNativeScroll();
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('resize', onNativeScroll, { passive: true });
    window.addEventListener('orientationchange', onNativeScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', onNativeScroll);
      window.removeEventListener('orientationchange', onNativeScroll);
    };
  }, [syncNativeScrollProgress]);

  const value = useMemo<ScrollCinemaContextValue>(
    () => ({
      reducedMotion,
      activeChapter,
      activeChapterRef,
      lenisRef,
      scrollYRef,
      scrollProgressRef,
      setActiveChapter,
      scrollToSection,
    }),
    [activeChapter, reducedMotion, scrollToSection, setActiveChapter]
  );

  return <ScrollCinemaContext.Provider value={value}>{children}</ScrollCinemaContext.Provider>;
}

export function ScrollCinemaProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeChapter, setActiveChapterState] = useState<ChapterId>('prologue');
  const activeChapterRef = useRef<ChapterId>('prologue');
  const scrollYRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const lenisRef = useRef<Lenis | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const trackedSectionsRef = useRef(new Set<ChapterId>());

  const warnDev = useCallback((message: string, error?: unknown) => {
    if (process.env.NODE_ENV !== 'production') console.warn(`[scroll-cinema] ${message}`, error);
  }, []);

  const syncScrollState = useCallback((scrollTop: number, limit: number) => {
    const clampedScrollTop = Math.max(0, scrollTop);
    scrollYRef.current = clampedScrollTop;
    scrollProgressRef.current = limit > 0 ? Math.min(1, Math.max(0, clampedScrollTop / limit)) : 0;
  }, []);

  const syncNativeScrollProgress = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
    const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
    const viewportHeight = window.innerHeight || doc.clientHeight || 0;
    syncScrollState(scrollTop, Math.max(scrollHeight - viewportHeight, 0));
  }, [syncScrollState]);

  const setActiveChapter = useCallback((chapter: ChapterId) => {
    activeChapterRef.current = chapter;
    setActiveChapterState(chapter);
    if (typeof document !== 'undefined') document.documentElement.dataset.activeChapter = chapter;
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const maxAttempts = 120;
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }

      const tryScroll = (attempt: number) => {
        const element = document.getElementById(sectionId);
        if (!element) {
          if (attempt < maxAttempts) {
            retryTimerRef.current = window.setTimeout(() => {
              retryTimerRef.current = null;
              tryScroll(attempt + 1);
            }, 80);
          }
          return;
        }

        retryTimerRef.current = null;
        const getTargetTop = () =>
          Math.max(0, element.getBoundingClientRect().top + window.scrollY + getSectionOffset());
        const nativeScroll = () => {
          window.scrollTo({
            top: getTargetTop(),
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        };

        const activeLenis = lenisRef.current;
        if (reducedMotion || !activeLenis) {
          nativeScroll();
          return;
        }

        try {
          // Resolve the element to a numeric document coordinate before the
          // animation starts. Deferred sections can change their containing
          // geometry during a smooth scroll; a moving HTMLElement target can
          // therefore settle above or below the sticky-nav safe zone.
          activeLenis.resize();

          const settleTarget = (settleAttempt: number) => {
            window.requestAnimationFrame(() => {
              activeLenis.resize();
              const correctedTop = getTargetTop();
              if (Math.abs(window.scrollY - correctedTop) > 2) {
                activeLenis.scrollTo(correctedTop, { immediate: true, force: true });
              }

              // Below-fold chapters can release content-visibility containment or
              // finish font/layout work after the first correction frame. Recheck
              // for a short bounded window instead of letting the anchor drift.
              if (settleAttempt < 4) {
                settleTimerRef.current = window.setTimeout(() => {
                  settleTimerRef.current = null;
                  settleTarget(settleAttempt + 1);
                }, 80);
              }
            });
          };

          activeLenis.scrollTo(getTargetTop(), {
            onComplete: () => settleTarget(0),
          });
        } catch (error) {
          warnDev('Lenis scrollTo failed. Falling back to native smooth scrolling.', error);
          lenisRef.current = null;
          document.documentElement.dataset.scrollEngine = 'native';
          nativeScroll();
        }
      };

      tryScroll(0);
    },
    [reducedMotion, warnDev]
  );

  useEffect(
    () => () => {
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
      if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const scrollFromHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (id) scrollToSection(id);
    };
    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);
    return () => window.removeEventListener('hashchange', scrollFromHash);
  }, [scrollToSection]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      const reduce = media.matches;
      setReducedMotion(reduce);
      document.documentElement.dataset.reducedMotion = reduce ? 'true' : 'false';
    };
    syncMotion();
    media.addEventListener('change', syncMotion);
    return () => media.removeEventListener('change', syncMotion);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const syncPointer = () => {
      setIsTouchDevice(coarse.matches);
      document.documentElement.dataset.pointerFine = fine.matches ? 'true' : 'false';
      document.documentElement.dataset.pointerCoarse = coarse.matches ? 'true' : 'false';
    };
    syncPointer();
    fine.addEventListener('change', syncPointer);
    coarse.addEventListener('change', syncPointer);
    return () => {
      fine.removeEventListener('change', syncPointer);
      coarse.removeEventListener('change', syncPointer);
    };
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.dataset.activeChapter = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const chapter = CHAPTERS.find((item) => item.id === activeChapter);
    if (!chapter || !document.getElementById(chapter.sectionId)) return;
    if (trackedSectionsRef.current.has(chapter.id)) return;
    trackedSectionsRef.current.add(chapter.id);
    trackSectionView(chapter.sectionId, chapter.id, chapter.label);
  }, [activeChapter]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let cancelled = false;
    let cleanupActiveEngine: (() => void) | null = null;

    const setupNativeScrollProgress = () => {
      document.documentElement.dataset.scrollEngine = 'native';
      const onNativeScroll = () => syncNativeScrollProgress();
      onNativeScroll();
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      window.addEventListener('resize', onNativeScroll, { passive: true });
      window.addEventListener('orientationchange', onNativeScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onNativeScroll);
        window.removeEventListener('resize', onNativeScroll);
        window.removeEventListener('orientationchange', onNativeScroll);
      };
    };

    const reducedMotionAtBoot = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointerAtBoot = window.matchMedia('(pointer: coarse)').matches;
    const compactViewportAtBoot = window.matchMedia('(max-width: 767px)').matches;
    const touchAtBoot = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

    // Mobile/reduced-motion is intentionally resolved before any GSAP/ScrollTrigger
    // download, registration, or refresh. Native scrolling is the product contract
    // on touch and for people who request reduced motion.
    if (
      reducedMotion ||
      reducedMotionAtBoot ||
      isTouchDevice ||
      coarsePointerAtBoot ||
      compactViewportAtBoot ||
      touchAtBoot
    ) {
      if (lenisRef.current) {
        try {
          lenisRef.current.destroy();
        } catch (error) {
          warnDev('Lenis destroy failed while entering native-scroll mode.', error);
        }
        lenisRef.current = null;
      }
      cleanupActiveEngine = setupNativeScrollProgress();
      return () => cleanupActiveEngine?.();
    }

    const initializeDesktopEngine = async () => {
      try {
        const [{ gsap, ScrollTrigger }, { default: LenisConstructor }] = await Promise.all([
          loadScrollCinemaRuntime(),
          import('lenis'),
        ]);

        // Route transitions and capability changes may clean up this effect while
        // the chunks are still in flight. Never initialize against an unmounted tree.
        if (cancelled) return;

        // Lenis is the single desktop wheel owner. ScrollTrigger remains synchronized
        // from Lenis' scroll event, but does not install normalizeScroll(), which would
        // independently intercept the same wheel input on the JavaScript thread.
        // Touch/coarse-pointer devices never reach this branch and keep native scrolling.
        gsap.ticker.lagSmoothing(0);

        const safeRefresh = (force = false) => {
          try {
            ScrollTrigger.refresh(force);
          } catch (error) {
            warnDev('ScrollTrigger refresh failed.', error);
          }
        };

        let lenis: Lenis | null = null;
        let cleanupNative: (() => void) | null = null;
        let lenisTickerFn: ((time: number) => void) | null = null;

        try {
          const sectionOffset = getSectionOffset();
          lenis = new LenisConstructor({
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: false,
            wheelMultiplier: 1,
            // Lenis' built-in anchor path accounts for both CSS scroll-margin and
            // root scroll-padding. The app's canonical target uses a direct sticky-nav
            // offset instead, so compensate here and make both click paths converge on
            // the same final coordinate rather than launching competing destinations.
            anchors: { offset: -sectionOffset },
            stopInertiaOnNavigate: true,
            prevent: (node: HTMLElement) => {
              if (node.hasAttribute('data-lenis-prevent')) return true;
              const style = getComputedStyle(node);
              return (
                node.scrollWidth > node.clientWidth + 4 &&
                ['auto', 'scroll'].includes(style.overflowX)
              );
            },
          });

          if (cancelled) {
            lenis.destroy();
            return;
          }

          lenisRef.current = lenis;
          const activeLenis = lenis;
          lenisTickerFn = (time: number) => {
            try {
              activeLenis.raf(time * 1000);
            } catch (error) {
              warnDev('Lenis raf() failed. Removing GSAP ticker integration.', error);
              if (lenisTickerFn) gsap.ticker.remove(lenisTickerFn);
              lenisTickerFn = null;
            }
          };
          gsap.ticker.add(lenisTickerFn, false, true);
          document.documentElement.dataset.scrollEngine = 'lenis';
        } catch (error) {
          lenisRef.current = null;
          warnDev('Lenis initialization failed. Falling back to native scrolling.', error);
          cleanupNative = setupNativeScrollProgress();
        }

        const onScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
          syncScrollState(scroll, limit);
        };
        const syncScrollTrigger = () => {
          try {
            ScrollTrigger.update();
          } catch (error) {
            warnDev('ScrollTrigger update failed after Lenis scroll tick.', error);
          }
        };

        if (lenis) {
          lenis.on('scroll', onScroll);
          lenis.on('scroll', syncScrollTrigger);
          syncNativeScrollProgress();
        }

        const refresh = () => {
          try {
            lenis?.resize();
          } catch (error) {
            warnDev('Lenis resize failed during refresh.', error);
          }
          safeRefresh();
          syncNativeScrollProgress();
        };

        let refreshTimer: ReturnType<typeof setTimeout> | null = null;
        const debouncedRefresh = () => {
          if (refreshTimer !== null) clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => {
            refreshTimer = null;
            refresh();
          }, 150);
        };

        window.addEventListener('resize', debouncedRefresh, { passive: true });
        window.addEventListener('orientationchange', debouncedRefresh, { passive: true });

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined' && lenis) {
          let previousHeight = 0;
          resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
              const newHeight = entry.contentRect.height;
              if (Math.abs(newHeight - previousHeight) > 4) {
                previousHeight = newHeight;
                debouncedRefresh();
              }
            }
          });
          resizeObserver.observe(document.body);
        }

        const onVisibility = () => {
          if (document.visibilityState === 'visible') {
            lenis?.start();
            safeRefresh(true);
            syncNativeScrollProgress();
            if (
              !document.documentElement.hasAttribute('data-nav-open') &&
              !document.body.classList.contains('nav-open') &&
              document.body.style.overflow === 'hidden'
            ) {
              document.body.style.overflow = '';
            }
          } else {
            lenis?.stop();
          }
        };
        document.addEventListener('visibilitychange', onVisibility);

        const fontsReady = document.fonts?.ready;
        if (fontsReady) {
          void fontsReady.then(() => {
            if (cancelled) return;
            safeRefresh(true);
            syncNativeScrollProgress();
          });
        }

        cleanupActiveEngine = () => {
          resizeObserver?.disconnect();
          if (lenisTickerFn) gsap.ticker.remove(lenisTickerFn);
          cleanupNative?.();
          if (lenis) {
            lenis.off('scroll', onScroll);
            lenis.off('scroll', syncScrollTrigger);
            try {
              lenis.destroy();
            } catch (error) {
              warnDev('Lenis destroy failed during cleanup.', error);
            }
          }
          lenisRef.current = null;
          window.removeEventListener('resize', debouncedRefresh);
          window.removeEventListener('orientationchange', debouncedRefresh);
          if (refreshTimer !== null) clearTimeout(refreshTimer);
          document.removeEventListener('visibilitychange', onVisibility);
          try {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          } catch (error) {
            warnDev('ScrollTrigger cleanup failed.', error);
          }
        };
      } catch (error) {
        if (cancelled) return;
        warnDev('Cinematic dependencies failed to load. Falling back to native scrolling.', error);
        cleanupActiveEngine = setupNativeScrollProgress();
      }
    };

    // Keep the first paint free of GSAP/Lenis bootstrap work. The hero is
    // fully usable with native scrolling; desktop cinematic scrolling is an
    // enhancement that can safely start after the browser has had a chance to
    // paint the critical content. A bounded timeout keeps the enhancement from
    // being postponed indefinitely on a busy main thread.
    const schedule = window.setTimeout(() => {
      void initializeDesktopEngine();
    }, 600);

    return () => {
      window.clearTimeout(schedule);
      cancelled = true;
      cleanupActiveEngine?.();
      cleanupActiveEngine = null;
    };
  }, [isTouchDevice, reducedMotion, syncNativeScrollProgress, syncScrollState, warnDev]);

  const value = useMemo<ScrollCinemaContextValue>(
    () => ({
      reducedMotion,
      activeChapter,
      activeChapterRef,
      lenisRef,
      scrollYRef,
      scrollProgressRef,
      setActiveChapter,
      scrollToSection,
    }),
    [activeChapter, reducedMotion, scrollToSection, setActiveChapter]
  );

  return <ScrollCinemaContext.Provider value={value}>{children}</ScrollCinemaContext.Provider>;
}
