import type { HTMLAttributes } from 'react';

export type BrandWordmarkSize = 'nav' | 'hero' | 'compact' | 'social';
export type BrandWordmarkTone = 'light' | 'dark' | 'accent';
export type BrandWordmarkElement = 'span' | 'div';

export type BrandWordmarkProps = {
  as?: BrandWordmarkElement;
  size?: BrandWordmarkSize;
  tone?: BrandWordmarkTone;
  label?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'aria-label'>;

const WORDMARK = 'SCARDUBU' as const;

const glyphClassMap: Record<string, string> = {
  S: 'brand-wordmark__glyph--s',
  C: 'brand-wordmark__glyph--c',
  A: 'brand-wordmark__glyph--a',
  R: 'brand-wordmark__glyph--r',
  D: 'brand-wordmark__glyph--d',
  U: 'brand-wordmark__glyph--u',
  B: 'brand-wordmark__glyph--b',
};

export function BrandWordmark({
  as = 'span',
  size = 'nav',
  tone = 'light',
  label = 'Oscar Ndugbu — Home',
  className = '',
  ...props
}: BrandWordmarkProps) {
  const Component = as;

  return (
    <Component
      {...props}
      role="img"
      aria-label={label}
      className={[
        'brand-wordmark',
        `brand-wordmark--${size}`,
        `brand-wordmark--${tone}`,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="brand-wordmark__inner">
        {WORDMARK.split('').map((glyph, index) => (
          <span
            key={`${glyph}-${index}`}
            className={[
              'brand-wordmark__glyph',
              glyphClassMap[glyph],
              index === 6 ? 'brand-wordmark__glyph--bu-entry' : '',
              index === 7 ? 'brand-wordmark__glyph--bu-exit' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {glyph}
          </span>
        ))}
      </span>
    </Component>
  );
}

export default BrandWordmark;
