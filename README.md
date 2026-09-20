# Oscar Ndugbu — scardubu.dev

Staff+ Full-Stack / Infra / AI portfolio. Production systems that stay alive when it matters most — compliant, fast, and relentlessly reliable. Built under Lagos constraints. Deployed to global standards.

**Live site:** [https://scardubu.dev](https://scardubu.dev)

**Canonical system spec:** [CONVICTION_ENGINE_V1_0.md](CONVICTION_ENGINE_V1_0.md)

---

## What it is

A proof system, not a brag sheet. Four production case studies, four open-source packages, 62 verified skills, and writing that explains the decisions behind the work.

## Current release status

As of 2026-06-02, the homepage production surface has passed a fresh `pnpm run type-check`, `pnpm run lint`, `pnpm run build`, the primary Playwright smoke suite on both `chromium` and `mobile-chrome`, the secondary smoke suite on both `chromium` and `mobile-chrome`, and the broader `tests/portfolio.spec.ts` regression suite on `chromium`.

- Touch and coarse-pointer devices now bypass Lenis at boot and stay on the native scroll engine, while desktop keeps the cinematic Lenis path; GSAP ticker lag smoothing is also restored to prevent large-delta jumps after tab visibility changes.
- Availability surfaces are now semantically separated and more maintainable: hero and about keep the recency-bearing status treatment, the desktop navbar CTA stays compact and action-oriented, and the about chip now shares the canonical `HERO.availability` copy instead of a divergent hardcoded string.
- The mobile navigation toggle now uses explicit “Open navigation menu” / “Close navigation menu” accessibility labels, tightening screen-reader clarity without changing visual behavior.
- Playwright availability assertions now target explicit hero/about surfaces instead of generic substring matches, removing selector collisions introduced by the desktop nav CTA while preserving the current UI.

---

## Tech stack

| Layer      | Technology                                                         |
| ---------- | ------------------------------------------------------------------ |
| Framework  | Next.js 15 — App Router, Partial Prerendering, Streaming           |
| UI         | React 19, Tailwind CSS v4, Framer Motion 11                        |
| Language   | TypeScript strict across all layers                                |
| Scroll     | Lenis smooth scroll + GSAP ScrollTrigger (Cinematic Scroll System) |
| WebGL      | Three.js — atmospheric brush field (ThreeBrushField)               |
| Content    | MDX — case studies and writing posts                               |
| Testing    | Playwright E2E (smoke + full journey suites)                       |
| CI         | Lighthouse CI, husky pre-commit (lint + type-check + smoke)        |
| Deployment | Vercel — main branch auto-deploys                                  |

### Observability and accessibility

- Vercel Analytics + Speed Insights are mounted from the App Router root layout in production.
- Custom Vercel events track section views, hero CTA clicks, project link clicks, contact submissions, code-copy actions, metric impressions, and web vitals.
- Accessibility automation includes `eslint-plugin-jsx-a11y`, Playwright + `@axe-core/playwright`, skip navigation, reduced-motion handling, and Lighthouse CI.

---

## Cinematic Scroll System

The homepage uses an 8-chapter cinematic scroll architecture. Understanding it is required before touching any section component, the scroll provider, or the WebGL canvas.

### Architecture overview

```text
ScrollCinemaProvider          — Lenis instance, activeChapter state, scrollProgressRef, lenisRef
  └── GSAP ticker             — single RAF loop shared by Lenis + ScrollTrigger
       └── ScrollTrigger      — per-section reveal timelines (via useChapterTimeline)
     └── useLenisScroll          — shared subscriber for reading progress surfaces
  └── ThreeBrushField         — Three.js WebGL atmospheric shader
       ├── Renderer RAF       — reads scrollProgressRef, updates uniforms
       └── Palette effect     — imperative uniform mutation on activeChapter change
  └── ScrollProgress          — chapter-aware vertical rail (reads context)
  └── Navbar                  — useScrollCinema context for active dot
```

### The 8 chapters

| Index | Chapter ID    | Section              | Accent           |
| ----- | ------------- | -------------------- | ---------------- |
| 0     | `prologue`    | hero                 | `#67e8f9` teal   |
| 1     | `proof`       | section-projects     | `#5eead4` mint   |
| 2     | `credibility` | section-testimonials | `#fbbf24` amber  |
| 3     | `craft`       | open-source          | `#38bdf8` sky    |
| 4     | `range`       | skills               | `#c084fc` violet |
| 5     | `human`       | section-about        | `#fde68a` gold   |
| 6     | `judgment`    | section-writing      | `#93c5fd` blue   |
| 7     | `epilogue`    | section-contact      | `#34d399` green  |

Chapter configuration is canonical in `lib/cinematic/chapters.ts`. Do not modify it.

### Animation ownership — critical constraint

**GSAP ScrollTrigger** owns all section-level scroll reveals.
**Framer Motion** owns the hero section, micro-interactions (hover, accordion, mobile menu), and carousels.
They do not overlap. Mixing them inside the same element causes competing animation ownership.

```text
✅ DO:     whileHover, whileTap, AnimatePresence inside any component
✅ DO:     data-cinematic="title|eyebrow|panel|card|media|cta" on elements inside ChapterFrame
✅ DO:     setActiveChapter() inside ScrollTrigger onEnter/onEnterBack callbacks

❌ DO NOT: whileInView, initial="hidden", animate="visible" inside ChapterFrame sections
❌ DO NOT: framer-motion useScroll/useTransform on any homepage-mounted component
❌ DO NOT: add activeChapter to the ThreeBrushField main effect dependency array
```

### Adding a new section

1. Add a chapter config to `lib/cinematic/chapters.ts`.
2. Wrap the section in `<ChapterFrame chapter={chapter}>`.
3. Add `data-cinematic="[target]"` attributes to animatable elements.
4. `useChapterTimeline` runs automatically from `ChapterFrame`.
5. Do not add `whileInView` or scroll animations — GSAP handles everything inside `ChapterFrame`.

### ThreeBrushField performance budget

Three RAF loops share one frame budget:

- Lenis: smooth scroll interpolation
- GSAP ticker: ScrollTrigger calculations
- ThreeBrushField: WebGL render

Lenis feeds into GSAP ticker via `gsap.ticker.add(raf)`. The ticker still owns the RAF loop, and `ScrollCinemaProvider` now adds a guarded post-Lenis `ScrollTrigger.update()` sync callback so chapter triggers stay aligned with the active smooth-scroll path. On mobile, `mix-blend-mode: screen` is disabled (costs a GPU compositor pass per frame on low-power devices).

Current resilience notes:

- `ScrollCinemaProvider` now exposes `data-scroll-engine="lenis|native"` on `<html>` so CSS and diagnostics can distinguish the active path.
- `ScrollCinemaProvider` also exposes `lenisRef`, and writing-route progress surfaces consume it through `useLenisScroll` so Lenis/native fallback stays centralized.
- If Lenis initialization or `scrollTo()` fails, the homepage falls back to native scroll with the same chapter tracking and anchor offsets.
- Hero parallax progress is synced through Framer Motion's shared animation frame loop instead of a custom RAF, reducing drift between scroll interpolation and motion transforms.

---

## Patch changelog — Cinematic Scroll v1.1

Seven files were patched to fix critical bugs and add polish enhancements. The patch is available in `oscar-portfolio-cinematic-patch.zip`.

### Bug fixes (scroll behaviour was broken)

| File                       | Bug                                 | Impact                                             |
| -------------------------- | ----------------------------------- | -------------------------------------------------- |
| `ScrollCinemaProvider.tsx` | `immediate: true` in `scrollTo()`   | Every navbar click teleported instead of gliding   |
| `ThreeBrushField.tsx`      | `activeChapter` in main effect deps | Canvas flashed black on every chapter change       |
| `HeroSection.tsx`          | No ScrollTrigger for hero section   | Prologue chapter never re-activated on scroll-back |

### Enhancements (visual quality + performance)

| File                       | Enhancement                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `ChapterFrame.tsx`         | `noBorderTop` prop to remove hero/projects visual seam                                     |
| `ProjectsSection.tsx`      | Passes `noBorderTop` — brush field flows continuously into first section                   |
| `globals.css`              | `@property` declarations + `html[data-active-chapter]` CSS cross-fades over 0.65s expo-out |
| `globals.css`              | Scrollbar thumb uses `color-mix(--chapter-accent)` instead of hardcoded teal               |
| `ThreeBrushField.tsx`      | `sm:[mix-blend-mode:screen]` — blend mode disabled on mobile                               |
| `ScrollCinemaProvider.tsx` | Removed `ScrollTrigger.update()` from Lenis callback (was double-processing)               |
| `ScrollCinemaProvider.tsx` | Added `aria-live="polite"` region for screen reader chapter announcements                  |
| `useChapterTimeline.ts`    | `typeof window === 'undefined'` guard (SSR/RSC analysis safety)                            |

### Integration quick wins — UX polish v1.2

| File              | Quick win                                                                                               | Benefit                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `HeroSection.tsx` | Added tab-panel relationships (`aria-controls`, `aria-labelledby`, active `tabIndex`) to proof carousel | Better keyboard and screen-reader navigation     |
| `globals.css`     | Refined proof-dot touch targets to 24x24 with visual 6px center indicator                               | WCAG-friendly tap areas on mobile                |
| `globals.css`     | Added ultra-narrow hero safeguards (`max-width: 389px`) for availability metadata and stat wrapping     | Cleaner 320-390px rendering with no clipping     |
| `globals.css`     | Added `min-width: 1920px` hero scale and spacing tuning                                                 | Better composition on ultrawide desktop displays |
| `Footer.tsx`      | Removed no-op inline style object from primary CTA                                                      | Cleaner code and reduced maintenance overhead    |

Validation pass after v1.2 polish:

- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅

### Stability fixes — runtime guard v1.3

| File                    | Fix                                                                                          | Impact                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `lib/motionVariants.ts` | Corrected `AnimatePresence` mode from invalid `popout` to valid `popLayout`                  | Prevents client runtime crashes in motion paths                                 |
| `tests/setup.ts`        | Added `scrollMargin` to `MockIntersectionObserver` and removed unresolved side-effect import | Clears editor diagnostics and keeps test setup aligned with current DOM typings |

Validation pass after v1.3 stability fix:

- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅
- Browser runtime probe on `/` reported `NO_CLIENT_ERRORS_DETECTED` ✅

### Production hardening — local font resilience + responsive audit v1.4

| File              | Change                                                                                 | Impact                                                                     |
| ----------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `app/layout.tsx`  | Migrated to local-only CSS font variable strategy for root typography token assignment | Eliminates build/runtime fragility from remote Google Fonts fetch timeouts |
| `app/globals.css` | Kept targeted small-screen and ultrawide guards from the surgical responsive audit     | Preserves stable hero/navigation composition across edge viewport classes  |

Validation pass after v1.4 hardening:

- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- Responsive sweep at `320, 375, 390, 430, 768, 1024, 1280, 1920` ✅
- Sweep checks: horizontal overflow, hero/nav edge bounds, proof-dot wrapping ✅

### Landing page consistency — shared intro + formatter v1.5

| File                                 | Change                                                    | Impact                                                                                                                            |
| ------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `components/shared/SectionIntro.tsx` | Added a shared motion-aware editorial intro primitive     | Removes repeated section header markup and keeps Projects, Testimonials, Open Source, Skills, About, Writing, and Contact aligned |
| `lib/utils.ts`                       | Added `formatMonthYear()`                                 | Reuses the hero/about availability date formatting in one place                                                                   |
| `components/*Section.tsx`            | Migrated the landing sections to the shared intro pattern | Visual rhythm is now consistent across the full page                                                                              |

Validation pass after v1.5 consistency refactor:

- `pnpm test:smoke` ✅

### Runtime hygiene + browser data refresh v1.6

| File             | Change                                                                         | Impact                                                                                       |
| ---------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `app/layout.tsx` | Removed duplicate `fixes.css` import                                           | Prevents redundant stylesheet loading and keeps root layout intent clean                     |
| `app/layout.tsx` | Preserved pre-seeded `window.__commandPaletteRequested` flag during early boot | Keeps command palette bootstrap reliable across early key interception and test init scripts |
| `pnpm-lock.yaml` | Refreshed `caniuse-lite` and `baseline-browser-mapping`                        | Removes stale browser dataset warnings from routine builds                                   |

Validation pass after v1.6 maintenance:

- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅
- `pnpm run test:smoke` ✅

### Command palette + dead-code prune v1.7

Two real UX bugs and a non-trivial maintenance pass.

#### CommandPalette — Lenis integration + iOS safe area

| File                            | Change                                                                                                              | Impact                                                                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/CommandPalette.tsx` | Replaced native `element.scrollIntoView({ behavior: 'smooth' })` with `useScrollCinema().scrollToSection()`         | Palette navigation now glides via Lenis with the same `-88px` nav offset and `prefers-reduced-motion` handling as the navbar and hero CTAs (single source of truth) |
| `components/CommandPalette.tsx` | Mobile FAB `bottom` switched from fixed `1.5rem` to `max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))` | FAB no longer lands on iOS Safari's home-indicator gesture zone on iPhone X+ devices                                                                                |

#### Code hygiene — removed dead modules

| Removal                                        | Reason                                                                                                                                                    |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ThreeBrushField.tsx`               | Re-export shim; zero importers. Canonical module lives at `components/cinematic/ThreeBrushField.tsx`                                                      |
| `lib/cinematic/ThreeBrushField.tsx`            | Re-export shim; zero importers                                                                                                                            |
| `lib/cinematic/ScrollCinemaProvider.tsx`       | Re-export shim; zero importers                                                                                                                            |
| `.backup-pre-cinematic-patch/` (7 stale files) | Pre-patch snapshot left in the working tree. Git history preserves the same content. Removed to stop polluting code search, grep, and editor file pickers |

