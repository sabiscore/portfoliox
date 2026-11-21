# Project: portfoliox (scardubu.dev)

## Architecture

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Framer Motion (`LazyMotion`), Lenis + GSAP (desktop fine-pointer only).
- **Data Flow & State**:
  - Canonical site configuration (`SITE_URL`, `CONTACT_EMAIL`, `CV_ASSET_PATH`) in `lib/config.ts`.
  - Canonical case-study domains, status tones, evidence boundaries, links, and display order (`WORK_CASE_META`, `WORK_CASE_ORDER`, `STATUS_TONE`) in `lib/work-meta.ts`.
  - MDX compilation and frontmatter parsing for `content/work/*.mdx` and `content/writing/*.mdx` in `lib/content.ts` with shared MDX styling in `mdx-components.tsx`.
  - Claims Ledger policy in `docs/claim-ledger.md` and automated validator in `scripts/audit-copy.mjs`.
  - Hybrid scroll orchestration with coarse-pointer/reduced-motion native bypass and coordinated `scrollToSection` anchor scrolling in `components/cinematic/ScrollCinemaProvider.tsx`.
  - SEO, JSON-LD, manifest, RSS, and OLED Open Graph image generation in `app/layout.tsx`, `app/lib/structured-data.ts`, `components/OGImage.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/og/route.tsx`, `app/api/og/route.tsx`, `app/work/[slug]/og/route.tsx`, `app/rss.xml/route.ts`, and `public/manifest.json`.

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | GSAP / Lenis Mobile Deferral | Bypass heavy cinematic libs on mobile/touch/reduced-motion | M1 | ORIGINAL_REQUEST §R1 |
| 2 | LazyMotion Strict Integration | Dynamic `domAnimation` loading and `m`-components | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Fine-Pointer Cursor Glow | CursorGlow isolated to `(pointer: fine)` devices | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Mobile Surface Discipline | Lightweight OLED surfaces and zero decorative clutter on mobile | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Mobile Geometry Ceilings | `IdentityCard` compact `64×64 px` portrait (`<= 130px` ceiling), balanced mobile header | M2 | ORIGINAL_REQUEST §R2 |
| 6 | Touch Target Standards | `>= 44px` interactive controls (`48px` primary hero/case-study CTAs) | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Zero Horizontal Overflow | `scrollWidth <= innerWidth` across `320px–1440px+` | M2 | ORIGINAL_REQUEST §R2 |
| 8 | WCAG 2.2 AA Contrast & A11y | Contrast, visible `#00D9FF` focus rings, multi-field form `aria-describedby` | M2 | ORIGINAL_REQUEST §R2 |
| 9 | Editorial Route Parity | Shared `Navbar` + `Footer` and `lg:` sticky sidebars across `/work/[slug]` and `/writing/[slug]` | M2 | Refinement Pass |
| 10 | Staff Backend Persona | Consistent positioning across metadata, hero, OG cards, and JSON-LD | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Evidence-Bounded Case Studies | Unified `WORK_CASE_META` status badges, evidence boundaries, and ordered index | M3 | ORIGINAL_REQUEST §R3 |
| 12 | Claims Ledger Discipline | Zero unverified metrics; strict `audit:copy` enforcement | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Anchor Navigation Precision | Lenis `anchors: false` + CSS `.lenis-smooth` override + `scrollToSection` navbar handoff | M4 | Refinement Pass |
| 14 | Single Canonical H1 Hierarchy | Exactly 1 H1 per route with structured H2/H3 landmarks | M4 | ORIGINAL_REQUEST §R4 |
| 15 | Symmetrical Footer & Contact UX | `2×4` / `4×2` footer grid, engagement formats, untruncated `<select>` options | M4 | Refinement Pass |
| 16 | Unified OLED OG & Structured Data | Canonical `/opengraph-image`, `/twitter-image`, `/work/[slug]/og`, and complete `TechArticle` / `SoftwareApplication` JSON-LD | M4 | Refinement Pass |
| 17 | Release Gate Verification | App Router contracts, UI contracts, ESLint, TypeScript, Vitest, `audit:copy`, `next build`, Playwright Chromium/Mobile Chrome | M5 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Critical Path Performance & Bundle Optimization | Features 1–4: mobile deferrals, lazy motion, runtime budgets | none | DONE |
| M2 | Responsive Geometry & Visual Polish | Features 5–9: touch targets, contrast, compact portrait, route parity | M1 | DONE |
| M3 | Claims Integrity & Systems Ledger Architecture | Features 10–12: persona uniformity, evidence boundaries, claims audit | none | DONE |
| M4 | Accessibility, Navigation Precision & SEO | Features 13–16: anchor scrolling, multi-field validation, OG/JSON-LD unification | M2, M3 | DONE |
| M5 | Release Gates & Verification | Feature 17: static contracts, unit tests, build, browser QA | M1–M4 | DONE |

