import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: "#08090C",     // Strict OLED base background
          surface: "#0E0E10",  // Elevated cards and structural modules
          elevated: "#141519", // Nested metric cells and interactive pills
          border: "#1F222A",   // Crisp 1px structural hairline
          subtle: "#2A2E39",   // Hover/active hairline state
          text: "#F3F4F6",     // Primary high-contrast foreground
          muted: "#9CA3AF",    // Secondary prose
          dim: "#6B7280",      // Metadata and labels
        },
        accent: {
          cyan: "#00D9FF",     // Electric cyan for interactive telemetry/borders
          emerald: "#00FF66",  // Emerald green for primary CTAs and live states
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "border-illuminate-cyan":
          "linear-gradient(90deg, rgba(31,34,42,0) 0%, rgba(0,217,255,0.45) 50%, rgba(31,34,42,0) 100%)",
        "border-illuminate-emerald":
          "linear-gradient(90deg, rgba(31,34,42,0) 0%, rgba(0,255,102,0.45) 50%, rgba(31,34,42,0) 100%)",
        "surface-subtle":
          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
