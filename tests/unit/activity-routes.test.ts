import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET as getActivity } from '@/app/api/activity/route';
import { GET as getLatestActivity } from '@/app/api/activity/latest/route';

const ORIGINAL_ENV = {
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_COMMIT_MESSAGE: process.env.VERCEL_GIT_COMMIT_MESSAGE,
  VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
  VERCEL_GIT_COMMIT_AUTHOR_DATE: process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE,
};

function restoreVercelEnv(): void {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function mockJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('Activity API routes server-side filtering and resilience', () => {
  beforeEach(() => {
    delete process.env.VERCEL_GIT_COMMIT_SHA;
    delete process.env.VERCEL_GIT_COMMIT_MESSAGE;
    delete process.env.VERCEL_GIT_COMMIT_REF;
    delete process.env.VERCEL_GIT_COMMIT_AUTHOR_DATE;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    restoreVercelEnv();
  });

  it('/api/activity/latest suppresses low-signal chore commits and falls back cleanly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse([
        { sha: 'aaa1111222', commit: { message: 'Update tailwind.', author: { date: '2026-10-01T10:00:00Z' } } },
        { sha: 'bbb2222333', commit: { message: 'chore: bump lockfile', author: { date: '2026-10-01T09:00:00Z' } } },
        { sha: 'ccc3333444', commit: { message: 'fix(css): align border', author: { date: '2026-10-01T08:00:00Z' } } },
        { sha: 'ddd4444555', commit: { message: 'Update package.json', author: { date: '2026-10-01T07:00:00Z' } } },
      ])
    );

    const response = await getLatestActivity();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('s-maxage=300');

    const payload = await response.json();
    expect(payload).toMatchObject({
      kind: 'status',
      repo: 'sabiscore/portfoliox',
      message: 'Production build verified · UTC+1',
      source: 'fallback',
    });
    expect(payload.message).not.toMatch(/tailwind/i);
  });

  it('/api/activity/latest skips chore commits and returns the first qualifying engineering commit', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse([
        { sha: 'aaa1111222', commit: { message: 'Update tailwind.', author: { date: '2026-10-02T10:00:00Z' } } },
        { sha: 'bbb2222333', commit: { message: 'fix: typo in readme', author: { date: '2026-10-02T09:00:00Z' } } },
        {
          sha: 'def5678999',
          html_url: 'https://github.com/sabiscore/portfoliox/commit/def5678999',
          commit: {
            message: 'feat(api): enforce idempotent retry boundary.\n\nbody details',
            author: { date: '2026-10-02T08:30:00Z' },
          },
        },
      ])
    );

    const response = await getLatestActivity();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      kind: 'commit',
      repo: 'sabiscore/portfoliox',
      message: 'feat(api): enforce idempotent retry boundary',
      source: 'github',
      commitHash: 'DEF5678',
      url: 'https://github.com/sabiscore/portfoliox/commit/def5678999',
      timestamp: '2026-10-02T08:30:00.000Z',
    });
  });

  it('/api/activity/latest filters low-signal VERCEL_GIT_COMMIT_MESSAGE on upstream failure', async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = '1234567abcdef';
    process.env.VERCEL_GIT_COMMIT_MESSAGE = 'Update tailwind.';
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockJsonResponse({ message: 'rate limit' }, 403));

    const response = await getLatestActivity();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.kind).toBe('status');
    expect(payload.source).toBe('fallback');
    expect(payload.message).not.toMatch(/tailwind/i);
  });

  it('/api/activity/latest uses qualifying VERCEL_GIT_COMMIT_MESSAGE when GitHub fails', async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = '9876543abcdef';
    process.env.VERCEL_GIT_COMMIT_MESSAGE = 'feat(queue): isolate tenant retry dead-letter boundary';
    process.env.VERCEL_GIT_COMMIT_REF = 'main';
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('network timeout'));

    const response = await getLatestActivity();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('s-maxage=120');
    expect(payload).toMatchObject({
      kind: 'commit',
      source: 'vercel-build-metadata',
      commitHash: '9876543',
      message: 'feat(queue): isolate tenant retry dead-letter boundary',
    });
  });

  it('/api/activity/latest handles non-array JSON safely', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse({ error: 'unexpected object' }, 200)
    );

    const response = await getLatestActivity();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.kind).toBe('status');
    expect(payload.source).toBe('fallback');
  });

  it('/api/activity returns verified fallback status when all commits are chores (even with missing sha)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse([
        { commit: { message: 'Update tailwind.' } },
        { sha: 'bbb2222', commit: { message: 'chore(deps): update lockfile' } },
      ])
    );

    const response = await getActivity();
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toContain('no-store');

    const payload = await response.json();
    expect(payload).toMatchObject({
      ago: 'Verified',
      type: 'StatusEvent',
      repo: 'sabiscore/portfoliox',
      sha: 'unknown',
      message: 'Production build verified',
      availability: 'empty',
    });
  });

  it('/api/activity skips qualifying commits with missing/invalid timestamps and returns the next valid commit', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse([
        { sha: 'aaa1111', commit: { message: 'Update tailwind.', author: { date: '2026-10-02T10:00:00Z' } } },
        { sha: 'bbb2222', commit: { message: 'feat(api): add circuit breaker', author: null } },
        { sha: 'ccc3333', commit: { message: 'feat(api): bad date commit', author: { date: 'not-a-date' } } },
        {
          sha: 'ddd4444555',
          commit: {
            message: 'perf(pipeline): stream state partitions with bounded batches',
            author: { date: '2026-10-01T12:00:00Z' },
          },
        },
      ])
    );

    const response = await getActivity();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      type: 'PushEvent',
      repo: 'sabiscore/portfoliox',
      sha: 'ddd4444',
      message: 'perf(pipeline): stream state partitions with bounded batches',
      createdAt: '2026-10-01T12:00:00.000Z',
      availability: 'available',
    });
  });

  it('/api/activity handles non-array JSON and upstream failure gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      mockJsonResponse({ message: 'unexpected shape' }, 200)
    );

    const response = await getActivity();
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.availability).toBe('unavailable');
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
});
