'use client';

import { useEffect } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';
import type { ChapterConfig } from '@/lib/cinematic/chapters';
import { loadScrollCinemaRuntime } from '@/lib/cinematic/load-scroll-cinema';

type UseChapterTimelineArgs = {
  chapter: ChapterConfig;
  rootRef: React.RefObject<HTMLElement | null>;
};

function revealStatic(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-cinematic]').forEach((element) => {
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    element.style.transform = 'none';
  });
}

export function useChapterTimeline({ chapter, rootRef }: UseChapterTimelineArgs) {
  const { reducedMotion, setActiveChapter } = useScrollCinema();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = rootRef.current;
    if (!root) return;

    const reducedMotionAtBoot = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const compactViewportAtBoot = window.matchMedia('(max-width: 767px)').matches;
    const touchAtBoot = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    if (
      reducedMotion ||
      reducedMotionAtBoot ||
      coarsePointer ||
      compactViewportAtBoot ||
      touchAtBoot
    ) {
      revealStatic(root);

      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) setActiveChapter(chapter.id);
        },
        { rootMargin: '-20% 0px -60%' }
      );
      observer.observe(root);
      return () => observer.disconnect();
    }

    let cancelled = false;
    let context: { revert: () => void } | null = null;
    const cleanupFns: Array<() => void> = [];

    const initializeTimeline = async () => {
      try {
        const { gsap } = await loadScrollCinemaRuntime();
        if (cancelled) return;

        const largeViewport = window.matchMedia('(min-width: 1024px)');
        const start =
          chapter.id === 'epilogue'
            ? 'top bottom'
            : largeViewport.matches
              ? 'top 78%'
              : 'top 85%';

        context = gsap.context(() => {
          const select = gsap.utils.selector(root);
          const targets = (selector: string): HTMLElement[] => select(selector) as HTMLElement[];

          const eyebrow = targets('[data-cinematic="eyebrow"]');
          const title = targets('[data-cinematic="title"]');
          const lede = targets('[data-cinematic="lede"]');
          const media = targets('[data-cinematic="media"]');
          const panel = targets('[data-cinematic="panel"]');
          const card = targets('[data-cinematic="card"]');
          const proof = targets('[data-cinematic="proof"]');
          const cta = targets('[data-cinematic="cta"]');
          const textTargets = [...eyebrow, ...title, ...lede, ...panel, ...card, ...proof, ...cta];
          const allTargets = [...textTargets, ...media];

          const revealAll = () => {
            if (allTargets.length === 0) return;
            gsap.set(allTargets, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clearProps: 'transform',
            });
          };

          if (textTargets.length > 0) gsap.set(textTargets, { autoAlpha: 0, y: 18 });
          if (media.length > 0) gsap.set(media, { autoAlpha: 0, scale: 0.985, y: 20 });

          if (root.getBoundingClientRect().top < window.innerHeight * 0.92) revealAll();

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start,
              end: 'bottom 45%',
              scrub: false,
              pin: false,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              toggleActions: 'play none none reverse',
              onEnter: () => setActiveChapter(chapter.id),
              onEnterBack: () => setActiveChapter(chapter.id),
              onRefresh: (self: { progress?: number; isActive?: boolean }) => {
                if (self.isActive || (self.progress ?? 0) > 0) revealAll();
              },
            },
            defaults: { ease: 'power3.out', duration: 0.7 },
          });

          if (media.length > 0) {
            timeline.to(media, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 }, 0);
          }
          if (eyebrow.length > 0) {
            timeline.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.45 }, 0.04);
          }
          if (title.length > 0) {
            timeline.to(title, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08);
          }
          if (lede.length > 0) {
            timeline.to(lede, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.14);
          }
          if (panel.length > 0) {
            timeline.to(panel, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.45 }, 0.2);
          }
          if (card.length > 0) {
            timeline.to(card, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 }, 0.24);
          }
          if (proof.length > 0) {
            timeline.to(proof, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.45 }, 0.26);
          }
          if (cta.length > 0) {
            timeline.to(cta, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.34);
          }

          const safetyTimer = window.setTimeout(() => {
            if (timeline.progress() === 0 && !timeline.isActive()) revealAll();
          }, 1200);
          cleanupFns.push(() => window.clearTimeout(safetyTimer));
        }, root);
      } catch (error) {
        if (cancelled) return;
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            '[chapter-timeline] cinematic runtime failed. Falling back to static content.',
            error
          );
        }
        revealStatic(root);
      }
    };

    void initializeTimeline();

    return () => {
      cancelled = true;
      cleanupFns.forEach((cleanup) => cleanup());
      context?.revert();
    };
  }, [chapter, reducedMotion, rootRef, setActiveChapter]);
}