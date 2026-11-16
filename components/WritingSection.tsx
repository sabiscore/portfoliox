import React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock } from "lucide-react";

export interface EngineeringArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
}

const ENGINEERING_ARTICLES: EngineeringArticle[] = [
  {
    slug: "/writing/zero-downtime-design",
    title: "Zero-Downtime Architecture: Designing Systems You Can Trust at 2 AM",
    category: "RELIABILITY · DISTRIBUTED SYSTEMS",
    readTime: "8 MIN READ",
    summary:
      "How to isolate failure domains, enforce idempotent retries, and structure expand-and-contract database migrations without maintenance windows.",
  },
  {
    slug: "/writing/taxbridge-compliance-architecture",
    title: "Cryptographic Audit Trails & Multi-Tenant RLS in TaxBridge",
    category: "FINTECH · POSTGRESQL",
    readTime: "10 MIN READ",
    summary:
      "Engineering tamper-evident financial compliance workflows using Fastify 5, PostgreSQL 15 Row-Level Security, and hash-linked state ledgers.",
  },
  {
    slug: "/writing/building-sabiscore",
    title: "Architecting SabiScore: Out-of-Core ML Under a 512MB Ceiling",
    category: "ML INFRASTRUCTURE · PERFORMANCE",
    readTime: "9 MIN READ",
    summary:
      "Eliminating OOM kills and pickle serialization overhead with Polars, DuckDB, and strict Pydantic v2 contracts for real-time match forecasting.",
  },
  {
    slug: "/writing/production-ml-reliability",
    title: "Production ML Reliability: Deterministic Fallbacks Over Hype",
    category: "AI SYSTEMS · OPERATIONS",
    readTime: "7 MIN READ",
    summary:
      "Enforcing latency budgets, drift telemetry, and circuit-broken fallback heuristics when deploying machine learning models to constrained environments.",
  },
  {
    slug: "/writing/swarmxq-agent-orchestration",
    title: "SwarmXQ: Deterministic Agent Orchestration on CPU-Bounded Nodes",
    category: "AGENT PIPELINES · RUNTIME",
    readTime: "8 MIN READ",
    summary:
      "Coordinating local LLM routing and Kokoro TTS audio synthesis through checkpointed DAGs without runaway compute costs.",
  },
  {
    slug: "/writing/building-lagos-running-globally",
    title: "Building in Lagos, Running Globally: Constraint-Driven Engineering",
    category: "SYSTEMS STRATEGY · INFRASTRUCTURE",
    readTime: "6 MIN READ",
    summary:
      "Why architecting for strict hardware ceilings and intermittent networks produces superior, globally resilient distributed systems.",
  },
];

export const WritingSection: React.FC = () => {
  return (
    <section
      id="writing"
      aria-labelledby="writing-heading"
      className="border-t border-obsidian-border bg-obsidian-base"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
              <span className="font-semibold text-accent-emerald">03</span>
              <span className="text-obsidian-muted">TECHNICAL WRITING</span>
            </div>

            <h2
              id="writing-heading"
              className="mb-2 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-4xl"
            >
              Field notes from production.
            </h2>

            <p className="max-w-2xl font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
              Deep-dive architectural guides on distributed systems, database
              isolation, and low-memory AI infrastructure.
            </p>
          </div>

          <Link
            href="/writing"
            className="inline-flex min-h-pill items-center gap-1.5 rounded-lg border border-obsidian-border bg-obsidian-surface px-4 py-2 font-mono text-caption text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
          >
            <BookOpen className="h-3.5 w-3.5 text-accent-cyan" />
            <span>View all guides</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ENGINEERING_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={article.slug}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-5 transition-colors hover:border-accent-cyan/60"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-illuminate-cyan opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />

              <div>
                <div className="mb-3 flex items-center justify-between gap-2 font-mono text-micro">
                  <span className="text-accent-cyan">{article.category}</span>
                  <span className="inline-flex items-center gap-1 text-obsidian-dim tabular-nums">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="mb-2.5 font-sans text-lg font-bold leading-snug tracking-tight text-obsidian-text transition-colors group-hover:text-accent-cyan">
                  {article.title}
                </h3>

                <p className="mb-4 font-sans text-caption leading-relaxed text-obsidian-muted">
                  {article.summary}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-obsidian-border pt-3 font-mono text-micro text-obsidian-text group-hover:text-accent-emerald">
                <span>READ SPECIFICATION</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WritingSection;
