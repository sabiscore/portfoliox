import React from "react";

export interface MetricBadgeProps {
  label: string;
  value: string;
  accent?: "cyan" | "emerald";
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({
  label,
  value,
  accent = "cyan",
}) => {
  const valueColor =
    accent === "emerald" ? "text-accent-emerald" : "text-accent-cyan";

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-obsidian-border bg-obsidian-elevated px-3 py-1.5 font-mono text-micro tabular-nums">
      <span className="uppercase tracking-telemetry text-obsidian-dim">
        {label}
      </span>
      <span className="text-obsidian-border" aria-hidden="true">
        |
      </span>
      <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
};

export default MetricBadge;
