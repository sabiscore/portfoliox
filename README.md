# scardubu.dev // Engineering Portfolio & Systems Ledger

> Systems you can trust at 2 AM. Staff backend, platform, and AI infrastructure engineered with explicit failure boundaries, observable behavior, and deliberate recovery paths.

---

## Architecture & Visual Design System

`scardubu.dev` is built with **Next.js 15 (App Router)**, **React 19**, **TypeScript (strict)**, and **Tailwind CSS v4** on a high-contrast dark OLED interface:

- **Base Canvas**: OLED black (`#08090C`).
- **Elevated Surfaces**: Structural cards and ledger modules (`#0E0E10`).
- **Accents**: Electric cyan (`#00D9FF`) for primary calls to action, focus rings, active navigation indicators, and interactive telemetry; amber (`#FCD34D`) for `ACTIVE BUILD` status; emerald (`#00FF66`) for `PUBLIC SOURCE` status.
- **Typography**: `Space Grotesk` (`--font-space-grotesk`) for display/section headings and editorial copy; `JetBrains Mono` (`--font-jetbrains-mono`, `tabular-nums`) for section indices, status metadata, and technical labels.
- **Styling Principles**: Structural `1px` hairlines (`border-white/10`), fluid display/section/lede scales, WCAG 2.2 AA contrast and focus rings, and strict `prefers-reduced-motion` support.

---

## Profile Picture & Static Assets Contract

- **Canonical profile picture**: [`public/headshot.webp`](public/headshot.webp) (served at `/headshot.webp`).
  - **Intrinsic size**: `680 × 680 px` (`1:1` square, WebP VP8, `48.53 KB` — within the `≤ 80 KB` asset budget).
  - **Rendered size**: `64 × 64 px` (`h-16 w-16`, `fill`, `sizes="64px"`, `priority`, `object-cover`) in [`components/IdentityCard.tsx`](components/IdentityCard.tsx), matching `next.config.ts` `imageSizes` (`64`, `128`) for crisp `1×`/`2×` delivery and locked by [`tests/unit/milestone2-geometry.test.ts`](tests/unit/milestone2-geometry.test.ts).
  - **Structured data**: Referenced as `Person.image` (`${SITE_URL}/headshot.webp`) in [`app/lib/structured-data.ts`](app/lib/structured-data.ts).
- **Archived source portraits (unreferenced by active components)**:
  - `public/images/oscar-headshot.jpg` (`1086 × 1448 px`, `377.40 KB`)
  - `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`)
- **Résumé PDF**: `public/cv/oscar-ndugbu-resume.pdf` (configured via `CV_ASSET_PATH` in `lib/config.ts`).
- **Open Graph & Twitter Cards**: Dynamically rendered from [`components/OGImage.tsx`](components/OGImage.tsx) at `/opengraph-image`, `/twitter-image`, `/og`, `/api/og`, and per-project `/work/[slug]/og` (`1200 × 630 px` PNG).

---

## Routes & Engineering Evidence

All public claims follow the evidence boundaries in [`docs/claim-ledger.md`](docs/claim-ledger.md) and are enforced by `pnpm run audit:copy`.

- **Homepage (`/`)**: Editorial hero + `IdentityCard` profile ledger, selected systems ledger (`TaxBridge`, `SabiScore`, `YapCommerce / Yap Engine`, `UBEC Data Pipeline`) plus additional case studies (`SwarmXQ`, `Hashablanca`, `ML Systems Consulting`), failure-boundary engineering patterns with latest notes, and structured contact intake (`/api/contact`).
- **Engineering Case Studies (`/work/[slug]`)**: MDX records in `content/work/*.mdx` backed by canonical metadata in `lib/work-meta.ts`, sticky evidence-boundary sidebar, and `SoftwareApplication` / `Service` JSON-LD.
- **Engineering Writing (`/writing`, `/writing/[slug]`, `/rss.xml`)**: MDX notes in `content/writing/*.mdx` compiled via `lib/content.ts` with `TechArticle` JSON-LD and RSS syndication.

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
# Run unit tests
pnpm run test:unit

# Run Chromium smoke E2E suite (requires built app / Playwright browsers)
pnpm run test:smoke

# Run copy & claims ledger audit
pnpm run audit:copy
```
