import React from "react";

export interface MetricBadgeProps {
  label: string;
  value: string;
  accent?: "cyan" | "emerald";
  /** Optional freshness indicator for externally sourced metrics. */
  badge?: string;
  /** Optional attribution for the system that supplied the metric. */
  sourceLabel?: string;
  /** Compact presentation for dense metric grids; md preserves the original scale. */
  size?: "sm" | "md";
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  accent = "cyan",
  badge,
  sourceLabel,
  size = "md",
}) => {
  const valueColor =
    accent === "emerald" ? "text-accent-emerald" : "text-accent-cyan";
  const compact = size === "sm";

  const accessibleDetails = [
    label,
    value,
    badge,
    sourceLabel ? `source: ${sourceLabel}` : undefined,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      aria-label={accessibleDetails}
      className={[
        "inline-flex min-w-0 flex-col items-start gap-1.5 rounded-lg border border-obsidian-border bg-obsidian-elevated font-mono tabular-nums",
        compact ? "px-2.5 py-2" : "px-3 py-2.5",
      ].join(" ")}
    >
      <div className="flex min-w-0 max-w-full items-center gap-2">
        <span
          className={[
            "truncate uppercase tracking-telemetry text-obsidian-dim",
            compact ? "text-[9px]" : "text-micro",
          ].join(" ")}
        >
          {label}
        </span>
        <span className="shrink-0 text-obsidian-border" aria-hidden="true">
          |
        </span>
        <span
          className={[
            "min-w-0 truncate font-semibold",
            valueColor,
            compact ? "text-xs" : "text-sm",
          ].join(" ")}
        >
          {value}
        </span>
      </div>

      {(badge || sourceLabel) && (
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-[9px] leading-none">
          {badge && (
            <span className="inline-flex items-center gap-1 border border-accent-emerald/30 bg-accent-emerald/10 px-1.5 py-1 font-semibold tracking-wider text-accent-emerald uppercase">
              <span
                className="h-1 w-1 rounded-full bg-accent-emerald"
                aria-hidden="true"
              />
              {badge}
            </span>
          )}
          {sourceLabel && (
            <span className="truncate text-obsidian-dim">
              via {sourceLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricBadge;
