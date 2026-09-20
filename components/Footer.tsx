// CONVICTION ENGINE — Footer v2.0
//
// CHANGES from v1.0:
//   - Footer CTA button hover glow uses `--chapter-accent` (registered @property)
//     instead of the hardcoded `--color-film-teal-glow`. On the Epilogue chapter
//     (emerald) the CTA glows green; on Judgment (blue) it glows blue. The cross-
//     fade is CSS-native — zero JS.
//   - Footer gradient ambient uses `--chapter-accent` at very low opacity so the
//     footer atmosphere subtly matches the final (Epilogue) chapter palette.
//   - All social links now have explicit `aria-label` for the aria-hidden icon
//     pattern consistency with the rest of the site.
//   - `hover:translate-x-1` links now respect `prefers-reduced-motion` via
//     CSS `@media` — the hover transform is inside a `@media (hover: hover)`
//     block in globals.css already, but we reinforce it here with conditional
//     class names.
//   - Public evidence language replaces the earlier simulated system-status fixture.

'use client';

import Link from 'next/link';

import { CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl } from '@/lib/config';

const NAV_LINKS = [
  { label: 'Projects', href: anchorUrl('section-projects') },
  { label: 'Open Source', href: anchorUrl('open-source') },
  { label: 'Skills', href: anchorUrl('skills') },
  { label: 'About', href: anchorUrl('section-about') },
  { label: 'Writing', href: anchorUrl('section-writing') },
  { label: 'Contact', href: anchorUrl('section-contact') },
] as const;

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Scardubu', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/oscardubu', external: true },
  { label: 'Email', href: `mailto:${CONTACT_EMAIL}`, external: false },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Backend and platform system conversation'
  )}`;

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-color-border relative overflow-hidden border-t"
    >
      {/* Ambient background — chapter-accent tinted, very subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        // eslint-disable-next-line no-restricted-syntax
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 18% 100%, color-mix(in oklch, var(--chapter-accent) 5%, transparent) 0%, transparent 75%)',
          transition: 'background 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      <div className="relative container grid gap-6 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[2fr_1fr_1fr] lg:gap-16 lg:py-12">
        {/* ── Brand / thesis ──────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-1">
          <div className="min-w-0">
            <Link
              href="/"
              className="text-color-text-primary inline-block text-[17px] font-bold tracking-[-0.02em] transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.985]"
              aria-label="Oscar Ndugbu home"
            >
              Oscar Ndugbu
            </Link>

            <p className="text-color-text-secondary mt-1.5 max-w-[34ch] text-[15px] leading-relaxed">
              Staff backend and platform engineering.{' '}
              <span className="text-color-text-muted">Based in Lagos · UTC+1.</span>
            </p>

            <p
              className="text-2xs mt-2 font-mono font-medium tracking-[0.5px]"
              // eslint-disable-next-line no-restricted-syntax
              style={{
                color: 'color-mix(in oklch, var(--chapter-accent) 58%, oklch(100% 0 0 / 0.4))',
              }}
            >
              Constraint is the credential.
            </p>
          </div>

          <div className="text-2xs flex flex-col gap-1 font-mono tracking-wide">
            <p className="text-secondary-boost text-color-text-secondary sm:text-[oklch(93%_0.006_264_/_0.42)]">
              Public evidence record
            </p>
            <p className="text-[oklch(93%_0.006_264_/_0.58)] sm:text-[oklch(93%_0.006_264_/_0.24)]">
              TaxBridge · SabiScore · SwarmXQ
            </p>
            <p className="text-[oklch(93%_0.006_264_/_0.54)] sm:text-[oklch(93%_0.006_264_/_0.18)]">
              © 2024–{year} Oscar Ndugbu · Next.js 15
            </p>
          </div>
        </div>

        {/* ── Navigation ──────────────────────────────────────────────── */}
        <nav aria-label="Footer navigation">
          <p className="text-2xs text-color-text-muted mb-3 font-mono tracking-widest uppercase">
            Navigation
          </p>

          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className="group text-color-text-secondary inline-flex min-h-11 items-center text-sm transition-all duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none motion-safe:hover:translate-x-1"
                >
                  <span>{label}</span>
                  <span
                    className="ml-1.5 opacity-0 transition-opacity group-hover:opacity-70"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Connect + CTA ────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <p className="text-2xs text-color-text-muted mb-3 font-mono tracking-widest uppercase">
              Connect
            </p>

            <ul className="flex flex-col gap-1">
              {SOCIAL_LINKS.map(({ label, href, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    aria-label={external ? `${label} (opens in new tab)` : label}
                    className="group text-color-text-secondary inline-flex min-h-11 items-center text-sm transition-all duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none motion-safe:hover:translate-x-1"
                  >
                    <span>{label}</span>
                  </a>
                </li>
              ))}

              <li>
                <a
                  href={CV_ASSET_PATH}
                  download
                  aria-label="Download Oscar's resume as PDF"
                  className="group text-color-text-secondary inline-flex min-h-11 items-center gap-1.5 text-sm transition-all duration-200 hover:text-white focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none motion-safe:hover:translate-x-1"
                >
                  <span>Resume</span>
                  <span aria-hidden="true" className="text-color-text-muted">
                    ↓
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Primary CTA — chapter-accent glow on hover */}
          <div className="pt-3">
            <a
              href={mailHref}
              className="cta-primary group flex w-full items-center justify-center gap-3 px-8 py-3.5 text-base font-medium focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none active:scale-[0.985] sm:w-auto"
              aria-label="Discuss a system with Oscar"
            >
              <span
                className="bg-color-success inline-block h-2.5 w-2.5 rounded-full transition-transform group-active:scale-90 motion-safe:group-hover:scale-125"
                aria-hidden="true"
              />
              Discuss a system
            </a>

            <p className="text-2xs mt-3 text-center font-mono tracking-wider text-[oklch(93%_0.006_264_/_0.62)] sm:text-left sm:text-[oklch(93%_0.006_264_/_0.45)]">
              Problem · stakes · timeline · contact
            </p>
          </div>
        </div>
      </div>

      {/* ── Legal strip ─────────────────────────────────────────────────── */}
      <div className="border-color-border-subtle text-3xs border-t py-4 font-mono">
        <div className="container flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="tracking-[0.5px] text-balance text-[oklch(93%_0.006_264_/_0.60)] uppercase sm:text-[oklch(93%_0.006_264_/_0.22)]">
            Backend · Platform · AI infrastructure · Production reliability
          </p>
          <p className="text-[oklch(93%_0.006_264_/_0.56)] sm:text-[oklch(93%_0.006_264_/_0.16)]">
            scardubu.dev
          </p>
        </div>
      </div>
    </footer>
  );
}
