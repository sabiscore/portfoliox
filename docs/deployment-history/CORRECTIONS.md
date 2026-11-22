# Corrections

This file is reserved for release corrections and follow-up notes for the portfolio production surface.

## 2026-11-22 — Portfolio Elevation v2, Secondary-Route Polish v2 & Résumé Sync

**Changes applied (Patch 01 — `scardubu-portfolio-upgrade.patch` + integration hardening):**
- **Hero & Identity Card positioning (`components/HeroSection.tsx`, `components/IdentityCard.tsx`)**: Refined Direction B plain-English subheadline and all four `Design focus` cards within `docs/claim-ledger.md` boundaries; updated `IdentityCard` badge to `LAGOS · REMOTE`, added a single-line role-fit cue (`Staff / Principal roles · Scoped architecture & reliability reviews`), updated CTA label to `RÉSUMÉ`, and preserved the `240 × 300 px` `4:5` editorial portrait (`/images/oscar-headshot.jpg`) + `4 × 3` capability ledger (`V20`–`V24`).
- **Dual-layer flagship project cards & failure-boundary flows (`components/ProjectCardInteractive.tsx`, `components/ProjectsSection.tsx`, `lib/work-meta.ts`, `content/work/swarmxq.mdx`, `content/work/hashablanca.mdx`, `content/work/ml-consulting.mdx`, `app/globals.css`)**: Promoted `SabiScore` (`PUBLIC DEMO`) to `P/01`; unified naming to `The Yap Engine` with a symmetrical `2 × 2` stack grid; added keyboard-navigable (`ArrowLeft`/`ArrowRight`/`Home`/`End`) `Plain English` ↔ `Under the hood` segmented tablists with `.card-panel-stable` height stability; embedded interactive 3-stage `FailureFlowStepper` modules inside native `<details>` disclosures (`How it works`); added scannable one-line hooks to the `P/01`–`P/04` index; tightened secondary case-study frontmatter summaries to prevent mid-sentence clipping.
- **Section 02 deduplication & trade-off matrix (`components/ProductionPatterns.tsx`)**: Replaced Section 01 repetition with a distinct **Naive default (rejected) vs. Chosen boundary** comparison matrix using pure Obsidian Nocturne v2 tokens.
- **Adaptive recruiter-first contact funnel (`components/ContactSection.tsx`, `app/lib/validations.ts`, `app/api/contact/route.ts`, `tests/unit/contact-validation.test.ts`, `e2e/smoke.spec.ts`, `tests/portfolio.spec.ts`)**: Added a 2-mode intent toggle (`Hiring / Staff Role` default vs. `Architecture & Consulting`); updated `contactSchema` via `.superRefine` so `stakes` is optional strictly for `inquiryType: 'job'` while remaining required for consulting/advisory/collaboration inquiries; cleared unselected `scope` in hiring submissions and normalized blank-field email formatting (`|| '-'`).
- **Global `⌘K` quick navigation & integration refinements (`app/layout.tsx`, `components/Navbar.tsx`, `components/DeferredCommandPalette.tsx`, `components/CommandPalette.tsx`, `app/page.tsx`, `scripts/verify-ui-contracts.mjs`)**: Mounted `<DeferredCommandPalette />` globally in `app/layout.tsx`; added desktop `JUMP ⌘K` button in `Navbar.tsx` ordered safely after the mobile drawer `<button>` (`milestone2-geometry.test.ts`); added `event.preventDefault()` on initial `Ctrl/⌘+K` capture in `DeferredCommandPalette.tsx` to prevent browser address-bar hijack; added focus restoration on palette close and synced `SabiScore`-first subtitle in `CommandPalette.tsx`; aligned `app/page.tsx` root wrapper to Obsidian Nocturne v2 tokens and extended `verify-ui-contracts.mjs` V23 checks to `ProjectCardInteractive.tsx` and `ProductionPatterns.tsx`.

**Changes applied (Patch 02 — `scardubu-portfolio-polish-v2.patch`):**
- **Secondary-route navigation, outlines & bidirectional linking (`components/ArticleOutline.tsx`, `lib/content.ts`, `lib/work-meta.ts`, `app/work/[slug]/page.tsx`, `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`, `app/globals.css`)**: Added `extractMarkdownHeadings` + `slugifyHeading` (`github-slugger`-compatible) powering sticky `ArticleOutline` ("On this page" TOC + one-click section-link copy) on `/work/[slug]` and `/writing/[slug]`; added `WRITING_TO_WORK_SLUGS`, `getRelatedWorkForWriting`, and `getRelatedWritingSlugsForWork` to cross-link case studies and engineering notes bidirectionally; migrated `/writing`, `/writing/[slug]`, `/work/[slug]`, `ArchDecision.tsx`, `Footer.tsx`, and `StaticSectionIntro.tsx` to pure Obsidian Nocturne v2 tokens.
- **MDX code-block & heading ergonomics (`components/CodeBlockClient.tsx`, `mdx-components.tsx`)**: Wrapped MDX `<pre>` blocks in `CodeBlockClient` with language header, accessible `COPY` button + polite live region, and `.mdx-code-pre` styling; added hover/focus `#` permalink anchors to rendered `h2` headings.
- **Fault-isolation & 404 polish + dead-code removal (`app/error.tsx`, `app/not-found.tsx`, `app/actions/contact.ts`, `tests/unit/polish-contracts.test.ts`)**: Upgraded `/error` with one-click error-digest copy and token-pure layout; refined `/not-found` recovery links; deleted deprecated, unreferenced `app/actions/contact.ts`; added 5 unit contract tests in `tests/unit/polish-contracts.test.ts`.
- **Résumé asset sync (`public/cv/oscar-ndugbu-resume.pdf`, `public/oscar-scardubu-resume.pdf`)**: Installed the latest résumé PDF (`111,535 bytes`, `SHA-256: eb8df0e95a0a66f629d921373b052ae789767e86bcf3612e11b9c685f8109343`) to both the canonical `/cv/oscar-ndugbu-resume.pdf` asset and the redirected `/oscar-scardubu-resume.pdf` legacy path.
- **Documentation refresh (`README.md`, `PROJECT.md`, `docs/deployment-history/SETUP_AND_IMPLEMENTATION.md`, `docs/deployment-history/BLOG_GUIDE.md`, `docs/deployment-history/CORRECTIONS.md`)**: Updated active docs to reflect the `4:5` editorial portrait contract, dual-layer cards, adaptive contact funnel, global `⌘K` palette, secondary-route outlines, and verified release gates.

