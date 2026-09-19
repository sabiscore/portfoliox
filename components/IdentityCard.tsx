/* eslint-disable no-restricted-syntax */
'use client';

import Image from 'next/image';
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { CSSProperties, JSX, PointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PROFILE } from '@/lib/portfolio-data';

type IdentityCardProps = {
  className?: string;
  reducedMotion?: boolean;
};

const PORTRAIT_SOURCES = [
  '/headshot.webp',
  '/images/oscar-headshot.jpg',
  '/images/scar-headshot.jpeg',
] as const;

const STACK_SIGNALS = ['Backend · Platform', 'AI infrastructure'] as const;

const TRUST_SIGNALS = [
  { label: 'Focus', value: 'Backend · platform reliability' },
  { label: 'Proof', value: 'TaxBridge · SabiScore · SwarmXQ' },
  { label: 'Method', value: 'Constraint → decision → outcome → evidence' },
] as const;

function PortraitFallback(): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="grid size-full place-items-center bg-[radial-gradient(circle_at_28%_18%,rgba(56,189,248,0.28),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.22),transparent_38%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))]"
    >
      <span className="font-mono text-4xl font-semibold tracking-[0.28em] text-white/85">
        ON
      </span>
    </div>
  );
}

export default function IdentityCard({
  className = '',
  reducedMotion,
}: IdentityCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reducedMotion ?? Boolean(prefersReducedMotion);

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateXRaw = useTransform(pointerY, [-0.5, 0.5], [8, -8]);
  const rotateYRaw = useTransform(pointerX, [-0.5, 0.5], [-9, 9]);

  const rotateX = useSpring(rotateXRaw, {
    stiffness: 240,
    damping: 28,
    mass: 0.5,
  });

  const rotateY = useSpring(rotateYRaw, {
    stiffness: 240,
    damping: 28,
    mass: 0.5,
  });

  const glareXSpring = useSpring(glareX, {
    stiffness: 200,
    damping: 26,
    mass: 0.45,
  });

  const glareYSpring = useSpring(glareY, {
    stiffness: 200,
    damping: 26,
    mass: 0.45,
  });

  const glareBackground = useMotionTemplate`
    radial-gradient(
      circle at ${glareXSpring}% ${glareYSpring}%,
      rgba(255,255,255,0.34),
      rgba(56,189,248,0.15) 18%,
      rgba(251,146,60,0.11) 36%,
      transparent 60%
    )
  `;

  const portraitSrc = PORTRAIT_SOURCES[portraitIndex];

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');

    const syncPointer = (): void => {
      setCoarsePointer(query.matches);
    };

    syncPointer();
    query.addEventListener('change', syncPointer);

    return () => {
      query.removeEventListener('change', syncPointer);
    };
  }, []);

  const resetTilt = useCallback((): void => {
    pointerX.set(0);
    pointerY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [glareX, glareY, pointerX, pointerY]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>): void => {
      if (shouldReduceMotion || coarsePointer) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      pointerX.set(x - 0.5);
      pointerY.set(y - 0.5);
      glareX.set(x * 100);
      glareY.set(y * 100);
    },
    [coarsePointer, glareX, glareY, pointerX, pointerY, shouldReduceMotion]
  );

  const handlePortraitError = useCallback((): void => {
    const nextIndex = portraitIndex + 1;

    if (nextIndex < PORTRAIT_SOURCES.length) {
      setPortraitIndex(nextIndex);
      return;
    }

    setPortraitFailed(true);
  }, [portraitIndex]);

  const baseMotionStyle = useMemo<CSSProperties>(
    () => ({
      transformStyle: 'preserve-3d',
      willChange: shouldReduceMotion || coarsePointer ? 'auto' : 'transform',
    }),
    [coarsePointer, shouldReduceMotion]
  );

  const interactiveMotionStyle = shouldReduceMotion || coarsePointer
    ? baseMotionStyle
    : {
        ...baseMotionStyle,
        rotateX,
        rotateY,
      };

  return (
    <m.article
      aria-label="Oscar Ndugbu identity card"
      data-testid="hero-identity-card"
      className={[
        'group relative mx-auto w-full max-w-[25rem] rounded-[2rem]',
        'border border-white/10 bg-white/[0.055] p-2.5 shadow-2xl shadow-sky-950/35 sm:p-3',
        'backdrop-blur-2xl [perspective:1200px] transform-gpu',
        className,
      ].join(' ')}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.6 }}
      style={interactiveMotionStyle}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(56,189,248,0.22),transparent_28%,rgba(251,146,60,0.18)_72%,transparent)] opacity-70" />

      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px rounded-[1.9rem] opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glareBackground }}
      />

      <div className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-slate-950/72">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_90%_12%,rgba(251,146,60,0.16),transparent_30%)]" />

        <div className="relative p-3.5 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4 sm:gap-3">
            <p className="min-w-0 rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1.5 font-mono text-[0.56rem] tracking-[0.2em] text-sky-100/90 uppercase sm:px-3 sm:text-[0.62rem] sm:tracking-[0.28em]">
              Operating model
            </p>

            <span className="shrink-0 rounded-full border border-orange-300/20 bg-orange-300/10 px-2.5 py-1.5 font-mono text-[0.56rem] tracking-[0.18em] text-orange-100/85 uppercase sm:px-3 sm:text-[0.62rem] sm:tracking-[0.24em]">
              UTC+1
            </span>
          </div>

          <div className="grid grid-cols-[7.25rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[0.82fr_1fr] sm:items-end sm:gap-5">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[1.15rem] border border-white/10 bg-slate-900 shadow-2xl shadow-black/35 sm:rounded-[1.35rem]"
              data-testid="identity-portrait"
            >
              {portraitFailed ? (
                <PortraitFallback />
              ) : (
                <Image
                  src={portraitSrc}
                  alt="Portrait of Oscar Ndugbu"
                  fill
                  sizes="(max-width: 640px) 116px, 190px"
                  className="object-cover object-center opacity-95 transition duration-700 motion-safe:group-hover:scale-[1.035]"
                  onError={handlePortraitError}
                  style={{
                    filter: 'url(#luxury-duotone-cinema) saturate(1.08) contrast(1.04)',
                  }}
                />
              )}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_46%,rgba(2,6,23,0.72))]" />
            </div>

            <div className="min-w-0 space-y-2.5 sm:space-y-3">
              <div>
                <p className="font-mono text-[0.56rem] leading-4 tracking-[0.18em] text-white/50 uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">
                  {PROFILE.role}
                </p>
                <h2 className="mt-1.5 text-pretty text-2xl leading-[1.02] font-semibold tracking-[-0.035em] text-white sm:mt-2 sm:text-4xl">
                  Oscar Ndugbu
                </h2>
              </div>

              <p className="text-xs leading-5 text-white/62 sm:text-sm sm:leading-6">
                Backend, platform, and AI systems designed to make failure visible, recovery deliberate, and operations easier to understand.
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {STACK_SIGNALS.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.065] px-2.5 py-1 text-[0.68rem] font-medium text-white/76 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2">
            {TRUST_SIGNALS.map((signal) => (
              <div
                key={signal.label}
                className="rounded-xl border border-white/8 bg-white/[0.045] px-2 py-2 sm:px-3 sm:py-2.5"
              >
                <p className="font-mono text-[0.48rem] tracking-[0.12em] text-sky-200/75 uppercase sm:text-[0.55rem] sm:tracking-[0.16em]">
                  {signal.label}
                </p>
                <p className="mt-1 text-[0.6rem] leading-[0.85rem] text-white/68 sm:text-[0.7rem] sm:leading-4">
                  {signal.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 hidden font-mono text-[0.62rem] leading-4 tracking-[0.24em] text-white/42 uppercase sm:block">
            Lagos · UTC+1 · Backend · Platform · AI infrastructure
          </p>
        </div>
      </div>
    </m.article>
  );
}
