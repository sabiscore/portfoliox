import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// TODO(wire-existing): Point to your canonical MDX/blog loader and MDX renderer component
import { getAllWritingPosts, getWritingPostBySlug } from '@/lib/writing';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface WritingPostDetail {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  displayDate?: string;
  readingTime?: string;
  tags?: readonly string[];
  content: React.ReactNode;
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

export async function generateStaticParams() {
  const posts = await getAllWritingPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post: WritingPostDetail | null = await getWritingPostBySlug(slug);

  if (!post) {
    return { title: 'Note Not Found' };
  }

  return {
    // Root layout.tsx appends " · Oscar Ndugbu" once
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/writing/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
      url: `/writing/${post.slug}`,
    },
  };
}

export default async function WritingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getWritingPostBySlug(slug),
    getAllWritingPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const sortedPosts = [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const currentIndex = sortedPosts.findIndex((item) => item.slug === post.slug);
  const nextPost =
    currentIndex >= 0
      ? sortedPosts[(currentIndex + 1) % sortedPosts.length]
      : undefined;
  const relatedPost =
    nextPost && nextPost.slug !== post.slug ? nextPost : undefined;

  const currentFormattedDate = formatEditorialDate(
    post.publishedAt,
    post.displayDate,
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link
          href="/writing"
          className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-zinc-400 transition-colors duration-200 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Writing
        </Link>
      </nav>

      <article>
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs tabular-nums text-zinc-400">
            <time dateTime={post.publishedAt}>{currentFormattedDate}</time>
            {post.readingTime && (
              <>
                <span aria-hidden="true" className="text-zinc-600">
                  /
                </span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {post.summary}
          </p>

          {post.tags && post.tags.length > 0 && (
            <ul aria-label="Article topics" className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* MDX / Article Body */}
        <div className="prose prose-invert prose-zinc mt-10 max-w-none prose-headings:tracking-tight prose-a:text-cyan-400 prose-code:font-mono">
          {post.content}
        </div>
      </article>

      {/* Related / Next Note — Strictly Bound to relatedPost.publishedAt */}
      {relatedPost && (
        <aside
          aria-labelledby="continue-reading-heading"
          className="mt-16 border-t border-white/10 pt-8"
        >
          <p
            id="continue-reading-heading"
            className="font-mono text-xs uppercase tracking-widest text-zinc-400"
          >
            Continue Reading
          </p>

          <Link
            href={`/writing/${relatedPost.slug}`}
            className="group mt-3 block rounded-xl border border-white/10 bg-zinc-950/90 p-5 transition-colors duration-200 hover:border-cyan-400/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs tabular-nums text-zinc-400">
              <time dateTime={relatedPost.publishedAt}>
                {formatEditorialDate(
                  relatedPost.publishedAt,
                  relatedPost.displayDate,
                )}
              </time>
              {relatedPost.readingTime && <span>{relatedPost.readingTime}</span>}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-zinc-100 transition-colors duration-200 group-hover:text-cyan-300 motion-reduce:transition-none">
              {relatedPost.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
              {relatedPost.summary}
            </p>
          </Link>
        </aside>
      )}
    </main>
  );
}
