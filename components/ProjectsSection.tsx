// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
//
// SURGICAL PATCH v2026.13 — Mobile Animation Threshold Fix
//
// CHANGES IN THIS FILE (search "PATCH v2026.13" to locate every edit):
//
//   [1] SECTION_VIEWPORT constant — line ~32
//       Was:  { once: true, amount: 0.25, margin: '-20px 0px' }
//       Now:  { once: true, amount: 0.15, margin: '0px 0px -50px 0px' }
//       Why:  This single constant controls every whileInView threshold in this
//             file (FeaturedProjectCard, SecondaryFeaturedCard, ProjectCard,
//             and the section intro wrapper). The prior '-20px 0px' negative
//             top margin was shrinking the intersection detection zone from
//             the top of the viewport. On iOS Safari with a 50px address bar,
//             this created a window where cards that were visually in-frame
//             weren't registering as intersecting — the animated initial state
//             (opacity:0, y:12) was visible until a second scroll gesture.
//             Fix: remove the negative top margin entirely; add '-50px' on the
//             bottom so cards trigger 50px before reaching the viewport bottom
//             edge (fires early, never fires late). Amount reduced 0.25 → 0.15
//             to lower the required visible fraction — cards with tall content
//             may only show 15% on first viewport entry on compact screens.
//
// All other logic, structure, comments, and imports are IDENTICAL.
// ════════════════════════════════════════════════════════════════════════════

'use client';

