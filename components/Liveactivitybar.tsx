'use client';

import type { JSX } from 'react';
import { useState } from 'react';

export {
  LOW_SIGNAL_COMMIT_PATTERN,
  LOW_SIGNAL_COMMIT_PATTERNS,
  isQualifyingCommitMessage,
  sanitizeCommitTitle,
} from '@/lib/activity-filter';

export type ArchitectureNodeId = 'sabiscore' | 'yapcommerce' | 'taxbridge';

export interface ArchitectureNode {
  id: ArchitectureNodeId;
  title: string;
  discipline: string;
  designConstraint: string;
  architectureSummary: string;
  evidenceBoundary: string;
  runtimeStack: readonly string[];
}

export type TelemetryNode = ArchitectureNode;

const ARCHITECTURE_NODES: readonly ArchitectureNode[] = [
  {
    id: 'sabiscore',
    title: 'SabiScore',
    discipline: 'Quantitative forecasting · ML platform',
    designConstraint:
      'Analytical workloads must remain understandable when data volume, model quality, or upstream feeds change.',
    architectureSummary:
      'The project record describes out-of-core feature processing, ensemble model evaluation, market de-vigging, version-aware caching, and an explicit lower-confidence fallback path.',
    evidenceBoundary:
      'Public product demo. Private uptime and latency artifacts are not presented as public benchmarks.',
    runtimeStack: ['Python', 'FastAPI', 'Polars', 'DuckDB', 'PostgreSQL', 'Redis', 'Next.js'],
  },
  {
    id: 'yapcommerce',
    title: 'Yap Engine',
    discipline: 'AI workflows · Media orchestration',
    designConstraint:
      'Multi-stage generation can be interrupted by provider limits, worker restarts, and constrained CPU or memory.',
    architectureSummary:
      'The architecture uses stage-level checkpoints, content-addressed inputs, local model routing, bounded provider fallbacks, and deterministic media assembly.',
    evidenceBoundary:
      'Public architecture and source record. No throughput or production latency SLO is claimed here.',
    runtimeStack: ['Python', 'TypeScript', 'Fastify', 'GGUF', 'Kokoro TTS', 'Redis'],
  },
  {
    id: 'taxbridge',
    title: 'TaxBridge',
    discipline: 'Fintech · Fiscal compliance',
    designConstraint:
      'Tax workflows must preserve tenant context and retry safety across unreliable networks and external fiscalization dependencies.',
    architectureSummary:
      'The implementation direction combines PostgreSQL row-level security, idempotent background jobs, append-oriented audit records, and offline-first mobile synchronization.',
    evidenceBoundary:
      'Active build. NRS DigiTax integration and tenant-policy validation remain in progress.',
    runtimeStack: ['Fastify', 'PostgreSQL', 'Redis', 'BullMQ', 'Expo', 'SQLite', 'TypeScript'],
  },
] as const;

export interface LiveActivityBarProps {
  className?: string;
  initialActiveId?: ArchitectureNodeId;
}

export function LiveActivityBarSkeleton(): JSX.Element {
  return (
    <section
      aria-label="Project architecture index loading"
      aria-busy="true"
      className="w-full border border-white/10 bg-[#0E0E10]/90 p-5"
    >
      <span className="sr-only">Loading project architecture index</span>
      <div aria-hidden="true" className="animate-pulse space-y-4">
        <div className="h-3 w-52 rounded bg-white/10" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="h-12 rounded border border-white/10 bg-white/[0.03]" />
          <div className="h-12 rounded border border-white/10 bg-white/[0.03]" />
          <div className="h-12 rounded border border-white/10 bg-white/[0.03]" />
        </div>
        <div className="h-24 rounded border border-white/10 bg-white/[0.03]" />
      </div>
    </section>
  );
}

export function LiveActivityBar({
  className = '',
  initialActiveId = 'sabiscore',
}: LiveActivityBarProps): JSX.Element {
  const [activeId, setActiveId] = useState<ArchitectureNodeId>(initialActiveId);
  const activeNode =
    ARCHITECTURE_NODES.find((node) => node.id === activeId) ?? ARCHITECTURE_NODES[0];

  return (
    <section
      aria-labelledby="architecture-index-heading"
      className={`w-full border border-white/10 bg-[#0E0E10]/95 transition-colors duration-200 hover:border-[#00D9FF]/30 ${className}`}
    >
      <header className="flex flex-col gap-2 border-b border-white/10 bg-[#08090C]/80 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00D9FF]">
            Architecture index
          </p>
          <h2
            id="architecture-index-heading"
            className="mt-1 font-display text-lg font-semibold text-white sm:text-xl"
          >
            Systems, constraints, and implementation choices
          </h2>
        </div>
        <p className="max-w-md text-xs leading-5 text-zinc-500">
          Project snapshots from the written engineering record — not a live production monitor.
        </p>
      </header>

      <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ARCHITECTURE_NODES.map((node, index) => {
          const selected = node.id === activeNode.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveId(node.id)}
              aria-pressed={selected}
              className={`flex min-h-[52px] items-center justify-between gap-3 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00D9FF] ${
                selected
                  ? 'bg-[#00D9FF]/[0.07] text-white'
                  : 'bg-transparent text-zinc-400 hover:bg-white/[0.025] hover:text-zinc-200'
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="font-mono text-[10px] text-[#00D9FF]/70">
                  0{index + 1}
                </span>
                <span className="truncate font-mono text-xs font-semibold uppercase tracking-wide">
                  {node.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${selected ? 'bg-[#00D9FF]' : 'bg-white/20'}`}
              />
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)]"
      >
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#00D9FF]">
            {activeNode.discipline}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-white">{activeNode.title}</h3>

          <div className="mt-4 space-y-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Engineering constraint
              </p>
              <p className="mt-1 max-w-[72ch] text-sm leading-6 text-zinc-300">
                {activeNode.designConstraint}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Architectural approach
              </p>
              <p className="mt-1 max-w-[72ch] text-sm leading-6 text-zinc-300">
                {activeNode.architectureSummary}
              </p>
            </div>
            <p className="border-l-2 border-[#00D9FF]/50 pl-3 text-xs leading-5 text-zinc-400">
              Evidence boundary: {activeNode.evidenceBoundary}
            </p>
          </div>
        </div>

        <aside className="border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Runtime and data stack
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {activeNode.runtimeStack.map((technology) => (
              <li
                key={technology}
                className="inline-flex min-h-[30px] items-center border border-white/10 bg-[#08090C] px-2.5 py-1 font-mono text-[11px] text-zinc-300"
              >
                {technology}
              </li>
            ))}
          </ul>
          <a
            href={`/work/${activeNode.id === 'yapcommerce' ? 'yap-engine' : activeNode.id}`}
            className="mt-5 inline-flex min-h-[44px] w-full items-center justify-between border border-[#00D9FF]/35 bg-[#00D9FF]/[0.06] px-3.5 py-2.5 font-mono text-[11px] font-semibold tracking-wider text-[#00D9FF] transition-colors hover:bg-[#00D9FF]/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            <span>OPEN PROJECT RECORD</span>
            <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </section>
  );
}

export const Liveactivitybar = LiveActivityBar;
export default LiveActivityBar;
