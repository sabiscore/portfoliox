'use client';

import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';

import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';

export interface IdentityCardProps {
  className?: string;
  /** Server-rendered profile detail placed between the identity block and the actions. */
  children?: ReactNode;
}

export function IdentityCard({ className = '', children }: IdentityCardProps): React.JSX.Element {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopyContact = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyState('copied');
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      // Clipboard access is blocked in some embedded browsers; show the address instead.
      setCopyState('failed');
    }
  };

  return (
    <section
      aria-label="Staff Backend and Platform Engineer profile"
      className={`border border-white/10 bg-[#0E0E10]/95 p-5 backdrop-blur-xl transition-colors duration-200 hover:border-[#00D9FF]/40 sm:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00D9FF]">
            ENGINEERING PROFILE
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            BACKEND · PLATFORM · AI SYSTEMS
          </p>
        </div>
        <span className="border border-white/10 bg-[#08090C] px-2 py-1 font-mono text-[10px] text-zinc-400">
          LAGOS, NG
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#00D9FF]/40 bg-[#08090C]">
          <Image
            src="/headshot.webp"
            alt="Oscar Ndugbu"
            fill
            sizes="64px"
            priority
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold leading-tight text-white">
            Oscar Ndugbu <span className="font-mono text-xs text-[#00D9FF]">(@Scardubu)</span>
          </h2>
          <p className="mt-1 font-mono text-xs leading-5 text-zinc-300">
            Staff Backend and Platform Engineer
          </p>
          <p className="mt-1 font-mono text-[11px] leading-5 text-zinc-400">
            Data-intensive products&nbsp;· Quantitative systems&nbsp;· Nigerian fintech
          </p>
        </div>
      </div>

      {children ? <div className="mt-6 border-t border-white/10 pt-5">{children}</div> : null}

      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleCopyContact()}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-medium text-white transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            {copyState === 'copied' ? 'COPIED TO CLIPBOARD ✓' : 'COPY EMAIL ADDRESS'}
          </button>
          <a
            href={CV_ASSET_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-semibold text-zinc-200 transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            CV.PDF
          </a>
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="min-h-4 text-xs text-zinc-400">
          {copyState === 'copied'
            ? 'Email address copied.'
            : copyState === 'failed'
              ? `Copy is unavailable in this browser. Email: ${CONTACT_EMAIL}`
              : ''}
        </p>
      </div>
    </section>
  );
}

export default IdentityCard;
