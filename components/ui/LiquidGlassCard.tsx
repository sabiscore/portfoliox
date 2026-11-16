import React from "react";
import { GlassCard, GlassCardProps } from "@/components/GlassCard";

/**
 * Backwards-compatible alias for legacy LiquidGlassCard imports.
 * Routes all consumers to the strict Obsidian Nocturne v2 GlassCard primitive.
 */
export const LiquidGlassCard: React.FC<GlassCardProps> = (props) => {
  return <GlassCard {...props} />;
};

export default LiquidGlassCard;
