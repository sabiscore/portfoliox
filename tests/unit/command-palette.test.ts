import { describe, expect, it } from 'vitest';

import { getProjectPaletteCommand, STATIC_PALETTE_ITEMS } from '@/constants/palette';
import { CV_ASSET_PATH } from '@/lib/config';

describe('command palette route and artifact wiring', () => {
  it('points the Yap Engine and SwarmXQ palette entries at their canonical case-study routes', () => {
    const yapEngineItem = STATIC_PALETTE_ITEMS.find((item) => item.id === 'proj-yap-engine');
    const swarmXqItem = STATIC_PALETTE_ITEMS.find((item) => item.id === 'proj-swarmxq');

    expect(yapEngineItem).toBeDefined();
    expect(yapEngineItem?.href).toBe('/work/yap-engine');
    expect(swarmXqItem).toBeDefined();
    expect(swarmXqItem?.href).toBe('/work/swarmxq');
  });

  it('resolves project palette items by their canonical project slugs', () => {
    expect(getProjectPaletteCommand('yap-engine')).toMatchObject({
      id: 'proj-yap-engine',
      title: 'YapCommerce // The Yap Engine',
      href: '/work/yap-engine',
      category: 'project',
    });

    expect(getProjectPaletteCommand('swarmxq')).toMatchObject({
      id: 'proj-swarmxq',
      title: 'SwarmXQ Agent Orchestration',
      href: '/work/swarmxq',
      category: 'project',
    });
  });

  it('exposes the identity anchor and canonical resume artifact route', () => {
    expect(STATIC_PALETTE_ITEMS.some((item) => item.href === '/#identity')).toBe(true);
    expect(STATIC_PALETTE_ITEMS.some((item) => item.href === CV_ASSET_PATH)).toBe(true);
  });

  it('returns undefined for unknown project palette entries', () => {
    expect(getProjectPaletteCommand('missing')).toBeUndefined();
  });
});
