import React from "react";
import { ShieldAlert, Database, Cpu, Lock, CheckCircle2 } from "lucide-react";

export interface ArchitecturalPattern {
  id: string;
  code: string;
  title: string;
  failureMode: string;
  implementation: string;
  verification: string;
  stack: string[];
  accent: "cyan" | "emerald";
}

const PRODUCTION_PATTERNS: ArchitecturalPattern[] = [
  {
    id: "replay-safe-idempotency",
    code: "PAT-01",
    title: "Replay-Safe Financial & Compliance Workflows",
    failureMode:
      "Network partitions and client retries under degraded mobile connectivity causing duplicate ledger mutations or orphaned webhook payloads.",
    implementation:
      "Deterministic idempotency keys scoped per tenant with atomic PostgreSQL state transitions, BullMQ dead-letter isolation, and hash-linked audit trails.",
    verification:
      "Zero duplicate ledger postings across simulated 30% packet-loss chaos suites.",
    stack: ["Fastify 5", "PostgreSQL 15", "BullMQ", "AES-256"],
    accent: "emerald",
  },
  {
    id: "bounded-memory-execution",
    code: "PAT-02",
    title: "Out-of-Core Data & Sub-512MB ML Inference",
    failureMode:
      "OOM container kills and GC latency spikes caused by unbounded in-memory DataFrame materialization and pickle deserialization.",
    implementation:
      "Streaming out-of-core execution via Polars and DuckDB paired with zero-pickle meta-learners and strict Pydantic v2 boundary contracts.",
    verification:
      "Sustained p99 < 150ms inference latency within a hard 512MB RAM ceiling.",
    stack: ["Polars", "DuckDB", "FastAPI", "Pydantic v2"],
    accent: "cyan",
  },
  {
    id: "zero-trust-tenant-isolation",
    code: "PAT-03",
    title: "Database-Enforced Multi-Tenant Isolation",
    failureMode:
      "Application-layer query omissions exposing cross-tenant records in multi-organization B2B platforms.",
    implementation:
      "Transaction-scoped PostgreSQL Row-Level Security (RLS) policies bound to cryptographically verified session claims via pg-tenant.",
    verification:
      "Fail-closed query rejection when tenant context is absent or mismatched.",
    stack: ["PostgreSQL RLS", "pg-tenant", "audit-chain", "TypeScript"],
    accent: "emerald",
  },
];

export const ProductionPatterns: React.FC = () => {
  return (
    <section
      id="patterns"
      aria-labelledby="patterns-heading"
      className="border-t border-obsidian-border bg-obsidian-base"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Section Header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
            <span className="font-semibold text-accent-cyan">02</span>
            <span className="text-obsidian-muted">PRODUCTION PATTERNS</span>
          </div>

          <h2
            id="patterns-heading"
            className="mb-3 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-4xl"
          >
            Engineered to fail closed.
          </h2>

          <p className="max-w-2xl font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
            Repeatable architectural blueprints designed to keep distributed
            systems observable, bounded in memory, and deterministic during
            infrastructure degradation.
          </p>
        </div>

        {/* Pattern Specification Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {PRODUCTION_PATTERNS.map((pattern) => {
            const topEdgeClass =
              pattern.accent === "emerald"
                ? "bg-illuminate-emerald"
                : "bg-illuminate-cyan";

            return (
              <article
                key={pattern.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-5 transition-colors hover:border-obsidian-subtle"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-px opacity-70 transition-opacity group-hover:opacity-100 ${topEdgeClass}`}
                  aria-hidden="true"
                />

                <div>
                  {/* Pattern Code & Icon */}
                  <div className="mb-4 flex items-center justify-between border-b border-obsidian-border pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-elevated px-2 py-0.5 font-mono text-micro text-accent-cyan">
                      <Cpu className="h-3 w-3" />
                      <span>{pattern.code}</span>
                    </span>

                    <Lock
                      className="h-3.5 w-3.5 text-obsidian-dim"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 font-sans text-lg font-bold tracking-tight text-obsidian-text">
                    {pattern.title}
                  </h3>

                  {/* Failure Mode */}
                  <div className="mb-3 rounded-lg border border-obsidian-border bg-obsidian-elevated p-3">
                    <div className="mb-1 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                      <ShieldAlert className="h-3 w-3 text-accent-cyan" />
                      <span>Failure Mode</span>
                    </div>
                    <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                      {pattern.failureMode}
                    </p>
                  </div>

                  {/* Architectural Implementation */}
                  <div className="mb-3 rounded-lg border border-obsidian-border bg-obsidian-elevated p-3">
                    <div className="mb-1 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                      <Database className="h-3 w-3 text-accent-emerald" />
                      <span>Implementation</span>
                    </div>
                    <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
                      {pattern.implementation}
                    </p>
                  </div>

                  {/* Empirical Verification */}
                  <div className="mb-4 rounded-lg border border-obsidian-border bg-obsidian-base p-3">
                    <div className="mb-1 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-accent-emerald">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Verified Outcome</span>
                    </div>
                    <p className="font-mono text-micro leading-relaxed text-obsidian-text">
                      {pattern.verification}
                    </p>
                  </div>
                </div>

                {/* Stack Tokens */}
                <div className="flex flex-wrap gap-1.5 border-t border-obsidian-border pt-3">
                  {pattern.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-obsidian-border bg-obsidian-elevated px-2 py-0.5 font-mono text-micro text-obsidian-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductionPatterns;
