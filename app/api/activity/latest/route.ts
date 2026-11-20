import { NextResponse } from 'next/server';

export interface LatestActivityApiResponse {
  commitHash: string | null;
  commitMessage: string | null;
  branch: string | null;
  committedAt: string | null;
  source: 'vercel-build-metadata' | 'unavailable';
}

export function GET(): NextResponse<LatestActivityApiResponse> {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? null;
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? null;
  const committedAt = process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE ?? null;
  const hasBuildMetadata = Boolean(sha || message || branch);

  return NextResponse.json(
    {
      commitHash: sha ? sha.slice(0, 7).toUpperCase() : null,
      commitMessage: message,
      branch,
      committedAt,
      source: hasBuildMetadata ? 'vercel-build-metadata' : 'unavailable',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