#### Dead CSS prune — `app/globals.css` slimmed by ~254 lines

| Removal                                                                          | Reason                                                                                            |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.bottom-nav`, `.bottom-nav-item*` (block + media + print + safe-area variants)  | No `<BottomNav>` component renders. Navbar uses a hamburger pattern. Class list reduced.          |
| `.floating-hire-cta` (block + active + data-hidden + print variants)             | No floating-hire-cta component is mounted. Hero CTA + CommandPalette FAB cover mobile conversion. |
| `.contact-sticky-cta` (legacy alias + active + data-hidden variants)             | Same: zero JSX consumers.                                                                         |
| `@keyframes floatIn`                                                             | Only the deleted CTAs animated with it.                                                           |
| Two duplicate `.skeleton-shimmer` blocks + duplicate `@keyframes skeleton-sweep` | Three near-identical declarations existed; the canonical pair beside `.skeleton` is retained.     |
| `.bottom-nav-item` removed from the `touch-action: manipulation` selector list   | The class no longer exists; selector list shortened.                                              |

#### Maintenance — `tsconfig.typecheck.json`

| File                      | Change                                                                                     | Impact                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.typecheck.json` | Stale per-file include list replaced with `components/**/*` glob (mirrors `tsconfig.json`) | `pnpm type-check` (used by the husky pre-commit hook) now type-checks `CommandPalette.tsx`, every `components/cinematic/*`, and other newer components that the explicit list missed — the pre-commit gate is no longer a partial gate |

