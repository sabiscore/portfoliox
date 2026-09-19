// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly status: 'live' | 'wip' | 'case-study';
  readonly type: string;
  readonly description: string;
  readonly constraint: string;
  readonly stack: readonly string[];
  readonly outcomes: readonly string[];
  readonly chosen: string;
  readonly over: string;
  readonly because: string;
  readonly ledger: {
    readonly constraint: string;
    readonly decision: string;
    readonly outcome: string;
    readonly evidence: string;
  };
  readonly featured?: boolean;
  readonly demoUrl?: string;
  readonly githubUrl?: string;
  readonly caseStudy?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'taxbridge',
    title: 'TaxBridge',
    type: 'Compliance Platform · Fintech',
    status: 'case-study',
    featured: true,
    tagline: 'Tax workflow orchestration with idempotent replay, database-enforced tenant isolation, and an explicitly private evidence record.',
    description:
      'Tax workflow automation for Nigerian small businesses. PostgreSQL RLS isolates each tenant at the database level. BullMQ jobs use submission-derived idempotency keys to prevent duplicate processing through retries, and the audit trail is hash-chained. NRS DigiTax integration remains in progress.',
    chosen: 'PostgreSQL Row-Level Security for multi-tenancy',
    over: 'Application-layer tenant filtering',
    because:
      'NRS audit scrutiny demands proof that tenant data cannot cross-contaminate — RLS enforces this at the database engine level, not the application layer',
    constraint:
      'NRS API rate limits require burst filing windows to be queued without producing duplicate submissions on retry.',
    outcomes: [
      'idempotent submission replay',
      'database-enforced tenant isolation',
      'hash-chained audit records',
      'durable offline + worker replay',
    ],
    ledger: {
      constraint: 'Rate-limited tax submission during deadline bursts, with duplicate filing risk on retry.',
      decision: 'Database RLS plus idempotent BullMQ jobs keyed to submission content.',
      outcome: 'Retries can resume without re-submitting a completed filing operation.',
      evidence: 'Private architecture record · source available to verified employers.',
    },
    stack: [
      'Fastify 5',
      'Java 17',
      'Spring Boot 3',
      'PostgreSQL 15 RLS',
      'Redis 7',
      'BullMQ',
      'React Native',
      'Turborepo',
      'GraphQL',
      'Prisma',
      'TypeScript',
    ],
    caseStudy: '/work/taxbridge',
  },
  {
    slug: 'sabiscore',
    title: 'SabiScore',
    type: 'ML Platform · Observability',
    status: 'live',
    featured: true,
    tagline: 'Ensemble ML serving with versioned caching, model-quality telemetry, and a deliberate lower-confidence fallback path.',
    description:
      'Ensemble prediction serving (XGBoost, LightGBM, CatBoost) with model-quality monitoring. Versioned Redis caching prevents stale predictions from surviving a retrain, and a baseline model provides an explicit degraded path when dependencies are unavailable.',
    chosen: 'FastAPI + Redis Pub/Sub for inference serving',
    over: 'Synchronous REST with database polling',
    because:
      'Pub/Sub avoids a polling herd against the database and gives disconnected subscribers a defined recovery path',
    constraint:
      'Ensemble inference must remain useful through retraining windows and dependency failure without serving stale model output.',
    outcomes: [
      'versioned cache invalidation',
      'model-quality telemetry',
      'lower-confidence fallback',
      'public source repository',
    ],
    ledger: {
      constraint: 'Inference and model-health signals must remain usable through cache or feature-store failure.',
      decision: 'FastAPI serving, versioned Redis caching, Pub/Sub fan-out, and a lower-confidence fallback model.',
      outcome: 'Dependency failure returns a labelled lower-confidence result instead of stale output or an opaque error.',
      evidence: 'Public source · architecture case study; performance artifacts are not published.',
    },
    stack: [
      'FastAPI',
      'XGBoost',
      'LightGBM',
      'CatBoost',
      'Redis Pub/Sub',
      'Prometheus',
      'Grafana',
      'PostgreSQL',
    ],
    demoUrl: 'https://sabiscore.scardubu.dev',
    githubUrl: 'https://github.com/Scardubu/Sabiscore',
    caseStudy: '/work/sabiscore',
  },
  {
    // v27 P2-B: description now names the triadic LLM stack explicitly.
    // Stack: Ollama added (the local inference runtime); React Native added
    // (the dashboard has a mobile companion view); PostgreSQL removed from
    // primary slot — Redis 7 is the queue store. WebSocket retained for
    // real-time fleet telemetry.
    slug: 'swarmxq',
    title: 'SwarmXQ',
    type: 'AI Agent Platform · Orchestration',
    status: 'case-study',
    featured: true,
    tagline: 'Multi-agent orchestration with task-specific model routing, bounded fallbacks, checkpoint recovery, and an operator dashboard.',
    description:
      'Multi-agent orchestration platform with local inference via Ollama. Phi-4-mini handles routing, DeepSeek-R1 handles multi-step reasoning, and Qwen2.5-Coder handles generation. The evolution layer scores strategies against recorded outcomes, while the operator dashboard exposes queue depth, agent health, completion state, and checkpoint recovery.',
    chosen: 'Autonomous evolution layer with LLM-guided strategy mutation',
    over: 'Static agent configurations with manual tuning cycles',
    because:
      'Manual tuning cannot adapt to novel inputs at scale — autonomous evolution scores strategies against real outcomes and rewrites low performers between runs, compounding quality without engineering intervention',
    constraint:
      'Agents must hold correctness through intermittent connectivity, variable third-party latency, and constrained local inference capacity.',
    outcomes: [
      'self-improving agent fleet',
      'live orchestration dashboard',
      'checkpoint-based fault recovery',
      'automated strategy evaluation',
    ],
    ledger: {
      constraint: 'Local inference must stay correct under constrained memory and intermittent third-party connectivity.',
      decision: 'Task-specific model routing with checkpointed state and bounded fallbacks.',
      outcome: 'Failed work resumes from the last consistent checkpoint instead of restarting the run.',
      evidence: 'Public source · architecture case study.',
    },
    stack: [
      'Python',
      'FastAPI',
      'Ollama',
      'Next.js 15',
      'React Native',
      'BullMQ',
      'Redis 7',
      'WebSocket',
    ],
    githubUrl: 'https://github.com/Scardubu/SwarmXQ',
    caseStudy: '/work/swarmxq',
  },
  {
    slug: 'yap-engine',
    title: 'The Yap Engine',
    type: 'AI Video Platform · Agent Orchestration',
    status: 'case-study',
    featured: true,
    tagline:
      'Pressure-aware short-form video generation powered by an autonomous agent runtime, from a raw topic to a publish-ready creative package.',
    description:
      'The Yap Engine is a short-form video generation platform powered by SwarmXQ. It turns a topic or creative brief into structured intent, a hook-led script, storyboard scenes, voice, captions, deterministic media assembly, and a certified export path while the runtime governs local-model memory pressure, retries, queue state, and graceful degradation.',
    chosen: 'A pressure-aware multi-stage pipeline with task-specific local model routing',
    over: 'A single general-purpose model call followed by ad-hoc media scripting',
    because:
      'Video generation crosses distinct reasoning, creative, and media stages. Separating those stages makes model selection, resource pressure, recovery, and output validation explicit instead of hiding them inside one opaque generation request.',
    constraint:
      'CPU-only generation on constrained hardware must remain observable and recoverable while multiple AI and media stages compete for memory, model residency, queue capacity, and external services.',
    outcomes: [
      'brief-to-video creative pipeline',
      'task-specific local-model routing',
      'checkpointed and resumable jobs',
      'pressure-aware graceful degradation',
    ],
    ledger: {
      constraint:
        'Short-form video generation must survive constrained CPU/RAM resources and partial failures without turning a long-running job into an opaque restart.',
      decision:
        'Stage the pipeline from intent through finalization, route work to task-specific local models, and enforce explicit queue, timeout, and resource-pressure boundaries.',
      outcome:
        'Creative work has visible stage boundaries, recoverable job state, and deliberate degradation paths across inference and media generation.',
      evidence: 'Public source · architecture case study.',
    },
    stack: [
      'Python 3.11+',
      'Fastify 5',
      'TypeScript',
      'Ollama',
      'Next.js 16',
      'React 19',
      'Redis 7',
      'BullMQ',
      'FFmpeg',
      'Kokoro TTS',
    ],
    githubUrl: 'https://github.com/sabiscore/the-yap-engine',
    caseStudy: '/work/yap-engine',
  },
  {
    slug: 'hashablanca',
    title: 'Hashablanca',
    type: 'Blockchain · ZK Privacy',
    status: 'case-study',
    featured: false,
    tagline:
      'ZK proofs for document integrity verification — confidentiality and verifiability as simultaneous properties, not a tradeoff.',
    description:
      'Privacy-preserving blockchain infrastructure using Circom 2 circuits and Groth16 proofs. A verifier can check document integrity without seeing the document. Multi-network adapters isolate chain-specific behavior, while CBOR streaming keeps large archives off the in-memory critical path.',
    chosen: 'Groth16 ZK proofs with off-chain proving',
    over: 'Database timestamp signatures',
    because:
      'Database timestamps are mutable — ZK proofs provide cryptographic verifiability of document existence and integrity without exposing content',
    constraint:
      'Proof generation must complete off-chain and fit within on-chain verifier gas limits across four EVM-compatible networks.',
    outcomes: [
      'ZK proof integrity layer',
      '4 chain networks',
      'streamed archive processing',
      'public source repository',
    ],
    ledger: {
      constraint: 'Verify document integrity without exposing the document or exceeding verifier gas budgets.',
      decision: 'Groth16 proofs generated off-chain with per-network verification adapters.',
      outcome: 'Integrity can be checked without revealing document contents.',
      evidence: 'Public source · architecture case study.',
    },
    stack: [
      'Circom 2',
      'snarkjs (Groth16)',
      'Solidity',
      'FastAPI',
      'Web3.py',
      'PostgreSQL',
      'Docker',
    ],
    githubUrl: 'https://github.com/Scardubu/hashablanca',
    caseStudy: '/work/hashablanca',
  },
  {
    slug: 'ubec',
    title: 'UBEC Data Pipeline',
    type: 'Federal Infrastructure · Data Engineering',
    status: 'case-study',
    featured: false,
    tagline: 'Federal education reporting across 36 state sources — probabilistic deduplication, per-state retry semantics, and explicit partial-output handling.',
    description:
      'Batch ingestion pipeline for the Universal Basic Education Commission (Abuja HQ). It processes reporting data from 36 state sources with heterogeneous schemas. Probabilistic deduplication (dedupe.io + PostgreSQL) is validated against a manual review sample. Per-state DAG tasks mean one late submission does not block reporting for the other 35, while Great Expectations flags anomalies before they enter ministry reports.',
    chosen: 'Blocking + probabilistic record linkage (dedupe.io)',
    over: 'Exact-match deduplication on school_name',
    because:
      'State submissions use inconsistent school names across ministries, so exact-match logic leaves known duplicate patterns unresolved',
    constraint:
      'Partial state submissions are the rule, not the exception. The pipeline must produce accurate reporting for submitted states without waiting for all 36.',
    outcomes: [
      '36 state sources ingested',
      'manual-review validation sample',
      'per-state retry semantics',
      'ministry-grade audit trail',
    ],
    ledger: {
      constraint: 'Late and partial state submissions must not block every completed report.',
      decision: 'Isolated Airflow task groups per state, followed by cross-state validation gates.',
      outcome: 'Thirty-five state reports can proceed while one delayed source remains visibly pending.',
      evidence: 'Private federal engagement · architecture case study.',
    },
    stack: [
      'Python 3.11',
      'Apache Airflow',
      'pandas',
      'PostgreSQL',
      'Great Expectations',
      'dedupe.io',
      'Docker',
    ],
    caseStudy: '/work/ubec',
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
