'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface ArchitecturalPillar {
  code: string;
  title: string;
  spec: string;
  verification: string;
}

const ARCHITECTURAL_PILLARS: readonly ArchitecturalPillar[] = [
  {
    code: 'INV_01',
    title: 'Zero-USD Cloud-LLM Local Inference',
    spec: 'Quantized GGUF multi-agent execution on local WSL2 hardware, eliminating recurring token burn.',
    verification: '0.00_USD_BURN',
  },
  {
    code: 'INV_02',
    title: 'Out-of-Core Memory-Bounded ML',
    spec: 'Polars + PyArrow + DuckDB zero-copy streaming engineered for 8GB–16GB local & 512MB cloud cgroups.',
    verification: 'OOM_IMMUNE',
  },
  {
    code: 'INV_03',
    title: 'Calibrated Quantitative Edge',
    spec: 'Shin devigging, Dynamic Dixon-Coles, MAPIE conformal intervals, and 0.25x fractional Kelly sizing.',
    verification: 'BRIER_CALIBRATED',
  },
  {
    code: 'INV_04',
    title: 'Emerging-Market Fintech Resilience',
    spec: 'Offline-first fiscal ledgers, strict Zod runtime contracts, and idempotent Fastify APIs.',
    verification: 'FAIL_CLOSED',
  },
] as const;

export interface IdentityCardProps {
  className?: string;
}

export function IdentityCard({ className = '' }: IdentityCardProps) {
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyContact = async () => {
    try {
      await navigator.clipboard.writeText('oscar@scardubu.dev');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <aside
      aria-label="Principal Architect Identity Ledger"
      className={`border border-white/10 bg-[#0E0E10]/95 p-6 backdrop-blur-xl transition-colors duration-200 hover:border-[#00D9FF]/40 ${className}`}
    >
      {/* Top Ledger Classification Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00FF66]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-white uppercase">
            IDENTITY_LEDGER // PRINCIPAL_CADRE
          </span>
        </div>
        <span className="border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-2 py-0.5 font-mono text-[11px] text-[#00D9FF]">
          VERIFIED_ARCHITECT
        </span>
      </div>

      {/* Architect Bio & Portrait Row */}
      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#00D9FF]/40 bg-[#08090C]">
          <Image
            src="/headshot.webp"
            alt="Oscar Ndugbu (Scardubu)"
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
          <p className="mt-0.5 font-mono text-xs text-zinc-300">
            Principal Software Architect &amp; Quant Strategist
          </p>
          <p className="mt-1 font-mono text-[11px] text-zinc-400">
            Nigerian Fintech, Public-Sector Planning &amp; Quantitative Markets
          </p>
        </div>
      </div>

      {/* Core Architectural Philosophy Ledger Rows */}
      <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-wider text-zinc-400 uppercase">
            SYSTEM_INVARIANTS
          </span>
          <span className="font-mono text-[11px] text-[#00FF66]">4/4 ENFORCED</span>
        </div>

        <ul className="space-y-2.5">
          {ARCHITECTURAL_PILLARS.map((pillar) => (
            <li
              key={pillar.code}
              className="border border-white/10 bg-[#08090C]/90 p-3 transition-colors hover:border-[#00D9FF]/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-white">
                  <span className="mr-2 font-mono text-xs text-[#00D9FF]">{pillar.code}</span>
                  {pillar.title}
                </span>
                <span className="shrink-0 border border-[#00FF66]/30 bg-[#00FF66]/10 px-1.5 py-0.5 font-mono text-[10px] text-[#00FF66]">
                  {pillar.verification}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{pillar.spec}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Hardware & Runtime Telemetry Footer (Strict 44px Touch Targets) */}
      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="border border-white/10 bg-[#08090C] p-2.5">
            <span className="block text-[10px] text-zinc-400">PRIMARY_STACK</span>
            <span className="mt-0.5 block font-semibold text-white">Python / TS / Next 15</span>
          </div>
          <div className="border border-white/10 bg-[#08090C] p-2.5">
            <span className="block text-[10px] text-zinc-400">DATA_ENGINE</span>
            <span className="mt-0.5 block font-semibold text-[#00D9FF]">Polars + DuckDB</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleCopyContact()}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-medium text-white transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D9FF]"
          >
            {copiedEmail ? 'COPIED: OSCAR@SCARDUBU.DEV ✓' : 'COPY_DIRECT_DISPATCH'}
          </button>

          <a
            href="/cv/oscar-ndugbu-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#00FF66]/40 bg-[#00FF66]/10 px-4 py-2.5 font-mono text-xs font-semibold text-[#00FF66] transition-colors hover:bg-[#00FF66]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF66]"
          >
            CV.PDF
          </a>
        </div>
      </div>
    </aside>
  );
}

export default IdentityCard;
