#!/usr/bin/env bash
set -euo pipefail

RUN_E2E=false
for arg in "$@"; do
  case "$arg" in
    --e2e)
      RUN_E2E=true
      ;;
    *)
      echo "Unknown option: $arg (supported: --e2e)" >&2
      exit 2
      ;;
  esac
done

# Source NVM when available; CI and Vercel use the Node version selected by
# their runner and do not require a local NVM installation.
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
fi

export PATH="./node_modules/.bin:$PATH"

echo "━━━ [1/8] Verifying App Router & Component Export Contracts ━━━"
node scripts/verify-app-router.mjs

echo "━━━ [2/8] Running Strict TypeScript Typecheck ━━━"
pnpm run type-check

echo "━━━ [3/8] Running ESLint Design-System & AST Rules ━━━"
pnpm run lint

echo "━━━ [4/8] Auditing Copy Against Claim Ledger (Strict NRS) ━━━"
node scripts/audit-copy.mjs --strict-nrs

echo "━━━ [5/8] Verifying WCAG 2.1 Color Contrast Matrix ━━━"
node scripts/verify-contrast.mjs

echo "━━━ [6/8] Verifying UI Accessibility & Rendering Contracts (V16–V24) ━━━"
pnpm run verify:ui-contracts

echo "━━━ [7/8] Running Unit Tests ━━━"
pnpm run test:unit

echo "━━━ [8/8] Executing Production Next.js Build ━━━"
pnpm run build

if [ "$RUN_E2E" = true ]; then
  echo "━━━ [Bonus] Running Playwright Refinement Verification Suite ━━━"
  pnpm exec playwright test e2e/refinement-verification.spec.ts
fi

echo "✓ Build validation completed successfully."
