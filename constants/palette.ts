// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
import { CONTACT_EMAIL } from '@/lib/config';

export interface PaletteItem {
  id: string;
  label: string;
  category: 'NAVIGATE' | 'PROJECTS' | 'WRITING' | 'CONTACT';
  href?: string;
  keywords: string[];
}

export const STATIC_PALETTE_ITEMS: PaletteItem[] = [
  {
    id: 'nav-projects',
    label: 'Projects',
    category: 'NAVIGATE',
    href: '#section-projects',
    keywords: ['work', 'portfolio'],
  },
  {
    id: 'nav-writing',
    label: 'Writing',
    category: 'NAVIGATE',
    href: '#section-writing',
    keywords: ['blog', 'posts', 'articles'],
  },
  {
    id: 'nav-about',
    label: 'About',
    category: 'NAVIGATE',
    href: '#section-about',
    keywords: ['background', 'bio'],
  },
  {
    id: 'nav-contact',
    label: 'Contact',
    category: 'NAVIGATE',
    href: '#section-contact',
    keywords: ['email', 'hire', 'reach'],
  },
  {
    id: 'proj-taxbridge',
    label: 'TaxBridge',
    category: 'PROJECTS',
    href: '/work/taxbridge',
    keywords: ['fintech', 'compliance', 'tax', 'fastify'],
  },
  {
    id: 'proj-sabiscore',
    label: 'SabiScore',
    category: 'PROJECTS',
    href: '/work/sabiscore',
    keywords: ['ml', 'machine learning', 'xgboost', 'observability'],
  },
  {
    id: 'proj-yap-engine',
    label: 'The Yap Engine',
    category: 'PROJECTS',
    href: '/work/yap-engine',
    keywords: ['ai', 'video', 'agents', 'orchestration', 'swarmxq', 'ollama', 'ffmpeg'],
  },
  {
    id: 'proj-hashablanca',
    label: 'Hashablanca',
    category: 'PROJECTS',
    href: '/work/hashablanca',
    keywords: ['blockchain', 'zk', 'privacy', 'encryption'],
  },
  {
    id: 'contact-email',
    label: 'Email Oscar',
    category: 'CONTACT',
    href: `mailto:${CONTACT_EMAIL}`,
    keywords: ['mail', 'message'],
  },
  {
    id: 'contact-gh',
    label: 'GitHub',
    category: 'CONTACT',
    href: 'https://github.com/Scardubu',
    keywords: ['code', 'repos'],
  },
  {
    id: 'contact-li',
    label: 'LinkedIn',
    category: 'CONTACT',
    href: 'https://linkedin.com/in/oscar-ndugbu',
    keywords: ['hire', 'profile'],
  },
];
