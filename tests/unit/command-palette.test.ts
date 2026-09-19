import { describe, expect, it } from 'vitest';

import { getProjectPaletteCommand, STATIC_PALETTE_ITEMS } from '@/constants/palette';

describe('command palette Yap Engine wiring', () => {
  it('points the Yap Engine palette entry at the case study route', () => {
    const yapEngineItem = STATIC_PALETTE_ITEMS.find((item) => item.id === 'proj-yap-engine');

    expect(yapEngineItem).toBeDefined();
    expect(yapEngineItem?.href).toBe('/work/yap-engine');
  });

  it('builds a visible Yap Engine case-study command', () => {
    expect(getProjectPaletteCommand('proj-yap-engine')).toEqual({
      id: 'proj-yap-engine',
      label: 'The Yap Engine case study',
      group: 'Case Studies',
      href: '/work/yap-engine',
    });
  });

  it('returns null for unknown project palette entries', () => {
    expect(getProjectPaletteCommand('proj-missing')).toBeNull();
  });
});
