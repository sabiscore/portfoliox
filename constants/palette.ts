export interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: 'project' | 'writing' | 'navigation' | 'system';
  keywords: string[];
}

export const STATIC_PALETTE_ITEMS: PaletteItem[] = [
  {
    id: 'proj-sabiscore',
    title: 'SabiScore Quantitative Platform',
    subtitle: 'Polars, DuckDB, Shin Devigging & 0.25x Fractional Kelly',
    href: '/work/sabiscore',
    category: 'project',
    keywords: ['sabiscore', 'quant', 'football', 'polars', 'duckdb', 'kelly'],
  },
  {
    id: 'proj-yap-engine',
    title: 'YapCommerce // The Yap Engine',
    subtitle: 'Zero-USD Cloud-LLM Multi-Agent Local GGUF Pipeline',
    href: '/work/yap-engine',
    category: 'project',
    keywords: ['yap', 'gguf', 'fastify', 'agents', 'tiktok', 'yapcommerce'],
  },
  {
    id: 'proj-taxbridge',
    title: 'TaxBridge Compliance Architecture',
    subtitle: 'Offline-First Nigerian Fintech Fiscal Ledger',
    href: '/work/taxbridge',
    category: 'project',
    keywords: ['taxbridge', 'fintech', 'nigeria', 'offline', 'zod', 'crdt'],
  },
  {
    id: 'nav-writing',
    title: 'Engineering Monographs & Writing',
    subtitle: 'Deep dives into low-memory ML and emerging-market systems',
    href: '/writing',
    category: 'navigation',
    keywords: ['blog', 'writing', 'articles', 'monographs'],
  },
];

export function getProjectPaletteCommand(slug: string): PaletteItem | undefined {
  const normalized = slug.trim().toLowerCase();
  return STATIC_PALETTE_ITEMS.find(
    (item) => item.id === `proj-${normalized}` || item.href === `/work/${normalized}`
  );
}
