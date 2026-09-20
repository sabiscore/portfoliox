// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// Standardizes editorial section hierarchy across all portfolio sections.
// Encapsulates: eyebrow, title, and optional description in a consistent
// left-aligned or centered composition.
//
// Design principles applied:
//   Nielsen: Consistency — same heading rhythm across all sections.
//   Fogg: Motivation — eyebrow anchors the reader before the headline lands.
//   Editorial: fluid type scale with clamp() keeps hierarchy legible at
//   all breakpoints without media query soup.
//
// Usage:
//   <SectionHeading
//     eyebrow="01 PROJECTS"
//     title="Built around real constraints."
//     description="Four systems. Every metric traceable to a deployed codebase."
//   />

import clsx from 'clsx';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        'flex w-full flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {/* Eyebrow — section number + label */}
      <div
        className="text-color-film-teal flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.30em] uppercase"
        aria-hidden="true"
      >
        <span>{eyebrow}</span>
        <div className="h-px w-8 shrink-0 bg-[oklch(70%_0.21_188_/_0.30)]" />
      </div>

      {/* Title + optional description */}
      <div className={clsx('space-y-4', align === 'center' ? 'max-w-3xl' : 'max-w-4xl')}>
        <h2
          id={id}
          className="font-display text-color-text-primary leading-[0.92] font-semibold tracking-tight text-balance"
          // eslint-disable-next-line no-restricted-syntax
          style={{
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            letterSpacing: '-0.055em',
          }}
        >
          {title}
        </h2>

        {description ? (
          <p
            className="text-color-text-secondary leading-8 text-pretty"
            // eslint-disable-next-line no-restricted-syntax
            style={{
              fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
              maxWidth: align === 'center' ? '52ch' : '58ch',
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
