'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DeploymentArchitectureSpec {
  code: string;
  name: string;
  role: string;
  invariant: string;
  stack: ReadonlyArray<string>;
  metric: string;
  href: string;
}

const DEPLOYMENT_LEDGER: ReadonlyArray<DeploymentArchitectureSpec> = [
  {
    code: 'SYS-01',
    name: 'SabiScore',
    role: 'Institutional Quant Football Platform',
    invariant:
      'Out-of-core Polars + DuckDB feature store feeding stacked XGBoost, LightGBM, and CatBoost ensembles with Shin devigging and Murphy Brier decomposition.',
    stack: ['Polars', 'DuckDB', 'XGBoost', 'LightGBM', 'CatBoost', 'Next.js App Router'],
    metric: 'E5c Dixon-Coles · E10 Market-Offset',
    href: '/work/sabiscore',
  },
  {
    code: 'SYS-02',
    name: 'YapCommerce',
    role: 'Zero-USD Edge Conversational Commerce',
    invariant:
      'Translates unstructured WhatsApp Pidgin audio into single-turn NIBSS NIP escrow checkouts via INT8 faster-whisper ASR and cgroup-bounded local GGUF models.',
    stack: ['faster-whisper INT8', 'Local GGUF', 'Fastify 5', 'NIBSS NIP', 'NRS B2C Worker'],
    metric: '$0.00 Cloud-LLM API Dependency',
    href: '/work/yap-engine',
  },
  {
    code: 'SYS-03',
    name: 'TaxBridge',
    role: 'SME Fiscalization & Offline Compliance',
    invariant:
      'Enforces tenant isolation via PostgreSQL 15 Row-Level Security and idempotent BullMQ queues, paired with an offline-first Expo Android SQLite sync engine.',
    stack: ['Fastify 5', 'PostgreSQL 15 RLS', 'BullMQ', 'React Native Expo', 'SQLite Sync'],
    metric: 'Zero Duplicate Filings · RLS Enforced',
    href: '/work/taxbridge',
  },
];

export function IdentityCard(): React.JSX.Element {
  return (
    <section
      aria-labelledby="identity-ledger-heading"
      className="w-full bg-[#08090C] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl border border-white/15 bg-[#0E0E10]/90 backdrop-blur-xl">
        {/* Top Ledger Header Bar — Pr-14 on mobile prevents fixed FAB collision */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-6 py-3.5 pr-14 sm:pr-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 bg-[#00D9FF]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
              OPERATING MODEL // ARCHITECTURAL LEDGER
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="border border-white/15 bg-[#08090C] px-2.5 py-1 font-mono text-xs text-white/80">
              WAT · UTC+1
            </span>
            <span className="border border-[#00FF66]/40 bg-[#00FF66]/10 px-2.5 py-1 font-mono text-xs font-semibold text-[#00FF66]">
              FAIL-CLOSED
            </span>
          </div>
        </div>

        {/* Profile & Engineering Philosophy Row — Stacks cleanly on mobile to prevent 2-col text squeeze */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          {/* Portrait & Core Identity Cell */}
          <div className="lg:col-span-4 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 border border-[#00D9FF]/40 bg-[#08090C] overflow-hidden">
              <Image
                src="/headshot.webp"
                alt="Oscar Ndugbu — Software Architect and Quantitative Strategist"
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-cover"
                priority={false}
              />
            </div>

            <div className="space-y-1.5">
              <div className="font-mono text-[11px] uppercase tracking-widest text-[#00D9FF]">
                PRINCIPAL ENGINEER · QUANT ARCHITECT
              </div>
              <h2
                id="identity-ledger-heading"
                className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white"
              >
                Oscar Ndugbu
              </h2>
              <p className="font-mono text-xs text-white/60">
                github.com/scardubu · scardubu.dev
              </p>
            </div>
          </div>

          {/* Non-Redundant Architectural Thesis & Quantitative Invariants */}
          <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="font-mono text-xs uppercase tracking-widest text-white/50">
                SYSTEMS PHILOSOPHY &amp; RUNTIME CONSTRAINTS
              </div>
              <p className="font-heading text-lg sm:text-xl font-medium text-white leading-snug">
                Zero-USD cloud-LLM inference, memory-bounded columnar analytics, and deterministic state machines built for high-friction financial infrastructure.
              </p>
              <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                Instead of delegating critical paths to metered third-party AI APIs or unbounded cloud clusters, I architect self-hosted GGUF inference workers, out-of-core Polars/DuckDB pipelines, and schema-locked Fastify 5 services that guarantee predictable latency and zero silent data corruption.
              </p>
            </div>

            {/* Quantitative Operating Metrics Grid — Stacks 1-col on mobile, 3-col on tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="border border-white/10 bg-[#08090C] p-3.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                  LLM CLOUD API COST
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#00FF66]">
                  $0.00 / REQ
                </div>
                <div className="mt-0.5 font-mono text-xs text-white/70">
                  Self-hosted INT8 / GGUF
                </div>
              </div>

              <div className="border border-white/10 bg-[#08090C] p-3.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                  ML MEMORY CEILING
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-[#00D9FF]">
                  OOC STREAMING
                </div>
                <div className="mt-0.5 font-mono text-xs text-white/70">
                  Polars + DuckDB cgroup cap
                </div>
              </div>

              <div className="border border-white/10 bg-[#08090C] p-3.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                  WRITE SEMANTICS
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-white">
                  FAIL-CLOSED
                </div>
                <div className="mt-0.5 font-mono text-xs text-white/70">
                  PG15 RLS + Idempotent Queues
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contextual Deployment Matrix — Replaces cramped 3-col FOCUS/PROOF/METHOD mobile grid */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#00D9FF]">
              CONTEXTUAL TECH STACK // ACTIVE PRODUCTION DEPLOYMENTS
            </h3>
            <span className="font-mono text-xs text-white/50">
              CONSTRAINT → PRIMITIVES → VERIFIED TELEMETRY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEPLOYMENT_LEDGER.map((item) => (
              <article
                key={item.code}
                className="flex flex-col justify-between border border-white/10 hover:border-[#00D9FF]/40 bg-[#08090C] p-4 sm:p-5 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                    <span className="font-mono text-xs font-bold text-[#00D9FF]">
                      {item.code} // {item.name}
                    </span>
                    <span className="font-mono text-[11px] text-[#00FF66]">
                      ● LIVE
                    </span>
                  </div>

                  <h4 className="font-heading text-base font-bold text-white">
                    {item.role}
                  </h4>

                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    {item.invariant}
                  </p>

                  {/* Embedded Contextual Tech Primitives */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.stack.map((primitive) => (
                      <span
                        key={primitive}
                        className="border border-white/15 bg-[#0E0E10] px-2.5 py-1 font-mono text-[11px] text-white/90"
                      >
                        {primitive}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-white/60 truncate">
                    {item.metric}
                  </span>

                  {/* 44px Minimum Touch Target Link */}
                  <Link
                    href={item.href}
                    className="min-h-[44px] px-3 inline-flex items-center justify-center gap-1.5 border border-white/15 hover:border-[#00D9FF] bg-[#0E0E10] font-mono text-xs font-semibold uppercase tracking-wider text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-colors shrink-0"
                  >
                    <span>SPEC</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default IdentityCard;
