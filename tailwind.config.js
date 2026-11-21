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
          cyanHover: '#7AEAFF',
          emerald: '#00FF66',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        micro: ['0.6875rem', { lineHeight: '1.125rem' }],
      },
      letterSpacing: {
        domain: '0.16em',
        kicker: '0.18em',
        section: '0.2em',
        brand: '0.26em',
      },
      maxWidth: {
        hero: '72rem',
        heading: '15ch',
        prose: '62ch',
      },
      minHeight: {
        chip: '30px',
        touch: '44px',
        cta: '48px',
        tab: '52px',
      },
      minWidth: {
        touch: '44px',
      },
      aspectRatio: {
        portrait: '4 / 5',
      },
      gridTemplateColumns: {
        'profile-mobile': '7rem minmax(0, 1fr)',
        'profile-desktop': '8.5rem minmax(0, 1fr)',
        'profile-lg': '9rem minmax(0, 1fr)',
      },
    },
  },
  plugins: [],
};
