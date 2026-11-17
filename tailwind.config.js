/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,md,mdx}',
    './components/**/*.{ts,tsx,md,mdx}',
    './content/**/*.{md,mdx}',
    './mdx-components.tsx',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          base: '#08090C',
          surface: '#0E0E10',
        },
        accent: {
          cyan: '#00D9FF',
          emerald: '#00FF66',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
