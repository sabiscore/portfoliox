'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';

export interface ProjectLedgerEntry {
  slug: string;
  domain: string;
  status: 'ACTIVE BUILD' | 'PUBLIC DEMO' | 'PUBLIC SOURCE' | 'PRIVATE CASE STUDY';
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
    status: 'ACTIVE BUILD',
    title: 'TaxBridge',
    summary:
      'TaxBridge is a tax workflow platform built around shared API contracts, tenant-scoped data access, background processing, and offline-first mobile sync. NRS DigiTax integration remains in progress.',
    ledgerTitle: 'TAXBRIDGE RELIABILITY LEDGER',
    constraint:
      'SME filings must preserve organization context and avoid duplicate work when mobile connectivity or upstream fiscal services are unreliable.',
    decision:
      'PostgreSQL row-level security, transaction-scoped organization context, idempotent BullMQ jobs, and an offline-first sync queue.',
    outcome:
      'The implementation makes tenant scope, retry semantics, and audit history explicit. This is an engineering direction, not a claim of completed end-to-end production certification.',
    evidence: 'Active build. NRS DigiTax integration, tenant-policy validation, and provider certification remain in progress.',
    architectureNotes: [
      'Database access is designed to bind tenant context inside a transaction; policy configuration and transaction lifecycle still require integration validation.',
      'Idempotent queue keys and bounded retry handling are used to isolate upstream fiscalization failures.',
      'The Expo client uses a local SQLite queue to preserve pending operations when connectivity is unavailable.'
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
    status: 'PUBLIC DEMO',
    title: 'SabiScore',
    summary:
      'A probabilistic football forecasting and market-comparison product spanning data ingestion, feature engineering, ensemble inference, and a research-facing web interface.'
    ledgerTitle: 'SABISCORE RELIABILITY LEDGER',
    constraint:
      'Prediction quality and service behavior must remain legible as market data, model versions, and upstream feed quality change.'
    decision:
      'Out-of-core Polars and DuckDB pipelines, model-aware cache namespaces, ensemble evaluation, and an explicit lower-confidence fallback path.'
    outcome:
      'The engineering record describes calibration workflows and a fallback path. Public operational uptime and latency measurements are not asserted here.'
    evidence: 'Public product demo. Private uptime, latency, and model-evaluation artifacts are not represented as public benchmarks.'
    architectureNotes: [
      'Columnar streaming through Polars lazy frames and DuckDB is used for rolling feature joins under explicit resource constraints.'
      'Shin devigging strips bookmaker overround prior to computing market-offset residual folds.',
      'Model evaluation includes calibration and probability-quality checks; private operational reports are not reproduced in this portfolio.'
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
    status: 'PUBLIC SOURCE',
    title: 'YapCommerce',
    summary:
      'A stage-oriented media and agent workflow combining local model routing, schema-constrained outputs, CPU-aware synthesis, and restartable tasks.'
    ledgerTitle: 'YAPCOMMERCE RELIABILITY LEDGER',
    constraint:
      'Long-running generation stages can be interrupted by provider limits, worker restarts, or resource pressure.'
    decision:
      'Local GGUF model routing, stage-level checkpoints, content hashes, schema validation, and deterministic media assembly.'
    outcome:
      'The project documents restart boundaries and intermediate artifact reuse; no throughput, availability, or cost SLO is asserted here.'
    evidence: 'Public source and architecture record. Deployment-specific performance varies by hardware and model configuration.'
    architectureNotes: [
      'Stage-oriented media processing separates synthesis, assembly, and validation steps.'
      'Local model routing and schema validation keep model output handling explicit.'
      'Checkpointed orchestration preserves intermediate stage results and makes recovery points explicit.'
    ],
    contextualStack: [
      { primitive: 'faster-whisper INT8', role: 'Pidgin Audio ASR' },
      { primitive: 'Local GGUF', role: '$0 Cloud-LLM Extraction' },
      { primitive: 'Fastify 5', role: 'Checkout State Machine' },
      { primitive: 'FFmpeg', role: 'Media Assembly' },
      { primitive: 'Kokoro TTS', role: 'Speech Synthesis' },
      { primitive: 'Local GGUF', role: 'Model Routing' },
      { primitive: 'Redis', role: 'Queue State' },
    ],
    caseStudyHref: '/work/swarmxq',
  },
  { // UBEC
      { primitive: 'WhatsApp Flow v7.3', role: 'Single-Turn UX' },
    ],
    caseStudyHref: '/work/swarmxq',
  },
  {
    slug: 'ubec',
    domain: 'FEDERAL INFRASTRUCTURE · DATA ENGINEERING',
    status: 'PRIVATE CASE STUDY',
    title: 'UBEC Data Pipeline',
    summary:
      'State-partitioned data ingestion and validation workflows for federal education reporting, described at a non-sensitive architectural level.'
    ledgerTitle: 'UBEC DATA PIPELINE RELIABILITY LEDGER',
    constraint:
      'Incomplete or inconsistent state submissions need to remain identifiable without blocking independent reporting work.'
    decision:
      'Partitioned ingestion tasks, canonical schemas, validation stages, and traceable exception records.'
    outcome:
      'The case study describes the data workflow at a high level; confidential outcomes and operational figures are not published.'
    evidence: 'Private engagement case study. No confidential artifacts or performance claims are included.'
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
            <span className="text-white/60">PROJECTS // SELECTED WORK</span>
          </div>
          <h2
            id="projects-section-heading"
            className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]"
          >
            Built around real constraints.
          </h2>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            Each case study explains the operating constraint and architectural decisions, then states whether supporting evidence is public, private, or still in progress.
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
                      <span className="inline-flex shrink-0 items-center border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
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

                      {/* IMPLEMENTATION NOTE */}
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
                        <span aria-hidden="true">↗</span>
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
