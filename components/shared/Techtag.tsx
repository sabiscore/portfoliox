import React from "react";

export interface TechtagProps {
  label: string;
  variant?: "default" | "cyan" | "emerald";
  className?: string;
}

export const Techtag: React.FC<TechtagProps> = ({
  label,
  variant = "default",
  className = "",
}) => {
  const variantStyles =
    variant === "cyan"
      ? "border-accent-cyan/50 bg-obsidian-elevated text-accent-cyan"
      : variant === "emerald"
        ? "border-accent-emerald/50 bg-obsidian-elevated text-accent-emerald"
        : "border-obsidian-border bg-obsidian-base text-obsidian-muted";

  return (
    <span
      className={`inline-flex min-h-pill items-center rounded border px-2.5 py-1 font-mono text-micro ${variantStyles} ${className}`}
    >
      {label}
    </span>
  );
};

export default Techtag;
