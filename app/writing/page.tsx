import type { Metadata } from 'next';
import Link from 'next/link';
// TODO(wire-existing): Confirm canonical blog loader among app/lib/blog.ts, lib/blog.ts, or lib/writing.ts
import { getAllWritingPosts } from '@/lib/writing';

export const metadata: Metadata = {
  // Root layout.tsx template appends " · Oscar Ndugbu" automatically.
  title: 'Writing',
  description:
    'Engineering notes on distributed reliability, quantitative ML calibration, compliance architecture, and production systems.',
  alternates: {
    canonical: '/writing',
  },
};

export interface WritingPostMeta {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string; // ISO date string, e.g. "2025-12-08"
  displayDate?: string; // Pre-formatted date, e.g. "08 Dec 2025"
  readingTime?: string;
  tags?: readonly string[];
}

function formatEditorialDate(isoDate: string, fallback?: string): string {
  if (fallback) return fallback;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

export default async function WritingIndexPage() {
  const rawPosts: readonly WritingPostMeta[] = await getAllWritingPosts();

  const posts = [...rawPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <header className="max-w-2xl border-b border-white/10 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
          Engineering Notes
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          Writing
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">
          Architecture postmortems, production reliability patterns, and notes
          from shipping systems under real operational constraints.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-10 font-mono text-sm text-zinc-400">
          No published notes available yet.
        </p>
      ) : (
        <ol className="mt-6 divide-y divide-white/10">
          {posts.map((post) => {
            const formattedDate = formatEditorialDate(
              post.publishedAt,
              post.displayDate,
            );

            return (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="group flex flex-col gap-2 py-5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 motion-reduce:transition-none"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold tracking-tight text-zinc-100 transition-colors duration-200 group-hover:text-cyan-300 sm:text-lg motion-reduce:transition-none">
                      {post.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-400">
                      {post.summary}
                    </p>
                  </div>

                  {/* Single semantic <time> node — never duplicated across breakpoints */}
                  <div className="flex shrink-0 items-center gap-3 font-mono text-xs tabular-nums text-zinc-400 sm:text-right">
                    <time dateTime={post.publishedAt}>{formattedDate}</time>
                    {post.readingTime && (
                      <>
                        <span aria-hidden="true" className="text-zinc-600">
                          /
                        </span>
                        <span>{post.readingTime}</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </main>
  );
}
