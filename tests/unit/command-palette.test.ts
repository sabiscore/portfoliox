import { describe, expect, it } from 'vitest';

import { getProjectPaletteCommand, STATIC_PALETTE_ITEMS } from '@/constants/palette';

describe('command palette Yap Engine wiring', () => {
  it('points the Yap Engine palette entry at the registered case-study route', () => {
    const yapEngineItem = STATIC_PALETTE_ITEMS.find((item) => item.id === 'proj-yap-engine');

    expect(yapEngineItem).toBeDefined();
    expect(yapEngineItem?.href).toBe('/work/swarmxq');
  });

  it('resolves the Yap Engine palette item by its project slug', () => {
    expect(getProjectPaletteCommand('yap-engine')).toMatchObject({
      id: 'proj-yap-engine',
      title: 'YapCommerce // The Yap Engine',
      href: '/work/swarmxq',
      category: 'project',
    });
  });

  it('returns undefined for unknown project palette entries', () => {
    expect(getProjectPaletteCommand('missing')).toBeUndefined();
  });
});
