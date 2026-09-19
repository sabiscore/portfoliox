import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { STATIC_PALETTE_ITEMS } from '@/constants/palette';

describe('command palette Yap Engine wiring', () => {
  const rootDir = resolve(__dirname, '../..');

  it('points the Yap Engine palette entry at the case study route', () => {
    const yapEngineItem = STATIC_PALETTE_ITEMS.find((item) => item.id === 'proj-yap-engine');

    expect(yapEngineItem).toBeDefined();
    expect(yapEngineItem?.href).toBe('/work/yap-engine');
  });

  it('surfaces the Yap Engine entry in the visible command palette commands', () => {
    const commandPaletteContent = readFileSync(
      resolve(rootDir, 'components/CommandPalette.tsx'),
      'utf-8'
    );

    expect(commandPaletteContent).toContain("import { STATIC_PALETTE_ITEMS } from '@/constants/palette'");
    expect(commandPaletteContent).toContain("item.id === 'proj-yap-engine'");
    expect(commandPaletteContent).toContain("label: `${YAP_ENGINE_PALETTE_ITEM.label} case study`");
    expect(commandPaletteContent).toContain('router.push(YAP_ENGINE_CASE_STUDY_HREF);');
  });
});
