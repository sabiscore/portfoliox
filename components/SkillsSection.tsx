import React from "react";
import { Server, Database, Cpu, ShieldCheck } from "lucide-react";

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
    id: "backend-distributed",
    code: "DOM-01",
    title: "Distributed Backend & APIs",
    summary:
      "High-throughput service architecture, idempotent event queues, and strict schema validation.",
    items: [
      { name: "Python · FastAPI", spec: "Async / Pydantic v2" },
      { name: "Node.js · TypeScript", spec: "Fastify 5 / JSNSD" },
      { name: "BullMQ · Redis 7", spec: "Replay-Safe Workers" },
      { name: "GraphQL · REST", spec: "Contract-First" },
    ],
  },
  {
    id: "data-storage",
    code: "DOM-02",
    title: "Data Engineering & Storage Engines",
    summary:
      "Multi-tenant relational isolation, out-of-core analytical pipelines, and automated national ETL.",
    items: [
      { name: "PostgreSQL 15", spec: "RLS / Query Tuning" },
      { name: "Polars · DuckDB", spec: "Out-of-Core Execution" },
      { name: "Automated ETL", spec: "Python / Power BI" },
      { name: "Audit Chains", spec: "SHA-256 Linked Logs" },
    ],
  },
  {
    id: "ai-infrastructure",
    code: "DOM-03",
    title: "AI & ML Infrastructure",
    summary:
      "Low-memory model serving, deterministic ensemble meta-learners, and multi-agent DAG routing.",
    items: [
      { name: "Zero-Pickle ML", spec: "< 512MB RAM Envelopes" },
      { name: "SwarmXQ DAGs", spec: "Agent Orchestration" },
      { name: "Local LLM Routing", spec: "Circuit-Broken Fallbacks" },
      { name: "Kokoro TTS", spec: "CPU-Bounded Synthesis" },
    ],
  },
  {
    id: "cloud-security",
    code: "DOM-04",
    title: "Cloud Platform, Security & Certifications",
    summary:
      "Zero-trust deployment topologies, cryptographic payload validation, and verified cloud credentials.",
    items: [
      { name: "AWS Certified Developer", spec: "Dec 2023" },
      { name: "GCP Associate Cloud Eng", spec: "Aug 2023" },
      { name: "OpenJS Node.js (JSNSD)", spec: "May 2024" },
      { name: "PostgreSQL 14 Associate", spec: "Mar 2024" },
    ],
  },
];

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
          <span className="font-semibold text-accent-emerald">02.5</span>
          <span className="text-obsidian-muted">CAPABILITIES MATRIX</span>
        </div>

        <h2
          id="capabilities-heading"
          className="mb-3 font-sans text-2xl font-bold tracking-tight text-obsidian-text sm:text-3xl"
        >
          Production stack &amp; verified credentials.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CAPABILITY_DOMAINS.map((domain, idx) => {
          const IconComponent =
            idx === 0
              ? Server
              : idx === 1
                ? Database
                : idx === 2
                  ? Cpu
                  : ShieldCheck;

          return (
            <div
              key={domain.id}
              className="relative overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-5"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-illuminate-cyan opacity-60"
                aria-hidden="true"
              />

              <div className="mb-3 flex items-center justify-between border-b border-obsidian-border pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-accent-cyan" />
                  <h3 className="font-sans text-base font-bold text-obsidian-text">
                    {domain.title}
                  </h3>
                </div>
                <span className="font-mono text-micro text-obsidian-dim">
                  {domain.code}
                </span>
              </div>

              <p className="mb-4 font-sans text-caption leading-relaxed text-obsidian-muted">
                {domain.summary}
              </p>

              <ul className="space-y-2">
                {domain.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between rounded-lg border border-obsidian-border bg-obsidian-elevated px-3 py-2 font-mono text-caption"
                  >
                    <span className="text-obsidian-text">{item.name}</span>
                    <span className="text-micro text-accent-cyan">
                      {item.spec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SkillsSection;
