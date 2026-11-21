import { CV_ASSET_PATH } from '@/lib/config';

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
    subtitle: 'Local GGUF Multi-Agent Video & Commerce Pipeline',
    href: '/work/yap-engine',
    category: 'project',
    keywords: ['yap', 'gguf', 'fastify', 'agents', 'tiktok', 'yapcommerce'],
  },
  {
    id: 'proj-swarmxq',
    title: 'SwarmXQ Agent Orchestration',
    subtitle: 'Bounded Multi-Agent Execution & Local Inference Routing',
    href: '/work/swarmxq',
    category: 'project',
    keywords: ['swarmxq', 'agents', 'orchestration', 'inference', 'gguf'],
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
    id: 'nav-identity',
    title: 'Engineering Profile & Contact Ledger',
    subtitle: 'Staff Backend & Platform Engineer — Capabilities, Email & CV',
    href: '/#identity',
    category: 'navigation',
    keywords: ['profile', 'identity', 'oscar', 'scardubu', 'contact', 'email'],
  },
  {
    id: 'nav-writing',
    title: 'Engineering Monographs & Writing',
    subtitle: 'Deep dives into low-memory ML and emerging-market systems',
    href: '/writing',
    category: 'navigation',
    keywords: ['blog', 'writing', 'articles', 'monographs'],
  },
  {
    id: 'sys-resume',
    title: 'Open Résumé (CV.PDF)',
    subtitle: 'Canonical PDF profile for Oscar Ndugbu',
    href: CV_ASSET_PATH,
    category: 'system',
    keywords: ['cv', 'resume', 'pdf', 'download', 'credentials'],
  },
];

export function getProjectPaletteCommand(slug: string): PaletteItem | undefined {
  const normalized = slug.trim().toLowerCase();
  return STATIC_PALETTE_ITEMS.find(
    (item) => item.id === `proj-${normalized}` || item.href === `/work/${normalized}`
  );
}
