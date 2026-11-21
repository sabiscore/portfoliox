import type { ReactNode } from 'react';

import clsx from 'clsx';

interface StaticSectionIntroProps {
  eyebrowLabel: string;
  headingId?: string;
  title: ReactNode;
  description?: ReactNode;
  eyebrowNumber?: string;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

/**
 * Route-level heading block for secondary pages (/writing, /writing/[slug]).
 * Uses the same eyebrow treatment as the homepage sections; the previous
 * `section-*` class names had no stylesheet, so the number and label ran
 * together ("05Writing") and the title fell back to body size.
 */
export function StaticSectionIntro({
  eyebrowLabel,
  headingId,
  title,
  description,
  eyebrowNumber,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: StaticSectionIntroProps) {
  return (
    <div className={className}>
      <div>
        <p
          className={clsx(
            'flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase',
            eyebrowClassName
          )}
        >
          {eyebrowNumber ? (
            <span className="font-bold text-[#00D9FF]" aria-hidden="true">
              {eyebrowNumber}
            </span>
          ) : null}
          <span className="text-zinc-400">{eyebrowLabel}</span>
        </p>

        <h1 id={headingId} className={titleClassName}>
          {title}
        </h1>
      </div>

      {description ? <p className={descriptionClassName}>{description}</p> : null}
    </div>
  );
}
