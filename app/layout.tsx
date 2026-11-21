import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from './providers';
import { SITE_URL } from '@/lib/config';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const viewport: Viewport = {
  themeColor: '#08090C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Oscar Ndugbu (@Scardubu) — Staff Backend and Platform Engineer',
  description:
    'Staff Backend and Platform Engineer in Lagos, Nigeria. Engineering reliable backend services, data-intensive platforms, AI infrastructure, and resilient fintech systems.',
  manifest: '/manifest.json',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Oscar Ndugbu — Staff Backend and Platform Engineer',
    title: 'Oscar Ndugbu (@Scardubu) — Staff Backend and Platform Engineer',
    description:
      'Backend, platform, AI infrastructure, and production reliability engineering. Lagos, Nigeria · Remote.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Oscar Ndugbu — Staff Backend and Platform Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oscar Ndugbu (@Scardubu) — Staff Backend and Platform Engineer',
    description:
      'Backend, platform, AI infrastructure, and production reliability engineering. Lagos, Nigeria · Remote.',
    images: ['/twitter-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen bg-[#08090C] font-sans text-white antialiased selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-[#00D9FF] focus:bg-[#08090C] focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:text-white"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
