import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// Scope vitest strictly to unit tests under tests/unit. Without this, `vitest run`
// defaults to globbing every *.spec.ts in the repo and tries to execute the
// Playwright e2e specs (which call test.skip() at module scope), failing the run.
// Playwright owns e2e/** and tests/**/*.spec.ts (see playwright.config.ts);
// vitest owns tests/unit/**/*.test.ts. The two never overlap.
const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': root,
    },
  },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', '.next', 'e2e/**', 'tests/**/*.spec.ts'],
  },
});