**Validation after Elevation v2 + Polish v2:**
- `pnpm run prebuild` (`verify-app-router`, `verify-ui-contracts` V16–V25, `eslint .`, `tsc --noEmit -p tsconfig.typecheck.json`, `vitest run` 8 files / 49 tests, `audit:copy`): **PASSED** (exit `0`).
- `node scripts/verify-contrast.mjs`: **PASSED** (WCAG AA/AAA contrast matrix verified).
- `pnpm run build` (`next build`): **PASSED** (28/28 routes built cleanly).
- Playwright Chromium (`e2e/smoke.spec.ts`, `e2e/refinement-verification.spec.ts`, `tests/portfolio.spec.ts`, `tests/e2e/`): **PASSED** (39 passed, 2 pre-existing skipped, 0 failed).

## 2026-11-21 — Production portfolio refinement, conversion optimization & profile asset verification

**Profile picture audit (confirmed against repository source and disk assets):**
- Canonical active asset: `public/headshot.webp` (`/headshot.webp`), intrinsic size `680 × 680 px` (`1:1` WebP VP8, `48.53 KB` — within the `≤ 80 KB` asset budget).
- Active rendering in `components/IdentityCard.tsx`: `64 × 64 px` (`h-16 w-16`, `fill`, `sizes="64px"`, `priority`, `object-cover`), matching the `1:1` source ratio, `next.config.ts` `imageSizes` (`64`, `128`), and the `tests/unit/milestone2-geometry.test.ts` mobile geometry lock. Also referenced as `Person.image` in `app/lib/structured-data.ts`.
- Unreferenced archive copies confirmed on disk: `public/images/oscar-headshot.jpg` (`1086 × 1448 px`, `377.40 KB`) and `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`).

**Changes applied:**
- **Anchor navigation precision (`app/globals.css`, `components/cinematic/ScrollCinemaProvider.tsx`, `components/Navbar.tsx`)**: Added `.lenis.lenis-smooth { scroll-behavior: auto !important; }`, disabled Lenis's competing `anchors` handler (`anchors: false`), removed the inverted `-sectionOffset` (`+88px`) offset, and wired same-page homepage hash links in both desktop and mobile navigation through `useScrollCinema().scrollToSection`. Eliminated the ~378px desktop overshoot and 1-frame teleport flash so target headings clear the sticky 64px navbar cleanly.
- **Contact conversion & WCAG a11y (`components/ContactSection.tsx`)**: Added scannable engagement-format framing, shortened `<select>` option labels (`Architecture / consulting`, `Staff / principal role`, `Advisory / leadership`, `Exploring / flexible`) to eliminate mid-word clipping at `375px–1440px`, and replaced single-field validation with simultaneous multi-field `aria-invalid` + per-field inline error messages linked via `aria-describedby`.
- **Footer & mobile IdentityCard polish (`components/Footer.tsx`, `components/IdentityCard.tsx`, `components/HeroSection.tsx`)**: Replaced ragged footer link wrapping with a symmetrical `grid-cols-2 sm:grid-cols-4` (`2×4` mobile, `4×2` tablet/desktop) layout including LinkedIn and RSS; paired `ENGINEERING PROFILE` and `LAGOS, NG` on a single top row in `IdentityCard.tsx` to eliminate mobile badge orphaning; added canonical LinkedIn link in `HeroSection.tsx`.
- **Unified case-study metadata & route parity (`lib/work-meta.ts`, `components/ProjectsSection.tsx`, `app/work/layout.tsx`, `app/work/[slug]/page.tsx`, `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`, `mdx-components.tsx`)**: Centralized project domains, WCAG 1.4.1 status badges, evidence boundaries, links, and `WORK_CASE_ORDER`; added `<Footer />` to `/work/*`; aligned `/writing/[slug]` sticky sidebar to `lg:` (`1024px+`), replaced `Surface: Technical Monograph` with `Author: Oscar Ndugbu`, and completed `TechArticle` JSON-LD (`image`, `publisher`, `dateModified`, `mainEntityOfPage`); refined MDX links, headings (`scroll-mt-24`), and prose spacing.
- **MDX accuracy & unified OLED OG/manifest (`content/work/sabiscore.mdx`, `content/work/ml-consulting.mdx`, `components/OGImage.tsx`, `app/layout.tsx`, `app/lib/structured-data.ts`, `app/og/route.tsx`, `app/api/og/route.tsx`, `app/work/[slug]/og/route.tsx`, `public/manifest.json`)**: Updated SabiScore demo link to `https://sabiscore.app`, linked ML Consulting CTA to `/#contact`, replaced stale `/og-image.png` placeholder references with `/opengraph-image` / `/twitter-image`, unified `/og`, `/api/og`, and `/work/[slug]/og` to `<OGImage />`, and aligned manifest colors to `#08090C`.
- **Documentation refresh (`README.md`, `PROJECT.md`, `docs/deployment-history/CORRECTIONS.md`, `docs/deployment-history/SETUP_AND_IMPLEMENTATION.md`, `docs/deployment-history/BLOG_GUIDE.md`, `docs/release-certification-2026-08-26.md`)**: Cleaned corrupted `[span_N]` tags, aligned docs with the claim ledger and active App Router architecture, and recorded canonical profile-picture specs.

