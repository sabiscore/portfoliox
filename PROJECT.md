# Project: portfoliox (scardubu.dev)

## Architecture

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4 (Obsidian Nocturne v2 token system in `tailwind.config.js` + `app/globals.css`), Framer Motion (`LazyMotion`), Lenis + GSAP (desktop fine-pointer only).
- **Data Flow & State**:
  - Canonical site configuration (`SITE_URL`, `CONTACT_EMAIL`, `SENDER_EMAIL`, `CV_ASSET_PATH`) in `lib/config.ts`.
  - Canonical case-study domains, status tones, evidence boundaries, links, display order (`WORK_CASE_META`, `WORK_CASE_ORDER`, `STATUS_TONE`), and bidirectional writing↔work mapping (`WRITING_TO_WORK_SLUGS`, `getRelatedWorkForWriting`, `getRelatedWritingSlugsForWork`) in `lib/work-meta.ts`.
  - MDX compilation, frontmatter parsing, and H2 outline extraction (`extractMarkdownHeadings`, `slugifyHeading`) for `content/work/*.mdx` and `content/writing/*.mdx` in `lib/content.ts`, with shared token-styled MDX rendering (`CodeBlockClient`, `ArchDecision`, H2 anchor links) in `mdx-components.tsx`.
  - Contact validation contract (`contactSchema` with `.superRefine` dual-mode hiring/consulting rules) in `app/lib/validations.ts` consumed by `components/ContactSection.tsx` and `app/api/contact/route.ts` (deprecated `app/actions/contact.ts` removed).
  - Global lazy-loaded `⌘K` command palette (`components/DeferredCommandPalette.tsx` + `components/CommandPalette.tsx`) mounted in `app/layout.tsx` and triggered via `Ctrl/⌘+K` or the desktop `JUMP ⌘K` button in `components/Navbar.tsx`.
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
| 5 | Editorial Portrait & Mobile Geometry | `IdentityCard` `4:5` editorial portrait (`240×300`, `/images/oscar-headshot.jpg`) with scrim + desktop WebGL shader (`V20`/`V24`), `4×3` capability ledger (`V21`), and `LAGOS · REMOTE` + role-fit cue | M2 / M6 | Elevation v2 |
| 6 | Touch Target Standards | `>= 44px` (`min-h-touch`) interactive controls and `48px` (`min-h-cta`) primary hero/case-study CTAs | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Zero Horizontal Overflow | `scrollWidth <= innerWidth` across `320px–1920px` | M2 | ORIGINAL_REQUEST §R2 |
| 8 | WCAG 2.2 AA/AAA Contrast & A11y | Verified contrast matrix (`verify-contrast.mjs`), `#00D9FF` focus rings, polite live regions, and multi-field form `aria-describedby` | M2 / M6 | Elevation v2 |
| 9 | Editorial Route Parity & Outline | Shared `Navbar` + `Footer`, `lg:` sticky sidebars, `ArticleOutline` TOC + section-link copy, copyable `CodeBlockClient`, and bidirectional work↔writing cross-links | M2 / M6 | Polish v2 |
| 10 | Staff Backend Persona | Consistent Direction B plain-English positioning across hero, metadata, OG cards, résumé PDF, and JSON-LD | M3 / M6 | Elevation v2 |
| 11 | Dual-Layer Flagship Cards & Flows | `SabiScore` at `P/01`, `Plain English` ↔ `Under the hood` keyboard tablists (`ProjectCardInteractive.tsx`), 3-stage `FailureFlowStepper` inside native `<details>`, and `WORK_CASE_META` status badges | M3 / M6 | Elevation v2 |
| 12 | Claims Ledger Discipline | Zero unverified metrics; strict `audit:copy` enforcement | M3 | ORIGINAL_REQUEST §R3 |
| 13 | Anchor Navigation & Global `⌘K` | Lenis `anchors: false` + `scrollToSection` navbar handoff + lazy `DeferredCommandPalette` (`Ctrl/⌘+K` & desktop `JUMP ⌘K` with focus restoration) | M4 / M6 | Elevation v2 |
| 14 | Section 02 Trade-Off Matrix | `ProductionPatterns.tsx` **Naive default (rejected) vs. Chosen boundary** matrix deduplicated from Section 01 | M6 | Elevation v2 |
| 15 | Adaptive Dual-Mode Contact Funnel | `Hiring / Staff Role` (default quick recruiter path, `stakes` optional) vs. `Architecture & Consulting` (full scoped brief), plus one-click email copy and symmetrical `2×4` / `4×2` footer | M4 / M6 | Elevation v2 |
| 16 | Unified OLED OG, Error & 404 Surfaces | Canonical `/opengraph-image`, `/twitter-image`, `/work/[slug]/og`, complete JSON-LD, and Obsidian Nocturne v2 `/error` (with digest copy) + `/not-found` | M4 / M6 | Polish v2 |
| 17 | Release Gate Verification | App Router contracts, UI contracts (`V16–V25`), ESLint, TypeScript, Vitest (8 suites / 49 tests), `audit:copy`, `verify-contrast.mjs`, `next build`, Playwright E2E | M5 / M6 | Elevation & Polish v2 |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Critical Path Performance & Bundle Optimization | Features 1–4: mobile deferrals, lazy motion, runtime budgets | none | DONE |
| M2 | Responsive Geometry & Visual Polish | Features 5–9: touch targets, contrast, portrait contract, route parity | M1 | DONE |
| M3 | Claims Integrity & Systems Ledger Architecture | Features 10–12: persona uniformity, evidence boundaries, claims audit | none | DONE |
| M4 | Accessibility, Navigation Precision & SEO | Features 13, 15–16: anchor scrolling, multi-field validation, OG/JSON-LD unification | M2, M3 | DONE |
| M5 | Release Gates & Verification | Feature 17: static contracts, unit tests, build, browser QA | M1–M4 | DONE |
| M6 | Portfolio Elevation v2 & Secondary-Route Polish v2 | Dual-audience hero/project cards, 3-stage failure flows, Section 02 trade-off matrix, adaptive hiring/consulting funnel, global `⌘K` palette, `ArticleOutline`, `CodeBlockClient`, bidirectional work↔writing links, token-pure `/error` & `/not-found`, résumé sync | M1–M5 | DONE |

