'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

export interface ProjectLedgerEntry {
  slug: string;
  domain: string;
  status: 'LIVE' | 'PRODUCTION' | 'VERIFIED';
  title: string;
  summary: string;
  ledgerTitle: string;
  constraint: string;
  decision: string;
  outcome: string;
  evidence: string;
  architectureNotes: ReadonlyArray<string>;
  contextualStack: ReadonlyArray<{
    primitive: string;
    role: string;
  }>;
  caseStudyHref: string;
  sourceHref?: string;
}

const PRODUCTION_PROJECTS: ReadonlyArray<ProjectLedgerEntry> = [
  {
    slug: 'taxbridge',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    status: 'LIVE',
    title: 'TaxBridge',
    summary:
      'Tax workflow automation designed to keep tenant boundaries, retries, and audit history explicit — so deadline-driven filing can recover cleanly.',
    ledgerTitle: 'TAXBRIDGE RELIABILITY LEDGER',
    constraint:
      'Multi-tenant SME tax submissions must never leak across tenant boundaries or trigger duplicate fiscalization under NRS API rate limits.',
    decision:
      'Database PostgreSQL 15 Row-Level Security (RLS) paired with idempotent BullMQ jobs keyed deterministically to submission content hashes.',
    outcome:
      'Retries resume safely without re-submitting completed filing operations, with offline Android SQLite sync supporting field merchants.',
    evidence: 'Production architecture record · shared Fastify 5 contracts & Expo SQLite sync.',
    architectureNotes: [
      'Strict tenant_id session variables bound inside Fastify 5 transaction hooks before any query executes.',
      'BullMQ dead-letter queues isolate upstream NRS timeout spikes without blocking healthy tenant workers.',
      'React Native Expo Android client queues mutations in local SQLite with deterministic conflict resolution.',
    ],
    contextualStack: [
      { primitive: 'Fastify 5', role: 'Schema-Locked API' },
      { primitive: 'PostgreSQL 15 RLS', role: 'Tenant Isolation' },
      { primitive: 'BullMQ + Redis 7', role: 'Idempotent Queue' },
      { primitive: 'Expo SQLite', role: 'Offline Android Sync' },
      { primitive: 'Next.js App Router', role: 'Admin Console' },
    ],
    caseStudyHref: '/work/taxbridge',
    sourceHref: 'https://github.com/scardubu/taxbridge',
  },
  {
    slug: 'sabiscore',
    domain: 'ML PLATFORM · QUANTITATIVE OBSERVABILITY',
    status: 'LIVE',
    title: 'SabiScore',
    summary:
      'An institutional-grade ensemble ML platform that keeps calibrated football prediction delivery resilient through cache failures, retraining, and dependency loss.',
    ledgerTitle: 'SABISCORE RELIABILITY LEDGER',
    constraint:
      'Inference and model-health signals must remain calibrated and usable under a strict 1.2GB RAM ceiling and through feature-store or cache failure.',
    decision:
      'Out-of-core Polars and DuckDB feature pipelines, stacked XGBoost/LightGBM/CatBoost ensembles, Shin devigging, and versioned Redis fallback serving.',
    outcome:
      'Continuous Murphy Brier decomposition and E5c Dynamic Dixon-Coles + E10 Market-Offset Residual evaluation with zero OOM container evictions.',
    evidence: 'Live telemetry at sabiscore.app · verified calibration & Brier skill records.',
    architectureNotes: [
      'Columnar out-of-core streaming via Polars lazy frames and DuckDB prevents memory spikes during rolling window joins.',
      'Shin devigging strips bookmaker overround prior to computing market-offset residual folds.',
      'Real-time Murphy decomposition monitors Reliability, Resolution, and Uncertainty across every matchweek.',
    ],
    contextualStack: [
      { primitive: 'Polars + DuckDB', role: 'Out-of-Core Feature Store' },
      { primitive: 'XGBoost / LightGBM / CatBoost', role: 'Stacked Ensemble' },
      { primitive: 'Shin Devigging', role: 'Market Calibration' },
      { primitive: 'FastAPI + Redis 7', role: 'Versioned Serving' },
      { primitive: 'Next.js App Router', role: 'Telemetry UI' },
    ],
    caseStudyHref: '/work/sabiscore',
    sourceHref: 'https://sabiscore.app',
  },
  {
    slug: 'yap-engine',
    domain: 'CONVERSATIONAL COMMERCE · EDGE AI',
    status: 'PRODUCTION',
    title: 'YapCommerce',
    summary:
      'Edge-native conversational commerce monorepo translating unstructured WhatsApp Pidgin audio and media into single-turn checkouts with zero cloud-LLM spend.',
    ledgerTitle: 'YAPCOMMERCE RELIABILITY LEDGER',
    constraint:
      'Informal MSME retail margins cannot absorb per-token cloud LLM API billing or multi-turn checkout drop-offs over unstable mobile networks.',
    decision:
      'Self-hosted INT8 faster-whisper ASR paired with cgroup-bounded local GGUF models, Fastify 5 state machines, and NIBSS NIP virtual account escrow.',
    outcome:
      '$0.00 cloud-LLM operational spend, deterministic intent extraction from Nigerian Pidgin voice notes, and automated NRS B2C fiscalization.',
    evidence: 'Edge-native monorepo · cgroup memory-capped inference & WhatsApp Flow v7.3.',
    architectureNotes: [
      'INT8 quantized faster-whisper transcribes code-switched English/Pidgin audio notes inside strict CPU/RAM cgroup limits.',
      'Grammar-constrained local GGUF inference guarantees valid JSON checkout payloads on every turn.',
      'NIBSS NIP webhook workers reconcile virtual account escrow settlements before triggering NRS B2C receipts.',
    ],
    contextualStack: [
      { primitive: 'faster-whisper INT8', role: 'Pidgin Audio ASR' },
      { primitive: 'Local GGUF', role: '$0 Cloud-LLM Extraction' },
      { primitive: 'Fastify 5', role: 'Checkout State Machine' },
      { primitive: 'NIBSS NIP', role: 'Escrow Settlement' },
      { primitive: 'WhatsApp Flow v7.3', role: 'Single-Turn UX' },
    ],
    caseStudyHref: '/work/swarmxq',
  },
  {
    slug: 'ubec',
    domain: 'FEDERAL INFRASTRUCTURE · DATA ENGINEERING',
    status: 'VERIFIED',
    title: 'UBEC Data Pipeline',
    summary:
      'Federal education reporting across 36 state sources, designed to keep partial submissions moving without hiding data quality issues.',
    ledgerTitle: 'UBEC DATA PIPELINE RELIABILITY LEDGER',
    constraint:
      'Late and partial state submissions must not block every completed national report or silently corrupt aggregate census metrics.',
    decision:
      'Isolated Apache Airflow task groups per state, followed by deterministic cross-state schema and statistical validation gates.',
    outcome:
      'Thirty-five state reports proceed cleanly to executive publication while one delayed source remains visibly pending in the audit log.',
    evidence: 'Private federal engagement · production architecture case study.',
    architectureNotes: [
      'State-partitioned DAGs isolate upstream formatting anomalies to individual state staging tables.',
      'Automated row-level quarantine logs rejected records with explicit remediation codes for state officers.',
    ],
    contextualStack: [
      { primitive: 'Python 3.11', role: 'Ingestion Core' },
      { primitive: 'Apache Airflow', role: 'State-Isolated DAGs' },
      { primitive: 'Polars / pandas', role: 'Validation Gates' },
      { primitive: 'PostgreSQL', role: 'Audit Ledger' },
    ],
    caseStudyHref: '/work/ubec',
  },
];