**Validation after the November 21 refinement pass:**
- `pnpm run prebuild` (`verify-app-router`, `verify-ui-contracts` V16–V19, `eslint .`, `tsc --noEmit -p tsconfig.typecheck.json`, `vitest run` 5 files / 25 tests, `audit:copy`): **PASSED** (exit `0`).
- `pnpm run build` (`next build`): **PASSED** (28/28 static routes generated cleanly).
- Playwright Chromium (`e2e/smoke.spec.ts`, `tests/portfolio.spec.ts`, `e2e/scroll-responsiveness.spec.ts`, `tests/e2e/user-journey.spec.ts`) & Mobile Chrome (`e2e/smoke.spec.ts`): **PASSED** (35 passed / 2 pre-existing skipped on Chromium; 19 passed / 2 skipped on Mobile Chrome; 0 failed).
- Live browser visual/DOM QA across `1440×900`, `1024×800`, and `375×812`: **PASSED** (0 console errors, 0 failed network requests, anchor clearance verified, 4-field validation verified, zero mobile overflow, sticky sidebars verified).
- Pre-existing failure note: `e2e/scroll-engine.spec.ts` remains broken against retired legacy selectors (`.site-grain`, `body.nav-open`, `#section-testimonials`, `.metrics-grid`) removed prior to this pass; WebKit/Firefox binaries were not installed locally.

## 2026-06-05 — API hardening: query bounds, analytics sanitisation, rate-limit map pruning + formatter pass

**Full codebase audit findings (all non-functional issues confirmed clean):**
- TypeScript strict-mode: zero errors. ESLint: zero errors. No `as any`, no `@ts-ignore`.
- All `target="_blank"` links confirmed with `rel="noopener noreferrer"`.
- No draft-gated content leaking to production (draft filter in `lib/blog.ts` line 75 guards `NODE_ENV`).
- All referenced public assets (`/headshot.webp`, `/images/oscar-headshot.jpg`, `/images/scar-headshot.jpeg`, `/cv/oscar-ndugbu-resume.pdf`) confirmed present.
- Security headers verified: CSP, HSTS (63072000s + preload), `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Permissions-Policy`, `Referrer-Policy`.
- Deprecated `app/actions/contact.ts` confirmed unused (zero imports). Live path: `ContactSection.tsx → /api/contact → app/api/contact/route.ts`.

**Changes applied:**

- `app/api/blog/search/route.ts` — Added `.slice(0, 200)` on the query string after trim. Prevents runaway OpenAI token spend if a client sends an arbitrarily large search query; the semantic search path only calls the embeddings API when `queryWords.length >= 2 && OPENAI_API_KEY` is set.

- `app/api/blog/analytics/route.ts` — Added `sanitizeRecord()` function that truncates `path` (500), `query` (200), `slug` (200), `tag` (100), `userAgent` (500), and `referrer` (500) before forwarding to the webhook. Prevents oversized payloads reaching the external analytics sink.

- `app/api/contact/route.ts` — Added `pruneRateLimitMap()` that sweeps expired entries (older than `RATE_LIMIT_WINDOW_MS`) from the in-memory map on every `isRateLimited()` call. Prevents the map from growing unbounded in long-lived warm serverless instances.

- `README.md` — Prettier reformatted Markdown tables (column-padding alignment). No content changes.

- `app/globals.css` — Prettier normalised CSS string quotes (`"…"` → `'…'`) and removed trailing whitespace on two blank lines. No functional change.

Validation after the June 5 hardening pass:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm exec eslint app/api/blog/search/route.ts app/api/blog/analytics/route.ts app/api/contact/route.ts` passed with zero errors.

## 2026-06-05 — Scroll-engine boot-path lock + proof-grid centering + regression test coverage

- Added a synchronous `coarsePointerAtBoot` guard in `components/cinematic/ScrollCinemaProvider.tsx` to eliminate the first-render race where touch/coarse-pointer devices could briefly initialise Lenis before the pointer-state `useEffect` had fired. The `window.matchMedia('(pointer: coarse)').matches` check runs synchronously at the top of the Lenis init effect alongside the existing `isTouchDevice` state guard.
- Changed `margin-inline: 0` to `margin-inline: auto` in the `.metrics-grid` ultrawide CSS rule in `app/globals.css` so the 1280px-capped proof grid is centred within the section container at viewport widths ≥ 1536px.
- Updated inline comment in `components/TestimonialsSection.tsx` to reflect the centred grid behaviour.
- Added `e2e/scroll-engine.spec.ts` with regression tests across three suites: scroll engine boot path (`data-scroll-engine = 'lenis'` on desktop fine-pointer, `'native'` on coarse-pointer/mobile), mobile menu scroll restoration (`position:fixed` lock + `window.scrollTo` restore), and proof grid centering at 1920 px and 2560 px viewports.

Validation after the June 5 patch:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --project=mobile-chrome --workers=1 --timeout=120000` passed with 35 tests passed and 5 expected skips.
- `pnpm exec playwright test e2e/scroll-engine.spec.ts --project=chromium --project=mobile-chrome --workers=1 --timeout=120000` passed with 14 tests passed and 2 expected skips.