## Interface Contracts

### `components/IdentityCard.tsx` ↔ Editorial Portrait & Profile Contract

- **Active UI portrait**: `public/images/oscar-headshot.jpg` (`/images/oscar-headshot.jpg`)
  - Dimensions & frame: `PORTRAIT_WIDTH = 240`, `PORTRAIT_HEIGHT = 300` (`aspect-portrait` `4:5`), `sizes="(min-width: 1024px) 144px, (min-width: 640px) 136px, 112px"`, `quality={88}`, `priority`, `.identity-portrait-scrim`, and client-only (`ssr: false`) `HeroPortraitShader` gated to desktop fine-pointer + non-reduced-motion.
  - Footer: Pairs primary `<CopyEmail variant="primary" />` with canonical `CV_ASSET_PATH` (`RÉSUMÉ`) link (`>= 44px` touch targets) and polite live-region copy status.
  - Contracts locked by `scripts/verify-ui-contracts.mjs` (`V20`, `V22`, `V24`), `tests/unit/milestone2-geometry.test.ts`, and `e2e/refinement-verification.spec.ts`.
- **Structured-data avatar**: `public/headshot.webp` (`680 × 680 px`, `48.53 KB`) referenced as `Person.image` in `app/lib/structured-data.ts`.
- **Archived portrait copy**: `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`, unused in active UI).

### `components/Navbar.tsx` & `components/CommandPalette.tsx` ↔ Navigation & Quick-Jump

- Mobile menu trigger remains the first `<button>` in `Navbar.tsx` with `min-h-touch min-w-touch`, `aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}`, `aria-expanded={isMobileMenuOpen}`, `aria-controls="mobile-navigation-drawer"` (locked by `milestone2-geometry.test.ts`).
- Desktop `JUMP ⌘K` button dispatches `command-palette:open` (`window.__commandPaletteRequested = true`) to lazy-mount and open `CommandPalette` via `DeferredCommandPalette`; first-press `Ctrl/⌘+K` calls `event.preventDefault()` to prevent browser omnibox hijack, and closing restores focus to the triggering element.
- Same-page homepage hash links (`/#projects`, `/#failure-modes`, `/#contact`) coordinate with `useScrollCinema().scrollToSection`.

