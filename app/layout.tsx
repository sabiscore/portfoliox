import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
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
  title: 'Oscar Ndugbu (@Scardubu) — Principal Systems Architect & Quant Strategist',
  description:
    'Editorial anthology of fail-closed quantitative systems, memory-bounded Polars/DuckDB pipelines, and edge-native Nigerian fintech infrastructure.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#08090C] font-sans text-white antialiased selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]">
        {children}
      </body>
    </html>
  );
}