import { m, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { trackEvent } from '@/app/lib/analytics';
import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { ReliabilityLedger } from '@/components/ReliabilityLedger';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
import { anchorUrl } from '@/lib/config';
import {
  cardReveal,
  clipReveal,
  fadeRise,
  hoverLift,
  hoverNudgeX,
  noMotion,
} from '@/lib/motionVariants';
import { PROJECTS, type Project } from '@/lib/projects';

const FEATURED_PRIMARY_VARIANT = cardReveal(28);
const FEATURED_SECONDARY_VARIANT = cardReveal(20);
const GRID_VARIANT_A = cardReveal(24);
const GRID_VARIANT_B = cardReveal(-20);

// ── PATCH v2026.20 [SECTION_VIEWPORT removed] ───────────────────────────────
// The SECTION_VIEWPORT constant (and the v2026.13 iOS rootMargin tuning it
// documented) drove Framer Motion whileInView reveals on the project cards and
// the section-intro wrapper. Those reveals have been removed because every one
// of those nodes is a GSAP data-cinematic target — GSAP's useChapterTimeline is
// now the single reveal owner (see the per-node PATCH v2026.20 comments below).
// With no remaining whileInView consumer, the constant is deleted to satisfy
// strict `noUnusedLocals`. The iOS-safe trigger timing it provided is preserved
// by useChapterTimeline's own `start: 'top 85%'` + onRefresh/in-view failsafes.

function trackProjectClick(projectSlug: string, target: 'case-study' | 'demo' | 'source') {
  trackEvent('Portfolio', 'ProjectClick', projectSlug, undefined, {
    project_slug: projectSlug,
    target,
  });
}

function StatusBadge({ status }: Readonly<{ status: Project['status'] }>) {
  if (status === 'case-study') {
    return <span className="badge-muted">CASE STUDY</span>;
  }
  return (
    <span className={status === 'live' ? 'badge-live' : 'badge-wip'}>
      <span className={status === 'live' ? 'dot-live' : 'dot-wip'} aria-hidden="true" />
      {status === 'live' ? 'LIVE' : 'WIP'}
    </span>
  );
}

function TechStrip({
  stack,
  slug,
  limit = 5,
}: Readonly<{ stack: readonly string[]; slug: string; limit?: number }>) {
  const visible = stack.slice(0, limit);
  const rest = stack.length - visible.length;
  return (
    <div className="mt-4 flex flex-wrap gap-1.5" aria-label={`${slug} technology stack`}>
      {visible.map((tech) => (
        <span
          key={tech}
          className="glass-light text-color-text-muted min-w-0 rounded-md px-2 py-1 font-mono text-[10px] tracking-wide break-words"
        >
          {tech}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-color-text-muted rounded-md px-2 py-1 font-mono text-[10px]">
          +{rest} more
        </span>
      )}
    </div>
  );
}

/* ── Primary featured card ─────────────────────────────────────────────────── */
function FeaturedProjectCard({ featured }: Readonly<{ featured: Project }>) {
  return (
    <m.article
      // PATCH v2026.20 [GSAP/Framer isolation]: removed initial/whileInView/viewport.
      // This node carries data-cinematic="proof" — GSAP's useChapterTimeline owns its
      // scroll-reveal (autoAlpha + y). Having Framer Motion ALSO drive opacity/y here
      // is a dual-write on the same DOM node, the one constraint the engine must never
      // break. Concrete failure: GSAP sets autoAlpha:0 at mount; on scroll-up
      // toggleActions reverses GSAP back to autoAlpha:0, but Framer's whileInView
      // (once:true) latched opacity:1 — leaving the card stuck visible while GSAP
      // believes it is hidden, desyncing the next re-entry reveal. `variants` is kept
      // (harmless when no initial/animate drives it) for any non-cinematic reuse.
      variants={FEATURED_PRIMARY_VARIANT}
      className="project-card-glow glass-full mb-5 overflow-hidden rounded-[var(--radius-xl)]"
      data-cinematic="proof"
      data-project-id={featured.slug}
    >
      <div className="px-4 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <span className="label-mono">{featured.type}</span>
          <StatusBadge status={featured.status} />
        </div>

        <h3 className="text-color-text-primary text-[clamp(1.375rem,3.5vw+0.5rem,2.75rem)] leading-[1.15] font-bold tracking-tight">
          {featured.title}
        </h3>

        <p className="font-body text-color-text-secondary mt-3 max-w-[56ch] text-sm leading-[1.8] sm:text-base">
          {featured.tagline}
        </p>

        <ReliabilityLedger {...featured.ledger} label={`${featured.title} Reliability Ledger`} />

        <TechStrip stack={featured.stack} slug={featured.slug} />

        <details className="group mt-5">
          <summary className="text-color-text-muted inline-flex min-h-[48px] cursor-pointer list-none items-center gap-1.5 rounded-full border border-white/14 px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase transition hover:border-white/28 focus-visible:ring-2 focus-visible:ring-[color:var(--chapter-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none">
            <span className="group-open:hidden">How it works ↓</span>
            <span className="hidden group-open:inline">Hide details ↑</span>
          </summary>
          <div className="mt-4 pb-1">
            <p className="text-color-text-secondary max-w-[72ch] text-sm leading-8 sm:text-base">
              {featured.description}
            </p>
          </div>
        </details>
      </div>

      <div className="px-4 pb-5 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
        <div className="border-color-border mt-2 flex flex-col gap-3 border-t pt-5">
          {featured.caseStudy && (
            <Link
              href={featured.caseStudy}
              className="cta-primary w-full justify-center"
              onClick={() => trackProjectClick(featured.slug, 'case-study')}
            >
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            {featured.demoUrl && (
              <a
                href={featured.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProjectClick(featured.slug, 'demo')}
                className="cta-secondary w-full justify-center sm:w-auto sm:justify-start"
              >
                Live demo <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {featured.githubUrl && (
              <a
                href={featured.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProjectClick(featured.slug, 'source')}
                className="cta-ghost flex min-h-[48px] items-center justify-center text-center sm:justify-start sm:text-left"
              >
                View source
              </a>
            )}
          </div>
        </div>
      </div>
    </m.article>
  );
}

/* ── Secondary featured card (2-col grid) ─────────────────────────────────── */
function SecondaryFeaturedCard({
  project,
  reducedMotion,
}: Readonly<{ project: Project; reducedMotion: boolean }>) {
  return (
    <m.article
      // PATCH v2026.20 [GSAP/Framer isolation]: removed initial/whileInView/viewport.
      // data-cinematic="card" → GSAP owns the scroll-reveal. whileHover is retained:
      // it's a pointer-driven micro-interaction (y-lift) that fires only after the
      // reveal settles and never competes with GSAP's autoAlpha/y entrance write.
      variants={FEATURED_SECONDARY_VARIANT}
      className="project-card-glow glass-full flex flex-col overflow-hidden rounded-[var(--radius-xl)]"
      data-cinematic="card"
      data-project-id={project.slug}
      whileHover={reducedMotion ? undefined : hoverLift(-3)}
    >
      <div className="flex-1 px-4 pt-5 sm:px-6 sm:pt-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <span className="label-mono">{project.type}</span>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="text-color-text-primary text-[clamp(1.2rem,2vw+0.5rem,1.6rem)] leading-[1.2] font-bold tracking-tight">
          {project.title}
        </h3>

        <p className="text-color-text-secondary mt-3 text-sm leading-[1.75]">{project.tagline}</p>

        <ReliabilityLedger
          {...project.ledger}
          compact
          label={`${project.title} Reliability Ledger`}
        />

        <TechStrip stack={project.stack} slug={project.slug} limit={4} />

      </div>

      <div className="border-color-border mt-3 border-t px-4 pt-4 pb-5 sm:px-6 sm:pb-6">
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
          {project.caseStudy && (
            <Link
              href={project.caseStudy}
              className="cta-primary justify-center text-xs sm:justify-start"
              onClick={() => trackProjectClick(project.slug, 'case-study')}
            >
              Read the case study <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProjectClick(project.slug, 'demo')}
              className="cta-secondary justify-center text-xs sm:justify-start"
            >
              Live demo <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackProjectClick(project.slug, 'source')}
              className="cta-ghost flex min-h-[44px] items-center justify-center text-xs sm:justify-start"
            >
              View source
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
}

/* ── Grid card (non-featured) ─────────────────────────────────────────────── */
function ProjectCard({
  project,
  variant,
  reducedMotion,
}: Readonly<{ project: Project; variant: ReturnType<typeof cardReveal>; reducedMotion: boolean }>) {
  return (
    <m.article
      // PATCH v2026.20 [GSAP/Framer isolation]: removed initial/whileInView/viewport.
      // data-cinematic="card" → GSAP owns the scroll-reveal (staggered via the grid
      // timeline). whileHover (y-lift) is retained — safe, pointer-only, post-reveal.
      variants={variant}
      className="project-card-glow glass-medium flex flex-col overflow-hidden rounded-[var(--radius-xl)] p-4 sm:p-7"
      data-cinematic="card"
      data-project-id={project.slug}
      whileHover={reducedMotion ? undefined : hoverLift(-4)}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="label-mono">{project.type}</span>
        <StatusBadge status={project.status} />
      </div>
      <h3 className="text-color-text-primary text-base leading-snug font-semibold tracking-tight sm:text-xl">
        {project.title}
      </h3>
      <p className="text-color-text-secondary mt-2 flex-1 text-sm leading-[1.75]">
        {project.tagline}
      </p>
      <ReliabilityLedger {...project.ledger} compact label={`${project.title} Reliability Ledger`} />
      <div className="mt-3 flex flex-wrap gap-1">
        {project.stack.slice(0, 4).map((tech) => (
          <span key={tech} className="text-color-text-muted font-mono text-[9px] tracking-wide">
            {tech}
          </span>
        ))}
        {project.stack.length > 4 && (
          <span className="text-color-text-muted font-mono text-[9px]">
            +{project.stack.length - 4}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
        {project.caseStudy && (
          <Link
            href={project.caseStudy}
            className="cta-ghost group flex min-h-[48px] items-center justify-center gap-1 text-xs sm:justify-start"
            onClick={() => trackProjectClick(project.slug, 'case-study')}
          >
            Read case study
            <m.span
              aria-hidden="true"
              whileHover={reducedMotion ? undefined : hoverNudgeX(2)}
              className="inline-block"
            >
              →
            </m.span>
          </Link>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackProjectClick(project.slug, 'source')}
            className="cta-ghost flex min-h-[48px] items-center justify-center text-xs sm:justify-start"
          >
            View source
          </a>
        )}
      </div>
    </m.article>
  );
}

/* ── Section export ───────────────────────────────────────────────────────── */
export function ProjectsSection() {
  const reducedMotion = useReducedMotion();
  const chapter = getChapterBySectionId('section-projects');

  const child = reducedMotion ? noMotion : fadeRise;

  const primaryFeatured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
  const secondaryFeatured = PROJECTS.filter((p) => p.featured && p.slug !== primaryFeatured.slug);
  const gridProjects = PROJECTS.filter((p) => !p.featured);

  return (
    <ChapterFrame
      chapter={chapter}
      ariaLabelledBy="projects-heading"
      className="border-color-border section-deferred overflow-x-clip"
      noBorderTop
    >
      <m.div>
        <m.div
          // PATCH v2026.20 [GSAP/Framer isolation]: removed initial/whileInView/viewport.
          // This wrapper itself has no data-cinematic, but it wraps <SectionIntro>,
          // whose children carry data-cinematic="eyebrow|title|lede". GSAP's
          // useChapterTimeline selects those descendants and animates their
          // autoAlpha/y. A Framer reveal on this parent would fade the whole group
          // a second time on a different IntersectionObserver clock, producing a
          // visible double-reveal stutter. The eyebrow/title/lede variants passed
          // into SectionIntro stay dormant (no initial/animate drives them inside
          // ChapterFrame) — GSAP is the sole reveal owner.
          className="mb-10 sm:mb-14"
        >
          <SectionIntro
            eyebrowNumber="01"
            eyebrowLabel="Projects"
            headingId="projects-heading"
            title={
              <>
                Built around <br className="hidden lg:block" />
                real constraints.
              </>
            }
            description={
              'Each case study starts with the constraint, explains the architecture decision, and shows the resulting behaviour and available evidence.'
            }
            eyebrowVariant={child}
            titleVariant={reducedMotion ? child : clipReveal}
            descriptionVariant={child}
            titleClassName="text-color-text-primary max-w-[24ch]"
            descriptionClassName="text-color-text-secondary max-w-[56ch] text-sm leading-8 sm:text-base"
          />
        </m.div>

        {/* Primary featured */}
        <FeaturedProjectCard featured={primaryFeatured} />

        {/* Secondary featured — 2-col on md+ */}
        {secondaryFeatured.length > 0 && (
          <div className="secondary-featured-grid mb-5 grid gap-4 md:grid-cols-2">
            {secondaryFeatured.map((project) => (
              <SecondaryFeaturedCard
                key={project.slug}
                project={project}
                reducedMotion={reducedMotion ?? false}
              />
            ))}
          </div>
        )}

        {/* Non-featured grid */}
        {gridProjects.length > 0 && (
          <div
            className={
              gridProjects.length === 1
                ? 'projects-grid grid gap-4'
                : 'projects-grid grid gap-4 sm:grid-cols-2'
            }
          >
            {gridProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                variant={i % 2 === 0 ? GRID_VARIANT_A : GRID_VARIANT_B}
                reducedMotion={reducedMotion ?? false}
              />
            ))}
          </div>
        )}

        {/* Flow hook — V1.0 Change 6a: §Flow Mechanics §Projects */}
        <m.p
          variants={child}
          data-cinematic="cta"
          className="text-color-text-muted mt-10 font-mono text-[13px] [letter-spacing:0.06em]"
        >
          <Link
            href={anchorUrl('section-testimonials')}
            className="transition-opacity hover:opacity-80"
          >
            How these systems perform in production →
          </Link>
        </m.p>
      </m.div>
    </ChapterFrame>
  );
}
