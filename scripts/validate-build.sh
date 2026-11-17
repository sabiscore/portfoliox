#!/usr/bin/env bash
set -euo pipefail

echo "━━━ [1/4] Verifying App Router & Component Export Contracts ━━━"
node scripts/verify-app-router.mjs

echo "━━━ [2/4] Running Strict TypeScript Typecheck ━━━"
pnpm exec tsc --noEmit

echo "━━━ [3/4] Running ESLint Design-System & AST Rules ━━━"
pnpm run lint

echo "━━━ [4/4] Executing Production Next.js Build ━━━"
BROWSERSLIST_IGNORE_OLD_DATA=1 pnpm run build

echo "✓ Build validation completed with zero errors."