## Interface Contracts

### `components/IdentityCard.tsx` ↔ Profile Picture & Media Contract

- **Canonical asset**: `public/headshot.webp` (`/headshot.webp`)
  - Intrinsic dimensions: `680 × 680 px` (`1:1` WebP VP8, `48.53 KB`)
  - Rendered frame: `relative h-16 w-16 shrink-0` (`64 × 64 px`), `fill`, `sizes="64px"`, `priority`, `className="object-cover"`
  - Contract locked by `tests/unit/milestone2-geometry.test.ts` and aligned with `next.config.ts` `imageSizes` (`64`, `128`).
  - Also referenced by `app/lib/structured-data.ts` (`Person.image`).
- **Archived source portraits on disk (unused in active UI)**:
  - `public/images/oscar-headshot.jpg` (`1086 × 1448 px`, `377.40 KB`)
  - `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`)

### `components/Navbar.tsx` ↔ Scroll & Mobile Accessibility

- Mobile menu trigger: `min-h-[44px] min-w-[44px]`, `aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}`, `aria-expanded={isMobileMenuOpen}`, `aria-controls="mobile-navigation-drawer"`.
- Same-page homepage hash links (`/#projects`, `/#failure-modes`, `/#contact`) coordinate with `useScrollCinema().scrollToSection` so headings clear the sticky 64px navbar without overshooting.

### `components/ContactSection.tsx` ↔ Validation & Accessibility

- Client-side validation checks all required fields simultaneously (`name`, `email`, `stakes`, `message`), sets `aria-invalid="true"` and per-field inline error messages linked via `aria-describedby`, and submits to `POST /api/contact`.

### `lib/work-meta.ts` ↔ Case Studies & OG Routes

- Shared metadata map (`WORK_CASE_META`), canonical order (`WORK_CASE_ORDER`), and WCAG 1.4.1 status tokens (`STATUS_TONE`) consumed by `components/ProjectsSection.tsx`, `app/work/[slug]/page.tsx`, and `app/work/[slug]/og/route.tsx`.

## Code Layout

- `app/` — Next.js App Router routes (`page.tsx`, `layout.tsx`, `providers.tsx`, `globals.css`, `work/`, `writing/`, `og/`, `api/`, `rss.xml/`, `opengraph-image.tsx`, `twitter-image.tsx`, `lib/structured-data.ts`)
- `components/` — Active homepage & shared UI (`Navbar.tsx`, `HeroSection.tsx`, `IdentityCard.tsx`, `ProjectsSection.tsx`, `ProductionPatterns.tsx`, `ContactSection.tsx`, `Footer.tsx`, `GradientMeshMotion.tsx`, `OGImage.tsx`, `ReadingProgress.tsx`, `cinematic/ScrollCinemaProvider.tsx`)
- `lib/` — Configuration, MDX content loader, case-study metadata, and utilities (`config.ts`, `content.ts`, `work-meta.ts`, `utils.ts`, `contact-schema.ts`)
- `content/` — MDX engineering case studies (`work/*.mdx`) and technical notes (`writing/*.mdx`)
- `docs/` — Authoritative claims policy (`claim-ledger.md`), release certifications, and deployment history (`deployment-history/`)
- `public/` — Canonical headshot (`headshot.webp`), archived portrait sources (`images/`), résumé PDF (`cv/oscar-ndugbu-resume.pdf`), and `manifest.json`
- `scripts/` — Verification & audit gates (`verify-app-router.mjs`, `verify-ui-contracts.mjs`, `audit-copy.mjs`)
- `tests/` & `e2e/` — Vitest unit tests (`tests/unit/`), Playwright specs (`e2e/`, `tests/`)
