#!/usr/bin/env bash
set -euo pipefail

INSTALL_PLAYWRIGHT=false
for arg in "$@"; do
  case "$arg" in
    --with-playwright)
      INSTALL_PLAYWRIGHT=true
      ;;
    *)
      echo "Unknown option: $arg (supported: --with-playwright)" >&2
      exit 2
      ;;
  esac
done

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

echo "━━━ [1/5] Activating Node.js 22.x Runtime (Unix NVM / nvm-windows) ━━━"
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  if ! nvm use 22 --silent >/dev/null 2>&1; then
    echo "Installing Node.js 22 LTS via NVM..."
    nvm install 22
    nvm use 22
  fi
  nvm alias default 22 >/dev/null 2>&1 || true
elif command -v nvm >/dev/null 2>&1; then
  nvm use 22 >/dev/null 2>&1 || true
else
  echo " ⚠ NVM not detected. Continuing with system Node: $(node -v)"
fi

echo "Active Node: $(node -v)"

echo "━━━ [2/5] Preparing Pinned pnpm@10.34.9 via Corepack ━━━"
if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
  corepack prepare pnpm@10.34.9 --activate
fi
echo "Active pnpm: $(pnpm -v)"

echo "━━━ [3/5] Purging Cross-OS node_modules & Stale Build Artifacts ━━━"
rm -rf node_modules .next

echo "━━━ [4/5] Reinstalling Platform-Native Dependencies (Frozen Lockfile) ━━━"
pnpm install --frozen-lockfile

echo "━━━ [5/5] Verifying Native Rollup & esbuild Resolution for Current OS ━━━"
node -e '
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

const key = `${process.platform}:${process.arch}`;
const targets = {
  "linux:x64": [
    { prefix: "rollup@", pkg: "rollup/package.json", candidates: ["@rollup/rollup-linux-x64-gnu", "@rollup/rollup-linux-x64-musl"] },
    { prefix: "esbuild@", pkg: "esbuild/package.json", candidates: ["@esbuild/linux-x64"] },
  ],
  "linux:arm64": [
    { prefix: "rollup@", pkg: "rollup/package.json", candidates: ["@rollup/rollup-linux-arm64-gnu", "@rollup/rollup-linux-arm64-musl"] },
    { prefix: "esbuild@", pkg: "esbuild/package.json", candidates: ["@esbuild/linux-arm64"] },
  ],
  "win32:x64": [
    { prefix: "rollup@", pkg: "rollup/package.json", candidates: ["@rollup/rollup-win32-x64-msvc"] },
    { prefix: "esbuild@", pkg: "esbuild/package.json", candidates: ["@esbuild/win32-x64"] },
  ],
  "darwin:arm64": [
    { prefix: "rollup@", pkg: "rollup/package.json", candidates: ["@rollup/rollup-darwin-arm64"] },
    { prefix: "esbuild@", pkg: "esbuild/package.json", candidates: ["@esbuild/darwin-arm64"] },
  ],
  "darwin:x64": [
    { prefix: "rollup@", pkg: "rollup/package.json", candidates: ["@rollup/rollup-darwin-x64"] },
    { prefix: "esbuild@", pkg: "esbuild/package.json", candidates: ["@esbuild/darwin-x64"] },
  ],
};

const checks = targets[key];
if (!checks) {
  console.log(` ⚠ No explicit native check map for ${key}; skipping native probe.`);
  process.exit(0);
}

for (const check of checks) {
  const entry = fs.readdirSync("node_modules/.pnpm").find((dir) => dir.startsWith(check.prefix));
  if (!entry) {
    console.error(` ✕ Could not locate ${check.prefix} in node_modules/.pnpm`);
    process.exit(1);
  }
  const pkgPath = path.resolve("node_modules/.pnpm", entry, "node_modules", check.pkg);
  const req = createRequire(pkgPath);
  const found = check.candidates.find((candidate) => {
    try {
      req.resolve(candidate);
      return true;
    } catch {
      return false;
    }
  });
  if (!found) {
    console.error(` ✕ Missing native binary for ${key}: expected ${check.candidates.join(" or ")}`);
    process.exit(1);
  }
  console.log(` ✓ Verified ${found} (${key})`);
}
'

if [ "$INSTALL_PLAYWRIGHT" = true ]; then
  echo "━━━ [Bonus] Ensuring Playwright Chromium Binary Is Installed ━━━"
  pnpm exec playwright install chromium
fi

echo ""
echo "✓ Environment repaired cleanly for $(node -p 'process.platform + ":" + process.arch')."
echo "  Next step: bash scripts/validate-build.sh --e2e"
