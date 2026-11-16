export const OBSIDIAN_NOCTURNE_V2 = {
  backgrounds: {
    base: "#08090C",     // Pure OLED black base canvas
    surface: "#0E0E10",  // Elevated structural cards & bars
    elevated: "#14161B", // Nested metric cells & interactive pills
  },
  borders: {
    default: "#1F222A",  // Crisp 1px structural hairline
    subtle: "#2A2E39",   // Hover / focus hairline state
  },
  accents: {
    cyan: "#00D9FF",     // Electric cyan for telemetry, badges & focus borders
    emerald: "#00FF66",  // Emerald green for primary CTAs & live indicators
  },
  text: {
    primary: "#F3F4F6",  // High-contrast primary headings & copy
    muted: "#9CA3AF",    // Secondary analytical prose
    dim: "#6B7280",      // Monospace metadata & coordinates
  },
} as const;

export type ObsidianPalette = typeof OBSIDIAN_NOCTURNE_V2;
