'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

export interface TelemetryNode {
  id: string;
  system: string;
  domain: string;
  runtime: string;
  metricLabel: string;
  metricValue: string;
  status: 'NOMINAL' | 'DETERMINISTIC' | 'SYNCED';
  href: string;
}

export interface LiveActivityPayload {
  commitHash: string;
  commitMessage: string;
  timestamp: string;
  branch: string;
}

const DEFAULT_TELEMETRY_NODES: ReadonlyArray<TelemetryNode> = [
  {
    id: 'sabiscore',
    system: 'SABISCORE.APP',
    domain: 'QUANT ML ENSEMBLE',
    runtime: 'Polars + DuckDB + CatBoost',
    metricLabel: 'BRIER / ECE',
    metricValue: '0.184 · <1.2GB RAM',
    status: 'NOMINAL',
    href: '/work/sabiscore',
  },
  {
    id: 'yapcommerce',
    system: 'YAPCOMMERCE',
    domain: 'EDGE ASR COMMERCE',
    runtime: 'faster-whisper INT8 + Local GGUF',
    metricLabel: 'CLOUD LLM SPEND',
    metricValue: '$0.00 / TURN',
    status: 'DETERMINISTIC',
    href: '/work/yap-engine',
  },
  {
    id: 'taxbridge',
    system: 'TAXBRIDGE',
    domain: 'NRS B2C COMPLIANCE',
    runtime: 'Fastify 5 + PG15 RLS + BullMQ',
    metricLabel: 'IDEMPOTENCY',
    metricValue: 'FAIL-CLOSED · 100%',
    status: 'SYNCED',
    href: '/work/taxbridge',
  },
];

export function LiveActivityBarSkeleton(): React.JSX.Element {
  return (
    <div
      role="status"
      aria-label="Loading live system telemetry"
      className="w-full min-h-[44px] rounded-none border border-white/10 bg-[#0E0E10]/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#00FF66]/40 animate-pulse" />
        <span className="font-mono text-xs uppercase tracking-widest text-white/50">
          INIT_TELEMETRY_STREAM...
        </span>
      </div>
      <span className="font-mono text-xs text-[#00D9FF]/60">5CE0F06 · WAT</span>
    </div>
  );
}

export interface LiveActivityBarProps {
  initialCommit?: LiveActivityPayload;
  className?: string;
}

export function LiveActivityBar({
  initialCommit,
  className = '',
}: LiveActivityBarProps): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [commitData, setCommitData] = useState<LiveActivityPayload>(
    initialCommit ?? {
      commitHash: '5CE0F06',
      commitMessage: 'RELEASE-CERTIFICATION: LIQUID GLASS 2.0 TELEMETRY',
      timestamp: 'WAT (UTC+1)',
      branch: 'main',
    }
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchLatestActivity(): Promise<void> {
      try {
        const res = await fetch('/api/activity/latest', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const data: unknown = await res.json();
        if (
          isMounted &&
          typeof data === 'object' &&
          data !== null &&
          'commitHash' in data &&
          typeof (data as { commitHash: unknown }).commitHash === 'string'
        ) {
          const typed = data as Partial<LiveActivityPayload>;
          setCommitData((prev) => ({
            commitHash: typed.commitHash ?? prev.commitHash,
            commitMessage: typed.commitMessage ?? prev.commitMessage,
            timestamp: typed.timestamp ?? prev.timestamp,
            branch: typed.branch ?? prev.branch,
          }));
        }
      } catch {
        // Fail-closed: retain deterministic initial commit snapshot without throwing
      }
    }

    void fetchLatestActivity();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEFAULT_TELEMETRY_NODES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleCycleNode = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % DEFAULT_TELEMETRY_NODES.length);
  }, []);

  const currentNode =
    DEFAULT_TELEMETRY_NODES[activeIndex] ?? DEFAULT_TELEMETRY_NODES[0];

  return (
    <aside
      aria-label="Live production telemetry and deployment health"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-full border border-white/10 hover:border-[#00D9FF]/40 bg-[#0E0E10]/90 backdrop-blur-xl transition-colors duration-200 ${className}`}
    >
      {/* Top Bar: Commit Ledger & Deterministic Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3.5 py-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF66]" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00FF66] shrink-0">
            SYS_ONLINE
          </span>
          <span className="text-white/20 font-mono text-xs" aria-hidden="true">
            /
          </span>
          <span className="font-mono text-xs font-medium text-[#00D9FF] shrink-0">
            {commitData.commitHash}
          </span>
          <span className="font-mono text-xs text-white/70 truncate max-w-[200px] sm:max-w-[360px]">
            {commitData.commitMessage}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">
            {commitData.branch} · {commitData.timestamp}
          </span>
        </div>
      </div>

      {/* Bottom Interactive Telemetry Switcher: Enforces 44px high-glare touch geometry */}
      <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
        <div className="sm:col-span-8 flex items-center justify-between gap-3 px-3.5 py-2.5 min-h-[44px]">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="inline-flex items-center border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#00D9FF]">
              {currentNode.system}
            </span>
            <span className="font-mono text-xs text-white/80 truncate">
              {currentNode.runtime}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
              {currentNode.metricLabel}:
            </span>
            <span className="font-mono text-xs font-semibold text-[#00FF66]">
              {currentNode.metricValue}
            </span>
          </div>
        </div>

        {/* High-Glare 44px Touch Controls */}
        <div className="sm:col-span-4 flex items-center justify-end border-t sm:border-t-0 sm:border-l border-white/10 divide-x divide-white/10">
          <button
            type="button"
            onClick={handleCycleNode}
            aria-label="Cycle active deployment telemetry node"
            className="min-h-[44px] min-w-[44px] flex-1 sm:flex-initial px-3.5 inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-white/80 hover:text-[#00D9FF] hover:bg-white/[0.03] active:bg-white/[0.06] transition-colors"
          >
            <span>NODE {activeIndex + 1}/{DEFAULT_TELEMETRY_NODES.length}</span>
            <span className="text-[#00D9FF]" aria-hidden="true">
              ↻
            </span>
          </button>

          <Link
            href={currentNode.href}
            className="min-h-[44px] min-w-[44px] flex-1 sm:flex-initial px-4 inline-flex items-center justify-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#00D9FF] hover:bg-[#00D9FF]/10 active:bg-[#00D9FF]/20 transition-colors"
          >
            <span>INSPECT</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

/**
 * Explicit alias & default export to guarantee deterministic resolution
 * across both `mod.LiveActivityBar` and `mod.Liveactivitybar` imports.
 */
export const Liveactivitybar = LiveActivityBar;
export default LiveActivityBar;
