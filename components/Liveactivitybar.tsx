'use client';

import type { JSX } from 'react';
import { useState } from 'react';

export {
  isQualifyingCommitMessage,
  LOW_SIGNAL_COMMIT_PATTERN,
  LOW_SIGNAL_COMMIT_PATTERNS,
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
      className="bg-obsidian-surface/90 w-full border border-white/10 p-5"
    >
      <span className="sr-only">Loading project architecture index</span>
      <div aria-hidden="true" className="animate-pulse space-y-4">
        <div className="h-3 w-52 bg-white/10" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="h-12 border border-white/10 bg-white/5" />
          <div className="h-12 border border-white/10 bg-white/5" />
          <div className="h-12 border border-white/10 bg-white/5" />
        </div>
        <div className="h-24 border border-white/10 bg-white/5" />
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
      className={`bg-obsidian-surface/95 hover:border-accent-cyan/40 w-full border border-white/10 transition-colors duration-200 ${className}`}
    >
      <header className="bg-obsidian-base/80 flex flex-col gap-2 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <p className="text-2xs tracking-section text-accent-cyan font-mono font-semibold uppercase">
            Architecture index
          </p>
          <h2
            id="architecture-index-heading"
            className="font-display mt-1 text-lg font-semibold text-white sm:text-xl"
          >
            Systems, constraints, and implementation choices
          </h2>
        </div>
        <p className="max-w-prose text-xs leading-5 text-zinc-400">
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
              className={`min-h-tab focus-visible:ring-accent-cyan flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset ${
                selected
                  ? 'bg-accent-cyan/10 text-white'
                  : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="text-2xs text-accent-cyan/80 font-mono">0{index + 1}</span>
                <span className="truncate font-mono text-xs font-semibold tracking-wide uppercase">
                  {node.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${selected ? 'bg-accent-cyan' : 'bg-white/20'}`}
              />
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="activity-detail-grid grid gap-5 p-4 sm:p-5"
      >
        <div className="min-w-0">
          <p className="text-2xs tracking-kicker text-accent-cyan font-mono font-semibold uppercase">
            {activeNode.discipline}
          </p>
          <h3 className="font-display mt-2 text-xl font-bold text-white">{activeNode.title}</h3>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-2xs font-mono tracking-wider text-zinc-400 uppercase">
                Engineering constraint
              </p>
              <p className="mt-1 max-w-prose text-sm leading-6 text-zinc-300">
                {activeNode.designConstraint}
              </p>
            </div>
            <div>
              <p className="text-2xs font-mono tracking-wider text-zinc-400 uppercase">
                Architectural approach
              </p>
              <p className="mt-1 max-w-prose text-sm leading-6 text-zinc-300">
                {activeNode.architectureSummary}
              </p>
            </div>
            <p className="border-accent-cyan/50 border-l-2 pl-3 text-xs leading-5 text-zinc-400">
              Evidence boundary: {activeNode.evidenceBoundary}
            </p>
          </div>
        </div>

        <aside className="border-t border-white/10 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
          <p className="text-2xs tracking-kicker font-mono font-semibold text-zinc-400 uppercase">
            Runtime and data stack
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {activeNode.runtimeStack.map((technology) => (
              <li
                key={technology}
                className="min-h-chip bg-obsidian-base text-micro inline-flex items-center border border-white/10 px-2.5 py-1 font-mono text-zinc-300"
              >
                {technology}
              </li>
            ))}
          </ul>
          <a
            href={`/work/${activeNode.id === 'yapcommerce' ? 'yap-engine' : activeNode.id}`}
            className="min-h-touch border-accent-cyan/40 bg-accent-cyan/10 text-micro text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan hover:text-obsidian-base focus-visible:ring-accent-cyan mt-5 inline-flex w-full items-center justify-between border px-3.5 py-2.5 font-mono font-semibold tracking-wider transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
