'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { IdentityCard } from '@/components/IdentityCard';

// Deterministic file-path matching to components/Liveactivitybar.tsx on Linux/Vercel
const LiveActivityBar = dynamic(
  () => import('@/components/Liveactivitybar').then((mod) => mod.LiveActivityBar),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="h-[148px] w-full animate-pulse border border-white/10 bg-[#0E0E10]/80 p-4 font-mono text-xs text-zinc-500"
      >
        INITIALIZING_TELEMETRY_BUS // VERIFYING_ZOD_CONTRACTS...
      </div>
    ),
  }
);

interface ArchitecturalDeployment {
  slug: string;
  name: string;
  domainRole: string;
  quantMetric: string;
  architectureSummary: string;
  embeddedStack: string[];
  status: 'PROD_ACTIVE' | 'EDGE_VALIDATED';
}

const ACTIVE_DEPLOYMENTS: readonly ArchitecturalDeployment[] = [
  {
    slug: 'sabiscore',
    name: 'SabiScore',
    domainRole: 'Quantitative Football Markets & Probabilistic Forecasting',
    quantMetric: '200+ Settled Matches vs. Pinnacle Closing Line',
    architectureSummary:
      'Out-of-core Polars & DuckDB feature engineering, Shin devigging, Dirichlet simplex calibration, and 0.25x fractional Kelly allocation inside a strict 512MB cgroup.',
    embeddedStack: ['Polars', 'DuckDB', 'PyArrow', 'FastAPI', 'Next.js 15'],
    status: 'PROD_ACTIVE',
  },
  {
    slug: 'yap-engine',
    name: 'YapCommerce // The Yap Engine',
    domainRole: 'Autonomous Multi-Agent Media & Social Commerce Pipeline',
    quantMetric: '$0.00 Cloud LLM Spend // 8GB–16GB WSL2 Envelope',
    architectureSummary:
      'Local quantized GGUF inference and deterministic multi-agent orchestration over Fastify, eliminating external API token burn while maintaining strict schema guarantees.',
    embeddedStack: ['GGUF Local LLM', 'Fastify', 'TypeScript', 'Zod', 'PM2'],
    status: 'PROD_ACTIVE',
  },
  {
    slug: 'taxbridge',
    name: 'TaxBridge',
    domainRole: 'Offline-First Nigerian Fintech & Fiscal Compliance Ledger',
    quantMetric: 'Zero-Data-Loss Edge Sync // Sub-25ms Validation',
    architectureSummary:
      'Resilient revenue collection and tax reconciliation engine engineered for intermittent connectivity across Southeast Nigeria with cryptographic audit trails.',
    embeddedStack: ['Fastify', 'DuckDB', 'Zod', 'SQLite CRDT', 'Tailwind'],
    status: 'EDGE_VALIDATED',
  },
] as const;

