"use client";

import React, { useEffect, useState } from "react";
import { GitCommit, Activity } from "lucide-react";

export interface ActivityPayload {
  sha: string;
  message: string;
  timestamp: string;
  repo?: string;
}

export interface LiveActivityBarProps {
  initialData?: ActivityPayload;
}

const DEFAULT_ACTIVITY: ActivityPayload = {
  sha: "02A4B84",
  message: "feat(pipeline): enforce deterministic contract validation",
  timestamp: "21:28",
  repo: "scardubu/portfoliox",
};

export const Liveactivitybar: React.FC<LiveActivityBarProps> = ({
  initialData = DEFAULT_ACTIVITY,
}) => {
  const [activity, setActivity] = useState<ActivityPayload>(initialData);

  useEffect(() => {
    let mounted = true;

    async function fetchLatestCommit() {
      try {
        const res = await fetch("/api/activity/latest", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data?.sha) {
          setActivity({
            sha: String(data.sha).slice(0, 7).toUpperCase(),
            message: String(data.message || DEFAULT_ACTIVITY.message)
              .split("\n")[0]
              .trim(),
            timestamp: String(data.timestamp || DEFAULT_ACTIVITY.timestamp),
            repo: data.repo,
          });
        }
      } catch {
        // Fail-closed fallback to deterministic initialData
      }
    }

    fetchLatestCommit();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      role="status"
      aria-label="Latest production commit telemetry"
      className="relative overflow-hidden rounded-lg border border-obsidian-border bg-obsidian-surface px-3.5 py-2.5"
    >
      {/* Subtle Top Border Illumination */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-illuminate-cyan opacity-40"
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-caption">
        {/* Left: Status Pulse + Commit SHA */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-accent-cyan"
            aria-hidden="true"
          />

          <span className="inline-flex shrink-0 items-center gap-1 rounded border border-obsidian-border bg-obsidian-elevated px-1.5 py-0.5 text-micro font-medium text-accent-cyan">
            <GitCommit className="h-3 w-3" />
            <span>{activity.sha}</span>
          </span>

          <span className="truncate text-obsidian-muted" title={activity.message}>
            {activity.message}
          </span>
        </div>

        {/* Right: Timestamp */}
        <div className="flex shrink-0 items-center gap-1.5 text-micro text-obsidian-dim tabular-nums">
          <Activity className="h-3 w-3 text-accent-emerald" aria-hidden="true" />
          <span>{activity.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default Liveactivitybar;
