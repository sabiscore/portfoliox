import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: "#08090C",
          surface: "#0E0E10",
          elevated: "#14161B",
          border: "#1F222A",
          subtle: "#2A2E39",
          text: "#F3F4F6",
          muted: "#9CA3AF",
          dim: "#6B7280",
        },
        accent: {
          cyan: "#00D9FF",
          emerald: "#00FF66",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1rem" }], // 11px without arbitrary brackets
        caption: ["0.75rem", { lineHeight: "1.125rem" }], // 12px
        hero: ["2.25rem", { lineHeight: "1.08", letterSpacing: "-0.03em" }], // 36px mobile hero
      },
      letterSpacing: {
        telemetry: "0.14em",
        wordmark: "0.22em",
      },
      minHeight: {
        touch: "3rem",     // 48px WCAG / mobile touch target
        pill: "2rem",      // 32px interactive tag target
      },
      backgroundImage: {
        "illuminate-cyan":
          "linear-gradient(90deg, rgba(31,34,42,0) 0%, rgba(0,217,255,0.5) 50%, rgba(31,34,42,0) 100%)",
        "illuminate-emerald":
          "linear-gradient(90deg, rgba(31,34,42,0) 0%, rgba(0,255,102,0.5) 50%, rgba(31,34,42,0) 100%)",
        "illuminate-dual":
          "linear-gradient(90deg, rgba(0,217,255,0.35) 0%, rgba(0,255,102,0.35) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
