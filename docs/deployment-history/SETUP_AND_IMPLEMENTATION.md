# Identity Card Implementation Notes (Historical Archive + Current Contract)

> **Current state (verified 2026-11-21):** The legacy `4:5` squircle glass identity card documented below was superseded by the compact OLED engineering profile ledger in [`components/IdentityCard.tsx`](../../components/IdentityCard.tsx).
>
> - **Canonical profile picture**: [`public/headshot.webp`](../../public/headshot.webp) (`/headshot.webp`, `680 × 680 px`, `1:1` WebP VP8, `48.53 KB`).
> - **Rendered frame**: `64 × 64 px` (`h-16 w-16`, `fill`, `sizes="64px"`, `priority`, `object-cover`), locked by `tests/unit/milestone2-geometry.test.ts` and paired with `Person.image` in `app/lib/structured-data.ts`.
> - **Unused archive copies on disk**: `public/images/oscar-headshot.jpg` (`1086 × 1448 px`, `377.40 KB`) and `public/images/scar-headshot.jpeg` (`1254 × 1254 px`, `241.70 KB`).

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