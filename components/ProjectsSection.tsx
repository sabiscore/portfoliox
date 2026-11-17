'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';

type EvidenceStatus = 'ACTIVE BUILD' | 'PUBLIC DEMO' | 'PUBLIC SOURCE' | 'PRIVATE CASE STUDY';

interface ProjectLedgerEntry {
  slug: string;
  domain: string;
  status: EvidenceStatus;
  title: string;
  summary: string;
  constraint: string;
  decision: string;
  implementationNote: string;
  evidence: string;
  architectureNotes: readonly string[];
  contextualStack: readonly {
    primitive: string;
    role: string;
  }[];
  caseStudyHref: string;
  sourceHref?: string;
}

const SELECTED_PROJECTS: readonly ProjectLedgerEntry[] = [
  {
    slug: 'taxbridge',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    status: 'ACTIVE BUILD',
    title: 'TaxBridge',
    summary:
      'A tax workflow platform built around shared API contracts, tenant-scoped data access, background processing, and offline-first mobile sync.',
    constraint:
      'SME filings must preserve organization context and avoid duplicate work when mobile connectivity or upstream fiscal services are unreliable.',
    decision:
      'The architecture combines PostgreSQL row-level security, transaction-scoped organization context, idempotent background jobs, and a local mobile sync queue.',
    implementationNote:
      'Tenant scope, retry semantics, and audit history are explicit design concerns. NRS DigiTax integration and tenant-policy validation remain in progress.',
    evidence:
      'Active build. Provider certification and end-to-end fiscalization behavior are not presented as completed.',
    architectureNotes: [
      'Database access is designed to bind tenant context within a transaction; policy configuration and transaction lifecycle require integration validation.',
      'Idempotent queue keys and bounded retry handling isolate upstream fiscalization failures.',
      'The Expo client uses a local SQLite queue to preserve pending operations when connectivity is unavailable.',
    ],
    contextualStack: [
      { primitive: 'Fastify 5', role: 'API contracts' },
      { primitive: 'PostgreSQL', role: 'Tenant-scoped data' },
      { primitive: 'BullMQ + Redis', role: 'Background jobs' },
      { primitive: 'Expo + SQLite', role: 'Offline sync' },
    ],
    caseStudyHref: '/work/taxbridge',
    sourceHref: 'https://github.com/scardubu/taxbridge',
  },
  {
    slug: 'sabiscore',
    domain: 'QUANTITATIVE ML · DATA PLATFORM',
    status: 'PUBLIC DEMO',
    title: 'SabiScore',
    summary:
      'A probabilistic football forecasting and market-comparison product spanning data ingestion, feature engineering, ensemble inference, and a research-facing web interface.',
    constraint:
      'Prediction quality must remain legible as market data, model versions, and upstream feed quality change.',
    decision:
      'Out-of-core Polars and DuckDB pipelines, model-aware cache namespaces, ensemble evaluation, and an explicit lower-confidence fallback path.',
    implementationNote:
      'The engineering record documents calibration workflows and market comparison. Private uptime, latency, memory, and model-evaluation reports are not reproduced as public benchmarks.',
    evidence:
      'Public product demo. Operational SLOs and measured predictive performance are not asserted on this page.',
    architectureNotes: [
      'Columnar streaming through Polars lazy frames and DuckDB is used for rolling feature joins under explicit resource constraints.',
      'Shin de-vigging is used to remove bookmaker overround before market comparison.',
      'Model evaluation includes calibration and probability-quality checks; private operational reports are not presented as public evidence.',
    ],
    contextualStack: [
      { primitive: 'Polars + DuckDB', role: 'Feature processing' },
      { primitive: 'XGBoost / LightGBM', role: 'Model ensemble' },
      { primitive: 'FastAPI + Redis', role: 'Serving and cache' },
      { primitive: 'Next.js', role: 'Research interface' },
    ],
    caseStudyHref: '/work/sabiscore',
    sourceHref: 'https://sabiscore.app',
  },
  {
    slug: 'yap-engine',
    domain: 'AI WORKFLOWS · MEDIA PIPELINE',
    status: 'PUBLIC SOURCE',
    title: 'YapCommerce / Yap Engine',
    summary:
      'A stage-oriented media and agent workflow combining local model routing, schema-constrained outputs, CPU-aware synthesis, and restartable tasks.',
    constraint:
      'Long-running generation stages can be interrupted by provider limits, worker restarts, or resource pressure.',
    decision:
      'Local model routing, stage-level checkpoints, content hashes, schema validation, and deterministic media assembly.',
    implementationNote:
      'The project documents restart boundaries and intermediate artifact reuse. Throughput, availability, and cost SLOs are not claimed.',
    evidence:
      'Public source and architecture record. Deployment-specific performance depends on hardware and model configuration.',
    architectureNotes: [
      'Media processing separates synthesis, assembly, and validation into reviewable stages.',
      'Local model routing and schema validation keep model output handling explicit.',
      'Checkpointed orchestration preserves intermediate stage results and makes recovery points explicit.',
    ],
    contextualStack: [
      { primitive: 'Local GGUF', role: 'Model routing' },
      { primitive: 'Fastify + TypeScript', role: 'Workflow API' },
      { primitive: 'FFmpeg', role: 'Media assembly' },
      { primitive: 'Kokoro TTS', role: 'Speech synthesis' },
      { primitive: 'Redis', role: 'Queue state' },
    ],
    caseStudyHref: '/work/swarmxq',
    sourceHref: 'https://github.com/scardubu',
  },
  {
    slug: 'ubec',
    domain: 'PUBLIC SECTOR · DATA ENGINEERING',
    status: 'PRIVATE CASE STUDY',
    title: 'UBEC Data Pipeline',
    summary:
      'A state-partitioned data ingestion and validation workflow for federal education reporting, described at a non-sensitive architectural level.',
    constraint:
      'Incomplete or inconsistent submissions need to remain identifiable without blocking independent reporting work.',
    decision:
      'Partitioned ingestion tasks, canonical schemas, validation stages, and traceable exception records.',
    implementationNote:
      'The case study describes the data workflow at a high level. Confidential outcomes, datasets, and operational figures are not published.',
    evidence:
      'Private engagement. No confidential artifacts or unverified performance claims are included.',
    architectureNotes: [
      'State-partitioned ingestion isolates upstream formatting anomalies to individual staging areas.',
      'Validation and exception records preserve traceability for rejected or incomplete rows.',
    ],
    contextualStack: [
      { primitive: 'Python', role: 'Ingestion core' },
      { primitive: 'Apache Airflow', role: 'Workflow orchestration' },
      { primitive: 'Polars / pandas', role: 'Data validation' },
      { primitive: 'PostgreSQL', role: 'Audit records' },
    ],
    caseStudyHref: '/work/ubec',
  },
];

