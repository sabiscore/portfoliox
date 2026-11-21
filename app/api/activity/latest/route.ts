import { NextResponse } from 'next/server';

import { isQualifyingCommitMessage, sanitizeCommitTitle } from '@/lib/activity-filter';

export const revalidate = 300;

export interface LatestActivityPayload {
  kind: 'commit' | 'status';
  repo: string;
  message: string;
  timestamp: string | null;
  url: string | null;
  source: 'github' | 'vercel-build-metadata' | 'fallback';
  commitHash: string | null;
  commitMessage: string | null;
  branch: string | null;
  committedAt: string | null;
}

interface GitHubRepoCommit {
  sha?: string;
  html_url?: string;
  commit?: {
    message?: string;
    author?: { date?: string } | null;
    committer?: { date?: string } | null;
  };
}

const GITHUB_REPOSITORY = 'sabiscore/portfoliox';
const GITHUB_COMMITS_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits?per_page=20`;

const FALLBACK_ACTIVITY: LatestActivityPayload = {
  kind: 'status',
  repo: GITHUB_REPOSITORY,
  message: 'Production build verified · UTC+1',
  timestamp: null,
  url: `https://github.com/${GITHUB_REPOSITORY}`,
  source: 'fallback',
  commitHash: null,
  commitMessage: null,
  branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  committedAt: null,
};

function normalizeIsoTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function buildVercelMetadataFallback(): LatestActivityPayload {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;
  const rawMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null;
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? null;
  const committedAt = normalizeIsoTimestamp(process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE ?? null);

  if (rawMessage && isQualifyingCommitMessage(rawMessage)) {
    const cleaned = sanitizeCommitTitle(rawMessage);
    const shortSha = sha ? sha.slice(0, 7).toUpperCase() : null;
    return {
      kind: 'commit',
      repo: GITHUB_REPOSITORY,
      message: cleaned,
      timestamp: committedAt,
      url: sha
        ? `https://github.com/${GITHUB_REPOSITORY}/commit/${sha}`
        : `https://github.com/${GITHUB_REPOSITORY}`,
      source: 'vercel-build-metadata',
      commitHash: shortSha,
      commitMessage: cleaned,
      branch,
      committedAt,
    };
  }

  return {
    ...FALLBACK_ACTIVITY,
    branch,
    commitHash: sha ? sha.slice(0, 7).toUpperCase() : null,
  };
}

export async function GET(): Promise<NextResponse<LatestActivityPayload>> {
  const cacheHeaders = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  };

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'scardubu.dev-activity-latest',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(GITHUB_COMMITS_URL, {
      headers,
      next: { revalidate },
      signal: AbortSignal.timeout(4500),
    });

    if (!response.ok) {
      return NextResponse.json(buildVercelMetadataFallback(), {
        status: 200,
        headers: cacheHeaders,
      });
    }

    const rawPayload: unknown = await response.json();
    if (!Array.isArray(rawPayload)) {
      return NextResponse.json(buildVercelMetadataFallback(), {
        status: 200,
        headers: cacheHeaders,
      });
    }

    const commits = rawPayload as GitHubRepoCommit[];

    for (const entry of commits) {
      const title = sanitizeCommitTitle(entry?.commit?.message ?? '');
      if (!isQualifyingCommitMessage(title)) continue;

      const timestamp = normalizeIsoTimestamp(
        entry.commit?.author?.date ?? entry.commit?.committer?.date ?? null
      );
      const shortSha = entry.sha ? entry.sha.slice(0, 7).toUpperCase() : null;

      return NextResponse.json(
        {
          kind: 'commit',
          repo: GITHUB_REPOSITORY,
          message: title,
          timestamp,
          url:
            entry.html_url ??
            (entry.sha
              ? `https://github.com/${GITHUB_REPOSITORY}/commit/${entry.sha}`
              : `https://github.com/${GITHUB_REPOSITORY}`),
          source: 'github',
          commitHash: shortSha,
          commitMessage: title,
          branch: process.env.VERCEL_GIT_COMMIT_REF ?? 'main',
          committedAt: timestamp,
        },
        {
          status: 200,
          headers: cacheHeaders,
        }
      );
    }

    return NextResponse.json(buildVercelMetadataFallback(), {
      status: 200,
      headers: cacheHeaders,
    });
  } catch {
    return NextResponse.json(buildVercelMetadataFallback(), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  }
}