## 2026-06-02 — Scroll-engine hardening + availability surface integration pass

- Hardened `components/cinematic/ScrollCinemaProvider.tsx` so coarse-pointer devices and reduced-motion sessions now bypass Lenis entirely, fall back to the native scroll engine on boot, and still preserve cinematic chapter tracking through the existing native scroll progress path.
- Added GSAP ticker lag smoothing in `components/cinematic/ScrollCinemaProvider.tsx` to guard against large accumulated frame deltas after browser background/foreground transitions, reducing the risk of stuck mid-scroll positions on mobile browsers.
- Tightened availability-surface semantics across `components/Navbar.tsx`, `components/HeroSection.tsx`, and `components/AboutSection.tsx`:
  - Hero and About now expose explicit availability test hooks.
  - The About chip now uses the canonical `HERO.availability` string instead of a stale hardcoded variant.
  - The desktop navbar CTA keeps its compact visual copy but now exposes an action-focused accessibility label, preventing it from colliding with status-surface selectors.
- Improved mobile menu accessibility in `components/Navbar.tsx` by expanding the toggle label from generic “Open menu” / “Close menu” wording to explicit “Open navigation menu” / “Close navigation menu”.
- Refreshed Playwright coverage to target current UI contracts in `e2e/smoke.spec.ts`, `tests/e2e/smoke.spec.ts`, and `tests/portfolio.spec.ts`, replacing stale assumptions about generic availability selectors, legacy kicker DOM structure, class-based fixed-nav checks, old skills-filter controls, and retired live-activity fallback copy.

Validation after the June 2 integration pass:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run lint` passed with zero lint errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --project=mobile-chrome --workers=1` passed with 35 tests passed and 5 expected skips.
- `pnpm exec playwright test tests/e2e/smoke.spec.ts --project=chromium --project=mobile-chrome --workers=1` passed with 8 tests passed and 2 expected skips.
- `pnpm exec playwright test tests/portfolio.spec.ts --project=chromium --workers=1` passed with 64 tests passed and 1 expected skip.

## 2026-05-26 — Navbar + chapter rail harmonization and Lighthouse-focused perf pass

- Tightened the global chrome to match the upgraded hero by refactoring `components/Navbar.tsx` and `components/ScrollProgress.tsx` to use dedicated visual-system classes (hero-nav shell, active nav background states, mobile nav panel/item states, chapter rail shell/dot/tooltip states) instead of scattered inline styles.
- Added a dedicated harmonization layer in `app/globals.css` for nav + chapter rail (`HARMONIZATION v2026.10`) with chapter-accent-aware borders, ambient gradients, indicator glow, and reduced-motion-safe transitions.
- Improved hero LCP behavior in `components/HeroSection.tsx` and `components/IdentityCard.tsx` by making headshot image priority viewport-aware (`priority` prop) so the visible portrait variant gets eager/high fetch priority while the hidden variant defaults to lazy/auto.
- Reduced early homepage JS pressure by deferring heavy client surfaces:
  - `components/DeferredCommandPalette.tsx` now mounts `CommandPalette` only after explicit command intent (`⌘K` / `command-palette:open`), preserving early-open behavior via `window.__commandPaletteRequested`.
  - `components/cinematic/DeferredThreeBrushField.tsx` defers `ThreeBrushField` mount and skips low-power paths (`max-width: 639px`, coarse pointer, reduced motion).
  - `components/HeroSection.tsx` now delays `HeroVisual` mount briefly on desktop and renders a lightweight glass placeholder first.
- Hardened build reliability and reduced non-critical font overhead in `app/layout.tsx` by removing remote Google-font imports for JetBrains Mono and Playfair Display (mono/didone now resolve via existing CSS fallback stacks), while keeping Syne + DM Sans for core brand/body rendering.

Validation after navbar/rail + performance pass:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run lint` passed with zero lint errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --project=mobile-chrome --workers=1` passed with 35 tests passed and 5 expected skips.

Lighthouse execution note:

- `pnpm run lhci` failed because `lhci` is not installed in this environment (`sh: 1: lhci: not found`).
- Fallback attempt `pnpm dlx @lhci/cli@0.15.1 autorun` failed with npm registry network timeouts (`ETIMEDOUT` / `ERR_PNPM_META_FETCH_FAIL`), so a fresh Lighthouse score sweep could not be completed in this session.

## 2026-05-26 — Mobile hero recovery + final integration cleanup

