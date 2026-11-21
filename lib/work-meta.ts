export type EvidenceStatus =
  | 'ACTIVE BUILD'
  | 'PUBLIC DEMO'
  | 'PUBLIC SOURCE'
  | 'PRIVATE CASE STUDY'
  | 'SCOPED ENGAGEMENT';

export interface WorkCaseRecordMeta {
  slug: string;
  title: string;
  domain: string;
  status: EvidenceStatus;
  evidence: string;
  tagline: string;
  demoHref?: string;
  sourceHref?: string;
}

// Evidence status is carried by text and a dot; colour only reinforces it (WCAG 1.4.1).
export const STATUS_TONE: Record<EvidenceStatus, { chip: string; dot: string; hex: string }> = {
  'ACTIVE BUILD': {
    chip: 'border-amber-300/40 bg-amber-300/10 text-amber-200',
    dot: 'bg-amber-300',
    hex: '#fcd34d',
  },
  'PUBLIC DEMO': {
    chip: 'border-[#00D9FF]/40 bg-[#00D9FF]/10 text-[#00D9FF]',
    dot: 'bg-[#00D9FF]',
    hex: '#00D9FF',
  },
  'PUBLIC SOURCE': {
    chip: 'border-[#00FF66]/35 bg-[#00FF66]/10 text-[#00FF66]',
    dot: 'bg-[#00FF66]',
    hex: '#00FF66',
  },
  'PRIVATE CASE STUDY': {
    chip: 'border-white/15 bg-white/[0.03] text-zinc-300',
    dot: 'bg-zinc-400',
    hex: '#a1a1aa',
  },
  'SCOPED ENGAGEMENT': {
    chip: 'border-[#00D9FF]/30 bg-white/[0.03] text-zinc-200',
    dot: 'bg-[#00D9FF]',
    hex: '#00D9FF',
  },
};

export const WORK_CASE_META: Record<string, WorkCaseRecordMeta> = {
  taxbridge: {
    slug: 'taxbridge',
    title: 'TaxBridge',
    domain: 'COMPLIANCE PLATFORM · FINTECH',
    status: 'ACTIVE BUILD',
    tagline:
      'A tax workflow platform built around shared API contracts, tenant-scoped data access, background processing, and offline-first mobile sync.',
    evidence:
      'Active build. Provider certification and end-to-end fiscalization behavior are not presented as completed.',
    sourceHref: 'https://github.com/scardubu/taxbridge',
  },
  sabiscore: {
    slug: 'sabiscore',
    title: 'SabiScore',
    domain: 'QUANTITATIVE ML · DATA PLATFORM',
    status: 'PUBLIC DEMO',
    tagline:
      'A probabilistic football forecasting and market-comparison product spanning data ingestion, feature engineering, ensemble inference, and a research-facing web interface.',
    evidence:
      'Public product demo. Operational SLOs and measured predictive performance are not asserted on this page.',
    demoHref: 'https://sabiscore.app',
  },
  'yap-engine': {
    slug: 'yap-engine',
    title: 'YapCommerce / Yap Engine',
    domain: 'AI WORKFLOWS · MEDIA PIPELINE',
    status: 'PUBLIC SOURCE',
    tagline:
      'A stage-oriented media and agent workflow combining local model routing, schema-constrained outputs, CPU-aware synthesis, and restartable tasks.',
    evidence:
      'Public source and architecture record. Deployment-specific performance depends on hardware and model configuration.',
    sourceHref: 'https://github.com/sabiscore/the-yap-engine',
  },
  ubec: {
    slug: 'ubec',
    title: 'UBEC Data Pipeline',
    domain: 'PUBLIC SECTOR · DATA ENGINEERING',
    status: 'PRIVATE CASE STUDY',
    tagline:
      'A state-partitioned data ingestion and validation workflow for federal education reporting, described at a non-sensitive architectural level.',
    evidence:
      'Private engagement. No confidential artifacts or unverified performance claims are included.',
  },
  swarmxq: {
    slug: 'swarmxq',
    title: 'SwarmXQ',
    domain: 'AI AGENT PLATFORM · ORCHESTRATION',
    status: 'PUBLIC SOURCE',
    tagline:
      'Multi-agent orchestration platform built around outcome-scored strategy experiments, checkpoint-based recovery, and an operator dashboard.',
    evidence:
      'Public source and architecture record. Deployment status and measured quality-uplift rates are not claimed.',
    sourceHref: 'https://github.com/Scardubu/SwarmXQ',
  },
  hashablanca: {
    slug: 'hashablanca',
    title: 'Hashablanca',
    domain: 'BLOCKCHAIN · ZK PRIVACY',
    status: 'PUBLIC SOURCE',
    tagline:
      'Privacy-preserving blockchain infrastructure using Circom 2 and Groth16 proofs for document integrity verification and multi-chain distribution.',
    evidence:
      'Public source and architecture record. No unlinked throughput or maximum archive size benchmark is claimed.',
    sourceHref: 'https://github.com/Scardubu/hashablanca',
  },
  'ml-consulting': {
    slug: 'ml-consulting',
    title: 'ML Systems Consulting',
    domain: 'ML INFRASTRUCTURE · ADVISORY',
    status: 'SCOPED ENGAGEMENT',
    tagline:
      'Deliverable-led ML infrastructure engagements — incident remediation, inference optimisation, audit-traceable documentation, and production pipeline reviews.',
    evidence:
      'Deliverable-led consulting scope. Client-system evidence remains subject to engagement disclosure boundaries.',
  },
};

export const WORK_CASE_ORDER: readonly string[] = [
  'taxbridge',
  'sabiscore',
  'yap-engine',
  'ubec',
  'swarmxq',
  'hashablanca',
  'ml-consulting',
];
