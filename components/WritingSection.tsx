// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
import { anchorUrl } from '@/lib/config';
import type { WritingPost } from '@/lib/content';
import { cardReveal, clipReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';
import { formatDate } from '@/lib/utils';

const FILTER_LABELS = ['ARCHITECTURE', 'ML SYSTEMS', 'RELIABILITY', 'FINTECH'] as const;
type FilterLabel = (typeof FILTER_LABELS)[number];

export function WritingSection({ posts }: Readonly<{ posts: WritingPost[] }>) {
  const reducedMotion = useReducedMotion();
  const chapter = getChapterBySectionId('section-writing');
  const [activeFilter, setActiveFilter] = useState<FilterLabel | 'ALL'>('ALL');

  const container = useMemo(() => staggerContainer(0.08, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const card = useMemo(() => (reducedMotion ? noMotion : cardReveal(24)), [reducedMotion]);

  const featuredPost = posts.find((p) => p.featured) ?? posts[0];
  const allOtherPosts = posts.filter((p) => p !== featuredPost);
  const otherPosts =
    activeFilter === 'ALL'
      ? allOtherPosts
      : allOtherPosts.filter((p) =>
          p.tags.some((t) => t.toUpperCase().includes(activeFilter.split(' ')[0]))
        );

  return (
    <ChapterFrame
      chapter={chapter}
      ariaLabelledBy="writing-heading"
      className="border-color-border"
    >
      <div>
        {/* ── Section header ────────────────────────────────────────────── */}
        <m.div variants={child} className="mb-8 sm:mb-12">
          <SectionIntro
            eyebrowNumber="05"
            eyebrowLabel="Writing"
            headingId="writing-heading"
            title={<>Writing that makes engineering decisions clear.</>}
            // V1.3: Consequence-first rewrite. Opens with what both audiences get
            // ('how the systems are actually built'), then signals technical content
            // (architecture, ML). Em dash rhythm preserved — consistent voice marker.
            // Non-technical reader: 'actually built' = accessible entry.
            // Technical reader: 'architecture, ML decisions' = confirms relevant depth.
            description={
              'Architecture, ML systems, failure modes, and the decisions behind them — written for engineers who need the reasoning, not just the result.'
            }
            eyebrowVariant={child}
            titleVariant={reducedMotion ? child : clipReveal}
            descriptionVariant={child}
            titleClassName="text-color-text-primary mt-[var(--space-2)] max-w-[22ch]"
            descriptionClassName="text-color-text-secondary mt-4 max-w-[52ch] text-sm leading-[1.8] sm:text-base lg:mt-0"
          />

          {/*
              v24.0 CHANGE — Filter chips:
                Mobile (< md): horizontal scroll strip — `overflow-x-auto scrollbar-none`
                  with snap-x. Previously flex-wrap created 3 awkward rows (ALL,
                  ARCHITECTURE / ML SYSTEMS, RELIABILITY / FINTECH). A scroll strip
                  keeps all 5 chips reachable without layout clutter.
                md+: flex-wrap retained — the wider canvas has room for all chips.
              v22.1 intent (keep every chip visible) is preserved — now also usable.
            */}
          <m.div
            variants={child}
            data-cinematic="panel"
            className="filter-chip-row"
            role="group"
            aria-label="Filter articles by topic"
          >
            <div className="flex flex-wrap gap-2 pb-1">
              {(['ALL', ...FILTER_LABELS] as const).map((label) => {
                const isActive = activeFilter === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveFilter(label as FilterLabel | 'ALL')}
                    aria-pressed={isActive}
                    data-active={isActive ? 'true' : 'false'}
                    className={[
                      'writing-filter-chip shrink-0 rounded-full px-4 py-2.5 font-mono text-[11px] tracking-widest whitespace-nowrap uppercase',
                      'min-h-[44px] border transition-all duration-200',
                      'focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none',
                      'active:scale-[0.97]',
                      isActive
                        ? 'border-white/28 bg-white/10 text-white'
                        : 'border-white/10 text-white/45 hover:border-white/20 hover:text-white/70',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </m.div>
        </m.div>

        {featuredPost ? (
          <>
            {/* ── Featured article ───────────────────────────────────────── */}
            {/* V1.0 Change 5b: Warmup CTA — for the evaluating Type A visitor who reads
                  before they commit. Per spec §CTA Warmup Path: mono, 12px, opacity 0.50. */}
            <m.p
              variants={child}
              className="text-color-text-muted mb-4 font-mono text-[12px]"
            >
              Start here if you want to understand how these systems were designed.
            </m.p>

            <m.article
              variants={card}
              data-cinematic="proof"
              className="glass-full mb-4 rounded-[var(--radius-xl)] p-5 sm:p-8 lg:p-10"
            >
              {/* V1.0 Change 5a: TIER 1 signals curation; STAFF+ SIGNAL signals audience
                    relevance; min read is the only metric that serves the visitor directly. */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="pill pill-cyan font-mono text-[10px] [letter-spacing:0.08em]">
                  TIER 1
                </span>
                <span className="badge-muted font-mono text-[10px] [letter-spacing:0.06em]">
                  STAFF+ SIGNAL
                </span>
                <span className="text-color-text-muted font-mono text-xs">
                  {featuredPost.readingTime} min read
                </span>
              </div>

              <h3 className="text-color-text-primary mt-5 line-clamp-3 max-w-[28ch] text-xl leading-snug font-bold tracking-tight sm:line-clamp-none sm:text-2xl">
                {featuredPost.title}
              </h3>

              <p className="text-color-text-secondary mt-3 max-w-[64ch] text-sm leading-8 sm:text-base">
                {featuredPost.summary}
              </p>

              <div className="text-color-text-muted mt-4 flex flex-wrap items-center gap-3 text-xs">
                <time dateTime={featuredPost.date} className="font-mono uppercase">
                  {formatDate(featuredPost.date)}
                </time>
                {featuredPost.tags.slice(0, 3).map((tag) => (
                  <span key={`${featuredPost.slug}-${tag}`} className="pill">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>

              <Link
                href={`/writing/${featuredPost.slug}`}
                className="text-color-film-teal mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-[var(--color-film-teal-glow)] px-5 py-2.5 text-sm transition focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none active:scale-[0.97] sm:w-auto sm:justify-start"
              >
                <span>Read the article</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </m.article>

            {/* ── Article list ───────────────────────────────────────────── */}
            {otherPosts.length > 0 && (
              <AnimatePresence mode="popLayout">
                <m.div
                  variants={container}
                  className="writing-articles-list bg-color-border grid gap-px overflow-hidden rounded-[var(--radius-lg)]"
                >
                  {otherPosts.map((post) => (
                    <m.div
                      key={post.slug}
                      variants={card}
                      data-cinematic="card"
                      exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                      layout
                      className="bg-color-bg"
                    >
                      <Link href={`/writing/${post.slug}`} className="group block">
                        <m.article
                          whileHover={
                            reducedMotion
                              ? undefined
                              : {
                                  x: 4,
                                  transition: { type: 'spring', stiffness: 320, damping: 28 },
                                }
                          }
                          className="flex min-h-[52px] items-center gap-3 px-4 py-3.5"
                        >
                          {/* Date — stacked on mobile, inline on sm+ */}
                          <div className="hidden min-w-24 shrink-0 sm:block">
                            <time
                              dateTime={post.date}
                              className="text-color-text-muted font-mono text-xs"
                            >
                              {formatDate(post.date)}
                            </time>
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-color-text-primary line-clamp-2 block text-sm font-medium transition group-hover:text-white sm:line-clamp-2 sm:whitespace-normal">
                              {post.title}
                            </span>
                            <time
                              dateTime={post.date}
                              className="text-color-text-muted mt-0.5 block font-mono text-[10px] sm:hidden"
                            >
                              {formatDate(post.date)}
                            </time>
                          </div>

                          <span className="text-color-text-muted shrink-0 text-xs whitespace-nowrap">
                            {post.readingTime} min
                          </span>
                        </m.article>
                      </Link>
                    </m.div>
                  ))}
                </m.div>
              </AnimatePresence>
            )}

            {/* ── View all CTA: full-width on mobile ─────────────────────── */}
            <m.div variants={child} className="mt-8">
              <Link
                href="/writing"
                data-cinematic="cta"
                className="border-color-border text-color-film-teal inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border px-6 py-3 font-mono text-[11px] tracking-widest uppercase transition focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none active:scale-[0.97] sm:w-auto sm:justify-start"
              >
                See all {posts.length} articles
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </m.div>

            {/* Flow hook — V1.0 Change 6e: §Flow Mechanics §Writing */}
            <m.p
              variants={child}
              data-cinematic="cta"
              className="text-color-text-muted mt-10 font-mono text-[13px] [letter-spacing:0.06em]"
            >
              <Link
                href={anchorUrl('section-contact')}
                className="transition-opacity hover:opacity-80"
              >
                Have a system problem worth examining? Start with the stakes →
              </Link>
            </m.p>
          </>
        ) : null}
      </div>
    </ChapterFrame>
  );
}