- Fixed the mobile luxury identity card in `components/HeroSection.tsx` by aligning the mobile `next/image` `sizes` contract with the actual portrait frame, replacing the percentage-driven mobile width with deterministic card bounds, and keeping `/public/headshot.webp` as the canonical asset.
- Resolved telemetry pill clipping in `components/HeroSection.tsx` by splitting desktop and mobile badge treatments: desktop keeps the single-line premium pill, while mobile now uses bounded insets, wrap-safe copy, and tighter mono sizing so the badge stays inside the frame at 320px-768px.
- Removed the mobile hero bottom-crop regression in `components/HeroSection.tsx` and `app/globals.css` by relaxing outer hero clipping on non-desktop breakpoints and adding mobile-only headline descender/bottom-spacing tokens.
- Restored normal vertical gesture flow over the hero carousel in `app/globals.css` by changing `.mobile-carousel` touch behavior from `pan-x` to `pan-x pan-y`, preserving horizontal swipe without trapping page scroll.
- Cleared the remaining Lenis hook lint warning in `hooks/useLenisScroll.ts` by removing the dependency-array spread pattern, simplifying subscribers to a stable callback-ref model, and updating the writing-route consumers in `hooks/useReadingProgress.ts`, `components/BlogProgressWidget.tsx`, and `components/BlogReadingProgressTracker.tsx`.
- Applied a final UI hygiene pass in `components/Liveactivitybar.tsx` by replacing the invalid `text-ellipsis` utility with `truncate`, keeping the live activity row visually stable and semantically unchanged.

Validation after the mobile hero recovery + final integration cleanup:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --workers=1` passed with 18 tests passed and 2 expected skips.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=mobile-chrome --workers=1` passed with 17 tests passed and 3 expected skips.

## 2026-05-26 — Phase 2 integration pass (O2 + O4 + O5 + O6 + O7)

- Migrated brand typography in `app/layout.tsx` from inline fallback variables to self-hosted `next/font/google` assignments for Syne, DM Sans, JetBrains Mono, and Playfair Display, then aligned `tailwind.config.ts` to the semantic font-variable contract already consumed by `app/globals.css`.
- Removed dead reveal scaffolding by deleting `components/ScrollRevealInit.tsx`, `hooks/useScrollReveal.ts`, and `components/ui/SubtleParallaxWrapper.tsx`, and by dropping the stale barrel export from `hooks/index.ts`.
- Exposed `lenisRef` from `components/cinematic/ScrollCinemaProvider.tsx`, added shared `hooks/useLenisScroll.ts`, and refactored `components/BlogReadingProgressTracker.tsx`, `components/BlogProgressWidget.tsx`, and `hooks/useReadingProgress.ts` so writing-route progress UI now rides one Lenis/native scroll source instead of three separate `window` listeners.
- Added chapter-accent project-card hover glow styling in `app/globals.css` and applied it across all project card variants in `components/ProjectsSection.tsx`.
- Elevated the hero conviction metrics in `components/HeroSection.tsx` and `app/globals.css` with glass stat pills, stronger numeric hierarchy, and restored mobile proof-carousel active-dot state.
- Replaced the flaky `networkidle` wait in `tests/e2e/smoke.spec.ts` with `load`, matching the actual readiness contract of the homepage while background live activity requests remain active.

Validation after Phase 2 integration:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --workers=1` passed with 18 tests passed and 2 expected skips.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=mobile-chrome --workers=1` passed with 17 tests passed and 3 expected skips.
- `pnpm exec playwright test tests/e2e/smoke.spec.ts --project=mobile-chrome --workers=1` passed with 4 tests passed and 1 expected skip.

## 2026-05-26 — Phase 1 stability hardening (O0 + O1 + O3)

- Hardened cinematic startup in `components/cinematic/ScrollCinemaProvider.tsx` by removing module-scope GSAP registration, adding guarded runtime registration, and adding safe ScrollTrigger refresh/update wrappers so mobile initialization failures degrade safely instead of blank-screening.
- Added `ScrollCinemaStaticProvider` fallback path in `components/cinematic/ScrollCinemaProvider.tsx` and wrapped cinematic composition in `components/CinematicErrorBoundary.tsx` via `app/providers.tsx` so failures downgrade to static native scroll context without breaking consumers of `useScrollCinema()`.
- Guarded `gsap.context()` setup in `hooks/useChapterTimeline.ts` with try/catch and null-safe cleanup so timeline bootstrap errors no longer cascade to root-level runtime crashes.
- Restored Lenis-to-ScrollTrigger post-scroll sync in `components/cinematic/ScrollCinemaProvider.tsx` with explicit subscribe/unsubscribe symmetry (`lenis.on/off('scroll', syncScrollTrigger)`), keeping ticker ownership intact.
- Upgraded the existing floating command affordance in `components/CommandPalette.tsx` into an accessible quick-actions FAB: expandable contact shortcut (`Tell me your constraints`), command palette shortcut (`⌘K` dispatch path), Escape collapse, focus trapping when expanded, and safe-area-aware fixed positioning with chapter-accent glow.

Validation after Phase 1 implementation:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --workers=1` passed with 18 tests passed and 2 expected skips.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=mobile-chrome --workers=1` completed with 16 tests passed, 3 expected skips, and 1 flaky retry pass caused by an existing `networkidle` wait in `tests/e2e/smoke.spec.ts`.

## 2026-05-26 — Follow-up interaction harmonization

