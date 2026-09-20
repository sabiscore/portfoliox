import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, JetBrains_Mono, Syne } from 'next/font/google';

import { Providers } from '@/app/providers';
import { DeferredCursorGlow } from '@/components/DeferredCursorGlow';
import { DeferredCommandPalette } from '@/components/DeferredCommandPalette';
import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { PageWrapper } from '@/components/PageWrapper';
import { ScrollProgress } from '@/components/ScrollProgress';
import { WebVitals } from '@/components/WebVitals';
import { DeferredThreeBrushField } from '@/components/cinematic/DeferredThreeBrushField';
import { PROFILE } from '@/lib/portfolio-data';
import { cn } from '@/lib/utils';

import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  // Display-only face: never make the critical hero paint wait on the display font.
  // The hero has a system-compatible fallback and the display face is non-critical.
  display: 'optional',
  preload: false,
  fallback: ['Avenir Next', 'Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  // The measured mobile LCP is hero copy, not an image. Do not make the
  // first paint compete with a font preload; optional keeps the fallback
  // paintable on constrained Lighthouse runs and avoids a late font swap.
  display: 'optional',
  preload: false,
  fallback: ['Inter', 'Avenir Next', 'Segoe UI', 'system-ui', 'sans-serif'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
  fallback: ['Fira Code', 'Cascadia Code', 'Consolas', 'Menlo', 'monospace'],
});

const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3000');

const shouldLoadVercelInsights = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
const siteTitle = `${PROFILE.name} — ${PROFILE.role} · AI Infrastructure · Fintech Engineering`;
const siteDescription =
  'Staff backend and platform engineer in Lagos. Case studies across fintech workflows, ML inference, distributed systems, and AI infrastructure — with the architecture decisions and evidence behind the work.';
const socialDescription =
  'Staff Backend and Platform Engineer building reliable AI, fintech, and infrastructure systems from Lagos.';
const socialImagePath = '/og';

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s · ${PROFILE.name}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  authors: [{ name: PROFILE.name, url: siteUrl }],
  creator: PROFILE.name,
  keywords: [
    'Staff Backend Engineer',
    'Platform Engineer',
    'Backend Engineer',
    'Full-Stack Engineer',
    'Systems Architect',
    'AI Infrastructure',
    'SRE',
    'Staff Engineer',
    'Next.js 15',
    'React Native',
    'Expo SDK 54',
    'TypeScript',
    'Java',
    'Spring Boot',
    'FastAPI',
    'Python',
    'Effect-TS',
    'Turborepo',
    'PostgreSQL',
    'Redis',
    'Fintech',
    'Nigerian fintech',
    'Lagos Engineer',
    'Lagos Nigeria',
    'TaxBridge',
    'SabiScore',
    'SwarmXQ',
    'AI Agent Orchestration',
    'Ollama',
    'LLM Routing',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: PROFILE.name,
    title: siteTitle,
    description: socialDescription,
    images: [
      {
        url: socialImagePath,
        width: 1200,
        height: 630,
        alt: `${PROFILE.name} — ${PROFILE.role}, AI Infrastructure & Fintech Systems`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: socialDescription,
    images: [socialImagePath],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'scardubu.dev',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
  colorScheme: 'dark',
};

const schemaGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: PROFILE.name,
      url: siteUrl,
      jobTitle: PROFILE.role,
      description:
        'Staff backend and platform engineer based in Lagos, Nigeria. Builds backend infrastructure, AI systems, fintech workflows, and production reliability tooling.',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': siteUrl,
      },
      image: {
        '@type': 'ImageObject',
        url: `${siteUrl}${socialImagePath}`,
        width: 1200,
        height: 630,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lagos',
        addressCountry: 'NG',
      },
      worksFor: {
        '@type': 'Organization',
        name: 'Independent Engineering & Consulting',
      },
      knowsAbout: [
        'Next.js',
        'React Native',
        'Expo',
        'TypeScript',
        'Java',
        'AI Agent Orchestration',
        'LLM Routing',
        'SwarmXQ',
        'Spring Boot',
        'FastAPI',
        'Python',
        'Effect-TS',
        'Turborepo',
        'PostgreSQL',
        'Redis',
        'Machine Learning',
        'Fintech',
        'SRE',
        'AI Infrastructure',
        'Platform Engineering',
        'Systems Architecture',
        'Distributed Systems',
      ],
      alumniOf: [
        {
          '@type': 'Organization',
          name: 'Universal Basic Education Commission (UBEC)',
          url: 'https://ubec.gov.ng',
        },
      ],
      sameAs: [PROFILE.github, PROFILE.linkedin, siteUrl],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: PROFILE.name,
      alternateName: 'scardubu.dev',
      url: siteUrl,
      description:
        'Portfolio and engineering record for Oscar Ndugbu — staff backend and platform engineer focused on AI infrastructure, fintech systems, and production reliability.',
      inLanguage: 'en-US',
      author: { '@id': `${siteUrl}/#person` },
      copyrightHolder: { '@id': `${siteUrl}/#person` },
      copyrightYear: new Date().getFullYear(),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(syne.variable, dmSans.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              window.__commandPaletteRequested = window.__commandPaletteRequested ?? false;
              document.addEventListener('keydown', (event) => {
                if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                  event.preventDefault();
                  window.__commandPaletteRequested = true;
                  document.dispatchEvent(
                    new CustomEvent('command-palette:open', { bubbles: true })
                  );
                }
              }, { capture: true });
            })();`,
          }}
        />
        <script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
        />
      </head>

      <body className={cn('relative min-h-[100dvh] overflow-x-clip antialiased')}>
        <div className="site-grain pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <defs>
            <filter id="glass-refraction">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65 0.85"
                numOctaves="3"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="3"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <clipPath id="squircle-id" clipPathUnits="objectBoundingBox">
              <path d="M 0.500 0.000 C 0.817 0.000 0.870 0.030 0.920 0.080 C 0.977 0.136 1.000 0.183 1.000 0.500 C 1.000 0.817 0.977 0.864 0.920 0.920 C 0.870 0.970 0.817 1.000 0.500 1.000 C 0.183 1.000 0.130 0.970 0.080 0.920 C 0.023 0.864 0.000 0.817 0.000 0.500 C 0.000 0.183 0.023 0.136 0.080 0.080 C 0.130 0.030 0.183 0.000 0.500 0.000 Z" />
            </clipPath>
          </defs>
        </svg>

        <Providers>
          <DeferredCursorGlow />
          <ScrollProgress />
          <DeferredThreeBrushField />
          <Navbar />
          <DeferredCommandPalette />
          <PageWrapper>{children}</PageWrapper>
          <Footer />
        </Providers>

        {shouldLoadVercelInsights ? <Analytics /> : null}
        {shouldLoadVercelInsights ? <SpeedInsights /> : null}
        {shouldLoadVercelInsights ? <WebVitals /> : null}
      </body>
    </html>
  );
}
