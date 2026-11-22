# scardubu.dev // Engineering Portfolio & Systems Ledger

> Systems you can trust at 2 AM. Staff backend, platform, and AI infrastructure engineered with explicit failure boundaries, observable behavior, and deliberate recovery paths.

---

## Architecture & Visual Design System

`scardubu.dev` is built with **Next.js 15 (App Router)**, **React 19**, **TypeScript (strict)**, and **Tailwind CSS v4** on the **Obsidian Nocturne v2** dark OLED design system:

- **Base Canvas**: OLED black (`bg-obsidian-base` / `#08090C`).
- **Elevated Surfaces**: Structural cards and ledger modules (`bg-obsidian-surface` / `#0E0E10`).
- **Accents**: Electric cyan (`accent-cyan` / `#00D9FF`, hover `accent-cyanHover` / `#7AEAFF`) for primary calls to action, focus rings, active navigation indicators, and interactive telemetry; amber (`#FCD34D`) for `ACTIVE BUILD` status; emerald (`accent-emerald` / `#00FF66`) for `PUBLIC SOURCE` status and copy-confirmation states.
- **Typography**: `Space Grotesk` (`--font-space-grotesk`) for display/section headings and editorial copy; `JetBrains Mono` (`--font-jetbrains-mono`, `tabular-nums`) for section indices, status metadata, and technical labels.
- **Token Hygiene & Styling**: Structural `1px` hairlines (`border-white/10`), fluid display/section/lede scales, pure Tailwind v4 design tokens (`tailwind.config.js` + `app/globals.css`) with zero arbitrary bracket utilities enforced across active surfaces (`scripts/verify-ui-contracts.mjs` V23/V25 and `tests/unit/polish-contracts.test.ts`), WCAG 2.2 AA/AAA contrast, and strict `prefers-reduced-motion` support.
- **Global Quick Navigation (`⌘K` / `Ctrl+K`)**: Lazy-loaded [`DeferredCommandPalette`](components/DeferredCommandPalette.tsx) mounted in [`app/layout.tsx`](app/layout.tsx) with desktop `JUMP ⌘K` trigger in [`Navbar.tsx`](components/Navbar.tsx), first-press browser shortcut guard, keyboard arrow navigation, and focus restoration on close.

---

## Profile Portrait & Static Assets Contract

- **Active editorial portrait**: [`public/images/oscar-headshot.jpg`](public/images/oscar-headshot.jpg) (served at `/images/oscar-headshot.jpg`).
  - **Rendered frame**: `240 × 300 px` (`4:5` `aspect-portrait`, `sizes="(min-width: 1024px) 144px, (min-width: 640px) 136px, 112px"`, `quality={88}`, `priority`, `object-cover`) in [`components/IdentityCard.tsx`](components/IdentityCard.tsx), paired with `.identity-portrait-scrim` and a desktop fine-pointer WebGL overlay (`HeroPortraitShader`, `ssr: false`, gated by `(min-width: 1024px) and (pointer: fine)` and `(prefers-reduced-motion: reduce)`).
  - **Enforcement**: Locked by V20/V22/V24 in [`scripts/verify-ui-contracts.mjs`](scripts/verify-ui-contracts.mjs), [`tests/unit/milestone2-geometry.test.ts`](tests/unit/milestone2-geometry.test.ts), and [`e2e/refinement-verification.spec.ts`](e2e/refinement-verification.spec.ts).
- **Structured-data avatar**: [`public/headshot.webp`](public/headshot.webp) (`680 × 680 px`, `1:1` WebP VP8, `48.53 KB`), referenced as `Person.image` (`${SITE_URL}/headshot.webp`) in [`app/lib/structured-data.ts`](app/lib/structured-data.ts).
- **Archived portrait source**: `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`, unreferenced by active UI).
- **Résumé PDF**: [`public/cv/oscar-ndugbu-resume.pdf`](public/cv/oscar-ndugbu-resume.pdf) (canonical asset via `CV_ASSET_PATH` in [`lib/config.ts`](lib/config.ts)), with legacy alias [`public/oscar-scardubu-resume.pdf`](public/oscar-scardubu-resume.pdf) kept in sync and permanently redirected to `/cv/oscar-ndugbu-resume.pdf` in [`next.config.ts`](next.config.ts).
- **Open Graph & Twitter Cards**: Dynamically rendered from [`components/OGImage.tsx`](components/OGImage.tsx) at `/opengraph-image`, `/twitter-image`, `/og`, `/api/og`, and per-project `/work/[slug]/og` (`1200 × 630 px` PNG).