- Harmonized remaining high-traffic focus states in `components/ProjectsSection.tsx`, `components/OpenSourceSection.tsx`, `components/WritingSection.tsx`, `components/skills/SkillsMap.tsx`, `components/ProductionPatterns.tsx`, and `components/ThemeToggle.tsx` so keyboard rings now use the chapter-accent system instead of older white-only values.
- Refined `components/AboutSection.tsx` so the desktop profile headshot hover effect fully respects `prefers-reduced-motion`.
- Deepened hover cohesion in `app/globals.css` by giving `article-card` and `cert-card` the same token-driven hover shadow language used by the rest of the glass card system.
- Cleaned the working tree by removing stale Lighthouse JSON artifacts that were not part of the tracked source tree.

Validation after follow-up harmonization:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --workers=1` passed with 18 tests passed and 2 expected skips.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=mobile-chrome --workers=1` passed with 17 tests passed and 3 expected skips.

## 2026-05-26 — Final production polish pass

- Fixed the last mobile smoke accessibility blocker in `components/Footer.tsx` by lifting the inherited footer status line color on small screens, allowing the `SystemStatus` full-label copy to clear WCAG AA contrast.
- Tightened keyboard affordances in `components/ScrollProgress.tsx` with explicit `focus-visible` ring treatment on chapter rail buttons so the active target remains visible during keyboard and assistive navigation.
- Stabilized `components/Liveactivitybar.tsx` by locking both the skeleton and resolved activity row to the same 24px height, reducing small but repeatable layout movement on load.
- Hardened `components/CommandPalette.tsx` focus restoration so closing the palette falls back to `#main-content` when the original trigger is no longer focusable.
- Refined `components/SkillsSection.tsx` with a proper list-versus-radar segmented control (`tablist`/`tabpanel`) instead of a binary switch copy, improving both polish and accessibility.
- Added adaptive quality scaling to `components/cinematic/ThreeBrushField.tsx`, lowering the frame budget and pixel ratio on constrained devices or under sustained slow-frame pressure while keeping the existing Lenis + ScrollTrigger + Three.js architecture intact.

Validation after final production polish:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm run build` passed cleanly on Next.js 15.5.10.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=mobile-chrome --workers=1` passed with 17 tests passed and 3 expected skips.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --workers=1` passed with 18 tests passed and 2 expected skips.
- Fresh Lighthouse collection could not be rerun in this environment because the `lighthouse` CLI is not installed locally and the registry fetch for `pnpm dlx lighthouse` failed with network timeouts.

## 2026-05-25 — Cinematic Scroll Stabilization v2 final polish and sign-off

- Fixed a reintroduced hero proof-carousel regression in `components/HeroSection.tsx` where the active dot class string lost the required leading space (`carousel-dot active`), restoring the active chapter pill state.
- Improved Command Palette responsiveness in `components/CommandPalette.tsx` by making pointer-mode detection reactive to media-query changes instead of one-time mount detection.
- Simplified `components/ScrollProgress.tsx` by removing a no-op inline style allocation on chapter dots, reducing render noise and keeping the rail fully CSS-driven.
- Kept the reduced-motion hardening from this stabilization cycle in `app/globals.css`, including explicit animation shutdown for `.live-bar-dot`.

Validation after final polish:

- `pnpm run type-check` passed with zero TypeScript errors.
- `pnpm build` passed cleanly with 27/27 static pages generated.
- `pnpm exec playwright test e2e/smoke.spec.ts --project=chromium --workers=1` passed with 18 tests passed and 2 pre-existing skips (`command palette global trigger`, `nav links scroll to matching sections`).

## 2026-05-21 — Cinematic Homepage Integration hardening

## 2026-05-22 — Production readiness integration pass

- Vercel install remediation: replaced the unconditional `prepare` script in `package.json` with a CI/Vercel guard so `pnpm install` no longer fails on missing Husky bootstrap binaries during deployment builds.
- Deployment note: local Git hook setup remains intact via `pnpm exec husky`, but production installs now skip lifecycle hook wiring cleanly.
- Smoke stability hardening: replaced index-based target-blank link assertions with snapshot-based `evaluateAll` checks in smoke suites and relaxed brittle page-readiness assumptions that intermittently flaked under CI timing.

- Follow-up quick win: moved `ThreeBrushField` mount in `app/layout.tsx` to `next/dynamic` (code-split import with loading fallback) to reduce startup pressure from the heavy Three.js path and improve Lighthouse JS-execution profile on first paint.
- Accessibility micro-audit pass: verified skip-link target coverage (`#main-content`) across homepage, writing routes, and work detail routes; no anchor-target regressions found.
- Bundle hotspot audit: confirmed `three` import is isolated to `components/cinematic/ThreeBrushField.tsx`; no additional heavy library leaks discovered in app-level route components.

- Centralized global Framer Motion policy in `app/providers.tsx` via `MotionConfig` with `reducedMotion="user"` and a shared spring default (`stiffness: 280`, `damping: 26`) to align app-wide interaction feel.
- Simplified `components/MotionProvider.tsx` to LazyMotion-only responsibility (`domAnimation` feature loading), removing nested MotionConfig overrides and reducing configuration drift.
- Hardened command palette status fetch lifecycle in `components/CommandPalette.tsx` with `AbortController` cancellation and `AbortError` guard to prevent stale state updates after unmount.
- Added Next.js production optimization flags in `next.config.ts`: `compiler.removeConsole` (preserving `error`) and `experimental.optimizePackageImports` for `framer-motion` and `lucide-react`.
- Preserved all existing accessibility and smoke-contract requirements, including live activity status semantics and mobile overflow guardrails.
- Validation: `pnpm run lint`, `pnpm run type-check`, and `pnpm run build` pass after integration; smoke suite remains green in this environment (16 passed / 3 skipped).

