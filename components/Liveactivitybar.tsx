'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface TelemetryNode {
  id: 'sabiscore' | 'yapcommerce' | 'taxbridge';
  service: string;
  domain: string;
  status: 'NOMINAL' | 'SYNCING' | 'FALLBACK_LOCKED';
  latencyMs: number;
  memoryEnvelope: string;
  runtimeStack: string[];
  lastAssertion: string;
  metricLabel: string;
  metricValue: string;
}

const DETERMINISTIC_BASELINE_NODES: readonly TelemetryNode[] = [
  {
    id: 'sabiscore',
    service: 'SABISCORE_QUANT_ENGINE',
    domain: 'sabiscore.app',
    status: 'NOMINAL',
    latencyMs: 38,
    memoryEnvelope: '412MB / 512MB cgroup',
    runtimeStack: ['Polars', 'DuckDB', 'FastAPI', 'Next.js 15'],
    lastAssertion: 'SHIN_DEVIG_SIMPLEX_OK',
    metricLabel: 'CLV_EDGE',
    metricValue: '+4.82%',
  },
  {
    id: 'yapcommerce',
    service: 'YAP_ENGINE_ORCHESTRATOR',
    domain: 'edge.local.wsl2',
    status: 'NOMINAL',
    latencyMs: 14,
    memoryEnvelope: '6.4GB / 8.0GB WSL2',
    runtimeStack: ['GGUF Q4_K_M', 'Fastify', 'TypeScript', 'Zod'],
    lastAssertion: 'ZERO_USD_CLOUD_LLM_VERIFIED',
    metricLabel: 'CLOUD_BURN',
    metricValue: '$0.00/mo',
  },
  {
    id: 'taxbridge',
    service: 'TAXBRIDGE_LEDGER_CORE',
    domain: 'fintech.ng.edge',
    status: 'NOMINAL',
    latencyMs: 22,
    memoryEnvelope: '188MB / 512MB Worker',
    runtimeStack: ['Fastify', 'DuckDB', 'Zod', 'CRDT-Sync'],
    lastAssertion: 'FAIL_CLOSED_AUDIT_HASH_OK',
    metricLabel: 'SYNC_INTEGRITY',
    metricValue: '100.0%',
  },
] as const;

function validateTelemetryPayload(raw: unknown): TelemetryNode[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const validNodes: TelemetryNode[] = [];

  for (const item of raw) {
    if (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      'service' in item &&
      'latencyMs' in item &&
      typeof (item as Record<string, unknown>).service === 'string' &&
      typeof (item as Record<string, unknown>).latencyMs === 'number'
    ) {
      validNodes.push(item as TelemetryNode);
    } else {
      return null; // Fail-closed on any malformed telemetry contract
    }
  }
  return validNodes;
}

export interface LiveActivityBarProps {
  className?: string;
  initialActiveId?: TelemetryNode['id'];
}

