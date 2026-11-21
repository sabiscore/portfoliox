'use client';
// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
// FIXED (v21.1): Missing <a opening tag on "View all on GitHub" footer CTA.
// Mobile-native: 52px row targets, skeleton states, graceful API failure.
// Refresh: every 5 minutes. AbortController on unmount.

import { m, useReducedMotion } from 'framer-motion';
import { Activity, FileText, GitCommit } from 'lucide-react';
import { useEffect, useState } from 'react';

import { isQualifyingCommitMessage } from '@/components/Liveactivitybar';
import { springs } from '@/lib/motionVariants';
import { formatMonthYear } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'deployment' | 'blog' | 'commit';
  title: string;
  timestamp: string;
  icon: typeof GitCommit;
  accentColor: string;
}

function getRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  const days = Math.floor(s / 86400);
  if (days < 30) return `${days}d ago`;
  // Beyond a month, an ever-growing day count ("523d ago") reads as stale next
  // to a "LIVE" badge. Fall back to the same Month/Year format used elsewhere
  // (e.g. the About section's "Updated <Month Year>" availability timestamp).
  return formatMonthYear(timestamp);
}

function SkeletonRow() {
  return (
    <div className="flex min-h-[52px] items-start gap-3 px-4 py-3" aria-hidden="true">
      <div className="bg-color-border mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded" />
      <div className="flex-1 space-y-1.5">
        <div className="bg-color-border h-3.5 w-3/4 animate-pulse rounded" />
        <div className="bg-color-border-subtle h-2.5 w-1/4 animate-pulse rounded" />
      </div>
    </div>
  );
}

export function LiveBuildFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [feedState, setFeedState] = useState<'loading' | 'done' | 'error'>('loading');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [githubRes, blogRes] = await Promise.allSettled([
          fetch('/api/activity'),
          fetch('/api/recent-blog-posts'),
        ]);

        if (cancelled) return;

        const combined: ActivityItem[] = [];
        let successfulSources = 0;

        if (githubRes.status === 'fulfilled' && githubRes.value.ok) {
          type GitHubActivity = {
            availability?: string;
            createdAt?: string;
            message?: string;
            repo?: string;
            sha?: string;
          };
          const event = (await githubRes.value.json()) as GitHubActivity;
          if (event.availability !== 'unavailable') {
            successfulSources += 1;
          }
          if (event.createdAt && event.message && isQualifyingCommitMessage(event.message)) {
            combined.push({
              id: event.sha ?? `commit-${event.createdAt}`,
              type: 'commit',
              title: event.message,
              timestamp: event.createdAt,
              icon: GitCommit,
              accentColor: 'oklch(65% 0.15 220)',
            });
          }
        }

        if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
          successfulSources += 1;
          type BlogPost = { slug: string; title: string; date: string };
          const posts = (await blogRes.value.json()) as BlogPost[];
          posts.slice(0, 2).forEach((p) =>
            combined.push({
              id: p.slug,
              type: 'blog',
              title: p.title.length > 52 ? p.title.slice(0, 52) + '…' : p.title,
              timestamp: p.date,
              icon: FileText,
              accentColor: 'oklch(72% 0.15 290)',
            })
          );
        }

        if (!cancelled) {
          if (successfulSources === 0) {
            setActivities([]);
            setFeedState('error');
            return;
          }

          setActivities(
            combined
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
          );
          setFeedState('done');
        }
      } catch {
        if (!cancelled) setFeedState('error');
      }
    }

    void fetchAll();
    const timer = setInterval(() => void fetchAll(), 300_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      className="glass-medium overflow-hidden rounded-[var(--radius-xl)]"
      aria-label="Recent engineering activity"
    >
      {/* Header */}
      <div className="border-color-border flex items-center gap-2.5 border-b px-4 py-3">
        <Activity className="h-4 w-4 shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
        <h3 className="text-color-text-primary flex-1 text-sm font-semibold">
          Recent engineering activity
        </h3>
        <span className="text-color-text-muted font-mono text-[10px] tracking-wider uppercase">
          Public record
        </span>
      </div>

      {/* Body */}
      <div className="divide-color-border-subtle divide-y">
        {feedState === 'loading' && (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        )}

        {feedState === 'error' && (
          <p className="text-color-text-muted px-4 py-4 text-sm">
            Activity feed unavailable — check back soon.
          </p>
        )}

        {feedState === 'done' && activities.length === 0 && (
          <p className="text-color-text-muted px-4 py-4 text-sm">
            No recent public activity yet. GitHub and content feeds are online.
          </p>
        )}

        {feedState === 'done' &&
          activities.map((item) => {
            const Icon = item.icon;
            return (
              <m.div
                key={item.id}
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={reducedMotion ? { duration: 0 } : springs.layout}
                className="text-color-text-secondary flex min-h-[52px] items-start gap-3 px-4 py-3"
              >
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0"
                  // eslint-disable-next-line no-restricted-syntax
                  style={{ color: item.accentColor }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-color-text-primary line-clamp-2 text-sm leading-snug">
                    {item.title}
                  </p>
                  <p className="text-color-text-muted mt-0.5 font-mono text-[10px] tracking-wide">
                    {getRelativeTime(item.timestamp)}
                  </p>
                </div>
              </m.div>
            );
          })}
      </div>

      {/* FIX v21.1: restored missing <a opening tag on footer GitHub CTA */}
      <a
        href="https://github.com/Scardubu"
        target="_blank"
        rel="noopener noreferrer"
        className="border-color-border text-color-film-teal flex min-h-[48px] items-center justify-center gap-2 border-t font-mono text-[11px] tracking-widest uppercase transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none focus-visible:ring-inset"
      >
        View all on GitHub
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
          <path d="M8 0a8 8 0 0 0-2.529 15.59c.4.074.546-.173.546-.385v-1.353c-2.221.483-2.689-.959-2.689-.959-.363-.922-.886-1.168-.886-1.168-.725-.495.055-.485.055-.485.802.056 1.225.823 1.225.823.712 1.22 1.869.868 2.325.664.072-.516.279-.868.508-1.068-1.775-.202-3.641-.888-3.641-3.952 0-.874.313-1.588.823-2.147-.082-.202-.357-1.016.078-2.117 0 0 .671-.215 2.198.82a7.657 7.657 0 0 1 2-.269 7.657 7.657 0 0 1 2 .269c1.527-1.035 2.198-.82 2.198-.82.435 1.101.16 1.915.079 2.117.51.559.822 1.273.822 2.147 0 3.072-1.869 3.748-3.65 3.946.288.248.544.737.544 1.485v2.201c0 .214.144.463.55.385A8.001 8.001 0 0 0 8 0Z" />
        </svg>
      </a>
    </div>
  );
}