- Finalized chapter-wrapper migration for homepage sections (`Projects`, `Open Source`, `Skills`, `About`, `Writing`, `Contact`) and removed JSX structural regressions introduced during wrapper conversion.
- Canonicalized cinematic provider usage by collapsing legacy `lib/cinematic/ScrollCinemaProvider.tsx` into a compatibility re-export that points at `components/cinematic/ScrollCinemaProvider.tsx`.
- Completed cinematic semantics pass using `data-cinematic` markers across chapter content blocks (`eyebrow`, `title`, `lede`, `panel`, `card`, `proof`, `cta`, `media`) to align timeline orchestration.
- Fixed `HeroSection` counter animation effect dependency handling to prevent stale closure behavior when stat values update.
- Removed redundant ARIA role attributes from native footer lists to reduce accessibility noise while preserving behavior.
- Replaced deprecated `THREE.Clock` usage in `ThreeBrushField` with `performance.now()` elapsed-time tracking to eliminate build-time deprecation warnings.
- Retained justified dynamic inline styles with explicit lint suppression comments in cinematic and navigation surfaces where runtime color data cannot be represented as static Tailwind classes.
- Validation: `pnpm run type-check` passes and `pnpm run build` passes on Next.js 15.5.10.

## 2026-05-18 — Conviction Engine V1.0 major reset

- Standardized Conviction Engine headers and version identity to `V1.0` across active TS/TSX/CSS/config surfaces.
- Replaced legacy top-of-file evolution blocks with concise canonical headers to reduce maintenance noise and improve scanability.
- Promoted `CONVICTION_ENGINE_V1_0.md` as the canonical system guideline and moved legacy process guidance into explicit archive-only scope (`ARCHIVE — v32.0`).
- Preserved runtime behavior and styling output; this pass focused on documentation, header consistency, and governance clarity.
- Validation attempt blocked by transient npm registry timeouts during dependency install (`ETIMEDOUT`/`ECONNRESET`) in this environment.

## 2026-03-28

- Fixed home navigation so `Projects`, `About`, and `Contact` resolve correctly from subpages instead of pointing to broken in-page anchors.
- Added consistent top navigation and footer coverage to writing index, writing detail, and work detail pages.
- Brought hero, projects, about, and contact sections closer to the release spec with clearer production-facing copy and reveal semantics.
- Expanded `GlassCard` to forward HTML and `data-*` props so reveal/state annotations can be applied without wrapper div churn.
- Cleaned `package.json` duplicate keys and aligned `type-check` with `tsconfig.typecheck.json`.

## 2026-03-29

- Hardened `/api/contact` to return consistent error payloads, normalize rate-limit keys, and avoid exposing placeholder service language.
- Replaced demo-style API behavior in `/api/live-metrics` with deterministic public-safe status data and documented `/api/portfolio-metrics` as benchmark-backed output.
- Changed `/api/sabiscore-preview` from a placeholder `501` response to an intentional `410 Gone` contract for the non-public preview surface.
- Removed debug-only metric logging from shipped code and moved metric view tracking out of render-time execution.
- Removed broken placeholder image references from published blog posts so the public blog no longer points at missing assets.
- Added outside-click and focus management refinements to the mobile navigation, strengthened the homepage project and writing sections, and added related-navigation rails to writing and work detail pages.

## 2026-03-30 — Conviction Engine v7.0

- **E2E smoke suite (20/20)** — Fixed the one remaining command-palette test failure.
  Root cause: `document.dispatchEvent(keydownEvent)` makes `document` the AT_TARGET
  (phase 2), so the ordering between the layout inline-script capture listener and
  the React `useEffect`-registered capture listener was implementation-defined in
  Blink — causing double-toggle (open→close) in the same render batch. Fixed by
  switching to `page.waitForLoadState('networkidle')` + `page.keyboard.press('Control+k')`,
  which injects a trusted CDP key event that propagates through CAPTURING_PHASE (1)
  exactly as a real user keystroke does.
- **Design system globals.css** — Merged Conviction Engine v7 glass architecture tokens:
  7-step fluid type scale, 8px spacing grid, glass system (backdrop-blur + refraction),
  full dark/light/system theme support, reduced-motion override, prose styles, print styles,
  skip-nav, reading-progress bar, badge-live / badge-wip / dot-live animations.
- **lib/projects.ts** — Single source of truth for all three projects with typed
  `Chosen / Over / Because` architecture-decision fields.
- **lib/writing.ts** — MDX frontmatter parser with reading-time computation via
  `reading-time` package.
- **app/providers.tsx** — Minimal ThemeContext (dark/light/system) with localStorage
  persistence and `data-theme` attribute sync.
