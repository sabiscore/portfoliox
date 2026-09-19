import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GITHUB_REPOSITORY = 'Scardubu/oscar-portfolio-main';
const GITHUB_COMMITS_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits?per_page=1`;

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
      ago: 'Recently',
      type: 'StatusEvent',
      repo: GITHUB_REPOSITORY,
      sha: 'unknown',
      message: 'Activity feed temporarily unavailable',
      checkedAt,
    },
    status
  );
}

function trimCommitMessage(message: string): string {
  const line = message.split('\n')[0]?.trim() ?? '';

  if (!line) {
    return 'Building in production';
  }

  if (line.length <= 60) {
    return line;
  }

  return `${line.slice(0, 57)}...`;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    } | null;
    committer?: {
      date: string;
    } | null;
  };
}

export async function GET(): Promise<NextResponse> {
  const checkedAt = new Date().toISOString();

  try {
    const response = await fetch(GITHUB_COMMITS_URL, {
      cache: 'no-store',
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

    const commits = (await response.json()) as GitHubCommit[];

    if (!commits.length) {
      return jsonResponse({
        ago: 'Recently',
        type: 'StatusEvent',
        repo: GITHUB_REPOSITORY,
        sha: 'unknown',
        message: 'No recent activity found',
        checkedAt,
      });
    }

    const commit = commits[0];

    const commitDate =
      commit.commit.author?.date ??
      commit.commit.committer?.date;

    if (!commitDate) {
      throw new Error('Latest GitHub commit has no usable timestamp');
    }

    const createdAt = new Date(commitDate);

    if (Number.isNaN(createdAt.getTime())) {
      throw new Error('Latest GitHub commit has an invalid timestamp');
    }

    return jsonResponse({
      ago: formatAgo(createdAt),
      type: 'PushEvent',
      repo: GITHUB_REPOSITORY,
      sha: commit.sha.slice(0, 7),
      message: trimCommitMessage(commit.commit.message),
      checkedAt,
    });
  } catch {
    return fallbackActivity(checkedAt);
  }
}