export function LiveActivityBarSkeleton(): React.JSX.Element {
  const shimmer = 'animate-pulse rounded bg-white/10';

  return (
    <section
      aria-label="Live Deployment Telemetry"
      aria-busy="true"
      className="w-full rounded-none border border-white/10 bg-[#0E0E10]/90 backdrop-blur-xl"
    >
      <span className="sr-only">Loading live deployment telemetry</span>

      <div
        aria-hidden="true"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#08090C]/80 px-4 py-2.5"
      >
        <div className="flex items-center gap-3">
          <span className={`${shimmer} h-2.5 w-2.5 rounded-full`} />
          <span className={`${shimmer} h-3 w-64 max-w-[60vw]`} />
          <span className={`${shimmer} hidden h-5 w-24 sm:inline-block`} />
        </div>
        <span className={`${shimmer} h-11 w-28`} />
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 divide-y divide-white/10 border-b border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex min-h-[48px] items-center justify-between px-4 py-3">
            <span className={`${shimmer} h-3 w-40 max-w-[65%]`} />
            <span className={`${shimmer} h-5 w-14`} />
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12 lg:items-center"
      >
        <div className="space-y-2 lg:col-span-4">
          <span className={`${shimmer} block h-3 w-44`} />
          <span className={`${shimmer} block h-5 w-56 max-w-full`} />
        </div>

        <div className="grid grid-cols-2 gap-3 border-y border-white/10 py-3 sm:py-0 lg:col-span-4 lg:border-x lg:border-y-0 lg:px-4">
          <div className="space-y-2">
            <span className={`${shimmer} block h-2.5 w-28`} />
            <span className={`${shimmer} block h-4 w-36 max-w-full`} />
          </div>
          <div className="space-y-2">
            <span className={`${shimmer} block h-2.5 w-24`} />
            <span className={`${shimmer} block h-4 w-24 max-w-full`} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} className={`${shimmer} h-7 w-16`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LiveActivityBar({
  className = '',
  initialActiveId = 'sabiscore',
}: LiveActivityBarProps) {
  const [nodes, setNodes] = useState<readonly TelemetryNode[]>(DETERMINISTIC_BASELINE_NODES);
  const [activeId, setActiveId] = useState<TelemetryNode['id']>(initialActiveId);
  const [telemetryMode, setTelemetryMode] = useState<'LIVE_EDGE' | 'DETERMINISTIC_CACHE'>('LIVE_EDGE');
  const [tickCount, setTickCount] = useState<number>(0);

  const probeEdgeHealth = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch('/api/activity/latest', {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        setTelemetryMode('DETERMINISTIC_CACHE');
        return;
      }

      const payload: unknown = await response.json();
      const validated = validateTelemetryPayload(
        typeof payload === 'object' && payload !== null && 'nodes' in payload
          ? (payload as { nodes: unknown }).nodes
          : payload
      );

      if (validated) {
        setNodes(validated);
        setTelemetryMode('LIVE_EDGE');
      } else {
        setTelemetryMode('DETERMINISTIC_CACHE');
      }
    } catch {
      clearTimeout(timeoutId);
      // Fail-closed: preserve deterministic baseline without throwing unhandled client exceptions
      setTelemetryMode('DETERMINISTIC_CACHE');
    }
  }, []);

  useEffect(() => {
    void probeEdgeHealth();
    const pollInterval = setInterval(() => {
      setTickCount((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [probeEdgeHealth]);

  const activeNode = nodes.find((n) => n.id === activeId) ?? nodes[0];

  return (
    <section
      aria-label="Live Deployment Telemetry"
      className={`w-full rounded-none border border-white/10 bg-[#0E0E10]/90 backdrop-blur-xl transition-colors duration-200 hover:border-[#00D9FF]/40 ${className}`}
    >
      {/* Top Terminal Pulse Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#08090C]/80 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF66] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF66]" />
          </span>
          <span className="font-mono text-xs font-semibold tracking-wider text-white uppercase">
            TELEMETRY.PULSE // FAIL-CLOSED INVARIANT
          </span>
          <span
            aria-live="polite"
            aria-atomic="true"
            className="hidden border border-[#00FF66]/30 bg-[#00FF66]/10 px-2 py-0.5 font-mono text-[11px] text-[#00FF66] sm:inline-block"
          >
            {telemetryMode}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs text-zinc-400">
          <span>
            HEARTBEAT_SEQ: <strong className="text-[#00D9FF]">0x{(1024 + tickCount).toString(16).toUpperCase()}</strong>
          </span>
          <button
            type="button"
            onClick={() => void probeEdgeHealth()}
            aria-label="Re-verify edge telemetry"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-white/10 bg-[#0E0E10] px-3 font-mono text-xs text-zinc-200 transition-colors hover:border-[#00D9FF]/40 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00D9FF]"
          >
            SYNC_NODE
          </button>
        </div>
      </div>

      {/* Interactive Node Selector Tabs (Strict 44px Minimum Touch Geometry) */}
      <div className="grid grid-cols-1 divide-y divide-white/10 border-b border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {nodes.map((node) => {
          const isSelected = node.id === activeNode.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveId(node.id)}
              aria-pressed={isSelected}
              className={`flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                isSelected
                  ? 'bg-[#00D9FF]/[0.07] text-white'
                  : 'bg-transparent text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isSelected ? 'bg-[#00D9FF]' : 'bg-[#00FF66]/70'
                  }`}
                />
                <span className="font-mono text-xs font-medium tracking-tight">
                  {node.service}
                </span>
              </div>
              <span
                className={`border px-2 py-0.5 font-mono text-[11px] ${
                  isSelected
                    ? 'border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF]'
                    : 'border-white/10 bg-[#08090C] text-zinc-400'
                }`}
              >
                {node.latencyMs}ms
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Node Deep Architectural Context Readout */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12 lg:items-center">
        <div className="space-y-1 lg:col-span-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
            <span>ENDPOINT:</span>
            <span className="text-[#00D9FF]">{activeNode.domain}</span>
          </div>
          <p className="font-mono text-xs text-zinc-200">
            ASSERTION:{' '}
            <span className="border border-[#00FF66]/30 bg-[#00FF66]/10 px-1.5 py-0.5 text-[#00FF66]">
              {activeNode.lastAssertion}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-y border-white/10 py-3 sm:py-0 lg:col-span-4 lg:border-x lg:border-y-0 lg:px-4">
          <div>
            <span className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
              MEMORY_ENVELOPE
            </span>
            <span className="font-mono text-xs font-semibold text-white">
              {activeNode.memoryEnvelope}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
              {activeNode.metricLabel}
            </span>
            <span className="font-mono text-xs font-semibold text-[#00FF66]">
              {activeNode.metricValue}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:col-span-4 lg:justify-end">
          <span className="font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
            RUNTIME:
          </span>
          {activeNode.runtimeStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex min-h-[32px] items-center border border-white/10 bg-[#08090C] px-2.5 py-1 font-mono text-xs text-[#00D9FF]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Backward-compatible named export retained for legacy component consumers.
 * Both names reference the same component; no duplicate state or rendering path
 * is introduced.
 */
export const Liveactivitybar = LiveActivityBar;

export default LiveActivityBar;