export function ProjectsSection(): React.JSX.Element {
  const [expandedSlugs, setExpandedSlugs] = useState<Record<string, boolean>>({
    taxbridge: false,
    sabiscore: false,
    'yap-engine': false,
    ubec: false,
  });

  const toggleHowItWorks = useCallback((slug: string) => {
    setExpandedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  }, []);

  return (
    <section
      id="projects"
      aria-labelledby="projects-section-heading"
      className="w-full bg-[#08090C] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em]">
            <span className="text-[#00FF66] font-bold">01</span>
            <span className="text-white/60">PROJECTS // PRODUCTION LEDGER</span>
          </div>
          <h2
            id="projects-section-heading"
            className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Built around real constraints.
          </h2>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            Each case study starts with the operational constraint, explains the architectural decision, and verifies the resulting production behavior and runtime primitives.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {PRODUCTION_PROJECTS.map((project) => {
            const isExpanded = Boolean(expandedSlugs[project.slug]);

            return (
              <article
                key={project.slug}
                className="flex flex-col justify-between border border-white/15 hover:border-[#00D9FF]/40 bg-[#0E0E10]/90 backdrop-blur-xl transition-colors"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 sm:p-6 border-b border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                        {project.domain}
                      </span>
                      <span className="inline-flex items-center gap-1.5 border border-[#00FF66]/40 bg-[#00FF66]/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00FF66] shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00FF66]" />
                        {project.status}
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                      {project.title}
                    </h3>

                    <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Reliability Ledger Timeline */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                      {project.ledgerTitle}
                    </div>

                    <ol className="relative border-l border-white/15 ml-2 space-y-4 pl-5">
                      {/* CONSTRAINT */}
                      <li className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border border-[#00D9FF] bg-[#08090C]"
                        />
                        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#00D9FF]">
                          CONSTRAINT
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
                          {project.constraint}
                        </p>
                      </li>

                      {/* DECISION */}
                      <li className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border border-[#00D9FF] bg-[#00D9FF]/30"
                        />
                        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#00D9FF]">
                          DECISION
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
                          {project.decision}
                        </p>
                      </li>

                      {/* OUTCOME */}
                      <li className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border border-[#00FF66] bg-[#00FF66]/30"
                        />
                        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#00FF66]">
                          OUTCOME
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
                          {project.outcome}
                        </p>
                      </li>

                      {/* EVIDENCE */}
                      <li className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border border-white/40 bg-[#08090C]"
                        />
                        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-white/70">
                          EVIDENCE
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-white/65 leading-relaxed">
                          {project.evidence}
                        </p>
                      </li>
                    </ol>

                    {/* Contextual Tech Stack Matrix */}
                    <div className="pt-2 space-y-2">
                      <div className="font-mono text-[11px] uppercase tracking-wider text-white/45">
                        ARCHITECTURAL PRIMITIVES
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.contextualStack.map((item) => (
                          <div
                            key={item.primitive}
                            className="flex items-center justify-between border border-white/10 bg-[#08090C] px-3 py-2"
                          >
                            <span className="font-mono text-xs font-semibold text-white">
                              {item.primitive}
                            </span>
                            <span className="font-mono text-[11px] text-[#00D9FF]">
                              {item.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 44px Minimum Touch-Target Expandable Architecture Drawer */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => toggleHowItWorks(project.slug)}
                        aria-expanded={isExpanded}
                        className="min-h-[44px] w-full sm:w-auto px-4 inline-flex items-center justify-between sm:justify-center gap-2.5 border border-white/15 hover:border-[#00D9FF] bg-[#08090C] font-mono text-xs font-semibold uppercase tracking-wider text-white/85 hover:text-[#00D9FF] transition-colors"
                      >
                        <span>HOW IT WORKS</span>
                        <span aria-hidden="true" className="text-[#00D9FF]">
                          {isExpanded ? '↑' : '↓'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mt-3 border border-[#00D9FF]/30 bg-[#08090C] p-4 space-y-2">
                          <div className="font-mono text-[11px] uppercase tracking-wider text-[#00D9FF]">
                            CRITICAL PATH IMPLEMENTATION NOTES
                          </div>
                          <ul className="space-y-2 text-xs sm:text-sm text-white/80">
                            {project.architectureNotes.map((note) => (
                              <li key={note} className="flex items-start gap-2">
                                <span className="font-mono text-[#00FF66] shrink-0">
                                  ›
                                </span>
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer — Enforces 48px Touch Geometry */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                      href={project.caseStudyHref}
                      className="min-h-[48px] flex-1 px-5 inline-flex items-center justify-center gap-2 border border-[#00D9FF] bg-[#00D9FF] text-[#08090C] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#00D9FF]/90 transition-colors"
                    >
                      <span>READ CASE STUDY</span>
                      <span aria-hidden="true">↗</span>
                    </Link>

                    {project.sourceHref && (
                      <a
                        href={project.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[48px] px-5 inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#00D9FF] bg-[#08090C] font-mono text-xs font-semibold uppercase tracking-wider text-white hover:text-[#00D9FF] transition-colors"
                      >
                        <span>VIEW SOURCE</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
