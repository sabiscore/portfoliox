'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DeferredHeroEnhancements } from './DeferredHeroEnhancements';

interface ArchitecturalPillar {
  id: string;
  label: string;
  system: string;
  constraint: string;
  primitives: ReadonlyArray<string>;
  telemetry: string;
}

const ARCHITECTURAL_PILLARS: ReadonlyArray<ArchitecturalPillar> = [
  {
    id: 'quant-ml',
    label: '01 / QUANT ML',
    system: 'SabiScore Engine',
    constraint: 'Out-of-core feature pipelines bounded under 1.2GB cgroup RAM.',
    primitives: ['Polars', 'DuckDB', 'XGBoost', 'LightGBM', 'CatBoost', 'Shin Devigging'],
    telemetry: 'Murphy Decomposition · Calibrated Edge',
  },
  {
    id: 'edge-commerce',
    label: '02 / ZERO-USD AI',
    system: 'YapCommerce ASR',
    constraint: 'WhatsApp Pidgin audio to NIBSS NIP escrow with $0 cloud LLM API spend.',
    primitives: ['faster-whisper INT8', 'Local GGUF', 'Fastify 5', 'NIBSS NIP', 'NRS B2C'],
    telemetry: 'Single-Turn Checkout · Cgroup Capped',
  },
  {
    id: 'fintech-compliance',
    label: '03 / FAIL-CLOSED TAX',
    system: 'TaxBridge Platform',
    constraint: 'Tenant-isolated NRS fiscalization resilient to upstream rate limits.',
    primitives: ['Fastify 5', 'PostgreSQL 15 RLS', 'BullMQ', 'Next.js', 'Expo SQLite'],
    telemetry: 'Idempotent Retries · Offline Android Sync',
  },
];

export function HeroSection(): React.JSX.Element {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('quant-ml');

  const activePillar =
    ARCHITECTURAL_PILLARS.find((pillar) => pillar.id === selectedPillarId) ??
    ARCHITECTURAL_PILLARS[0];

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full bg-[#08090C] text-white border-b border-white/10 overflow-hidden"
    >
      {/* Subtle Kinetic Coordinate Grid Overlay (Zero Soft Shadows, Crisp 1px Geometry) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-14 sm:pb-16">
        {/* Top System Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-[#00FF66]/40 bg-[#0E0E10]/90 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#00FF66]">
              <span className="h-2 w-2 rounded-full bg-[#00FF66]" />
              LAGOS · NG // EDGE-NATIVE ARCHITECT
            </span>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-white/60">
            ZERO-USD CLOUD-LLM · FAIL-CLOSED SYSTEMS
          </div>
        </div>

        {/* Main Editorial Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Structural Headline & Thesis */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00D9FF]">
                OSCAR NDUGBU · SOFTWARE ARCHITECT &amp; QUANT STRATEGIST
              </p>
              <h1
                id="hero-heading"
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06]"
              >
                Systems you can trust at 2 AM.
              </h1>
              <p className="font-heading text-xl sm:text-2xl font-medium text-white/80 pt-1">
                Deterministic fintech infrastructure, memory-bounded ML ensembles, and edge-native commerce.
              </p>
            </div>

            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl">
              Engineering high-throughput backends and quantitative pipelines built for emerging-market realities. Every state transition is schema-validated, every out-of-core query runs inside strict cgroup RAM bounds, and every inference executes locally without paid cloud-LLM dependencies.
            </p>

            {/* Primary Action Bar — Enforces >=44px Outdoor High-Glare Touch Geometry */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="#projects"
                className="min-h-[48px] px-6 inline-flex items-center justify-center gap-2.5 border border-[#00D9FF] bg-[#00D9FF] text-[#08090C] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#00D9FF]/90 active:bg-[#00D9FF]/80 transition-colors"
              >
                <span>REVIEW PRODUCTION EVIDENCE</span>
                <span aria-hidden="true">↓</span>
              </Link>

              <Link
                href="#contact"
                className="min-h-[48px] px-6 inline-flex items-center justify-center gap-2.5 border border-white/20 hover:border-[#00D9FF]/60 bg-[#0E0E10]/90 backdrop-blur-xl text-white font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider hover:text-[#00D9FF] transition-colors"
              >
                <span>DISCUSS AN ARCHITECTURE</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Contextual Stack Inspector (Replaces Generic Skill Grids) */}
          <div className="lg:col-span-5 border border-white/15 bg-[#0E0E10]/90 backdrop-blur-xl">
            <div className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-white/70">
                ACTIVE ARCHITECTURAL CONTEXT
              </span>
              <span className="font-mono text-[11px] text-[#00FF66] uppercase tracking-wider">
                ● CGROUP_BOUNDED
              </span>
            </div>

            {/* 44px Minimum Touch-Target Selector Tabs */}
            <div
              role="tablist"
              aria-label="Production architecture domains"
              className="grid grid-cols-3 border-b border-white/10 divide-x divide-white/10"
            >
              {ARCHITECTURAL_PILLARS.map((pillar) => {
                const isSelected = pillar.id === activePillar.id;
                return (
                  <button
                    key={pillar.id}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className={`min-h-[44px] px-2.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors text-center ${
                      isSelected
                        ? 'bg-[#00D9FF]/15 text-[#00D9FF] border-b-2 border-b-[#00D9FF]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {pillar.label}
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Specification */}
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-heading text-lg font-bold text-white">
                  {activePillar.system}
                </h2>
                <span className="font-mono text-[11px] text-[#00D9FF] uppercase">
                  {activePillar.telemetry}
                </span>
              </div>

              <p className="text-sm text-white/75 leading-relaxed border-l-2 border-[#00D9FF]/60 pl-3">
                {activePillar.constraint}
              </p>

              <div className="space-y-2 pt-1">
                <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">
                  VERIFIED RUNTIME PRIMITIVES
                </div>
                <div className="flex flex-wrap gap-2">
                  {activePillar.primitives.map((tech) => (
                    <span
                      key={tech}
                      className="min-h-[36px] inline-flex items-center border border-white/15 bg-[#08090C] px-3 py-1 font-mono text-xs text-white/90"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Telemetry Bar Integration */}
        <div className="mt-8 sm:mt-10">
          <DeferredHeroEnhancements />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
