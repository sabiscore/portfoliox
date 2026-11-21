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
      className={`my-6 rounded-xl border border-white/10 bg-zinc-950/90 p-5 ${className}`}
    >
      {title && (
        <figcaption className="mb-4 border-b border-white/10 pb-3 text-sm font-semibold tracking-tight text-zinc-100">
          {title}
        </figcaption>
      )}

      <dl className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
          <dt className="inline-flex w-fit shrink-0 items-center rounded border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Chosen
            <span className="sr-only">: </span>
          </dt>
          <dd className="text-sm font-medium leading-relaxed text-zinc-100">
            {chosen}
          </dd>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-3">
          <dt className="inline-flex w-fit shrink-0 items-center rounded border border-white/15 bg-zinc-900 px-2 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Over
            <span className="sr-only">: </span>
          </dt>
          <dd className="text-sm leading-relaxed text-zinc-400">{over}</dd>
        </div>

        {rationale && (
          <div className="border-t border-white/10 pt-3">
            <dt className="font-mono text-xs uppercase tracking-wider text-cyan-400">
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
            <dt className="font-mono text-xs uppercase tracking-wider text-zinc-400">
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