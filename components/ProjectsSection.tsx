import Link from 'next/link';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface FlagshipProject {
  slug: string;
  name: string;
  status: string;
  summary: string;
  constraint: string;
  architectureDecision: string;
  metrics: readonly ProjectMetric[];
  stack: readonly string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface SecondaryProject {
  slug: string;
  name: string;
  category: string;
  summary: string;
  href: string;
  external?: boolean;
}

export interface ProjectsSectionProps {
  /** Pass verified entries from lib/projects.ts / lib/data/projects.ts */
  flagshipProjects: readonly FlagshipProject[];
  secondaryProjects?: readonly SecondaryProject[];
  sectionId?: string;
}

export function ProjectsSection({
  flagshipProjects,
  secondaryProjects = [],
  sectionId = 'work',
}: ProjectsSectionProps) {
  return (
    <section
      id={sectionId}
      aria-labelledby="projects-section-heading"
      className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:py-24"
    >
      {/* Unified Section Header */}
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
          Selected Systems
        </p>
        <h2
          id="projects-section-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl lg:text-4xl"
        >
          Built around real constraints.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">
          Production platforms, quantitative engines, and data pipelines
          engineered for determinism, observability, and graceful failure.
        </p>
      </header>

      {/* Flagship Case Studies: Consistent Hierarchy & Deterministic CTA Geometry */}
      <div className="mt-10 space-y-6">
        {flagshipProjects.map((project) => (
          <article
            key={project.slug}
            aria-labelledby={`project-title-${project.slug}`}
            className="rounded-xl border border-white/10 bg-zinc-950/90 p-5 transition-colors duration-200 hover:border-white/20 sm:p-7 motion-reduce:transition-none"
          >
            {/* Header Row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  id={`project-title-${project.slug}`}
                  className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
                >
                  {project.name}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {project.summary}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 font-mono text-xs font-medium text-emerald-300">
                {project.status}
              </span>
            </div>

            {/* Scannable Engineering Brief (Constraint vs. Architectural Decision) */}
            <dl className="mt-5 grid grid-cols-1 gap-4 border-y border-white/10 py-5 md:grid-cols-2">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                  Constraint
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                  {project.constraint}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Architectural Decision
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                  {project.architectureDecision}
                </dd>
              </div>
            </dl>

            {/* Verified Proof Metrics */}
            {project.metrics.length > 0 && (
              <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.metrics.slice(0, 4).map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-white/10 bg-zinc-900/70 px-4 py-3"
                  >
                    <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                      {metric.label}
                    </dt>
                    <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-zinc-100 sm:text-base">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Stack Tags */}
            {project.stack.length > 0 && (
              <ul
                aria-label={`${project.name} technologies`}
                className="mt-5 flex flex-wrap gap-2"
              >
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-white/10 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            {/* Unified CTA Bar: Identical Geometry Across Every Flagship Card */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-400 px-5 py-2.5 font-mono text-xs font-semibold text-zinc-950 transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
              >
                Read Architecture Case Study
              </Link>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 px-4 py-2.5 font-mono text-xs font-medium text-zinc-100 transition-colors duration-200 hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
                >
                  Live Deployment
                  <span className="sr-only"> for {project.name}</span>
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 bg-transparent px-4 py-2.5 font-mono text-xs font-medium text-zinc-300 transition-colors duration-200 hover:border-white/30 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:w-auto motion-reduce:transition-none"
                >
                  Source Repository
                  <span className="sr-only"> for {project.name}</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Secondary Systems Strip: Responsive 1 -> 2 -> 3 Grid (Fixes Mobile Cramping) */}
      {secondaryProjects.length > 0 && (
        <div className="mt-10">
          <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Additional Systems &amp; Advisory
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {secondaryProjects.map((item) => {
              const cardContent = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-cyan-400">
                      {item.category}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs text-zinc-400 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    >
                      &rarr;
                    </span>
                  </div>
                  <h4 className="mt-2 text-base font-semibold text-zinc-50">
                    {item.name}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                    {item.summary}
                  </p>
                </>
              );

              return item.external ? (
                <a
                  key={item.slug}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/80 p-5 transition-colors duration-200 hover:border-cyan-400/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
                >
                  {cardContent}
                </a>
              ) : (
                <Link
                  key={item.slug}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/80 p-5 transition-colors duration-200 hover:border-cyan-400/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectsSection;