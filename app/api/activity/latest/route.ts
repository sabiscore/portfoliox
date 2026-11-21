import { NextResponse } from 'next/server';

export const revalidate = 300;

export interface LatestActivityPayload {
  kind: 'commit' | 'status';
  repo: string;
  message: string;
  timestamp: string | null;
  url: string | null;
  source: 'github' | 'fallback';
}

interface GitHubPushEvent {
  type?: string;
  created_at?: string;
  repo?: { name?: string };
  payload?: {
    commits?: Array<{
      sha?: string;
      message?: string;
    }>;
  };
}

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? 'scardubz';

const LOW_SIGNAL_COMMIT_PATTERNS: readonly RegExp[] = [
  /^(chore|style|docs|ci|build|wip|merge|format|lint|bump)\b/i,
  /^update\s+(tailwind|css|styles?|deps|dependencies|readme|lockfile|packages?|config)\b/i,
  /^fix\s+(typo|formatting|lint|css|whitespace)\b/i,
  /^merge\s+(pull request|branch|remote-tracking)\b/i,
  /^initial\s+commit$/i,
];

const FALLBACK_ACTIVITY: LatestActivityPayload = {
  kind: 'status',
  repo: 'sabiscore/portfoliox',
  message: 'Production systems online · UTC+1',
  timestamp: null,
  url: `https://github.com/${GITHUB_USERNAME}`,
  source: 'fallback',
};

function sanitizeCommitTitle(rawMessage: string): string {
  return rawMessage.split('\n')[0]?.trim().replace(/\.+$/, '') ?? '';
}

function isHighSignalCommit(message: string): boolean {
  const cleaned = sanitizeCommitTitle(message);
  if (cleaned.length < 12) return false;
  return !LOW_SIGNAL_COMMIT_PATTERNS.some((pattern) => pattern.test(cleaned));
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'scardubu-portfolio-activity',
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/events/public?per_page=30`,
      {
        headers,
        next: { revalidate },
        signal: AbortSignal.timeout(4500),
      },
    );

    if (!response.ok) {
      return NextResponse.json(FALLBACK_ACTIVITY, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    const events = (await response.json()) as GitHubPushEvent[];

    for (const event of events) {
      if (event.type !== 'PushEvent' || !event.payload?.commits?.length) {
        continue;
      }

      const repoName = event.repo?.name ?? '';
      const commits = [...event.payload.commits].reverse();

      for (const commit of commits) {
        const title = sanitizeCommitTitle(commit.message ?? '');
        if (!isHighSignalCommit(title)) continue;

        const payload: LatestActivityPayload = {
          kind: 'commit',
          repo: repoName,
          message: title,
          timestamp: event.created_at ?? null,
          url:
            repoName && commit.sha
              ? `https://github.com/${repoName}/commit/${commit.sha}`
              : repoName
                ? `https://github.com/${repoName}`
                : null,
          source: 'github',
        };

        return NextResponse.json(payload, {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        });
      }
    }

    return NextResponse.json(FALLBACK_ACTIVITY, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json(FALLBACK_ACTIVITY, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
      },
    });
  }
}
