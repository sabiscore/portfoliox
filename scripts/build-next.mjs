#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const require = createRequire(import.meta.url);
const directNextBin = path.resolve(process.cwd(), 'node_modules/next/dist/bin/next');
const nextBin = fs.existsSync(directNextBin)
  ? directNextBin
  : require.resolve('next/dist/bin/next');

const result = spawnSync(
  process.execPath,
  [nextBin, 'build', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      BROWSERSLIST_IGNORE_OLD_DATA: '1',
    },
  }
);

if (result.error) {
  console.error(' ✕ [build-next] Failed to launch Next.js build:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