export function ProjectsSection(): React.JSX.Element {
  const [expandedSlugs, setExpandedSlugs] = useState<Record<string, boolean>>({});

  const toggleHowItWorks = useCallback((slug: string) => {
    setExpandedSlugs((current) => ({
      ...current,
      [slug]: !current[slug],
    }));
  }, []);

  return (
    <section
      id="projects"
      aria-labelledby="projects-section-heading"
      className="w-full border-b border-white/10 bg-[#08090C] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="max-w-3xl space-y-3">
          <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em]">
            <span className="font-bold text-[#00D9FF]">01</span>
            <span className="text-zinc-400">PROJECTS // SELECTED WORK</span>
          </p>
          <h2
            id="projects-section-heading"
            className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl"
          >
            Built around real constraints.
          </h2>
          <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
            Each project explains the operating constraint and architectural decisions, then states
            whether its supporting evidence is public, private, or still in progress.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {SELECTED_PROJECTS.map((project) => {
            const expanded = Boolean(expandedSlugs[project.slug]);
            const detailsId = `project-details-${project.slug}`;

            return (
              <article
                key={project.slug}
                className="flex min-w-0 flex-col border border-white/10 bg-[#0E0E10] transition-colors hover:border-[#00D9FF]/35"
              >
                <div className="flex-1 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      {project.domain}
                    </p>
                    <span className="inline-flex min-h-6 items-center border border-white/15 bg-white/[0.03] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-300">
                      {project.status}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-300 sm:text-base">
                    {project.summary}
                  </p>

                  <dl className="mt-6 space-y-4 border-y border-white/10 py-5">
                    <div>
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00D9FF]">
                        Constraint
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-zinc-300">{project.constraint}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#00D9FF]">
                        Architecture decision
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-zinc-300">{project.decision}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                        Implementation note
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-zinc-300">
                        {project.implementationNote}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Evidence boundary
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">{project.evidence}</p>
                  </div>

                  <div className="mt-5">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Runtime and data stack
                    </p>
                    <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {project.contextualStack.map((item) => (
                        <li
                          key={item.primitive}
                          className="flex min-w-0 flex-col gap-1 border border-white/10 bg-[#08090C] px-3 py-2.5"
                        >
                          <span className="break-words font-mono text-xs font-semibold text-white">
                            {item.primitive}
                          </span>
                          <span className="font-mono text-[10px] leading-4 text-[#00D9FF]">
                            {item.role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => toggleHowItWorks(project.slug)}
                      aria-expanded={expanded}
                      aria-controls={detailsId}
                      className="inline-flex min-h-[44px] w-full items-center justify-between border border-white/15 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200 transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] sm:w-auto sm:justify-center sm:gap-3"
                    >
                      <span>How it works</span>
                      <span aria-hidden="true" className="text-[#00D9FF]">
                        {expanded ? '−' : '+'}
                      </span>
                    </button>

                    {expanded ? (
                      <div
                        id={detailsId}
                        className="mt-3 border border-[#00D9FF]/25 bg-[#08090C] p-4"
                      >
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#00D9FF]">
                          Implementation details
                        </p>
                        <ul className="mt-3 space-y-2">
                          {project.architectureNotes.map((note) => (
                            <li key={note} className="flex items-start gap-2 text-sm leading-6 text-zinc-300">
                              <span aria-hidden="true" className="mt-0.5 text-[#00D9FF]">—</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                <footer className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:p-6">
                  <Link
                    href={project.caseStudyHref}
                    className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-[#00D9FF] px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#08090C] transition-colors hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10]"
                  >
                    <span>Read case study</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                  {project.sourceHref ? (
                    <a
                      href={project.sourceHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-white/20 bg-[#08090C] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                    >
                      <span>View source</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