export function HeroSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({ x: 480, y: 260 });
  const [isPointerInside, setIsPointerInside] = useState<boolean>(false);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  }, []);

  return (
    <section
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => setIsPointerInside(false)}
      aria-label="Architectural Anthology & Principal Overview"
      className="relative min-h-screen w-full overflow-hidden bg-[#08090C] text-white selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]"
    >
      {/* Kinetic 1px Coordinate Grid + Subtle Radial Cursor Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      <div
        aria-hidden="true"
        style={{
          background: isPointerInside
            ? `radial-gradient(560px circle at ${cursorCoords.x}px ${cursorCoords.y}px, rgba(0, 217, 255, 0.08), rgba(0, 255, 102, 0.02) 45%, transparent 80%)`
            : 'radial-gradient(640px circle at 20% 15%, rgba(0, 217, 255, 0.06), transparent 75%)',
        }}
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
        {/* Top Terminal Pulse Navigation Strip */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-[#0E0E10]/85 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#00FF66]" />
            <span className="font-mono text-xs font-semibold tracking-widest text-white uppercase">
              SCARDUBU.DEV // ANTHOLOGY_V2.6
            </span>
            <span className="hidden border border-white/10 bg-[#08090C] px-2 py-0.5 font-mono text-[11px] text-zinc-400 md:inline-block">
              LOC: AWKA / LAGOS, NG (WAT)
            </span>
          </div>

          <nav aria-label="Primary Jump Links" className="flex flex-wrap items-center gap-2">
            {[
              { href: '#deployments', label: '01.DEPLOYMENTS' },
              { href: '#telemetry', label: '02.TELEMETRY' },
              { href: '/writing', label: '03.EDITORIAL' },
              { href: '/cv/oscar-ndugbu-resume.pdf', label: '04.DOSSIER_PDF' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-transparent px-3 font-mono text-xs text-zinc-300 transition-colors hover:border-[#00D9FF]/40 hover:bg-[#08090C] hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D9FF]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* Main Hero Editorial Split: 7 Columns Narrative + 5 Columns Identity Ledger */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 border border-[#00D9FF]/40 bg-[#0E0E10]/90 px-3.5 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#00D9FF]" />
              <span className="font-mono text-xs font-medium tracking-wider text-[#00D9FF] uppercase">
                PRINCIPAL SYSTEMS ARCHITECT &amp; QUANT STRATEGIST
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.06]">
                Fail-Closed Quantitative Systems &amp;{' '}
                <span className="text-[#00D9FF]">Edge-Native</span> Fintech Infrastructure.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Engineering high-throughput, memory-bounded analytical platforms and offline-resilient
                financial infrastructure. Built with out-of-core{' '}
                <span className="font-mono text-sm text-white">Polars/DuckDB</span> pipelines,
                calibrated probabilistic models, and{' '}
                <span className="font-mono text-sm text-[#00FF66]">$0.00 cloud-LLM</span> local GGUF
                orchestration.
              </p>
            </div>

            {/* High-Glare 44px Minimum Touch Geometry CTA Matrix */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#deployments"
                className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center gap-3 border border-[#00D9FF] bg-[#00D9FF]/15 px-6 py-3 font-mono text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md transition-colors hover:bg-[#00D9FF]/25 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D9FF]"
              >
                <span>INSPECT_SYSTEM_ARCHITECTURE</span>
                <span aria-hidden="true" className="text-[#00D9FF]">
                  →
                </span>
              </Link>

              <Link
                href="/writing"
                className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center border border-white/15 bg-[#0E0E10]/90 px-6 py-3 font-mono text-xs font-medium tracking-wider text-zinc-200 uppercase backdrop-blur-md transition-colors hover:border-[#00D9FF]/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D9FF]"
              >
                READ_ENGINEERING_MONOGRAPHS
              </Link>

              <a
                href="https://github.com/sabiscore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] min-w-[44px] items-center justify-center border border-white/10 bg-[#08090C] px-4 py-3 font-mono text-xs text-zinc-300 transition-colors hover:border-[#00FF66]/40 hover:text-[#00FF66] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00FF66]"
              >
                GITHUB // SABISCORE ↗
              </a>
            </div>

            {/* Quantitative Invariants Bar */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
              {[
                { label: 'RENDER_CGROUP_CEILING', value: '512 MB', accent: 'text-[#00D9FF]' },
                { label: 'LOCAL_WSL2_ENVELOPE', value: '8–16 GB', accent: 'text-white' },
                { label: 'CLOUD_LLM_API_BURN', value: '$0.00 / MO', accent: 'text-[#00FF66]' },
                { label: 'RUNTIME_CONTRACT', value: 'FAIL-CLOSED', accent: 'text-[#00D9FF]' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="border border-white/10 bg-[#0E0E10]/80 p-3 backdrop-blur-md"
                >
                  <span className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
                    {stat.label}
                  </span>
                  <span className={`mt-1 block font-mono text-sm font-bold ${stat.accent}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Editorial Identity Ledger */}
          <div className="lg:col-span-5">
            <IdentityCard />
          </div>
        </div>

        {/* Live Telemetry Bus */}
        <div id="telemetry" className="mt-12">
          <LiveActivityBar />
        </div>

        {/* Contextual Skill Visualization Embedded in Active Production Deployments */}
        <div id="deployments" className="mt-14 space-y-6">
          <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs tracking-widest text-[#00D9FF] uppercase">
                CONTEXTUAL_SKILL_TOPOLOGY // ACTIVE_SYSTEMS
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                Production Architecture &amp; Embedded Runtime Stack
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-400">
              ZERO_SYNTHETIC_BENCHMARKS // VERIFIED_DEPLOYMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ACTIVE_DEPLOYMENTS.map((deployment) => (
              <article
                key={deployment.slug}
                className="flex flex-col justify-between border border-white/10 bg-[#0E0E10]/90 p-6 backdrop-blur-xl transition-colors duration-200 hover:border-[#00D9FF]/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="font-mono text-xs font-semibold text-[#00FF66]">
                      ● {deployment.status}
                    </span>
                    <span className="border border-white/10 bg-[#08090C] px-2 py-0.5 font-mono text-[11px] text-zinc-300">
                      {deployment.quantMetric}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {deployment.name}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[#00D9FF]">
                      {deployment.domainRole}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed text-zinc-300">
                    {deployment.architectureSummary}
                  </p>
                </div>

                <div className="mt-6 space-y-4 border-t border-white/10 pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {deployment.embeddedStack.map((tech) => (
                      <span
                        key={tech}
                        className="border border-white/10 bg-[#08090C] px-2.5 py-1 font-mono text-[11px] text-zinc-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/work/${deployment.slug}`}
                    className="inline-flex min-h-[44px] w-full items-center justify-between border border-white/10 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-medium text-white transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D9FF]"
                  >
                    <span>OPEN_CASE_DOSSIER</span>
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

export default HeroSection;