### `components/ContactSection.tsx` ↔ Adaptive Validation & API Contract

- Dual-mode intent selector (`Hiring / Staff Role` default vs. `Architecture & Consulting`):
  - `hiring` mode submits `inquiryType: 'job'`, optional `company`, `scope: undefined`, `stakes: ''`, `timeline`, and `message`.
  - `consulting` mode submits `inquiryType` (`consulting` | `collaboration` | `advisory`), `timeline`, `scope`, required `stakes` (`>= 5` chars enforced by `contactSchema.superRefine` in `app/lib/validations.ts`), and `message`.
- Client-side validation reports simultaneous multi-field `aria-invalid` + per-field inline errors (`aria-describedby`) and submits to `POST /api/contact` (`app/api/contact/route.ts`).

### `lib/work-meta.ts` & `lib/content.ts` ↔ Case Studies, Writing & Outline Sync

- `WORK_CASE_META`, `WORK_CASE_ORDER` (`sabiscore` first), `STATUS_TONE`, and bidirectional `WRITING_TO_WORK_SLUGS` helpers (`getRelatedWorkForWriting`, `getRelatedWritingSlugsForWork`) drive `ProjectsSection.tsx`, `app/work/[slug]/page.tsx`, `app/work/[slug]/og/route.tsx`, `app/writing/page.tsx`, and `app/writing/[slug]/page.tsx`.
- `extractMarkdownHeadings` + `slugifyHeading` in `lib/content.ts` match `rehype-slug` (`github-slugger`) IDs so `components/ArticleOutline.tsx` tracks active H2 headings accurately and copies direct section URLs.

## Code Layout

- `app/` — Next.js App Router routes (`page.tsx`, `layout.tsx`, `providers.tsx`, `globals.css`, `error.tsx`, `not-found.tsx`, `work/`, `writing/`, `og/`, `api/`, `rss.xml/`, `opengraph-image.tsx`, `twitter-image.tsx`, `lib/structured-data.ts`, `lib/validations.ts`)
- `components/` — Active homepage & shared UI (`Navbar.tsx`, `HeroSection.tsx`, `IdentityCard.tsx`, `ProjectsSection.tsx`, `ProjectCardInteractive.tsx`, `ProductionPatterns.tsx`, `ContactSection.tsx`, `Footer.tsx`, `CommandPalette.tsx`, `DeferredCommandPalette.tsx`, `ArticleOutline.tsx`, `CodeBlockClient.tsx`, `ArchDecision.tsx`, `GradientMeshMotion.tsx`, `OGImage.tsx`, `ReadingProgress.tsx`, `shared/StaticSectionIntro.tsx`, `cinematic/ScrollCinemaProvider.tsx`, `cinematic/HeroPortraitShader.tsx`)
- `lib/` — Configuration, MDX content loader, case-study metadata & cross-links, and utilities (`config.ts`, `content.ts`, `work-meta.ts`, `utils.ts`)
- `content/` — MDX engineering case studies (`work/*.mdx`) and technical notes (`writing/*.mdx`)
- `docs/` — Authoritative claims policy (`claim-ledger.md`), release certifications, and deployment history (`deployment-history/`)
- `public/` — Editorial portrait (`images/oscar-headshot.jpg`), structured-data headshot (`headshot.webp`), canonical résumé PDF (`cv/oscar-ndugbu-resume.pdf`) + synchronized legacy alias (`oscar-scardubu-resume.pdf`), and `manifest.json`
- `scripts/` — Verification & audit gates (`verify-app-router.mjs`, `verify-ui-contracts.mjs`, `verify-contrast.mjs`, `audit-copy.mjs`, `build-next.mjs`, `validate-build.sh`)
- `tests/` & `e2e/` — Vitest unit tests (`tests/unit/`, including `polish-contracts.test.ts`), Playwright specs (`e2e/`, `tests/`)
