'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { CopyEmail, type CopyStatus } from '@/components/CopyEmail';
import {
  IDENTITY_CARD_CV_CTA_CLASSNAME,
  IDENTITY_CARD_DOMAIN_CHIP_CLASSNAME,
  IDENTITY_CARD_DOMAIN_LIST_CLASSNAME,
  IDENTITY_CARD_FOOTER_CLASSNAME,
  IDENTITY_CARD_LEDGER_SLOT_CLASSNAME,
  IDENTITY_CARD_META_ROW_CLASSNAME,
  IDENTITY_CARD_METADATA_COLUMN_CLASSNAME,
  IDENTITY_CARD_PORTRAIT_CLASSNAME,
  IDENTITY_CARD_PROFILE_GRID_CLASSNAME,
  IDENTITY_CARD_SURFACE_CLASSNAME,
} from '@/components/identityCardStyles';
import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';

const DeferredPortraitShader = dynamic(
  () =>
    import('@/components/cinematic/HeroPortraitShader').then(
      (mod) => mod.HeroPortraitShader
    ),
  { ssr: false }
);

const PORTRAIT_ASSET_PATH = '/images/oscar-headshot.jpg';
const PORTRAIT_WIDTH = 240;
const PORTRAIT_HEIGHT = 300;
const PORTRAIT_SIZES = '(min-width: 1024px) 144px, (min-width: 640px) 136px, 112px';

const ENGINEERING_DOMAINS = [
  'Data-intensive products',
  'Quantitative systems',
  'Nigerian fintech',
] as const;

export interface IdentityCardProps {
  className?: string;
  /** Server-rendered profile detail placed between the identity block and the actions. */
  children?: ReactNode;
}

export function IdentityCard({
  className = '',
  children,
}: IdentityCardProps): React.JSX.Element {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
  const [enableShader, setEnableShader] = useState(false);

  useEffect(() => {
    const isDesktopFinePointer = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine)'
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isDesktopFinePointer && !prefersReducedMotion) {
      setEnableShader(true);
    }
  }, []);

  return (
    <section
      aria-label="Staff Backend and Platform Engineer profile"
      className={`${IDENTITY_CARD_SURFACE_CLASSNAME} ${className}`}
    >
      <div className={IDENTITY_CARD_META_ROW_CLASSNAME}>
        <p className="font-mono text-2xs font-semibold uppercase tracking-kicker text-accent-cyan">
          ENGINEERING PROFILE
        </p>
        <span className="shrink-0 border border-white/15 bg-obsidian-base px-2 py-1 font-mono text-2xs tracking-wider text-zinc-300">
          LAGOS · REMOTE
        </span>
      </div>

      <div className={IDENTITY_CARD_PROFILE_GRID_CLASSNAME}>
        <div className={IDENTITY_CARD_PORTRAIT_CLASSNAME}>
          <Image
            src={PORTRAIT_ASSET_PATH}
            alt="Oscar Ndugbu, Staff Backend and Platform Engineer"
            width={PORTRAIT_WIDTH}
            height={PORTRAIT_HEIGHT}
            sizes={PORTRAIT_SIZES}
            quality={88}
            priority
            className="identity-portrait-img h-full w-full object-cover"
          />
          {enableShader ? <DeferredPortraitShader /> : null}
          <div aria-hidden="true" className="identity-portrait-scrim" />
        </div>

        <div className={IDENTITY_CARD_METADATA_COLUMN_CLASSNAME}>
          <div>
            <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
              Oscar Ndugbu
            </h2>
            <p className="mt-1 font-mono text-xs font-medium text-accent-cyan">
              @Scardubu
            </p>
          </div>

          <div className="pt-3">
            <p className="font-sans text-sm font-medium leading-snug text-zinc-200">
              Staff Backend and Platform Engineer
            </p>
            <p className="mt-1.5 font-mono text-2xs uppercase tracking-kicker text-zinc-400">
              BACKEND · PLATFORM · AI SYSTEMS
            </p>
          </div>
        </div>
      </div>

      <ul aria-label="Primary engineering domains" className={IDENTITY_CARD_DOMAIN_LIST_CLASSNAME}>
        {ENGINEERING_DOMAINS.map((domain) => (
          <li key={domain} className={IDENTITY_CARD_DOMAIN_CHIP_CLASSNAME}>
            {domain}
          </li>
        ))}
      </ul>

      {children ? <div className={IDENTITY_CARD_LEDGER_SLOT_CLASSNAME}>{children}</div> : null}

      <div className={IDENTITY_CARD_FOOTER_CLASSNAME}>
        <p className="mb-3 font-mono text-micro tracking-wide text-zinc-300">
          Staff / Principal roles · Scoped architecture &amp; reliability reviews
        </p>
        <div className="flex items-center gap-2.5">
          <CopyEmail
            email={CONTACT_EMAIL}
            variant="primary"
            label="COPY EMAIL ADDRESS"
            copiedLabel="COPIED ✓"
            onStatusChange={setCopyStatus}
          />
          <a
            href={CV_ASSET_PATH}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open résumé PDF in a new tab"
            className={IDENTITY_CARD_CV_CTA_CLASSNAME}
          >
            <span>RÉSUMÉ</span>
            <span
              aria-hidden="true"
              className="text-zinc-400 motion-safe:transition-transform motion-safe:duration-150 group-hover/cv:text-accent-cyan motion-safe:group-hover/cv:-translate-y-0.5 motion-safe:group-hover/cv:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </div>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={
            copyStatus === 'idle'
              ? 'sr-only'
              : copyStatus === 'copied'
                ? 'mt-2.5 font-mono text-micro text-accent-emerald'
                : 'mt-2.5 font-mono text-micro text-zinc-300'
          }
        >
          {copyStatus === 'copied'
            ? 'Email address copied to clipboard.'
            : copyStatus === 'failed'
              ? `Copy is unavailable in this browser. Email: ${CONTACT_EMAIL}`
              : ''}
        </p>
      </div>
    </section>
  );
}

export default IdentityCard;
