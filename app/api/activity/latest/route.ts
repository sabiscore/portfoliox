import { NextResponse } from 'next/server';

export interface LatestActivityApiResponse {
  commitHash: string;
  commitMessage: string;
  timestamp: string;
  branch: string;
  status: 'NOMINAL';
}

const FALLBACK_ACTIVITY_PAYLOAD: LatestActivityApiResponse = {
  commitHash: '5CE0F06',
  commitMessage: 'RELEASE-CERTIFICATION: LIQUID GLASS 2.0 TELEMETRY',
  timestamp: 'WAT (UTC+1)',
  branch: 'main',
  status: 'NOMINAL',
};

export async function GET(): Promise<NextResponse<LatestActivityApiResponse>> {
  try {
    const commitSha =
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7).toUpperCase() ??
      FALLBACK_ACTIVITY_PAYLOAD.commitHash;
    const commitMessage =
      process.env.VERCEL_GIT_COMMIT_MESSAGE?.toUpperCase() ??
      FALLBACK_ACTIVITY_PAYLOAD.commitMessage;
    const branch =
      process.env.VERCEL_GIT_COMMIT_REF ?? FALLBACK_ACTIVITY_PAYLOAD.branch;

    return NextResponse.json(
      {
        commitHash: commitSha,
        commitMessage,
        timestamp: 'WAT (UTC+1)',
        branch,
        status: 'NOMINAL',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return NextResponse.json(FALLBACK_ACTIVITY_PAYLOAD, { status: 200 });
  }
}
