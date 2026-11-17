'use client';

import React from 'react';
import Link from 'next/link';

export interface FailureBoundaryPattern {
  id: string;
  domain: string;
  boundaryName: string;
  headline: string;
  mechanism: string;
  recoverySlo: string;
  verificationRecord: string;
  href: string;
}

const FAILURE_BOUNDARY_PATTERNS: ReadonlyArray<FailureBoundaryPattern> = [
  {
    id: 'rls-queue-boundary',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    boundaryName: 'RLS + Queue',
    headline: 'Duplicate filing and tenant leakage are designed out of the critical path.',
    mechanism:
      'BullMQ absorbs NRS API rate limits with idempotent content-hash job keys while PostgreSQL 15 Row-Level Security enforces hard tenant isolation at the database engine layer.',
    recoverySlo: '0 Duplicate Writes · Deterministic Backoff',
    verificationRecord: 'TaxBridge Fiscalization Worker',
    href: '/work/taxbridge',
  },
  {
    id: 'cgroup-ooc-boundary',
    domain: 'QUANTITATIVE ML · FEATURE STORE',
    boundaryName: 'Out-of-Core + Fallback',
    headline: 'Container OOM kills and upstream cache misses never halt matchweek inference.',
    mechanism:
      'Polars lazy frames and DuckDB stream rolling historical joins inside a 1.2GB cgroup ceiling, backed by versioned Redis caching and a lower-variance fallback model.',
    recoverySlo: '<1.2GB Peak RSS · 100% Inference Uptime',
    verificationRecord: 'SabiScore Ensemble Pipeline',
    href: '/work/sabiscore',
  },
  {
    id: 'zero-usd-asr-boundary',
    domain: 'EDGE COMMERCE · WHATSAPP ASR',
    boundaryName: 'INT8 ASR + NIP Escrow',
    headline: 'Unstructured voice notes resolve to verified escrow without cloud API billing.',
    mechanism:
      'Local faster-whisper INT8 and grammar-locked GGUF models extract structured checkout intents offline, holding settlement state in NIBSS NIP virtual account escrow.',
    recoverySlo: '$0.00 Cloud LLM Spend · Single-Turn Checkout',
    verificationRecord: 'YapCommerce Edge Worker',
    href: '/work/swarmxq',
  },
];

export function ProductionPatterns(): React.JSX.Element {
  return (
    <section
      id="failure-modes"
      aria-labelledby="failure-modes-heading"
      className="w-full bg-[#08090C] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Section Heading */}
        <div className="space-y-3 max-w-3xl">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#00D9FF]">
            02 // PRODUCTION RECORD
          </div>
          <h2
            id="failure-modes-heading"
            className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Failure modes, made explicit.
          </h2>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            The evidence is strongest when the failure boundary is named: what can break, how the system responds deterministically, and which production record supports the claim.
          </p>
        </div>

        {/* Boundary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FAILURE_BOUNDARY_PATTERNS.map((pattern) => (
            <article
              key={pattern.id}
              className="flex flex-col justify-between border border-white/15 hover:border-[#00D9FF]/50 bg-[#0E0E10]/90 backdrop-blur-xl border-l-2 border-l-[#00D9FF] p-5 sm:p-6 transition-colors"
            >
              <div className="space-y-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#00D9FF]/90">
                  {pattern.domain}
                </div>

                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#00D9FF]">
                    {pattern.boundaryName}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                    FAILURE BOUNDARY
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white leading-snug">
                  {pattern.headline}
                </h3>

                <p className="text-sm text-white/75 leading-relaxed">
                  {pattern.mechanism}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase text-white/50">
                    INVARIANT SLO
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#00FF66]">
                    {pattern.recoverySlo}
                  </span>
                </div>

                <Link
                  href={pattern.href}
                  className="min-h-[44px] w-full px-4 inline-flex items-center justify-between border border-white/15 hover:border-[#00D9FF] bg-[#08090C] font-mono text-xs font-semibold uppercase tracking-wider text-white hover:text-[#00D9FF] transition-colors"
                >
                  <span>VERIFY: {pattern.verificationRecord}</span>
                  <span aria-hidden="true" className="text-[#00D9FF]">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductionPatterns;
