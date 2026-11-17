import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Copy and claims audit validation', () => {
  it('executes the canonical audit with the same rules used by CI', () => {
    const rootDir = resolve(__dirname, '../..');
    const auditScript = resolve(rootDir, 'scripts/audit-copy.mjs');

    const result = spawnSync(process.execPath, [auditScript], {
      cwd: rootDir,
      encoding: 'utf8',
      env: process.env,
    });

    expect(result.error, result.stderr || 'Unable to start the canonical copy audit').toBeUndefined();
    expect(
      result.status,
      [
        'The canonical copy audit must pass before the unit suite can pass.',
        result.stdout,
        result.stderr,
      ].join('\n')
    ).toBe(0);
    expect(result.stdout).toContain('audit:copy — clean');
  });
});
