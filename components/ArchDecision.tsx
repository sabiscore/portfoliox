import React from "react";
import { Cpu, ShieldAlert, CheckCircle2, Scale } from "lucide-react";

export interface ArchDecisionProps {
  id?: string;
  title: string;
  status?: "ACCEPTED" | "ENFORCED" | "SUPERSEDED";
  context: string;
  decision: string;
  tradeoffs: string;
  consequences: string;
}

export const ArchDecision: React.FC<ArchDecisionProps> = ({
  id = "ADR-01",
  title,
  status = "ENFORCED",
  context,
  decision,
  tradeoffs,
  consequences,
}) => {
  return (
    <aside
      aria-label={`Architecture Decision Record: ${title}`}
      className="my-6 overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-4 sm:p-6"
    >
      {/* Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-elevated px-2 py-0.5 font-mono text-micro text-accent-cyan">
            <Cpu className="h-3 w-3" />
            <span>{id}</span>
          </span>
          <h4 className="font-sans text-base font-bold text-obsidian-text sm:text-lg">
            {title}
          </h4>
        </div>

        <span className="inline-flex items-center gap-1 rounded border border-accent-emerald/40 bg-obsidian-elevated px-2.5 py-0.5 font-mono text-micro text-accent-emerald">
          <CheckCircle2 className="h-3 w-3" />
          <span>{status}</span>
        </span>
      </div>

      {/* 2x2 Specification Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-obsidian-border bg-obsidian-elevated p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
            <ShieldAlert className="h-3.5 w-3.5 text-accent-cyan" />
            <span>Constraint &amp; Context</span>
          </div>
          <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
            {context}
          </p>
        </div>

        <div className="rounded-lg border border-obsidian-border bg-obsidian-elevated p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
            <Cpu className="h-3.5 w-3.5 text-accent-emerald" />
            <span>Architectural Decision</span>
          </div>
          <p className="font-sans text-caption leading-relaxed text-obsidian-text">
            {decision}
          </p>
        </div>

        <div className="rounded-lg border border-obsidian-border bg-obsidian-base p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
            <Scale className="h-3.5 w-3.5 text-accent-cyan" />
            <span>Explicit Trade-Offs</span>
          </div>
          <p className="font-sans text-caption leading-relaxed text-obsidian-muted">
            {tradeoffs}
          </p>
        </div>

        <div className="rounded-lg border border-obsidian-border bg-obsidian-base p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-micro uppercase tracking-telemetry text-accent-emerald">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Production Evidence</span>
          </div>
          <p className="font-mono text-micro leading-relaxed text-obsidian-text">
            {consequences}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ArchDecision;
