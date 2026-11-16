import React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: "cyan" | "emerald" | "dual" | "none";
  elevated?: boolean;
  interactive?: boolean;
}

/**
 * Obsidian Nocturne v2 replacement for legacy GlassCard.
 * Enforces #0E0E10 / #14161B OLED surfaces, crisp 1px #1F222A borders,
 * and zero soft drop shadows.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  accent = "cyan",
  elevated = false,
  interactive = false,
  className = "",
  children,
  ...props
}) => {
  const surfaceClass = elevated ? "bg-obsidian-elevated" : "bg-obsidian-surface";
  const hoverClass = interactive
    ? "transition-colors duration-150 hover:border-accent-cyan/60"
    : "";

  const topLineClass =
    accent === "emerald"
      ? "bg-illuminate-emerald"
      : accent === "dual"
        ? "bg-illuminate-dual"
        : accent === "cyan"
          ? "bg-illuminate-cyan"
          : "hidden";

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-obsidian-border ${surfaceClass} ${hoverClass} ${className}`}
      {...props}
    >
      {accent !== "none" && (
        <div
          className={`
            absolute inset-x-0 top-0 h-px opacity-65 transition-opacity
            group-hover:opacity-100 ${topLineClass}
          `}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};

export default GlassCard;
