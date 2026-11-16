import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export type MetricCardVariant = "focus" | "proof" | "method";

export interface MetricItem {
  label: string;
  detail?: string;
  href?: string;
}

export interface MetricCardProps {
  index: string;
  title: string;
  variant: MetricCardVariant;
  items: MetricItem[];
  accent?: "cyan" | "emerald";
}

export const MetricCard: React.FC<MetricCardProps> = ({
  index,
  title,
  variant,
  items,
  accent = "cyan",
}) => {
  const illuminationClass =
    accent === "emerald" ? "bg-illuminate-emerald" : "bg-illuminate-cyan";

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-obsidian-border bg-obsidian-elevated p-3.5 transition-colors hover:border-obsidian-subtle">
      {/* Crisp 1px Top Illumination on Hover */}
      <div
        className={`
          absolute inset-x-0 top-0 h-px opacity-50 transition-opacity
          group-hover:opacity-100 ${illuminationClass}
        `}
        aria-hidden="true"
      />

      {/* Module Header */}
      <div className="mb-3 flex items-center justify-between border-b border-obsidian-border pb-2">
        <span className="font-mono text-micro font-semibold uppercase tracking-telemetry text-obsidian-muted">
          {title}
        </span>
        <span className="font-mono text-micro text-obsidian-dim tabular-nums">
          {index}
        </span>
      </div>

      {/* Variant 1: FOCUS (Structured Capability Rows) */}
      {variant === "focus" && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-2 font-mono text-caption text-obsidian-text"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-cyan"
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </span>
              {item.detail && (
                <span className="rounded border border-obsidian-border bg-obsidian-surface px-1.5 py-0.5 text-micro text-obsidian-dim">
                  {item.detail}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Variant 2: PROOF (Interactive Case Study Pills) */}
      {variant === "proof" && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href || "#projects"}
              className="inline-flex min-h-pill items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-surface px-2.5 py-1 font-mono text-caption text-obsidian-text transition-colors hover:border-accent-emerald hover:text-accent-emerald"
            >
              <span>{item.label}</span>
              {item.detail && (
                <span className="text-micro text-obsidian-dim">
                  · {item.detail}
                </span>
              )}
              <ArrowUpRight className="h-3 w-3 text-accent-emerald" />
            </a>
          ))}
        </div>
      )}

      {/* Variant 3: METHOD (Deterministic Engineering Pipeline) */}
      {variant === "method" && (
        <div
          className="flex flex-wrap items-center gap-1.5 pt-0.5"
          aria-label="Engineering decision pipeline"
        >
          {items.map((item, idx) => (
            <React.Fragment key={item.label}>
              <span className="inline-flex items-center rounded border border-obsidian-border bg-obsidian-surface px-2 py-1 font-mono text-micro text-obsidian-text">
                {item.label}
              </span>
              {idx < items.length - 1 && (
                <ArrowRight
                  className="h-3 w-3 shrink-0 text-accent-cyan"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