#### Cosmetic — `components/ContactSection.tsx`

| Change                                                                                                                                                                     | Impact                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Removed redundant `import React from 'react'` (Next 15 + React 19 JSX transform doesn't need it). Switched `handleBlur` to the named `FocusEvent` import already in scope. | Smaller import footprint, consistent with the rest of the codebase |

Validation pass after v1.7:

- `pnpm run type-check` ✅ (now covers every component under `components/**`)
- `pnpm run lint` ✅
- `pnpm run build` ✅ (no warnings, no bundle regressions)
- Manual scan: zero remaining references to `.bottom-nav`, `.floating-hire-cta`, `.contact-sticky-cta` in source, content, tests, or `public/`

### Accessibility contrast + smoke stability v1.8

| File                | Change                                                                                           | Impact                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `app/globals.css`   | Replaced the hero reassurance line's translucent forced color with `var(--color-text-secondary)` | Clears the last axe WCAG AA contrast violation on the homepage without adding a one-off token |
| `app/globals.css`   | Kept the reassurance border accent but aligned the copy color with the shared text system        | Better visual cohesion and fewer contrast regressions hiding behind `!important` rules        |
| `e2e/smoke.spec.ts` | Switched homepage/reload waits from `networkidle` to `load` for the command palette path         | Removes a smoke-test flake caused by live activity requests that keep the network busy        |

Validation pass after v1.8:

- `pnpm exec playwright test e2e/smoke.spec.ts --grep "accessibility" --project=chromium --workers=1` ✅
- `pnpm run test:smoke` ✅

### Hero responsiveness + scroll resilience v1.9

| File                       | Change                                                                                          | Impact                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `ScrollCinemaProvider.tsx` | Added guarded Lenis init/destroy + native-scroll fallback with `data-scroll-engine` state       | Keeps cinematic navigation functional even if Lenis fails or reduced motion is enabled |
| `HeroSection.tsx`          | Moved hero progress updates to Framer Motion `useAnimationFrame`                                | Reduces motion drift and keeps the hero rail/headshot parallax stable                  |
| `HeroSection.tsx`          | Added canonical portrait utility classes and GPU-safe motion wrappers                           | Cleaner headshot rendering and lower transform jank on desktop and mobile              |
| `globals.css`              | Added terminal override block for container-query portrait ratios and View Timeline enhancement | Narrow screens get square/near-square crops first, then scale cleanly to 4:5           |
| `globals.css`              | Disabled native `scroll-behavior: smooth` when `data-scroll-engine='lenis'`                     | Prevents double-smoothing when Lenis is active                                         |

Validation pass after v1.9:

- `pnpm run type-check` ✅
- `pnpm run build` ✅
- `pnpm exec eslint components/cinematic/ScrollCinemaProvider.tsx components/HeroSection.tsx` ✅
- `pnpm run test:smoke` ✅

### Hero portrait layout correction v2.0

| File                         | Change                                                                                                  | Impact                                                                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`            | Removed `container-type: inline-size` from `.hero-headshot-container`                                   | CSS spec forces `overflow:clip` when `container-type` is set — removing it restores `overflow:visible` on the portrait frame and makes the `headshot-ring-breathe` glow animation visible at mobile |
| `app/globals.css`            | Bumped specificity of `object-position` rules to `.hero-headshot-shell .hero-headshot-image--*` (0,2,0) | Beats the legacy `.hero-headshot-shell img` selector (0,1,1) — portrait now crops at the correct `50% 14%` instead of being forced to `50% 18%`                                                     |
| `components/HeroSection.tsx` | Fixed `carousel-dot` active class: added missing space before `'active'` in template literal            | CSS rule `.carousel-dot.active` now matches correctly; previously generated `carousel-dotactive` (one token) which never matched the stylesheet                                                     |

Validation pass after v2.0:

- `pnpm run type-check` ✅
- `pnpm run build` ✅ (36.9 kB homepage, 229 kB First Load JS — no regression)
- `pnpm run test:smoke` ✅ (17 passed, 3 skipped — same baseline)

### Production cinematic refinement — mobile scroll, motion cohesion, performance v2.1

Eight-file surgical pass across mobile scroll stability, motion refinement, and visual polish. Zero architectural changes.

#### Mobile scroll — critical iOS fixes

| File                       | Change                                                                                                                          | Impact                                                                                                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ScrollCinemaProvider.tsx` | Re-asserts `document.documentElement.style.overflowX = 'clip'` after Lenis v1 init                                              | Lenis v1 constructor sets `overflow: hidden` inline, overriding the CSS `overflow-x: clip` and creating a conflicting BFC on iOS Safari. This restores horizontal clipping without a scroll container     |
| `ScrollCinemaProvider.tsx` | Emergency scroll recovery in `onVisibility`: clears stuck `body.overflow = 'hidden'` on tab-visible when neither lock is active | Covers React 19 concurrent unmount races where the Navbar cleanup fires late                                                                                                                              |
| `Navbar.tsx`               | Replaced `overflow: hidden` scroll lock with `position: fixed` + `body.nav-open` class + scroll save/restore                    | `overflow: hidden` on `body` causes content jump and BFC conflict with `overflow-x: clip` on `html`. The fixed pattern saves `window.scrollY`, applies `body.style.top = -scrollY`, and restores on close |
| `Navbar.tsx`               | Unmount cleanup removes `nav-open` class and clears `body.style.top`                                                            | Defensive guard for React 19 concurrent unmount during menu animation                                                                                                                                     |
| `app/fixes.css`            | `body.nav-open { position: fixed; width: 100%; overflow-y: scroll }`                                                            | CSS side of the scroll lock — keeps scrollbar gutter stable                                                                                                                                               |
| `app/fixes.css`            | `[data-lenis-prevent] { overscroll-behavior: contain; -webkit-overflow-scrolling: touch }`                                      | Tells Lenis to yield to horizontally snapping containers (ProofCarousel)                                                                                                                                  |
| `app/fixes.css`            | Updated `html:not([data-nav-open]):not(.nav-open) body`                                                                         | Belt-and-suspenders unlock rule now excludes both the attribute-based and class-based locks                                                                                                               |
| `app/fixes.css`            | Consolidated portrait edge-pulse `@keyframes` + `will-change` into `@media (prefers-reduced-motion: no-preference)`             | Keyframe and will-change never register for reduced-motion users; static opacity variant remains                                                                                                          |

#### Hero section fixes

| File              | Change                                                  | Impact                                                                                                                                          |
| ----------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroSection.tsx` | Removed `min-h-[100dvh]` from hero section className    | `dvh` recalculates with iOS address bar movement causing layout jitter; `100svh` (stable small viewport) only                                   |
| `app/globals.css` | Removed `min-height: 100dvh` fallback from `#hero` rule | Matching CSS-side removal                                                                                                                       |
| `HeroSection.tsx` | Carousel dot: `'active'` → `' active'` (space added)    | Produced `carousel-dotactive` (one token) instead of `carousel-dot active` (two tokens); compound selector `.carousel-dot.active` never matched |

#### Motion refinement

| File                    | Change                                                                                         | Impact                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `HeroSection.tsx`       | Hero stagger: `staggerContainer(0.055, 0.05)` → `staggerContainer(0.042, 0.04)`                | Tighter, more decisive reveal cadence                                                         |
| `HeroSection.tsx`       | `wordRevealContainer` stagger: 0.055 → 0.042                                                   | Matched to hero stagger                                                                       |
| `lib/motionVariants.ts` | `wordReveal` transition: `SPRING_WORD_REVEAL` → `{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }` | Spring easing on word reveals produces organic bounce; expo-out is sharper and more cinematic |
| `HeroSection.tsx`       | Primary magnetic: `strength: 0.2, radius: 144` → `strength: 0.16, radius: 108`                 | Subtler, more credible magnetic pull on the hero CTA                                          |
| `HeroSection.tsx`       | `ConvictionStat.whileHover` guarded with `!isDesktopViewport`                                  | Eliminates unintentional lift animation on touch devices                                      |
| `HeroSection.tsx`       | RAF: `previousScrollYRef` early-exit before computing hero progress                            | Skips all Math operations on frames where scroll position is unchanged                        |

#### Visual polish

| File              | Change                                                                                                                          | Impact                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroSection.tsx` | Subheadline `max-w-[30ch]` → `max-w-[28ch]`                                                                                     | Tighter editorial column width                                                                                                                       |
| `HeroSection.tsx` | Writing link: arrow `translate-x-0.5` → `translate-x-1`, added `hover:underline hover:underline-offset-[3px]`                   | Clearer affordance, more decisive arrow movement                                                                                                     |
| `app/globals.css` | Scrollbar thumb: 25% → 35% rest, 50% → 55% hover                                                                                | More visible against dark backgrounds while still feeling subtle                                                                                     |
| `app/globals.css` | `.glass-*` classes: `will-change: transform` → `will-change: auto` + hover-only via `@media (hover: hover) and (pointer: fine)` | Static will-change promotes every glass card to a compositor layer (wasteful on scroll-heavy pages). Hover-only is free — browser promotes on demand |

Validation pass after v2.1:

- `pnpm type-check` ✅
- `pnpm build` ✅ (zero errors, zero warnings)

### Observability integration fixes — analytics + web vitals v2.2

Two silent observability gaps closed. Both were the same class of bug: a feature the docs claimed was live but which never actually emitted in production.

| File                       | Change                                                                                                       | Impact                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`           | Replaced the broken `isPreviewDeployment` check with `NEXT_PUBLIC_VERCEL_ENV === 'production'` gating         | `NEXT_PUBLIC_VERCEL_URL` is a `*.vercel.app` URL on **every** deployment (production included), so the old `includes('vercel.app')` test made `isPreviewDeployment` true in production too — `<Analytics />` / `<SpeedInsights />` never mounted anywhere |
| `components/WebVitals.tsx` | New client component using `useReportWebVitals` (next/web-vitals), forwarding to `lib/monitoring.ts`           | The App Router never auto-invokes a file-level `reportWebVitals` export (that is a Pages Router convention), so the documented `WebVital` custom event was never emitted. This is the correct App Router entry point                          |
| `app/reportWebVitals.ts`   | Deleted                                                                                                       | Dead Pages-Router-style file with zero effect under the App Router; replaced by `components/WebVitals.tsx`                                                                                                                                  |
| `lib/monitoring.ts`        | Loosened `WebVitalMetric` type to match `NextWebVitalsMetric` (optional `rating`/`delta`, added `label`)      | Accepts both core web-vitals and Next.js custom metrics ('Next.js-hydration', '…-render') without type errors                                                                                                                               |
| `lib/portfolio-data.ts`    | Refreshed `HERO.availabilityLastUpdated` → `2026-06-20`                                                       | Keeps the hero/about availability badge within the 90-day freshness threshold                                                                                                                                                              |
| `components/IdentityCard.tsx` | Tightened the identity-card bio toward the Lagos-constraint voice                                          | "Ships financial, AI, and cinematic systems built to hold under Lagos constraints — with delivery you can measure."                                                                                                                        |

Validation pass after v2.2:

- `pnpm run type-check` ✅
- `pnpm run lint` ✅
- `pnpm run build` ✅ (39.9 kB homepage, 232 kB First Load JS — no regression)
- `pnpm run test:unit` ✅

---

### CI/CD pipeline repair — build-artifact reuse + scheduled agent v2.3

Two independent GitHub Actions bugs were silently breaking `main`'s CI signal.

| File                                  | Change                                                                                                    | Impact                                                                                                                                                                                                          |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`             | Added `include-hidden-files: true` to the `nextjs-build` `actions/upload-artifact@v4` step                 | `actions/upload-artifact@v4` treats any path inside a dot-prefixed folder as hidden and drops it by default. `.next/` is exactly that, so the "quality" job's build artifact uploaded **zero files** — `E2E Tests` and `Mobile Regression` then failed at `download-artifact` with `Artifact not found for name: nextjs-build`, every run, since the build-once/reuse-across-jobs refactor landed. `conviction-ci.yml` already had this flag; `ci.yml` was missing it |
| `.github/workflows/conviction-agent.yml` | `pnpm/action-setup@v4` pinned to `version: 9`, conflicting with `packageManager: pnpm@10.24.0` in `package.json` | The action hard-errors ("Multiple versions of pnpm specified") before installing anything — every scheduled run failed in ~10s. Bumped to `10.24.0` to match `package.json` and the rest of the workflows; added `cache: pnpm` for parity |
| `.github/workflows/conviction-agent.yml` | Disabled the `schedule` trigger (kept `workflow_dispatch`)                                                | `scripts/conviction-fix.ts` does unscoped blind-regex rewrites across every tracked `.tsx` file — it assumes an undefined `reveal` motion variant and deletes every `style={{...}}`, including ones with dynamic values. With the pnpm fix above, the job would have run for the first time and pushed that mutation to `conviction/fixes` every 6 hours. Re-enable only after the fixer is scoped to scanner-flagged files with transforms that can't corrupt animation/layout code |
| `.github/workflows/conviction-agent.yml` | `git push origin conviction/fixes` → `--force`                                                            | Branch is disposable bot output recreated from a fresh checkout every run; a plain push would reject on non-fast-forward once a prior run's branch exists remotely                                                                                            |

Validation pass after v2.3:

- `pnpm run lint` ✅
- `pnpm run type-check` ✅
- `pnpm run test:unit` ✅ (24/24)
- `pnpm run build` ✅
- `pnpm run test:smoke` ✅ (Chromium, after installing the local Playwright browser binary)
- Workflow YAML re-parsed and validated after edits

---

## Local setup

**Requirements:** Node.js ≥ 20.0.0 < 24.0.0, pnpm ≥ 9.0.0

```bash
# Clone and install
git clone https://github.com/Scardubu/oscar-portfolio.git
cd oscar-portfolio
pnpm install

# Start development server
pnpm dev
# → http://localhost:3000

# If Playwright browsers are not installed
pnpm exec playwright install chromium
```

---

## Scripts

```bash
pnpm dev            # development server (localhost:3000)
pnpm build          # production build — required integration check
pnpm start          # serve the production build locally
pnpm type-check     # strict TypeScript, zero tolerance
pnpm lint           # ESLint across all source paths
pnpm lint:fix       # auto-fix lint issues
pnpm test:smoke     # build + Playwright smoke suite (fast, Chromium only)
pnpm test:a11y      # build + axe-powered accessibility smoke gate
pnpm test:e2e       # full Playwright suite (Chromium)
pnpm test:mobile    # Playwright mobile (Chrome + Safari)
pnpm test:all       # complete matrix across all configured projects
pnpm audit:copy     # content compliance verification (NRS, metric sources)
pnpm lhci           # Lighthouse CI audit
pnpm analyze        # bundle analyser (set ANALYZE=true)
```

## Maintenance

Refresh browser compatibility metadata when build output reports stale `caniuse-lite` or Baseline data:

```bash
npx update-browserslist-db@latest
```

This updates the lockfile entries used by `browserslist`, `autoprefixer`, and Next.js build tooling without changing your declared application dependencies.

---

## Project structure

```text
oscar-portfolio/
│
├── app/
│   ├── globals.css              ← design tokens, cinematic chapter CSS, scrollbar
│   ├── layout.tsx               ← fonts, metadata, JSON-LD, layer stack
│   ├── page.tsx                 ← homepage (Suspense-deferred sections)
│   ├── providers.tsx            ← ThemeProvider → MotionProvider → ScrollCinemaProvider
│   ├── api/
│   │   ├── activity/route.ts    ← GitHub activity proxy (LiveActivityBar)
│   │   ├── contact/route.ts     ← contact form (Resend)
│   │   └── og/route.ts          ← Open Graph image generation
│   └── work/[slug]/             ← case study MDX routes
│       └── writing/             ← writing MDX routes
│
├── components/
│   ├── cinematic/
│   │   ├── ScrollCinemaProvider.tsx ← Lenis + GSAP ticker + activeChapter context
│   │   ├── ThreeBrushField.tsx      ← WebGL atmospheric shader
│   │   └── ChapterFrame.tsx         ← section wrapper (calls useChapterTimeline)
│   ├── HeroSection.tsx          ← framer-motion hero (owns prologue ScrollTrigger)
│   ├── ProjectsSection.tsx      ← proof chapter (ChapterFrame + noBorderTop)
│   ├── TestimonialsSection.tsx  ← credibility chapter
│   ├── OpenSourceSection.tsx    ← craft chapter
│   ├── SkillsSection.tsx        ← range chapter
│   ├── AboutSection.tsx         ← human chapter
│   ├── WritingSection.tsx       ← judgment chapter
│   ├── ContactSection.tsx       ← epilogue chapter
│   ├── Navbar.tsx               ← useScrollCinema active dot
│   ├── ScrollProgress.tsx       ← chapter-aware vertical rail
│   └── ...
│
├── hooks/
│   ├── useChapterTimeline.ts    ← GSAP ScrollTrigger per-section reveals
│   ├── useMagnetic.ts           ← spring motion values for magnetic buttons
│   ├── useSpotlight.ts          ← rAF-throttled cursor spotlight
│   ├── useReducedMotion.ts      ← prefers-reduced-motion + motion tier
│   └── ...
│
├── lib/
│   ├── cinematic/
│   │   └── chapters.ts          ← 8-chapter registry (canonical — do not modify)
│   ├── motionVariants.ts        ← complete framer-motion vocabulary
│   ├── portfolio-data.ts        ← PROFILE, HERO, CONVICTION_STATS (canonical)
│   ├── projects.ts              ← PROJECTS (canonical)
│   ├── data/
│   │   ├── skills.ts            ← 62 skills, 8 pillars (canonical)
│   │   └── blog-articles.ts     ← article metadata
│   └── config.ts                ← CONTACT_EMAIL, CV_ASSET_PATH, anchorUrl()
│
├── content/
│   ├── writing/*.mdx            ← 6 technical posts
│   └── work/*.mdx               ← case studies (TaxBridge, SabiScore, SwarmXQ...)
│
├── public/
│   ├── cv/oscar-ndugbu-resume.pdf
│   ├── headshot.webp
│   └── images/
│
└── tests/ + e2e/                ← Playwright suites
```

---

## Data layer — single source of truth

Each domain has exactly one canonical source. Never duplicate across files.

| Domain                       | Canonical source                                     |
| ---------------------------- | ---------------------------------------------------- |
| Projects                     | `lib/projects.ts`                                    |
| Skills (62 skills)           | `lib/data/skills.ts`                                 |
| Hero copy + CONVICTION_STATS | `lib/portfolio-data.ts`                              |
| Production proof cards       | `components/TestimonialsSection.tsx` → `PROOF_CARDS` |
| Chapter config               | `lib/cinematic/chapters.ts`                          |
| Motion vocabulary            | `lib/motionVariants.ts`                              |
| Writing posts                | `content/writing/*.mdx` via `lib/content.ts`         |
| Config / URLs                | `lib/config.ts`                                      |

`lib/data.ts` is a **deprecated orphan** — not imported by anything. Do not import from it.

---

## Testing strategy

### Playwright strict-mode + Suspense

Sections use Next.js `<Suspense>` deferred loading. Skeletons render with `aria-busy="true"` and share the same section `id` as the real section.

```typescript
// ✅ Target the loaded section only
page.locator('section#section-writing[aria-labelledby="writing-heading"]')

// ❌ Resolves to 2 elements during Suspense (skeleton + real)
page.locator('#section-writing')
```

### Suite breakdown

| Suite        | Path                             | Speed | Covers                                    |
| ------------ | -------------------------------- | ----- | ----------------------------------------- |
| Smoke        | `e2e/smoke.spec.ts`              | ~45s  | Core journey, API health, mobile overflow |
| V1 contract  | `tests/portfolio.spec.ts`        | ~90s  | Copy, flow hooks, a11y, trust signals     |
| User journey | `tests/e2e/user-journey.spec.ts` | ~60s  | Full recruiter scroll journey             |
| Mobile       | `--project=mobile-chrome`        | ~120s | Touch targets, carousel, viewport         |

**Current status:** Chromium smoke gate passing; 3 intentional skips remain (command palette, nav-links, user-journey).

**Final verification:** local production build, type-check, lint, and Chromium smoke suite all pass on the current branch. The homepage now has a single canonical live-activity status target, and the mobile overflow checks at 320px and 375px are green.

---

## Quality gates — pre-deployment checklist

Run these in order. Every gate must pass before merging or deploying.

```bash
# 1. Type safety
pnpm type-check

# 2. Lint
pnpm lint

# 3. Production build (catches App Router rendering regressions)
pnpm build

# 4. Playwright smoke (Chromium, built output)
pnpm test:smoke

# 5. Accessibility smoke gate
pnpm test:a11y

# 6. Full suite
pnpm test:all

# 7. Lighthouse CI (requires build to be running)
pnpm start &
pnpm lhci
```

Lighthouse release floors: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95. The performance target remains ≥ 95 and the accessibility target remains 100.

The score floor is not a substitute for metric correctness: `lighthouserc.json` also fails closed when median LCP exceeds 3.0 s, median TBT exceeds 300 ms, median FCP exceeds 2.5 s, CLS exceeds 0.1, or console errors are present. The performance floor was separated from the 95 target only after the mobile critical-path patch reduced homepage First Load JS from 231 kB to 184 kB, removed the measured unused-JavaScript opportunity, and brought median LCP and TBT inside their hard ceilings.

## Analytics events

The production deployment emits the following privacy-friendly Vercel Analytics events:

- `SectionView` — fired once per chapter/section per page session
- `HeroCtaClick` — hero CTA navigation intent
- `ProjectClick` — case study, demo, and source interactions
- `ContactSubmit` — success or error outcome without personal message content
- `MetricView` — metric badge impressions
- `CodeBlockCopy` — writing/code interaction signal
- `WebVital` — client-reported vitals metadata via the shared monitoring layer

All analytics events avoid sending message bodies, email addresses, or other user-provided contact content.

## Accessibility verification

- `pnpm lint` includes `eslint-plugin-jsx-a11y` rules.
- `pnpm test:a11y` runs an axe scan against the homepage and fails on serious or critical violations.
- `pnpm lhci` enforces Lighthouse accessibility scores alongside CLS and performance budgets.
- Dynamic UI surfaces preserve ARIA relationships, live regions, keyboard focus order, and reduced-motion fallbacks.

---

## Deployment

### Vercel (recommended)

```bash
# 1. Connect the GitHub repo to a Vercel project (one-time)
#    Settings → Framework: Next.js, Root Directory: ./, Build: pnpm build

# 2. Set required environment variables in Vercel dashboard:
RESEND_API_KEY=re_...           # contact form email delivery
NEXT_PUBLIC_SITE_URL=https://scardubu.dev
GITHUB_TOKEN=ghp_...            # optional — raises activity API rate limit

# 3. Push to main → auto-deploy
git push origin main

# 4. Verify after deploy:
open https://scardubu.dev                            # homepage
open https://scardubu.dev/work/taxbridge             # case study
open https://scardubu.dev/writing                    # writing index
open https://scardubu.dev/api/og                     # OG image (200 OK)
curl -I https://scardubu.dev/cv/oscar-ndugbu-resume.pdf  # 200 OK

# 5. Verify observability after deploy:
#    - Visit the homepage and click hero/project/contact flows
#    - Confirm events appear in the Vercel Analytics dashboard
#    - Confirm Speed Insights receives page and vitals data
#    - Run Lighthouse against the deployed URL
```

Note: Vercel Analytics and Speed Insights are mounted only when `NEXT_PUBLIC_VERCEL_ENV=production` to avoid preview-environment script-load noise.

### Manual / Netlify fallback

```bash
# Build
pnpm build

# Serve locally to verify
pnpm start

# Deploy via Netlify CLI
netlify deploy --prod --dir=.next
```

`netlify.toml` is already configured in the repo for Netlify fallback.

### Environment variables

| Variable               | Required | Purpose                                             |
| ---------------------- | -------- | --------------------------------------------------- |
| `RESEND_API_KEY`       | Yes      | Contact form email delivery                         |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Canonical URL for metadata + OG                     |
| `GITHUB_TOKEN`         | No       | Raises GitHub API rate limit for live activity feed |

---

## Responsive QA viewport targets

After any hero or layout change, verify these breakpoints:

```text
320px   — smallest phone (iPhone SE gen 1)
360px   — standard Android
390px   — iPhone 14 Pro
768px   — iPad portrait
1024px  — iPad landscape / small laptop
1280px  — standard laptop
1536px  — large desktop
```

For hero validation specifically, confirm four things together:

1. No horizontal overflow
2. Stable headline wrapping
3. Proof carousel snap behavior
4. Right-rail dashboard density on large screens

---

## Cinematic scroll acceptance criteria

After the v1.1 patch, verify each of the following manually:

### Smooth scroll

- Click any navbar link → Lenis glides to section (not instant jump)
- Click hash link in hero CTAs → same cinematic glide

### Chapter system

- Scroll down into Projects → progress rail shows "Proof" active
- Scroll back up into hero → progress rail returns to "Prologue" active
- Repeat for every chapter bidirectionally

### WebGL canvas

- Scroll slowly from hero into Projects → no black flash on canvas
- Continue through all 8 chapters → palette shifts smoothly with each

### CSS cross-fade

- Observe scrollbar thumb colour while scrolling → it shifts through teal → mint → amber → sky → violet → gold → blue → green

### Border continuity

- Inspect hero/projects boundary → no visible horizontal rule line

### Accessibility

- Screen reader: chapter changes announce "Now viewing: [chapter label]"
- Keyboard: Tab through entire page without getting stuck

---

## Section map

| #    | Section      | ID                     | Chapter     | What it proves                                 |
| ---- | ------------ | ---------------------- | ----------- | ---------------------------------------------- |
| 00   | Hero         | —                      | prologue    | Positioning, conviction stats, proof carousel  |
| 01   | Projects     | `section-projects`     | proof       | 4 case studies with arch decisions             |
| 01.5 | Testimonials | `section-testimonials` | credibility | Verified system outcomes                       |
| 02   | Open Source  | `open-source`          | craft       | 4 production packages                          |
| 03   | Skills       | `skills`               | range       | L1 trust + L2 lineage + full 62-skill explorer |
| 04   | About        | `section-about`        | human       | Operating context and credibility              |
| 05   | Writing      | `section-writing`      | judgment    | 6 technical posts                              |
| 06   | Contact      | `section-contact`      | epilogue    | 3 engagement types + contact form              |

---

## Performance notes

- Image formats: AVIF + WebP via Next.js `images.formats` config
- CSS optimisation: `experimental.optimizeCss: true` via `critters`
- Font loading: `display: 'swap'` on all Google Fonts (Syne, DM Sans, JetBrains Mono)
- LazyMotion + domAnimations — framer-motion tree-shaken to animations-only bundle (~18kB)
- ThreeBrushField: DPR capped at 1.5× to limit GPU pressure on high-res mobile screens
- `mix-blend-mode: screen` on the WebGL canvas is disabled at < 640px (saves a GPU compositor pass per frame)

---

## Contact

**[oscar@scardubu.dev](mailto:oscar@scardubu.dev)** — response within 24 hours, usually faster.

---

*Personal portfolio. All content copyright Oscar Ndugbu.*
