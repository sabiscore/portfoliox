import React from "react";
import { Activity, CheckCircle2, Terminal } from "lucide-react";

export interface LedgerEntry {
  system: string;
  metric: string;
  budget: string;
  observed: string;
  mechanism: string;
  status: "VERIFIED" | "ENFORCED";
}

const LEDGER_ENTRIES: LedgerEntry[] = [
  {
    system: "SabiScore Inference Engine",
    metric: "Container Memory Envelope",
    budget: "<= 512 MB",
    observed: "384 MB Peak",
    mechanism: "Out-of-core DuckDB / Polars + Zero-Pickle Meta-Learners",
    status: "ENFORCED",
  },
  {
    system: "SabiScore FastAPI Routes",
    metric: "p99 Forecast Latency",
    budget: "<= 150 ms",
    observed: "112 ms p99",
    mechanism: "Pre-materialized Parquet views + Pydantic v2 Rust validation",
    status: "VERIFIED",
  },
  {
    system: "TaxBridge Compliance Core",
    metric: "Cross-Tenant Isolation",
    budget: "0 Leaks",
    observed: "100% RLS Scoped",
    mechanism: "PostgreSQL 15 Row-Level Security + Hash-Linked Audit Chain",
    status: "ENFORCED",
  },
  {
    system: "Hashablanca Payload Bridge",
    metric: "Cryptographic Verification",
    budget: "Deterministic",
    observed: "AES-256 + ZK Proof",
    mechanism: "Fail-closed schema & proof validation prior to state commit",
    status: "VERIFIED",
  },
];

export const ReliabilityLedger: React.FC = () => {
  return (
    <section
      id="reliability-ledger"
      aria-labelledby="ledger-heading"
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="relative overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-4 sm:p-6">
        <div
          className="absolute inset-x-0 top-0 h-px bg-illuminate-emerald"
          aria-hidden="true"
        />

        {/* Ledger Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-border pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-accent-emerald" />
            <h2
              id="ledger-heading"
              className="font-mono text-caption font-semibold uppercase tracking-telemetry text-obsidian-text"
            >
              PRODUCTION RELIABILITY &amp; CONSTRAINT LEDGER
            </h2>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-accent-cyan tabular-nums">
            <Activity className="h-3 w-3 text-accent-emerald" />
            <span>4 SUBSYSTEMS AUDITED</span>
          </span>
        </div>

        {/* Mobile Card Stack (Visible < md) */}
        <div className="space-y-3 md:hidden">
          {LEDGER_ENTRIES.map((row) => (
            <div
              key={row.system}
              className="rounded-lg border border-obsidian-border bg-obsidian-elevated p-3.5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-sans text-sm font-semibold text-obsidian-text">
                  {row.system}
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-accent-emerald/40 bg-obsidian-surface px-2 py-0.5 font-mono text-micro text-accent-emerald">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{row.status}</span>
                </span>
              </div>

              <div className="mb-2 grid grid-cols-2 gap-2 rounded border border-obsidian-border bg-obsidian-base p-2 font-mono text-micro tabular-nums">
                <div>
                  <span className="block text-obsidian-dim">BUDGET</span>
                  <span className="text-obsidian-muted">{row.budget}</span>
                </div>
                <div>
                  <span className="block text-obsidian-dim">OBSERVED</span>
                  <span className="font-semibold text-accent-cyan">
                    {row.observed}
                  </span>
                </div>
              </div>

              <p className="font-mono text-micro leading-relaxed text-obsidian-muted">
                {row.mechanism}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop Tabular Specification (Visible >= md) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left font-mono text-caption">
            <thead>
              <tr className="border-b border-obsidian-border text-micro uppercase tracking-telemetry text-obsidian-dim">
                <th className="py-2.5 pr-4 font-medium">Subsystem</th>
                <th className="px-4 py-2.5 font-medium">Budget</th>
                <th className="px-4 py-2.5 font-medium">Observed</th>
                <th className="px-4 py-2.5 font-medium">
                  Enforcement Mechanism
                </th>
                <th className="py-2.5 pl-4 text-right font-medium">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-border">
              {LEDGER_ENTRIES.map((row) => (
                <tr
                  key={row.system}
                  className="transition-colors hover:bg-obsidian-elevated/60"
                >
                  <td className="py-3 pr-4 font-sans text-sm font-medium text-obsidian-text">
                    <div>{row.system}</div>
                    <div className="font-mono text-micro text-obsidian-dim">
                      {row.metric}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-obsidian-muted tabular-nums">
                    {row.budget}
                  </td>
                  <td className="px-4 py-3 font-semibold text-accent-cyan tabular-nums">
                    {row.observed}
                  </td>
                  <td className="px-4 py-3 text-micro text-obsidian-muted">
                    {row.mechanism}
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded border border-accent-emerald/40 bg-obsidian-elevated px-2 py-0.5 text-micro text-accent-emerald">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{row.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ReliabilityLedger;
