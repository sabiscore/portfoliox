import { Cpu, Database, Server, ShieldCheck } from 'lucide-react';
import React from 'react';

export interface CapabilityDomain {
  id: string;
  code: string;
  title: string;
  summary: string;
  items: { name: string; spec: string }[];
  credentials?: string[];
}

const CAPABILITY_DOMAINS: CapabilityDomain[] = [
  {
    id: 'backend-distributed',
    code: 'DOM-01',
    title: 'Distributed Backend & APIs',
    summary:
      'High-throughput service architecture, idempotent event queues, and strict schema validation.',
    items: [
      { name: 'Python · FastAPI', spec: 'Async / Pydantic v2' },
      { name: 'Node.js · TypeScript', spec: 'Fastify 5 / JSNSD' },
      { name: 'BullMQ · Redis 7', spec: 'Replay-Safe Workers' },
      { name: 'GraphQL · REST', spec: 'Contract-First' },
    ],
  },
  {
    id: 'data-storage',
    code: 'DOM-02',
    title: 'Data Engineering & Storage Engines',
    summary:
      'Multi-tenant relational isolation, out-of-core analytical pipelines, and automated national ETL.',
    items: [
      { name: 'PostgreSQL 15', spec: 'RLS / Query Tuning' },
      { name: 'Polars · DuckDB', spec: 'Out-of-Core Execution' },
      { name: 'Automated ETL', spec: 'Python / Power BI' },
      { name: 'Audit Chains', spec: 'SHA-256 Linked Logs' },
    ],
  },
  {
    id: 'ai-infrastructure',
    code: 'DOM-03',
    title: 'AI & ML Infrastructure',
    summary:
      'Low-memory model serving, deterministic ensemble meta-learners, and multi-agent DAG routing.',
    items: [
      { name: 'Zero-Pickle ML', spec: 'Bounded RAM Envelopes' },
      { name: 'SwarmXQ DAGs', spec: 'Agent Orchestration' },
      { name: 'Local LLM Routing', spec: 'Circuit-Broken Fallbacks' },
      { name: 'Kokoro TTS', spec: 'CPU-Bounded Synthesis' },
    ],
  },
  {
    id: 'cloud-security',
    code: 'DOM-04',
    title: 'Cloud Platform, Security & Credentials',
    summary:
      'Zero-trust deployment topologies, cryptographic payload validation, and resume-listed cloud credentials (verification available on request).',
    items: [
      { name: 'AWS Certified Developer', spec: 'Resume-listed · Dec 2023' },
      { name: 'GCP Associate Cloud Eng', spec: 'Resume-listed · Aug 2023' },
      { name: 'OpenJS Node.js (JSNSD)', spec: 'Resume-listed · May 2024' },
      { name: 'PostgreSQL 14 Associate', spec: 'Resume-listed · Mar 2024' },
    ],
  },
];

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="bg-obsidian-base w-full border-b border-white/10 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="max-w-hero mx-auto">
        <div className="mb-8 space-y-3">
          <div className="tracking-section inline-flex items-center gap-2.5 font-mono text-xs uppercase">
            <span className="text-accent-emerald font-bold">02.5</span>
            <span className="text-zinc-400">CAPABILITIES MATRIX</span>
          </div>

          <h2 id="capabilities-heading" className="type-section font-display font-bold text-white">
            Production stack &amp; resume-listed credentials.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CAPABILITY_DOMAINS.map((domain, idx) => {
            const IconComponent =
              idx === 0 ? Server : idx === 1 ? Database : idx === 2 ? Cpu : ShieldCheck;

            return (
              <div
                key={domain.id}
                className="identity-card-shell bg-obsidian-surface hover:border-accent-cyan/40 border border-white/10 p-5 transition-colors duration-200 sm:p-6"
              >
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <IconComponent
                      aria-hidden="true"
                      className="text-accent-cyan h-4 w-4 shrink-0"
                    />
                    <h3 className="font-display text-base font-bold text-white">{domain.title}</h3>
                  </div>
                  <span className="bg-obsidian-base text-2xs shrink-0 border border-white/10 px-2 py-0.5 font-mono tracking-wider text-zinc-400">
                    {domain.code}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-6 text-zinc-300">{domain.summary}</p>

                <ul className="space-y-2">
                  {domain.items.map((item) => (
                    <li
                      key={item.name}
                      className="bg-obsidian-base flex flex-wrap items-center justify-between gap-2 border border-white/10 px-3 py-2.5 font-mono text-xs"
                    >
                      <span className="font-semibold text-zinc-100">{item.name}</span>
                      <span className="text-micro text-accent-cyan">{item.spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
