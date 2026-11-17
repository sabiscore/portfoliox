import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface GitHubUserResponse {
  public_repos?: number;
  followers?: number;
}

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionsResponse {
  totalContributions?: number;
  contributions?: ContributionDay[];
}

type GitHubStatsPayload = {
  publicRepos: number | null;
  followers: number | null;
  currentYearContributions: number | null;
  availability: 'complete' | 'partial' | 'unavailable';
};

export async function GET(): Promise<NextResponse<GitHubStatsPayload>> {
  const [userResult, contributionsResult] = await Promise.allSettled([
    fetch('https://api.github.com/users/Scardubu', {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600, tags: ['github-user'] },
      signal: AbortSignal.timeout(5000),
    }).then(async (response) => {
      if (!response.ok) throw new Error(`GitHub profile request failed: ${response.status}`);
      return (await response.json()) as GitHubUserResponse;
    }),
    fetch('https://github-contributions-api.deno.dev/Scardubu.json', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600, tags: ['github-contributions'] },
      signal: AbortSignal.timeout(5000),
    }).then(async (response) => {
      if (!response.ok) throw new Error(`Contribution request failed: ${response.status}`);
      return (await response.json()) as ContributionsResponse;
    }),
  ]);

  const user = userResult.status === 'fulfilled' ? userResult.value : null;
  const contributionData =
    contributionsResult.status === 'fulfilled' ? contributionsResult.value : null;
  const currentYear = new Date().getFullYear();

  const currentYearContributions = Array.isArray(contributionData?.contributions)
    ? contributionData.contributions.reduce((sum, day) => {
        const year = new Date(day.date).getFullYear();
        return year === currentYear && Number.isFinite(day.count) ? sum + day.count : sum;
      }, 0)
    : contributionData?.totalContributions ?? null;

  const values = {
    publicRepos:
      typeof user?.public_repos === 'number' && Number.isFinite(user.public_repos)
        ? user.public_repos
        : null,
    followers:
      typeof user?.followers === 'number' && Number.isFinite(user.followers)
        ? user.followers
        : null,
    currentYearContributions,
  };
  const availableCount = Object.values(values).filter((value) => value !== null).length;
  const payload: GitHubStatsPayload = {
    ...values,
    availability:
      availableCount === 3 ? 'complete' : availableCount > 0 ? 'partial' : 'unavailable',
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control':
        payload.availability === 'complete'
          ? 'public, s-maxage=3600, stale-while-revalidate=300'
          : 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
