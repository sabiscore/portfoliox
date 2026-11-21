import { NextResponse } from 'next/server';

import { isQualifyingCommitMessage, sanitizeCommitTitle } from '@/lib/activity-filter';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GITHUB_REPOSITORY = 'sabiscore/portfoliox';
const GITHUB_COMMITS_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits?per_page=20`;

const NO_STORE_HEADERS = {
  'Cache-Control': 'private, no-store, no-cache, max-age=0, must-revalidate',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
  'Surrogate-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

function jsonResponse(
  data: Record<string, string>,
  status = 200
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function formatAgo(createdAt: Date): string {
  const diffMilliseconds = Date.now() - createdAt.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMilliseconds / 60_000));

  if (diffMinutes < 2) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function fallbackActivity(checkedAt: string, status = 200): NextResponse {
  return jsonResponse(
    {
      ago: 'Unavailable',
      type: 'StatusEvent',
      repo: GITHUB_REPOSITORY,
      sha: 'unknown',
      message: 'Activity feed temporarily unavailable',
      checkedAt,
      availability: 'unavailable',
    },
    status
  );
}

function trimCommitMessage(message: string): string {
  const line = sanitizeCommitTitle(message);

  if (!line) {
    return 'Production build verified';
  }

  if (line.length <= 60) {
    return line;
  }

  return `${line.slice(0, 57)}...`;
}

interface GitHubCommit {
  sha?: string;
  commit?: {
    message?: string;
    author?: {
      date?: string;
    } | null;
    committer?: {
      date?: string;
    } | null;
  };
}

function resolveValidCommitDate(entry: GitHubCommit): Date | null {
  const commitDate = entry.commit?.author?.date ?? entry.commit?.committer?.date;
  if (!commitDate) return null;
  const parsed = new Date(commitDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function GET(): Promise<NextResponse> {
  const checkedAt = new Date().toISOString();

  try {
    const response = await fetch(GITHUB_COMMITS_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4500),
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'scardubu.dev-activity-feed',
        ...(process.env.GITHUB_TOKEN
          ? {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            }
          : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const rawPayload: unknown = await response.json();
    if (!Array.isArray(rawPayload)) {
      throw new Error('GitHub commits response was not an array');
    }

    const commits = rawPayload as GitHubCommit[];

    if (!commits.length) {
      return jsonResponse({
        ago: 'Unavailable',
        type: 'StatusEvent',
        repo: GITHUB_REPOSITORY,
        sha: 'unknown',
        message: 'No public commits were returned for this repository',
        checkedAt,
        availability: 'empty',
      });
    }

    let matchedCommit: { sha: string; message: string; createdAt: Date } | null = null;
    for (const entry of commits) {
      const rawMessage = entry?.commit?.message ?? '';
      if (!isQualifyingCommitMessage(rawMessage)) continue;
      const createdAt = resolveValidCommitDate(entry);
      if (!createdAt) continue;

      matchedCommit = {
        sha: entry.sha ? entry.sha.slice(0, 7) : 'unknown',
        message: rawMessage,
        createdAt,
      };
      break;
    }

    if (!matchedCommit) {
      return jsonResponse({
        ago: 'Verified',
        type: 'StatusEvent',
        repo: GITHUB_REPOSITORY,
        sha: commits[0]?.sha ? commits[0].sha.slice(0, 7) : 'unknown',
        message: 'Production build verified',
        checkedAt,
        availability: 'empty',
      });
    }

    return jsonResponse({
      ago: formatAgo(matchedCommit.createdAt),
      type: 'PushEvent',
      repo: GITHUB_REPOSITORY,
      sha: matchedCommit.sha,
      message: trimCommitMessage(matchedCommit.message),
      createdAt: matchedCommit.createdAt.toISOString(),
      checkedAt,
      availability: 'available',
    });
  } catch {
    return fallbackActivity(checkedAt);
  }
}