---

## Routes & Engineering Evidence

All public claims follow the evidence boundaries in [`docs/claim-ledger.md`](docs/claim-ledger.md) and are enforced by `pnpm run audit:copy`.

- **Homepage (`/`)**:
  - **Hero & Identity Ledger** ([`HeroSection.tsx`](components/HeroSection.tsx), [`IdentityCard.tsx`](components/IdentityCard.tsx)): Plain-English positioning, `LAGOS · REMOTE` cue, role-fit summary, symmetrical `4 × 3` capability ledger, one-click `CopyEmail` + `RÉSUMÉ` CTAs, and four cross-project design themes.
  - **`01 // Projects`** ([`ProjectsSection.tsx`](components/ProjectsSection.tsx), [`ProjectCardInteractive.tsx`](components/ProjectCardInteractive.tsx)): Scannable `P/01`–`P/04` project index (`SabiScore`, `TaxBridge`, `The Yap Engine`, `UBEC Data Pipeline`) with accessible `Plain English` ↔ `Under the hood` segmented tablists, 3-stage interactive `FailureFlowStepper` modules inside native keyboard-operable `<details>` disclosures, and secondary case-study cards (`SwarmXQ`, `Hashablanca`, `ML Systems Consulting`).
  - **`02 // Engineering Decisions`** ([`ProductionPatterns.tsx`](components/ProductionPatterns.tsx)): **Naive default (rejected) vs. Chosen boundary** failure-containment matrix paired with the newest published engineering notes.
  - **`03 // Contact`** ([`ContactSection.tsx`](components/ContactSection.tsx), [`app/lib/validations.ts`](app/lib/validations.ts), [`app/api/contact/route.ts`](app/api/contact/route.ts)): Adaptive dual-mode intake switching between **`Hiring / Staff Role`** (default quick recruiter note, no consulting `stakes` required) and **`Architecture & Consulting`** (full scoped brief with `.superRefine` Zod validation), plus direct email copy and `mailto:` fallback.
- **Engineering Case Studies (`/work/[slug]`)**: MDX records in `content/work/*.mdx` backed by [`lib/work-meta.ts`](lib/work-meta.ts), featuring sticky [`ArticleOutline`](components/ArticleOutline.tsx) (`On this page` TOC + section-link copy), evidence-boundary sidebar, bidirectional links to related engineering notes, copyable [`CodeBlockClient`](components/CodeBlockClient.tsx) code blocks, and `SoftwareApplication` / `Service` JSON-LD.
- **Engineering Writing (`/writing`, `/writing/[slug]`, `/rss.xml`)**: MDX notes in `content/writing/*.mdx` compiled via [`lib/content.ts`](lib/content.ts) with featured article + related case-study cross-links (`getRelatedWorkForWriting`), sticky [`ArticleOutline`](components/ArticleOutline.tsx), copyable [`CodeBlockClient`](components/CodeBlockClient.tsx) blocks, H2 hover anchor links, newer/older navigation, `TechArticle` JSON-LD, and RSS syndication.
- **Fault Isolation & 404 Routes (`/error`, `/not-found`)**: Obsidian Nocturne v2 token-aligned recovery pages with error-digest copy (`app/error.tsx`) and direct links to verified portfolio routes (`app/not-found.tsx`).

---

## Local Development & Verification

### Prerequisites

- Node.js `22.x` (`engines.node` in `package.json`)
- `pnpm@10.34.9` (`packageManager` in `package.json`)

### Quickstart

```bash
# Clone the repository
git clone https://github.com/sabiscore/portfoliox.git
cd portfoliox

# Install dependencies
pnpm install

# Run full prebuild quality gates (App Router & UI contracts, ESLint, TypeScript, Vitest, copy audit)
pnpm run prebuild

# Run production build
pnpm run build

# Start local development server
pnpm run dev
```

### Additional Verification Scripts

```bash
# Run UI design-token & geometry contracts (V16–V25)
pnpm run verify:ui-contracts

# Verify WCAG AA/AAA contrast ratios
node scripts/verify-contrast.mjs

# Run unit tests (Vitest)
pnpm run test:unit

# Run copy & claims ledger audit
pnpm run audit:copy

# Run Playwright smoke, Chromium E2E, and mobile suites (requires built app / Playwright browsers)
pnpm run test:smoke
pnpm run test:e2e
pnpm run test:mobile

# Run cross-platform full validation helper
pnpm run validate
```
