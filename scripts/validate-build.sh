#!/usr/bin/env bash
set -euo pipefail

# Source NVM and user profile paths if available (fixes WSL subshell pnpm not found)
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Ensure corepack or local node_modules/.bin is in PATH
export PATH="./node_modules/.bin:$PATH"

echo "━━━ [1/4] Verifying App Router & Component Export Contracts ━━━"
node scripts/verify-app-router.mjs

echo "━━━ [2/4] Running Strict TypeScript Typecheck ━━━"
pnpm exec tsc --noEmit

echo "━━━ [3/4] Running ESLint Design-System & AST Rules ━━━"
pnpm run lint

echo "━━━ [4/4] Executing Production Next.js Build ━━━"
BROWSERSLIST_IGNORE_OLD_DATA=1 pnpm run build

echo "✓ Build validation completed with zero errors."