- **app/api/og/** — Homepage OG image route (edge runtime, 1200×630).
- **app/work/[slug]/og/** — Per-project OG image route with title, status badge, stack pills.
- **app/api/activity/** — GitHub last-commit feed (edge + ISR 3600s) replacing the
  previous activity endpoint; returns `{ sha, message, date, ago }`.
- **Liveactivitybar.tsx** — Renamed to canonical casing `Liveactivitybar.tsx` (repo
  tracks this casing); import paths normalised for case-sensitive CI environments.
- **playwright.config.ts** — `webServer` split so `pnpm start` (not `build && start`)
  is the server command; `reuseExistingServer: !process.env.CI` prevents timeout on
  local re-runs.

## 2026-03-29 (pass 2)

- **Footer** — expanded from a minimal 2-icon strip to a full production footer: auto-updating copyright year, résumé PDF download CTA, back-to-top anchor, and X (Twitter) + email icons alongside GitHub and LinkedIn.
- **Writing index page** (`/writing`) — added featured-article banner card with tag pills, summary, and date; added tag pills per post in the year-bucketed archive; replaced all inline style objects with Tailwind utility classes backed by CSS custom properties for maintainability.
- **LiveBuildFeed** — removed `console.error` from the production bundle; added an explicit `fetchError` state so failed fetches surface a human-readable message ("Activity feed unavailable — check back soon.") instead of silently showing "No recent activity".
- **LiveActivityBar** — guarded the GitHub API fetch against non-OK responses and network failures via `.catch()` so the component silently hides rather than throwing an unhandled rejection.

## 2026-03-31 — Conviction Engine v8.0

Every change traces to a gap observed in the live screenshot evidence.

- **GrainOverlay** (`components/GrainOverlay.tsx`) — new zero-layout-cost SVG filter overlay: `position:fixed`, `pointer-events:none`, `mix-blend-mode:soft-light`, `opacity:0.035`. Wired into `app/layout.tsx`.
- **GradientMesh** (`components/GradientMesh.tsx`) — ambient radial gradient layer: indigo orb top-left (12% opacity), green orb bottom-right (7% opacity), GPU-composited via `translateZ(0)`. Wired into `app/layout.tsx`.
- **ArchDecision** (`components/ArchDecision.tsx`) — `Chosen / Over / Because` triad rendered as an always-visible panel. `compact=false` renders a 3-column horizontal layout for case-study pages; `compact=true` stacks vertically for grid cards. Label colours driven by `data-arch-key` CSS attribute to avoid inline style warnings. No click required — previously the decisions panel was either missing or gated behind a toggle.
- **useReveal** (`lib/useReveal.ts`) — pure `IntersectionObserver` hook for section-entry stagger animation. Returns a ref; add `className="reveal"` to the element; no Framer Motion dependency at section level.
- **globals.css additions** — appended `.reveal` / `.reveal.visible` / `.reveal-delay-*` stagger classes, `.border-top-live` / `.border-top-accent` / `.border-top-wip` accent variants, `.arch-grid` responsive layout, `.text-gradient` helper, and `a[data-cta]` hover tokens.
- **globals.css deduplication** — merged the three separate `.glass-full`, `.glass-medium`, and `.glass-light` rule blocks (backdrop-filter, border, and box-shadow) into single declarations each. Fixed `-webkit-backdrop-filter` ordering to come before `backdrop-filter` throughout (`.glass`, `.glass-full`, `.glass-medium`, `.glass-light`, `.glass-no-hover`, `.glass-nav`, `.metric-card`, `.cmd-overlay`) for correct Safari cascade fallback.
- **HeroSection** — added three-tier CTA system (`data-cta="primary"` filled / `data-cta="secondary"` outlined / ghost underline-only). Added `data-pillar` on all four conviction pillars with `border-top` accent colour per pillar. Removed `role="status"` misuse from non-live elements.
- **ProjectCard** — replaced toggle-gated architecture decision panel with always-visible `<ArchDecision compact>` component. WIP status badge uses `.dot-wip` CSS class instead of an inline `style` color object. Status style map (`statusStyles`) centralises badge and dot classes.
- **ProjectsSection** — confirmed import path pulls from `@/lib/projects` (no inline project data); `ArchDecision` wired into both featured and grid card layouts.
- **Navbar** — added `IntersectionObserver`-driven `activeSection` state; active link receives `borderBottom: 1px solid var(--color-accent)` indicator.
- **ContactSection** — engagement cards upgraded with `glass-bg` + `backdropFilter` + `borderLeft: 3px solid var(--color-accent)` + `onMouseEnter/Leave` hover-lift. Status dot uses `.dot-live` class consistent with rest of codebase.
- **Liveactivitybar** — commit message `maxWidth` changed from `22ch` to `min(28ch, 45vw)` (28ch on desktop, ~16ch on small mobile) to stop technical commit summaries being truncated mid-word.
- **WritingSection** — props typed as `Readonly<{ articles: WritingArticle[] }>`.
- **app/providers.tsx** — fixed `export { useTheme }` re-export syntax.
- **app/error.tsx** — renamed function `Error` → `ErrorPage` (avoids global `Error` shadowing lint rule); props typed as `Readonly<{…}>`.
- **scripts/create-blog-post.js** — `require('fs'/'path'/'readline')` → `require('node:fs'/'node:path'/'node:readline')`; `.replace()` → `.replaceAll()`.
- **data/projects.ts** — SabiScore `tagline` and `description` aligned to the live system (sports intelligence, not fintech credit-scoring); architecture-decision fields added to Hashablanca and ML Consulting entries.
- **e2e/smoke.spec.ts** — added `ArchDecision panel visible without interaction` and `Conviction pillars have data-pillar attribute` assertions; updated CTA test to target `a[data-cta="primary"]`.
