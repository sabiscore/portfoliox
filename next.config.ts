// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
//
// next.config.ts — Canonical single-source configuration
//
// CHANGELOG v2026.10 (merge patch):
//   MERGED from next.config.mjs (now deleted):
//     · reactStrictMode: true       — React double-invocation dev guard
//     · poweredByHeader: false      — strips X-Powered-By response header (security)
//     · scrollRestoration: true     — browser-native scroll position restore
//     · images.deviceSizes          — full responsive breakpoint set
//     · images.imageSizes           — standard thumbnail/icon size set
//     · images.minimumCacheTTL      — 1-year edge cache for optimised images
//
//   KEPT from this file:
//     · MDX pipeline (withMDX + plugins)
//     · pageExtensions: ['md', 'mdx']
//     · images.qualities: [75, 88]  — production-grade WebP/AVIF quality ladder
//     · optimizePackageImports       — code-split framer-motion + lucide-react
//     · full CSP headers + HSTS + security header suite
//     · /cv redirect chain
//     · allowedDevOrigins
//
//   RATIONALE: Next.js 15 resolves next.config.ts over next.config.mjs when both
//   exist — the .mjs was silently ignored, meaning reactStrictMode, poweredByHeader,
//   scrollRestoration, full deviceSizes, and minimumCacheTTL were all dropped on
//   every deploy. This merge restores those values to the active config path.
// ─────────────────────────────────────────────────────────────────────────────

import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark-dimmed',
          keepBackground: false,
        },
      ],
    ],
  },
});

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // ── Core ──────────────────────────────────────────────────────────────────
  // Merged from next.config.mjs: React double-invocation guard in development.
  // Surfaces side-effects, missing cleanup, and impure renders before production.
  reactStrictMode: true,

  // Merged from next.config.mjs: strips X-Powered-By header.
  // Prevents fingerprinting the stack from response headers.
  poweredByHeader: false,

  // Development-only: allows localhost 127.0.0.1 as a valid origin.
  allowedDevOrigins: ['127.0.0.1'],

  // ── MDX ───────────────────────────────────────────────────────────────────
  // Required for /writing/** (rehype-pretty-code syntax highlighting, slug anchors).
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // ── Image optimisation ────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],

    // Production quality ladder: 75 (standard) + 88 (retina-grade).
    qualities: [75, 88],

    // Merged from next.config.mjs: complete responsive breakpoint coverage.
    // Without this, Next.js uses its abbreviated default set and misses
    // 750px (iPhone landscape) and 828px (iPhone Plus portrait).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Merged from next.config.mjs: standard thumbnail/icon dimension set.
    // Used for fixed-width <Image> components (e.g. avatars, project logos).
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Merged from next.config.mjs: 1-year edge TTL for optimised image variants.
    // Immutable at the CDN layer — fingerprinted by Next.js query params.
    minimumCacheTTL: 31_536_000,
  },

  // ── Compiler ──────────────────────────────────────────────────────────────
  compiler: {
    // Production: strip console.* except console.error (preserves error telemetry).
    // Development: no stripping — full console output for debugging.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    // Inline critical CSS via Critters. Requires `critters` in devDependencies.
    // Eliminates render-blocking <link rel="stylesheet"> on first paint.
    optimizeCss: true,

    // Merged from next.config.mjs: restores browser scroll position on back/forward.
    // Prevents the jarring scroll-to-top on navigation history traversal.
    scrollRestoration: true,

    // Tree-shake framer-motion and lucide-react at the module level.
    // Prevents full bundle import when only a handful of named exports are used.
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // CV path normalisation — legacy PDF/DOCX aliases
      {
        source: '/oscar-scardubu-resume.pdf',
        destination: '/cv/oscar-ndugbu-resume.pdf',
        permanent: true,
      },
      {
        source: '/cv/oscar-ndugbu-cv.pdf',
        destination: '/cv/oscar-ndugbu-resume.pdf',
        permanent: true,
      },
      {
        source: '/cv/oscar-ndugbu-cv.docx',
        destination: '/cv/oscar-ndugbu-resume.pdf',
        permanent: true,
      },
      // Blog → Writing section (v2.0 URL migration)
      { source: '/blog/:path*', destination: '/writing', permanent: true },
    ];
  },

  // ── Security headers ──────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Global: applied to every route
        source: '/(.*)',
        headers: [
          // Prevents MIME-type sniffing attacks
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Blocks clickjacking via iframe embedding
          { key: 'X-Frame-Options', value: 'DENY' },
          // Controls referer header on cross-origin navigation
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restricts browser API access — portfolio has no need for camera/mic/location
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Enables browser-level DNS prefetch for performance
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          // HSTS: 2-year max-age + includeSubDomains + preload eligibility
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Blocks Flash cross-domain policy files (defence-in-depth)
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          // Content Security Policy
          // — unsafe-eval only in development (Next.js hot reload requirement)
          // — unsafe-inline required for Next.js inline scripts and Tailwind style injection
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self'${isDev ? " 'unsafe-eval'" : ''} 'unsafe-inline' https://va.vercel-scripts.com https://vercel.live`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com https://*.public.blob.vercel-storage.com",
              "img-src 'self' data: blob: https://avatars.githubusercontent.com",
              "connect-src 'self' https://api.github.com https://vitals.vercel-insights.com https://va.vercel-scripts.com https://github-contributions-api.deno.dev https://vercel.live",
              "frame-src 'self' https://vercel.live",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      {
        // Fonts: immutable — Next.js fingerprints font filenames at build time
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // OG images: short browser TTL, long CDN TTL (revalidated at the edge)
        source: '/og(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },
    ];
  },
};

export default withMDX(nextConfig);
