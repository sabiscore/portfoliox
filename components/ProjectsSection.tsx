import React from "react";
import Link from "next/link";
import { ArrowUpRight, Shield, Cpu, Layers } from "lucide-react";

export interface CaseStudySummary {
  id: string;
  slug: string;
  domain: string;
  title: string;
  constraint: string;
  decision: string;
  outcome: string;
  metrics: string[];
  accent: "emerald" | "cyan";
}

const CASE_STUDIES: CaseStudySummary[] = [
  {
    id: "taxbridge",
    slug: "/work/taxbridge",
    domain: "COMPLIANCE PLATFORM · FINTECH",
    title: "TaxBridge",
    constraint:
      "Multi-tenant SME tax filing and ledger reconciliation under strict auditability and intermittent network conditions.",
    decision:
      "Architected replay-safe idempotency workflows on Fastify 5, PostgreSQL 15 Row-Level Security (RLS), BullMQ, and hash-linked audit chains.",
    outcome:
      "Zero cross-tenant data leakage, deterministic retry recovery, and cryptographically verifiable compliance logs.",
    metrics: ["PostgreSQL 15 RLS", "Fastify 5 · BullMQ", "Hash-Linked Audit"],
    accent: "emerald",
  },
  {
    id: "sabiscore",
    slug: "/work/sabiscore",
    domain: "REAL-TIME ML ANALYTICS · FORECASTING",
    title: "SabiScore",
    constraint:
      "Sub-150ms ensemble inference and out-of-core feature aggregation within a strict <512MB RAM container ceiling.",
    decision:
      "Replaced in-memory Pandas/pickle pipelines with zero-pickle meta-learners, DuckDB/Polars out-of-core execution, and Pydantic v2 contracts.",
    outcome:
      "Deterministic memory profile under peak matchday concurrency with sub-150ms p99 inference latency.",
    metrics: ["< 512MB RAM Ceiling", "p99 < 150ms", "Polars · DuckDB"],
    accent: "cyan",
  },
  {
    id: "swarmxq",
    slug: "/work/swarmxq",
    domain: "AGENT ORCHESTRATION · MEDIA PIPELINE",
    title: "SwarmXQ & The Yap Engine",
    constraint:
      "Orchestrating multi-stage LLM routing and Kokoro TTS voice synthesis across CPU-constrained execution nodes.",
    decision:
      "Built a DAG-based worker scheduler with circuit-breaking local model routing and deterministic asset checkpointing.",
    outcome:
      "Fault-tolerant pipeline resumption without redundant token or audio synthesis compute waste.",
    metrics: ["DAG Orchestration", "Local LLM Routing", "Kokoro TTS"],
    accent: "emerald",
  },
];

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16"
    >
      {/* Section Header */}
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
          <span className="font-semibold text-accent-emerald">01</span>
          <span className="text-obsidian-muted">PROJECTS</span>
        </div>

        <h2
          id="projects-heading"
          className="mb-3 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-4xl"
        >
          Built around real constraints.
        </h2>

        <p className="max-w-2xl font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
          Each case study starts with the constraint, explains the architecture
          decision, and shows the resulting behaviour and available evidence.
        </p>
      </div>

      {/* Case Study Cards */}
      <div className="space-y-4">
        {CASE_STUDIES.map((study) => {
          const topBarClass =
            study.accent === "emerald"
              ? "bg-illuminate-emerald"
              : "bg-illuminate-cyan";

          return (
            <article
              key={study.id}
              id={study.id}
              className="group relative overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-5 transition-colors hover:border-obsidian-subtle sm:p-6"
            >
              {/* 1px Top Illumination Boundary */}
              <div
                className={`absolute inset-x-0 top-0 h-px opacity-75 transition-opacity group-hover:opacity-100 ${topBarClass}`}
                aria-hidden="true"
              />

              {/* Card Kicker & Action Badge */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-micro font-medium uppercase tracking-telemetry text-accent-cyan">
                  {study.domain}
                </span>

                <Link
                  href={study.slug}
                  className="inline-flex min-h-pill items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-elevated px-3 py-1 font-mono text-micro text-obsidian-text transition-colors group-hover:border-accent-emerald group-hover:text-accent-emerald"
                >
                  <span>CASE STUDY</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Project Title */}
              <h3 className="mb-4 font-sans text-xl font-bold tracking-tight text-obsidian-text sm:text-2xl">
                {study.title}
              </h3>

              {/* Constraint -> Decision -> Outcome Breakdown */}
              <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-obsidian-border bg-obsidian-elevated p-3">
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                    <Shield className="h-3 w-3 text-accent-cyan" />
                    <span>Constraint</span>
                  </div>
                  <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                    {study.constraint}
                  </p>
                </div>

                <div className="rounded-lg border border-obsidian-border bg-obsidian-elevated p-3">
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                    <Cpu className="h-3 w-3 text-accent-cyan" />
                    <span>Decision</span>
                  </div>
                  <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                    {study.decision}
                  </p>
                </div>

                <div className="rounded-lg border border-obsidian-border bg-obsidian-elevated p-3">
                  <div className="mb-1 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                    <Layers className="h-3 w-3 text-accent-emerald" />
                    <span>Outcome</span>
                  </div>
                  <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                    {study.outcome}
                  </p>
                </div>
              </div>

              {/* Technical Telemetry Pills */}
              <div className="flex flex-wrap gap-2 border-t border-obsidian-border pt-3.5">
                {study.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="inline-flex items-center rounded border border-obsidian-border bg-obsidian-base px-2.5 py-1 font-mono text-micro text-obsidian-muted"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
