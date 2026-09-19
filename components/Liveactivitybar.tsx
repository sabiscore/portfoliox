'use client';

import { useEffect, useMemo, useState } from 'react';

interface ActivityData {
  ago: string;
  type: string;
  repo: string;
  sha?: string;
  message?: string;
  checkedAt?: string;
}

const ACTIVITY_REFRESH_INTERVAL = 300_000;

const FALLBACK_LOADING: ActivityData = {
  ago: 'Recently',
  type: 'PushEvent',
  repo: 'scardubu.dev',
  message: 'Checking latest activity',
};

function unavailableActivity(): ActivityData {
  return {
    ago: 'Recently',
    type: 'StatusEvent',
    repo: 'scardubu.dev',
    message: 'Activity feed temporarily unavailable',
    checkedAt: new Date().toISOString(),
  };
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    PushEvent: 'Pushed update',
    PullRequestEvent: 'Pull request',
    CreateEvent: 'Branch created',
    IssuesEvent: 'Issue activity',
  };

  return map[type] ?? 'Recent activity';
}

function formatLastChecked(checkedAt: string | undefined): string {
  if (!checkedAt) {
    return 'Checking';
  }

  const date = new Date(checkedAt);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function ActivitySkeleton() {
  return (
    <div className="flex h-6 items-center gap-2" aria-hidden="true">
      <div className="bg-color-border h-1.5 w-1.5 animate-pulse rounded-full" />
      <div className="bg-color-border h-3 w-44 animate-pulse rounded" />
    </div>
  );
}

export function LiveActivityBar() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let disposed = false;
    let controller: AbortController | null = null;

    const loadActivity = async () => {
      controller?.abort();

      const nextController = new AbortController();
      controller = nextController;

      try {
        const response = await fetch('/api/activity', {
          cache: 'no-store',
          signal: nextController.signal,
        });

        if (!response.ok) {
          throw new Error(`Activity request failed with ${response.status}`);
        }

        const data = (await response.json()) as ActivityData;

        if (!disposed && !nextController.signal.aborted) {
          setActivity(data);
        }
      } catch {
        if (!disposed && !nextController.signal.aborted) {
          setActivity(unavailableActivity());
        }
      } finally {
        if (!disposed && !nextController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadActivity();

    const refreshTimer = window.setInterval(() => {
      void loadActivity();
    }, ACTIVITY_REFRESH_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(refreshTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const safeActivity = activity ?? FALLBACK_LOADING;

  const label = useMemo(
    () => safeActivity.message ?? typeLabel(safeActivity.type),
    [safeActivity.message, safeActivity.type]
  );

  const lastCheckedLabel = formatLastChecked(safeActivity.checkedAt);

  const announcement =
    safeActivity.checkedAt === undefined
      ? `${label}. Checking latest GitHub activity.`
      : `${label}. Last checked at ${lastCheckedLabel}.`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={loading ? 'true' : 'false'}
      aria-label="Recent GitHub activity"
      className="live-bar-text flex min-h-6 items-center gap-2 overflow-hidden"
    >
      <span className="sr-only">{announcement}</span>

      {loading ? (
        <div aria-hidden="true">
          <ActivitySkeleton />
        </div>
      ) : (
        <div className="flex min-h-6 min-w-0 flex-1 items-center gap-2" aria-hidden="true">
          <span className="size-1.5 shrink-0 rounded-full bg-[var(--color-film-teal)]" />

          <span className="text-color-text-muted hidden shrink-0 font-mono text-[10px] tracking-wider uppercase sm:inline">
            Recent GitHub activity
          </span>

          {safeActivity.sha && safeActivity.sha !== 'unknown' && (
            <span className="text-color-text-muted shrink-0 font-mono text-[11px] uppercase">
              {safeActivity.sha.slice(0, 7)}
            </span>
          )}

          <span
            className="text-color-text-secondary min-w-0 flex-1 truncate text-xs leading-snug"
            title={label}
          >
            {label}
          </span>

          <span aria-hidden="true" className="text-color-border shrink-0">
            ·
          </span>

          <span className="text-color-text-muted hidden shrink-0 font-mono text-[10px] sm:inline">
            checked {lastCheckedLabel}
          </span>

          <span className="text-color-text-muted shrink-0 font-mono text-[10px] sm:hidden">
            {lastCheckedLabel}
          </span>
        </div>
      )}
    </div>
  );
}
