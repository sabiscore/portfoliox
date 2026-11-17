#!/usr/bin/env bash
set -euo pipefail

# Source NVM when available; CI and Vercel use the Node version selected by
# their runner and do not require a local NVM installation.
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
fi

export PATH="./node_modules/.bin:$PATH"

echo "━━━ [1/5] Verifying App Router & Component Export Contracts ━━━"
node scripts/verify-app-router.mjs

echo "━━━ [2/5] Running Strict TypeScript Typecheck ━━━"
pnpm run type-check

echo "━━━ [3/5] Running ESLint Design-System & AST Rules ━━━"
pnpm run lint

echo "━━━ [4/5] Running Unit Tests ━━━"
pnpm run test:unit

echo "━━━ [5/5] Executing Production Next.js Build ━━━"
pnpm run build

echo "✓ Build validation completed successfully."
