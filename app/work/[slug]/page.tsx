import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Shield,
  Cpu,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { ArchDecision } from "@/components/ArchDecision";
import { Footer } from "@/components/Footer";

interface CaseStudySpec {
  slug: string;
  domain: string;
  title: string;
  subtitle: string;
  constraint: string;
  decision: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  adr: {
    id: string;
    title: string;
    context: string;
    decision: string;
    tradeoffs: string;
    consequences: string;
  };
  architectureNotes: string[];
  liveUrl?: string;
}

const CASE_STUDY_REGISTRY: Record<string, CaseStudySpec> = {
  taxbridge: {
    slug: "taxbridge",
    domain: "COMPLIANCE PLATFORM · FINTECH",
    title: "TaxBridge",
    subtitle:
      "Replay-safe multi-tenant SME tax compliance and ledger reconciliation platform.",
    constraint:
      "Concurrent multi-organization tax filings and webhook ingestion over intermittent West African mobile networks with zero tolerance for cross-tenant leakage or duplicate ledger entries.",
    decision:
      "Architected on Fastify 5, PostgreSQL 15 with strict Row-Level Security (RLS) tenant scoping, Redis 7 + BullMQ idempotent background workers, and SHA-256 hash-linked audit trails.",
    outcome:
      "100% tenant isolation enforced at the database engine layer, deterministic retry recovery, and cryptographically verifiable compliance exports.",
    metrics: [
      { label: "TENANT ISOLATION", value: "PostgreSQL 15 RLS" },
      { label: "AUDIT INTEGRITY", value: "SHA-256 Hash Chain" },
      { label: "WORKER RETRY", value: "Idempotent BullMQ" },
    ],
    stack: [
      "Fastify 5",
      "TypeScript",
      "PostgreSQL 15 RLS",
      "Redis 7",
      "BullMQ",
      "GraphQL",
      "Docker",
    ],
    adr: {
      id: "ADR-TB-01",
      title: "Enforce Tenant Scoping via PostgreSQL RLS Over Application Filters",
      context:
        "Relying solely on ORM WHERE clauses in a multi-tenant financial compliance platform creates catastrophic blast radius if a single query omits tenant_id.",
      decision:
        "Bind every transaction to a verified session tenant context via SET LOCAL app.current_tenant_id and enforce restrictive PostgreSQL 15 RLS policies.",
      tradeoffs:
        "Requires connection-pool transaction wrapping and strict migration discipline.",
      consequences:
        "Zero cross-tenant data leakage even under developer query regressions; fail-closed rejection when tenant context is unset.",
    },
    architectureNotes: [
      "Every state mutation appends a SHA-256 digest linking the previous record hash, actor identity, and payload diff.",
      "BullMQ workers execute with deterministic idempotency keys so network retries never double-post tax assessments.",
    ],
  },
  sabiscore: {
    slug: "sabiscore",
    domain: "REAL-TIME ML ANALYTICS · FORECASTING",
    title: "SabiScore",
    subtitle:
      "Institutional-grade football forecasting and market comparison engine executing under a strict 512MB RAM ceiling.",
    constraint:
      "Delivering sub-150ms ensemble inference and live market odds comparison across European leagues within a constrained 512MB RAM container budget.",
    decision:
      "Eliminated in-memory Pandas and pickle deserialization in favor of out-of-core Polars and DuckDB pipelines, zero-pickle meta-learners, and strict Pydantic v2 boundary contracts.",
    outcome:
      "Sustained 112ms p99 inference latency and 384MB peak memory footprint during peak weekend matchday concurrency.",
    metrics: [
      { label: "MEMORY CEILING", value: "<= 512 MB RAM" },
      { label: "INFERENCE LATENCY", value: "112 ms p99" },
      { label: "SERIALIZATION", value: "Zero-Pickle" },
    ],
    stack: [
      "Python",
      "FastAPI",
      "Polars",
      "DuckDB",
      "Pydantic v2",
      "Next.js",
      "PostgreSQL",
    ],
    adr: {
      id: "ADR-SS-01",
      title: "Zero-Pickle Meta-Learners & Out-of-Core DuckDB/Polars Execution",
      context:
        "Standard scikit-learn/pickle model loading and Pandas DataFrames caused memory spikes above 1.2GB and cold-start latency bottlenecks.",
      decision:
        "Export model weights as deterministic typed coefficients and execute feature aggregations out-of-core via DuckDB and Polars lazy frames.",
      tradeoffs:
        "Custom serialization pipeline required for training-to-serving artifact promotion.",
      consequences:
        "Eliminated arbitrary code execution risk from pickle files and locked container memory under 400MB.",
    },
    architectureNotes: [
      "All incoming odds feeds and worker payloads are validated through strict Pydantic v2 schemas before touching the inference engine.",
      "Deterministic fallback heuristics activate automatically if upstream telemetry feeds degrade.",
    ],
    liveUrl: "https://sabiscore.app",
  },
  swarmxq: {
    slug: "swarmxq",
    domain: "AGENT ORCHESTRATION · MEDIA PIPELINE",
    title: "SwarmXQ & The Yap Engine",
    subtitle:
      "Fault-tolerant multi-agent DAG orchestration and CPU-bounded Kokoro TTS synthesis pipeline.",
    constraint:
      "Coordinating multi-step LLM script generation, visual assembly, and Kokoro TTS voice synthesis on CPU-constrained infrastructure without losing progress on transient failures.",
    decision:
      "Built a checkpointed DAG orchestrator with local LLM routing, per-stage content hashing, and circuit-broken fallback providers.",
    outcome:
      "Deterministic stage resumption on crash recovery with zero redundant LLM token or TTS synthesis compute waste.",
    metrics: [
      { label: "ORCHESTRATION", value: "Checkpointed DAG" },
      { label: "VOICE ENGINE", value: "Kokoro TTS (CPU)" },
      { label: "RECOVERY", value: "Stage-Level Resume" },
    ],
    stack: [
      "Python",
      "TypeScript",
      "SwarmXQ DAG",
      "Kokoro TTS",
      "Local LLM Routing",
      "Redis",
    ],
    adr: {
      id: "ADR-SX-01",
      title: "Content-Addressed Stage Checkpointing for Media & Agent DAGs",
      context:
        "Long-running audio and video generation pipelines fail mid-flight when upstream LLM APIs rate-limit or CPU workers preempt.",
      decision:
        "Hash every stage input contract and persist immutable intermediate artifacts before advancing the DAG cursor.",
      tradeoffs:
        "Additional local disk I/O for intermediate artifact manifests.",
      consequences:
        "Failed runs resume from the exact failed node in <50ms without re-synthesizing completed audio segments.",
    },
    architectureNotes: [
      "Local model router evaluates token budget and latency SLAs before dispatching to local or remote inference endpoints.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CASE_STUDY_REGISTRY).map((slug) => ({ slug }));
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDY_REGISTRY[slug];

  if (!study) {
    notFound();
  }

  return (
    <>
      <main className="min-h-screen bg-obsidian-base text-obsidian-text pb-20">
        {/* Top Sub-Route Navigation Bar */}
        <div className="border-b border-obsidian-border bg-obsidian-surface">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/#projects"
              className="inline-flex min-h-pill items-center gap-2 rounded-lg border border-obsidian-border bg-obsidian-elevated px-3 py-1.5 font-mono text-caption text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-accent-cyan" />
              <span>Back to Production Evidence</span>
            </Link>

            {study.liveUrl && (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-pill items-center gap-1.5 rounded-lg border border-accent-emerald bg-accent-emerald px-3.5 py-1.5 font-mono text-micro font-semibold text-obsidian-base transition-colors hover:bg-accent-cyan hover:border-accent-cyan"
              >
                <span>LIVE PRODUCTION SYSTEM</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Case Study Header */}
        <article className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-12">
          <div className="mb-3 font-mono text-micro font-semibold uppercase tracking-telemetry text-accent-cyan">
            {study.domain}
          </div>

          <h1 className="mb-3 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-5xl">
            {study.title}
          </h1>

          <p className="mb-6 max-w-3xl font-sans text-base leading-relaxed text-obsidian-muted sm:text-lg">
            {study.subtitle}
          </p>

          {/* Key Telemetry Badges */}
          <div className="mb-8 flex flex-wrap gap-2.5">
            {study.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-obsidian-border bg-obsidian-surface px-3.5 py-2 font-mono text-micro tabular-nums"
              >
                <span className="block text-obsidian-dim">{m.label}</span>
                <span className="font-semibold text-accent-emerald">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* 3-Column Constraint -> Decision -> Outcome Specification */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-obsidian-border bg-obsidian-surface p-4">
              <div className="mb-2 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                <Shield className="h-3.5 w-3.5 text-accent-cyan" />
                <span>01 // Constraint</span>
              </div>
              <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                {study.constraint}
              </p>
            </div>

            <div className="rounded-xl border border-obsidian-border bg-obsidian-surface p-4">
              <div className="mb-2 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                <Cpu className="h-3.5 w-3.5 text-accent-cyan" />
                <span>02 // Decision</span>
              </div>
              <p className="font-sans text-caption leading-relaxed text-obsidian-text">
                {study.decision}
              </p>
            </div>

            <div className="rounded-xl border border-obsidian-border bg-obsidian-surface p-4">
              <div className="mb-2 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                <Layers className="h-3.5 w-3.5 text-accent-emerald" />
                <span>03 // Outcome</span>
              </div>
              <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                {study.outcome}
              </p>
            </div>
          </div>

          {/* Primary Architecture Decision Record */}
          <ArchDecision {...study.adr} />

          {/* Implementation Notes */}
          <div className="mt-8 rounded-xl border border-obsidian-border bg-obsidian-surface p-5 sm:p-6">
            <h2 className="mb-4 font-sans text-xl font-bold text-obsidian-text">
              Operational Verification &amp; Runtime Invariants
            </h2>
            <ul className="space-y-2.5">
              {study.architectureNotes.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-2.5 font-sans text-sm leading-relaxed text-obsidian-muted"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent-emerald" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-obsidian-border pt-4">
              {study.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-obsidian-text"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
