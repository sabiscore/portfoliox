# Identity Card Implementation Notes (Historical Archive + Current Contract)

> **Current state (verified 2026-11-22):** The legacy squircle glass identity card documented below was superseded by the Obsidian Nocturne v2 engineering profile ledger in [`components/IdentityCard.tsx`](../../components/IdentityCard.tsx).
>
> - **Active editorial portrait**: [`public/images/oscar-headshot.jpg`](../../public/images/oscar-headshot.jpg) (`/images/oscar-headshot.jpg`, `1086 × 1448 px`).
> - **Rendered frame**: `240 × 300 px` (`4:5` `aspect-portrait`, `sizes="(min-width: 1024px) 144px, (min-width: 640px) 136px, 112px"`, `quality={88}`, `priority`, `.identity-portrait-scrim`, and desktop fine-pointer `HeroPortraitShader` with `ssr: false` + reduced-motion gating), locked by `scripts/verify-ui-contracts.mjs` (`V20`, `V22`, `V24`), `tests/unit/milestone2-geometry.test.ts`, and `e2e/refinement-verification.spec.ts`.
> - **Header & footer actions**: Displays `LAGOS · REMOTE`, role-fit cue, symmetrical `4 × 3` capability ledger (`V21`), primary `<CopyEmail variant="primary" />` (`COPIED ✓`), and canonical `CV_ASSET_PATH` (`RÉSUMÉ`) link.
> - **Structured-data avatar & archive**: [`public/headshot.webp`](../../public/headshot.webp) (`680 × 680 px`, `48.53 KB`) serves `Person.image` in `app/lib/structured-data.ts`; `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`) remains archived on disk.

---

## Historical Note — Luxury Operating-System Identity Card Upgrade

## Files updated
- `components/HeroSection.tsx`
- `components/IdentityCard.tsx`

## What changed
- Replaced the old portrait block with a dedicated identity-card component.
- Upgraded the portrait into a layered 4:5 squircle card with:
  - premium frame chrome
  - subtle scanlines
  - radial glow
  - top and bottom telemetry labels
  - restrained hover tilt on desktop
- Kept the hero layout intact so the change is surgical rather than structural.

## Implementation steps

1. Copy `components/IdentityCard.tsx` into your repo at the same path.
2. Replace `components/HeroSection.tsx` with the updated version.
3. Keep `public/headshot.webp` unchanged.
4. Run the project checks:
   - `pnpm lint`
   - `pnpm type-check`
   - `pnpm build`
5. Open the hero on mobile and desktop to confirm:
   - the card reads as a luxury identity module
   - the portrait still centers cleanly
   - the card does not introduce horizontal overflow

## Notes
- No new dependency is required.
- The upgrade uses existing Next.js, Tailwind, and Framer Motion setup.
- The identity card is self-contained and can be reused in other sections later.