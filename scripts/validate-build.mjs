#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const rootRequire = createRequire(path.resolve(rootDir, 'package.json'));

let e2eMode = 'none';
for (const arg of process.argv.slice(2)) {
  if (arg === '--e2e') {
    e2eMode = 'chromium';
  } else if (arg === '--e2e-all') {
    e2eMode = 'all';
  } else {
    console.error(`Unknown option: ${arg} (supported: --e2e, --e2e-all)`);
    process.exit(2);
  }
}

const baseEnv = {
  ...process.env,
  COREPACK_ENABLE_DOWNLOAD_PROMPT: '0',
  BROWSERSLIST_IGNORE_OLD_DATA: '1',
};

function resolveBin(pkgName, binName = pkgName) {
  const directPkgJson = path.resolve(rootDir, 'node_modules', pkgName, 'package.json');
  const pkgJsonPath = fs.existsSync(directPkgJson)
    ? directPkgJson
    : rootRequire.resolve(`${pkgName}/package.json`);
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  const binRel = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.[binName];
  if (!binRel) {
    throw new Error(`Could not resolve bin "${binName}" from package "${pkgName}"`);
  }
  return path.resolve(path.dirname(pkgJsonPath), binRel);
}

function runNode(scriptPath, args = []) {
  const result = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: rootDir,
    stdio: 'inherit',
    env: baseEnv,
  });

  if (result.error) {
    console.error(` ✕ Failed to execute ${scriptPath}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runPreflight() {
  console.log('━━━ [0/8] Preflight: Runtime & Native Dependency Integrity ━━━');

  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor !== 22) {
    console.warn(
      ` ⚠ Node ${process.versions.node} active; package.json expects 22.x (Vercel deploys on Node 22.x).`
    );
  }

  const rollupTargets = {
    'linux:x64': ['@rollup/rollup-linux-x64-gnu', '@rollup/rollup-linux-x64-musl'],
    'linux:arm64': ['@rollup/rollup-linux-arm64-gnu', '@rollup/rollup-linux-arm64-musl'],
    'darwin:arm64': ['@rollup/rollup-darwin-arm64'],
    'darwin:x64': ['@rollup/rollup-darwin-x64'],
    'win32:x64': ['@rollup/rollup-win32-x64-msvc'],
  };

  const key = `${process.platform}:${process.arch}`;
  const candidates = rollupTargets[key] ?? [];

  let rollupPkg = path.resolve(rootDir, 'node_modules/rollup/package.json');
  const pnpmDir = path.resolve(rootDir, 'node_modules/.pnpm');
  if (!fs.existsSync(rollupPkg) && fs.existsSync(pnpmDir)) {
    const entry = fs.readdirSync(pnpmDir).find((dir) => dir.startsWith('rollup@'));
    if (entry) {
      rollupPkg = path.resolve(pnpmDir, entry, 'node_modules/rollup/package.json');
    }
  }

  if (candidates.length > 0 && fs.existsSync(rollupPkg)) {
    const rollupReq = createRequire(rollupPkg);
    const resolved = candidates.some((pkg) => {
      try {
        rollupReq.resolve(pkg);
        return true;
      } catch {
        return false;
      }
    });

    if (!resolved) {
      console.error(`\n ✕ Missing native Rollup binary for ${key} (${candidates.join(' or ')}).`);
      console.error(
        '   Cause: node_modules was installed on a different OS (Windows vs WSL2 Linux).'
      );
      if (process.platform === 'linux') {
        console.error(
          '   Fix:   Run `node scripts/validate-build.mjs --e2e` in PowerShell, or run `bash scripts/repair-wsl-env.sh` to switch to WSL2 Linux.\n'
        );
      } else {
        console.error('   Fix:   Run `pnpm install --frozen-lockfile` in this shell.\n');
      }
      process.exit(1);
    }
  }

  console.log(
    ` ✓ [preflight] Node ${process.versions.node} (${key}) and native Rollup bindings verified.`
  );
}

runPreflight();

console.log('━━━ [1/8] Verifying App Router & Component Export Contracts ━━━');
runNode(path.resolve(rootDir, 'scripts/verify-app-router.mjs'));

console.log('━━━ [2/8] Running Strict TypeScript Typecheck ━━━');
runNode(resolveBin('typescript', 'tsc'), ['--noEmit', '-p', 'tsconfig.typecheck.json']);

console.log('━━━ [3/8] Running ESLint Design-System & AST Rules ━━━');
runNode(resolveBin('eslint', 'eslint'), ['.']);

console.log('━━━ [4/8] Auditing Copy Against Claim Ledger (Strict NRS) ━━━');
runNode(path.resolve(rootDir, 'scripts/audit-copy.mjs'), ['--strict-nrs']);

console.log('━━━ [5/8] Verifying WCAG 2.1 Color Contrast Matrix ━━━');
runNode(path.resolve(rootDir, 'scripts/verify-contrast.mjs'));

console.log('━━━ [6/8] Verifying UI Accessibility & Rendering Contracts (V16–V25) ━━━');
runNode(path.resolve(rootDir, 'scripts/verify-ui-contracts.mjs'));

console.log('━━━ [7/8] Running Unit Tests ━━━');
runNode(resolveBin('vitest', 'vitest'), ['run']);

console.log('━━━ [8/8] Executing Production Next.js Build ━━━');
runNode(path.resolve(rootDir, 'scripts/build-next.mjs'));

if (e2eMode === 'chromium') {
  console.log('━━━ [Bonus] Running Playwright Refinement Verification Suite (Chromium) ━━━');
  runNode(resolveBin('@playwright/test', 'playwright'), [
    'test',
    'e2e/refinement-verification.spec.ts',
    '--project=chromium',
  ]);
} else if (e2eMode === 'all') {
  console.log('━━━ [Bonus] Running Full 5-Browser Playwright Refinement Matrix ━━━');
  runNode(resolveBin('@playwright/test', 'playwright'), [
    'test',
    'e2e/refinement-verification.spec.ts',
  ]);
}

console.log('✓ Build validation completed successfully.');
