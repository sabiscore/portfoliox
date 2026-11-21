import Link from 'next/link';
import type { JSX } from 'react';

import { getWorkCases } from '@/lib/content';
import { STATUS_TONE, WORK_CASE_META, WORK_CASE_ORDER, type EvidenceStatus } from '@/lib/work-meta';

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
  /** Public source repository. */
  sourceHref?: string;
  /** Running product, distinct from source so the link label stays truthful. */
  demoHref?: string;
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
    demoHref: 'https://sabiscore.app',
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
    caseStudyHref: '/work/yap-engine',
    sourceHref: 'https://github.com/sabiscore/the-yap-engine',
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

const projectCode = (index: number): string => `P/${String(index + 1).padStart(2, '0')}`;

const primaryLinkClass =
  'group inline-flex min-h-11 w-full items-center justify-center gap-2 bg-accent-cyan px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-obsidian-base transition-colors hover:bg-accent-cyanHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-surface motion-safe:active:translate-y-px sm:w-auto';

const secondaryLinkClass =
  'group inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/20 bg-obsidian-base px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-safe:active:translate-y-px sm:w-auto';

const arrowOutClass =
  'motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5';

function StatusChip({ status }: { status: EvidenceStatus }): JSX.Element {
  const tone = STATUS_TONE[status];
  return (
    <span
      className={`text-2xs inline-flex min-h-6 items-center gap-1.5 border px-2 py-1 font-mono font-semibold tracking-wider uppercase ${tone.chip}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  );
}

/** Published case studies not featured above; MDX frontmatter is the only source. */
async function MoreCaseStudies(): Promise<JSX.Element | null> {
  const featuredSlugs = new Set(
    SELECTED_PROJECTS.map((project) => project.caseStudyHref.replace('/work/', ''))
  );
  const moreCases = (await getWorkCases())
    .filter((entry) => !featuredSlugs.has(entry.slug))
    .sort((left, right) => {
      const leftRank = WORK_CASE_ORDER.indexOf(left.slug);
      const rightRank = WORK_CASE_ORDER.indexOf(right.slug);
      return (leftRank === -1 ? 99 : leftRank) - (rightRank === -1 ? 99 : rightRank);
    });
  if (moreCases.length === 0) return null;

  return (
    <div className="border-t border-white/10 pt-8">
      <h3
        id="more-case-studies-heading"
        className="tracking-section font-mono text-xs font-semibold text-zinc-300 uppercase"
      >
        More case studies
      </h3>
      <ul
        aria-labelledby="more-case-studies-heading"
        className="mt-5 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {moreCases.map((entry) => {
          const meta = WORK_CASE_META[entry.slug];
          return (
            <li key={entry.slug} data-project-id={entry.slug} className="bg-obsidian-surface">
              <Link
                href={`/work/${entry.slug}`}
                className="group focus-visible:ring-accent-cyan flex h-full flex-col p-5 transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
              >
                {meta ? (
                  <span className="text-2xs tracking-domain font-mono text-zinc-400 uppercase">
                    {meta.domain}
                  </span>
                ) : null}
                <span className="mt-2 flex items-start justify-between gap-3">
                  <span className="font-display group-hover:text-accent-cyan text-lg leading-snug font-semibold text-white">
                    {entry.title}
                  </span>
                  <span aria-hidden="true" className={`text-accent-cyan mt-1 ${arrowOutClass}`}>
                    ↗
                  </span>
                </span>
                <span className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-zinc-400">
                  {entry.summary}
                </span>
                {meta ? (
                  <span className="text-2xs mt-4 inline-flex items-center gap-1.5 border-t border-white/10 pt-3 font-mono tracking-wider text-zinc-400 uppercase">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_TONE[meta.status].dot}`}
                    />
                    <span>{meta.status}</span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProjectsSection(): JSX.Element {
  return (
    <section
      id="projects"
      aria-labelledby="projects-section-heading"
      className="bg-obsidian-base w-full border-b border-white/10 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="max-w-hero mx-auto space-y-10">
        <header className="projects-header-grid grid grid-cols-1 gap-8 lg:items-end lg:gap-12">
          <div className="max-w-prose space-y-3">
            <p className="tracking-section flex items-center gap-2.5 font-mono text-xs uppercase">
              <span className="text-accent-cyan font-bold">01</span>
              <span className="text-zinc-400">PROJECTS // SELECTED WORK</span>
            </p>
            <h2
              id="projects-section-heading"
              className="type-section font-display font-bold text-white"
            >
              Built around real constraints.
            </h2>
            <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
              Each project explains the operating constraint and architectural decisions, then
              states whether its supporting evidence is public, private, or still in progress.
            </p>
          </div>

          <nav
            aria-label="Project index"
            className="bg-obsidian-surface min-w-0 border border-white/10"
          >
            <ol className="divide-y divide-white/10">
              {SELECTED_PROJECTS.map((project, index) => (
                <li key={project.slug}>
                  <a
                    href={`#project-${project.slug}`}
                    className="group focus-visible:ring-accent-cyan flex min-h-11 items-center justify-between gap-3 px-4 py-2.5 font-mono text-xs transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span aria-hidden="true" className="text-accent-cyan/80 shrink-0">
                        {projectCode(index)}
                      </span>
                      <span className="group-hover:text-accent-cyan truncate text-zinc-100">
                        {project.title}
                      </span>
                    </span>
                    <span className="text-2xs flex shrink-0 items-center gap-1.5 tracking-wider text-zinc-400 uppercase">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_TONE[project.status].dot}`}
                      />
                      {project.status}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          {SELECTED_PROJECTS.map((project, index) => {
            const wide = index === 0 || index === SELECTED_PROJECTS.length - 1;

            return (
              <article
                key={project.slug}
                id={`project-${project.slug}`}
                data-project-id={project.slug}
                className={`bg-obsidian-surface hover:border-accent-cyan/40 flex min-w-0 scroll-mt-24 flex-col border border-white/10 transition-colors ${
                  wide ? 'lg:col-span-2' : ''
                }`}
              >
                <div
                  className={`flex-1 p-5 sm:p-6 ${
                    wide ? 'projects-wide-grid lg:grid lg:gap-8 lg:p-7' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-2xs tracking-domain flex items-center gap-3 font-mono text-zinc-400 uppercase">
                        <span aria-hidden="true" className="text-accent-cyan/80">
                          {projectCode(index)}
                        </span>
                        <span>{project.domain}</span>
                      </p>
                      <StatusChip status={project.status} />
                    </div>

                    <h3
                      className={`font-display mt-3 font-bold tracking-tight text-white ${
                        wide ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="mt-2.5 max-w-prose text-sm leading-6 text-zinc-300 sm:text-base sm:leading-7">
                      {project.summary}
                    </p>

                    <dl className="mt-5 space-y-3.5 border-t border-white/10 pt-4">
                      <div>
                        <dt className="text-2xs tracking-domain text-accent-cyan font-mono font-bold uppercase">
                          Constraint
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-300">
                          {project.constraint}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-2xs tracking-domain text-accent-cyan font-mono font-bold uppercase">
                          Architecture decision
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-zinc-300">{project.decision}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className={`min-w-0 ${wide ? 'mt-5 lg:mt-0' : 'mt-5'}`}>
                    <div
                      className={`border-t border-white/10 pt-4 ${
                        wide ? 'lg:border-t-0 lg:pt-0' : ''
                      }`}
                    >
                      <p className="text-2xs tracking-domain font-mono font-semibold text-zinc-400 uppercase">
                        Evidence boundary
                      </p>
                      <p className="mt-1 border-l-2 border-white/15 pl-3 text-xs leading-5 text-zinc-300">
                        {project.evidence}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-2xs tracking-domain font-mono font-semibold text-zinc-400 uppercase">
                        Runtime and data stack
                      </p>
                      <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.contextualStack.map((item) => (
                          <li
                            key={item.primitive}
                            className="bg-obsidian-base flex min-w-0 flex-col gap-1 border border-white/10 px-3 py-2"
                          >
                            <span className="font-mono text-xs font-semibold break-words text-white">
                              {item.primitive}
                            </span>
                            <span className="text-2xs text-accent-cyan font-mono leading-4">
                              {item.role}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <details className="group mt-4">
                      <summary className="details-summary-clean bg-obsidian-base hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:ring-accent-cyan inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-between border border-white/15 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-zinc-200 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none sm:w-auto sm:justify-center sm:gap-3">
                        <span>How it works</span>
                        <span aria-hidden="true" className="text-accent-cyan group-open:hidden">
                          +
                        </span>
                        <span
                          aria-hidden="true"
                          className="text-accent-cyan hidden group-open:inline"
                        >
                          −
                        </span>
                      </summary>

                      <div className="border-accent-cyan/25 bg-obsidian-base mt-3 border p-4">
                        <p className="text-2xs tracking-domain font-mono font-semibold text-zinc-400 uppercase">
                          Implementation note
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-300">
                          {project.implementationNote}
                        </p>
                        <p className="text-2xs tracking-domain text-accent-cyan mt-4 font-mono font-semibold uppercase">
                          Implementation details
                        </p>
                        <ul className="mt-3 space-y-2">
                          {project.architectureNotes.map((note) => (
                            <li
                              key={note}
                              className="flex items-start gap-2 text-sm leading-6 text-zinc-300"
                            >
                              <span aria-hidden="true" className="text-accent-cyan mt-0.5">
                                —
                              </span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </div>
                </div>

                {/* Deterministic CTA action bar: identical geometry across all flagship cards */}
                <footer className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:p-6">
                  <Link href={project.caseStudyHref} className={primaryLinkClass}>
                    <span>Read case study</span>
                    <span aria-hidden="true" className={arrowOutClass}>
                      ↗
                    </span>
                  </Link>
                  {project.demoHref ? (
                    <a
                      href={project.demoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={secondaryLinkClass}
                    >
                      <span>Live demo</span>
                      <span aria-hidden="true" className={arrowOutClass}>
                        ↗
                      </span>
                    </a>
                  ) : null}
                  {project.sourceHref ? (
                    <a
                      href={project.sourceHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={secondaryLinkClass}
                    >
                      <span>View source</span>
                      <span aria-hidden="true" className={arrowOutClass}>
                        ↗
                      </span>
                    </a>
                  ) : null}
                </footer>
              </article>
            );
          })}
        </div>

        <MoreCaseStudies />
      </div>
    </section>
  );
}

export default ProjectsSection;
