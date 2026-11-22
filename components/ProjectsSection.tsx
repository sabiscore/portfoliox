import Link from 'next/link';
import type { JSX } from 'react';

import {
  FailureFlowStepper,
  ProjectCardNarrative,
  type FlowStage,
} from '@/components/ProjectCardInteractive';
import { getWorkCases } from '@/lib/content';
import { STATUS_TONE, WORK_CASE_META, WORK_CASE_ORDER, type EvidenceStatus } from '@/lib/work-meta';

interface ProjectLedgerEntry {
  slug: string;
  domain: string;
  status: EvidenceStatus;
  title: string;
  ownership: string;
  indexHook: string;
  consumerSummary: string;
  problemSolved: string;
  verifiableProof: string;
  constraint: string;
  decision: string;
  chosen: string;
  over: string;
  implementationNote: string;
  evidence: string;
  flowStages: readonly FlowStage[];
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
    slug: 'sabiscore',
    domain: 'QUANTITATIVE ML · DATA PLATFORM',
    status: 'PUBLIC DEMO',
    title: 'SabiScore',
    ownership: 'End-to-end architect & builder',
    indexHook: 'Live football match forecasting compared against betting odds',
    consumerSummary:
      'Predicts football match outcomes and compares them against live betting odds in a public web dashboard — helping analysts spot mispriced markets instead of relying on guesswork.',
    problemSolved:
      'Forecasting dashboards break silently when upstream sports feeds lag, memory spikes, or models go stale mid-season.',
    verifiableProof:
      'Live web app at sabiscore.app backed by memory-bounded Polars pipelines, model-versioned Redis caching, and an explicit fallback path.',
    constraint:
      'Prediction quality must remain legible as market data, model versions, and upstream feed quality change.',
    decision:
      'Out-of-core Polars and DuckDB pipelines, model-aware cache namespaces, ensemble evaluation, and an explicit lower-confidence fallback path.',
    chosen: 'Polars + DuckDB out-of-core features with versioned Redis cache',
    over: 'In-memory pandas joins and unversioned REST polling',
    implementationNote:
      'The engineering record documents calibration workflows and market comparison. Private uptime, latency, memory, and model-evaluation reports are not reproduced as public benchmarks.',
    evidence:
      'Public live demo available. Operational SLOs and private backtest reports are not asserted as public benchmarks here.',
    flowStages: [
      {
        code: '01',
        label: 'Feature ingest',
        boundary: 'Out-of-core Polars + DuckDB joins',
        failurePrevented:
          'Streams rolling fixture features within explicit memory ceilings instead of crashing workers on large historical windows.',
      },
      {
        code: '02',
        label: 'Versioned serving',
        boundary: 'Model-tagged Redis cache namespaces',
        failurePrevented:
          'Prevents stale forecasts from outliving a model retrain by scoping cache keys to the active model version.',
      },
      {
        code: '03',
        label: 'Graceful fallback',
        boundary: 'Labeled lower-confidence baseline path',
        failurePrevented:
          'Returns a clearly marked baseline estimate instead of opaque errors or silent staleness when upstream feeds degrade.',
      },
    ],
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
    slug: 'taxbridge',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    status: 'ACTIVE BUILD',
    title: 'TaxBridge',
    ownership: 'End-to-end architect & builder',
    indexHook: 'Offline-capable tax filing backend for Nigerian SMEs',
    consumerSummary:
      'Tax filing software for Nigerian small businesses that keeps working offline and protects against duplicate filings when mobile internet or tax portals fail.',
    problemSolved:
      'Flaky mobile connectivity and slow government portals routinely cause duplicate submissions and missing audit trails for small business accountants.',
    verifiableProof:
      'Public source repository demonstrating PostgreSQL Row-Level Security tenant isolation, replay-safe BullMQ queues, and local SQLite mobile sync.',
    constraint:
      'SME filings must preserve organization context and avoid duplicate work when mobile connectivity or upstream fiscal services are unreliable.',
    decision:
      'The architecture combines PostgreSQL row-level security, transaction-scoped organization context, idempotent background jobs, and a local mobile sync queue.',
    chosen: 'Database-layer PostgreSQL RLS + idempotent BullMQ replay',
    over: 'Application-only tenant filters and naive retry loops',
    implementationNote:
      'Tenant scope, retry semantics, and audit history are explicit design concerns. NRS DigiTax integration and tenant-policy validation remain in progress.',
    evidence:
      'Public source repository in active build; NRS DigiTax certification and end-to-end fiscalization remain in progress.',
    flowStages: [
      {
        code: '01',
        label: 'Offline capture',
        boundary: 'Local Expo + SQLite submission queue',
        failurePrevented:
          'Preserves draft and pending filings on-device when mobile networks drop mid-session.',
      },
      {
        code: '02',
        label: 'Tenant isolation',
        boundary: 'Transaction-scoped PostgreSQL RLS',
        failurePrevented:
          'Binds organization context at the database engine so a missed application filter cannot expose another business.',
      },
      {
        code: '03',
        label: 'Safe replay',
        boundary: 'Idempotent BullMQ + Redis workers',
        failurePrevented:
          'Deduplicates retries against upstream fiscal providers so network timeouts do not trigger double filings.',
      },
    ],
    architectureNotes: [
      'Database access is designed to bind tenant context within a transaction; policy configuration and transaction lifecycle require integration validation.',
      'Idempotent queue keys and bounded retry handling isolate upstream fiscalization failures.',
      'The Expo client uses a local SQLite queue to preserve pending operations when connectivity is unavailable.',
    ],
    contextualStack: [
      { primitive: 'Fastify 5', role: 'API contracts' },
      { primitive: 'PostgreSQL RLS', role: 'Tenant isolation' },
      { primitive: 'BullMQ + Redis', role: 'Replay-safe jobs' },
      { primitive: 'Expo + SQLite', role: 'Offline sync' },
    ],
    caseStudyHref: '/work/taxbridge',
    sourceHref: 'https://github.com/scardubu/taxbridge',
  },
  {
    slug: 'yap-engine',
    domain: 'AI WORKFLOWS · MEDIA PIPELINE',
    status: 'PUBLIC SOURCE',
    title: 'The Yap Engine',
    ownership: 'End-to-end architect & builder',
    indexHook: 'Resumable local-AI pipeline from creative brief to video',
    consumerSummary:
      'Turns a short creative brief into a scripted, voiced, and assembled short-form video using checkpointed AI stages that resume cleanly after crashes instead of starting over.',
    problemSolved:
      'Long multi-step AI media pipelines waste compute and fail silently whenever an API times out or a CPU-constrained worker restarts.',
    verifiableProof:
      'Open-source workflow engine with content-hashed stage checkpoints, schema-validated model outputs, local GGUF routing, and deterministic FFmpeg assembly.',
    constraint:
      'Long-running generation stages can be interrupted by provider limits, worker restarts, or resource pressure.',
    decision:
      'Local model routing, stage-level checkpoints, content hashes, schema validation, and deterministic media assembly.',
    chosen: 'Content-hashed stage checkpoints with task-specific local models',
    over: 'Single monolithic generation calls that restart from zero on failure',
    implementationNote:
      'The project documents restart boundaries and intermediate artifact reuse. Throughput, availability, and cost SLOs are not claimed.',
    evidence:
      'Public source and architecture record; runtime throughput depends on host CPU/GPU and model configuration.',
    flowStages: [
      {
        code: '01',
        label: 'Local routing',
        boundary: 'Task-specific GGUF + schema contracts',
        failurePrevented:
          'Validates script and storyboard structure between steps before media rendering begins.',
      },
      {
        code: '02',
        label: 'Checkpoints',
        boundary: 'Content-hashed intermediate artifacts',
        failurePrevented:
          'Resumes interrupted jobs from the failed stage instead of replaying completed inference or audio synthesis.',
      },
      {
        code: '03',
        label: 'Assembly',
        boundary: 'Deterministic Kokoro TTS + FFmpeg export',
        failurePrevented:
          'Isolates media synthesis and rendering under explicit Redis queue and timeout limits.',
      },
    ],
    architectureNotes: [
      'Media processing separates synthesis, assembly, and validation into reviewable stages.',
      'Local model routing and schema validation keep model output handling explicit.',
      'Checkpointed orchestration preserves intermediate stage results and makes recovery points explicit.',
    ],
    contextualStack: [
      { primitive: 'Local GGUF', role: 'Model routing' },
      { primitive: 'Fastify + Redis', role: 'API and queue state' },
      { primitive: 'Kokoro TTS', role: 'Speech synthesis' },
      { primitive: 'FFmpeg', role: 'Media assembly' },
    ],
    caseStudyHref: '/work/yap-engine',
    sourceHref: 'https://github.com/sabiscore/the-yap-engine',
  },
  {
    slug: 'ubec',
    domain: 'PUBLIC SECTOR · DATA ENGINEERING',
    status: 'PRIVATE CASE STUDY',
    title: 'UBEC Data Pipeline',
    ownership: 'Senior Data & Systems Engineer · UBEC HQ',
    indexHook: 'State-isolated federal education reporting across 36 states',
    consumerSummary:
      'Collects, cleans, and validates education reporting data across 36 Nigerian state offices so late or broken files from one state never stall national reporting.',
    problemSolved:
      'Federal education reporting previously stalled whenever inconsistent state spreadsheets or delayed submissions broke shared manual reconciliation.',
    verifiableProof:
      'Partitioned Python and Apache Airflow architecture with canonical schema checks, probabilistic record linkage, and auditable exception logs.',
    constraint:
      'Incomplete or inconsistent submissions need to remain identifiable without blocking independent reporting work.',
    decision:
      'Partitioned ingestion tasks, canonical schemas, validation stages, and traceable exception records.',
    chosen: 'Per-state Airflow partitions with probabilistic record linkage',
    over: 'All-or-nothing national batch imports and exact-match deduplication',
    implementationNote:
      'The case study describes the data workflow at a high level. Confidential outcomes, datasets, and operational figures are not published.',
    evidence:
      'Private federal engagement documented at a non-sensitive architectural level; confidential records excluded.',
    flowStages: [
      {
        code: '01',
        label: 'State partitions',
        boundary: 'Independent per-state Airflow DAG tasks',
        failurePrevented:
          'Allows 35 completed state reports to process cleanly while one delayed or broken submission stays visibly isolated.',
      },
      {
        code: '02',
        label: 'Schema gate',
        boundary: 'Canonical normalization + record linkage',
        failurePrevented:
          'Resolves inconsistent ministry column headers and duplicate school names before aggregation.',
      },
      {
        code: '03',
        label: 'Audit ledger',
        boundary: 'PostgreSQL traceable exception records',
        failurePrevented:
          'Preserves row-level lineage for every rejected or incomplete entry so analysts can remediate without silent drops.',
      },
    ],
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
                <span className="mt-2 flex-1 text-sm leading-6 text-zinc-400">
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
              Four core systems — each starting in plain English with an on-demand architectural
              view, clearly labeled as live demo, open source, active build, or private record.
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
                    className="group focus-visible:ring-accent-cyan flex min-h-touch items-center justify-between gap-3 border-l-2 border-l-transparent px-4 py-2.5 transition-colors hover:border-l-accent-cyan hover:bg-white/5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
                  >
                    <span className="min-w-0">
                      <span className="flex min-w-0 items-center gap-2.5 font-mono text-xs">
                        <span aria-hidden="true" className="text-accent-cyan/80 shrink-0">
                          {projectCode(index)}
                        </span>
                        <span className="group-hover:text-accent-cyan truncate font-semibold text-zinc-100">
                          {project.title}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate pl-9 font-sans text-xs text-zinc-400">
                        {project.indexHook}
                      </span>
                    </span>
                    <span className="text-2xs flex shrink-0 items-center gap-1.5 font-mono tracking-wider text-zinc-400 uppercase">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_TONE[project.status].dot}`}
                      />
                      <span className="hidden sm:inline">{project.status}</span>
                      <span
                        aria-hidden="true"
                        className="text-accent-cyan motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5"
                      >
                        ›
                      </span>
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

                    <ProjectCardNarrative
                      title={project.title}
                      ownership={project.ownership}
                      consumerSummary={project.consumerSummary}
                      problemSolved={project.problemSolved}
                      verifiableProof={project.verifiableProof}
                      constraint={project.constraint}
                      decision={project.decision}
                      chosen={project.chosen}
                      over={project.over}
                      evidence={project.evidence}
                    />
                  </div>

                  <div className={`min-w-0 ${wide ? 'mt-5 lg:mt-0' : 'mt-5'}`}>
                    <div
                      className={`border-t border-white/10 pt-4 ${
                        wide ? 'lg:border-t-0 lg:pt-0' : ''
                      }`}
                    >
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
                        <FailureFlowStepper
                          projectTitle={project.title}
                          stages={project.flowStages}
                        />
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
