'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { CONTACT_EMAIL } from '@/lib/config';

export interface ArchitecturalPillar {
  code: string;
  title: string;
  spec: string;
  focusTag: string;
}

const ARCHITECTURAL_PILLARS: readonly ArchitecturalPillar[] = [
  {
    code: '01',
    title: 'Local model inference',
    spec: 'Quantized GGUF workflows with local execution paths where the project environment supports them.',
    focusTag: 'LOCAL INFERENCE',
  },
  {
    code: '02',
    title: 'Out-of-core data processing',
    spec: 'Polars, PyArrow, and DuckDB pipelines for analytical workloads with explicit memory constraints.',
    focusTag: 'BOUNDED DATA',
  },
  {
    code: '03',
    title: 'Quantitative model evaluation',
    spec: 'Market de-vigging, Dixon-Coles modelling, calibration checks, and conservative decision rules.',
    focusTag: 'MODEL EVALUATION',
  },
  {
    code: '04',
    title: 'Resilient fintech workflows',
    spec: 'Offline-first mobile queues, runtime schema validation, and idempotent API boundaries; provider integrations are tracked explicitly.',
    focusTag: 'RECOVERY DESIGN',
  },
] as const;

export interface IdentityCardProps {
  className?: string;
}

export function IdentityCard({ className = '' }: IdentityCardProps): React.JSX.Element {
  const [copiedEmail, setCopiedEmail] = useState(false);
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
      setCopiedEmail(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <aside
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
          <h2 className="truncate font-display text-xl font-bold text-white">
            Oscar Ndugbu <span className="font-mono text-xs text-[#00D9FF]">(@Scardubu)</span>
          </h2>
          <p className="mt-1 font-mono text-xs leading-5 text-zinc-300">
            Staff Backend and Platform Engineer
          </p>
          <p className="mt-1 font-mono text-[11px] leading-5 text-zinc-500">
            Data-intensive products · Quantitative systems · Nigerian fintech
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            DESIGN FOCUS
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            The recurring engineering themes across the project records.
          </p>
        </div>

        <ul className="space-y-2.5">
          {ARCHITECTURAL_PILLARS.map((pillar) => (
            <li
              key={pillar.code}
              className="border border-white/10 bg-[#08090C]/90 p-3 transition-colors hover:border-[#00D9FF]/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-white">
                  <span className="mr-2 font-mono text-[11px] text-[#00D9FF]">{pillar.code}</span>
                  {pillar.title}
                </span>
                <span className="border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] tracking-wide text-zinc-400">
                  {pillar.focusTag}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{pillar.spec}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="min-w-0 border border-white/10 bg-[#08090C] p-2.5">
            <span className="block text-[10px] text-zinc-500">PRIMARY LANGUAGES</span>
            <span className="mt-1 block font-semibold text-white">Python · TypeScript</span>
          </div>
          <div className="min-w-0 border border-white/10 bg-[#08090C] p-2.5">
            <span className="block text-[10px] text-zinc-500">DATA SYSTEMS</span>
            <span className="mt-1 block font-semibold text-[#00D9FF]">PostgreSQL · DuckDB</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleCopyContact()}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-medium text-white transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            COPY EMAIL ADDRESS
          </button>
          <a
            href="/cv/oscar-ndugbu-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-semibold text-zinc-200 transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            CV.PDF
          </a>
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="min-h-4 text-xs text-zinc-400">
          {copiedEmail ? 'Email address copied.' : ''}
        </p>
      </div>
    </aside>
  );
}

export default IdentityCard;
