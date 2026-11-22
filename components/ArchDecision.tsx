export interface ArchDecisionProps {
  title?: string;
  chosen: string;
  over: string;
  rationale?: string;
  tradeoff?: string;
  className?: string;
}

export function ArchDecision({
  title,
  chosen,
  over,
  rationale,
  tradeoff,
  className = '',
}: ArchDecisionProps) {
  return (
    <figure
      className={`my-6 border border-white/10 border-t-2 border-t-accent-cyan/60 bg-obsidian-surface p-5 ${className}`.trim()}
    >
      {title && (
        <figcaption className="mb-4 border-b border-white/10 pb-3 font-display text-base font-semibold tracking-tight text-white">
          {title}
        </figcaption>
      )}

      <dl className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
          <dt className="inline-flex w-fit shrink-0 items-center border border-accent-emerald/35 bg-accent-emerald/10 px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-accent-emerald">
            Chosen
            <span className="sr-only">: </span>
          </dt>
          <dd className="text-sm font-medium leading-relaxed text-zinc-100">
            {chosen}
          </dd>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
          <dt className="inline-flex w-fit shrink-0 items-center border border-white/15 bg-obsidian-base px-2 py-0.5 font-mono text-2xs font-semibold uppercase tracking-wider text-zinc-300">
            Over
            <span className="sr-only">: </span>
          </dt>
          <dd className="text-sm leading-relaxed text-zinc-400">{over}</dd>
        </div>

        {rationale && (
          <div className="border-t border-white/10 pt-3">
            <dt className="font-mono text-2xs font-semibold uppercase tracking-domain text-accent-cyan">
              Rationale
              <span className="sr-only">: </span>
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-zinc-300">
              {rationale}
            </dd>
          </div>
        )}

        {tradeoff && (
          <div className="border-t border-white/10 pt-3">
            <dt className="font-mono text-2xs font-semibold uppercase tracking-domain text-zinc-400">
              Accepted Trade-off
              <span className="sr-only">: </span>
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-zinc-400">
              {tradeoff}
            </dd>
          </div>
        )}
      </dl>
    </figure>
  );
}

export default ArchDecision;
