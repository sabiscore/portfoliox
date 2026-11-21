'use client';

import { useEffect, useState } from 'react';
import type { LatestActivityPayload } from '@/app/api/activity/latest/route';

export interface LiveActivityBarProps {
  endpoint?: string;
  fallbackLabel?: string;
  className?: string;
}

const CLIENT_LOW_SIGNAL_GUARD =
  /^(chore|style|docs|ci|wip|merge|update\s+(tailwind|css|deps|readme))\b/i;

function formatRelativeTime(isoTimestamp: string | null): string | null {
  if (!isoTimestamp) return null;
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) return null;

  const diffSeconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (diffSeconds < 3600) {
    const minutes = Math.max(1, Math.floor(diffSeconds / 60));
    return `${minutes}m ago`;
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffSeconds / 86400);
  return `${days}d ago`;
}

export function LiveActivityBar({
  endpoint = '/api/activity/latest',
  fallbackLabel = 'Production systems online · UTC+1',
  className = '',
}: LiveActivityBarProps) {
  const [activity, setActivity] = useState<LatestActivityPayload | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLatestActivity() {
      try {
        const res = await fetch(endpoint, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) return;

        const data = (await res.json()) as LatestActivityPayload;
        if (!data?.message || CLIENT_LOW_SIGNAL_GUARD.test(data.message)) {
          return;
        }
        setActivity(data);
      } catch {
        // Silent fail-closed: keep clean static operational fallback
      }
    }

    void loadLatestActivity();
    return () => controller.abort();
  }, [endpoint]);

  const displayMessage = activity?.message ?? fallbackLabel;
  const repoShortName = activity?.repo?.split('/').pop();
  const relativeTime = formatRelativeTime(activity?.timestamp ?? null);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-11 flex-wrap items-center gap-x-2.5 gap-y-1 rounded-lg border border-white/10 bg-zinc-950/80 px-3.5 py-2 font-mono text-xs text-zinc-300 ${className}`}
    >
      <span className="inline-flex items-center gap-2 text-emerald-300">
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 rounded-full bg-emerald-400"
        />
        <span className="uppercase tracking-wider">
          {activity?.kind === 'commit' ? 'Recent Ship' : 'System Status'}
        </span>
      </span>

      <span aria-hidden="true" className="text-zinc-600">
        /
      </span>

      {activity?.url && activity.kind === 'commit' ? (
        <a
          href={activity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 truncate text-zinc-200 underline-offset-4 transition-colors duration-200 hover:text-cyan-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
        >
          {repoShortName ? `${repoShortName}: ` : ''}
          {displayMessage}
        </a>
      ) : (
        <span className="min-w-0 truncate text-zinc-300">{displayMessage}</span>
      )}

      {relativeTime && (
        <span className="ml-auto shrink-0 tabular-nums text-zinc-500">
          {relativeTime}
        </span>
      )}
    </div>
  );
}

export default LiveActivityBar;
