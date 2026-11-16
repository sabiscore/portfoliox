import React from "react";
import { Briefcase, Award, CheckCircle2 } from "lucide-react";

export interface CareerMilestone {
  period: string;
  role: string;
  organization: string;
  location: string;
  summary: string;
  highlights: string[];
}

const CAREER_LEDGER: CareerMilestone[] = [
  {
    period: "JAN 2024 — PRESENT",
    role: "Staff Backend & Platform Engineer / Infrastructure Consultant",
    organization: "Independent & Architecture Advisory",
    location: "Lagos / Remote",
    summary:
      "Architecting low-memory AI inference pipelines (SabiScore), multi-tenant fintech compliance platforms (TaxBridge), and conducting systems/security reviews for early-stage founders.",
    highlights: [
      "Engineered zero-pickle Polars/DuckDB execution pipelines under a strict 512MB RAM ceiling.",
      "Designed replay-safe financial workflows with PostgreSQL 15 RLS and SHA-256 hash-linked audit trails.",
    ],
  },
  {
    period: "JAN 2024 — JUN 2024",
    role: "Lead Backend Engineer (Encrypted Data Platform)",
    organization: "Hashablanca",
    location: "Remote",
    summary:
      "Led backend architecture for cross-blockchain encrypted payload transfers and deterministic verification pipelines.",
    highlights: [
      "Architected AES-256 payload encryption paired with Zero-Knowledge proof validation.",
      "Enforced fail-closed state verification across distributed relay nodes.",
    ],
  },
  {
    period: "2014 — PRESENT",
    role: "Senior Data & Systems Engineer",
    organization: "Universal Basic Education Commission (UBEC)",
    location: "Abuja & Lagos",
    summary:
      "Engineering automated national education data ETL pipelines, validation workflows, and real-time budget allocation telemetry.",
    highlights: [
      "Built resilient Python data validation and ETL pipelines serving national budget analytics.",
      "Delivered real-time executive observability dashboards across Python and Power BI.",
    ],
  },
];

export const AboutSection: React.FC = () => {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-t border-obsidian-border bg-obsidian-base"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
            <Briefcase className="h-3.5 w-3.5 text-accent-cyan" />
            <span className="text-obsidian-muted">ENGINEERING TENURE</span>
          </div>

          <h2
            id="experience-heading"
            className="mb-2 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-4xl"
          >
            Over a decade of production systems.
          </h2>
        </div>

        <div className="space-y-4">
          {CAREER_LEDGER.map((entry) => (
            <article
              key={`${entry.organization}-${entry.period}`}
              className="relative overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-5 sm:p-6"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-illuminate-cyan opacity-60"
                aria-hidden="true"
              />

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-border pb-3">
                <div>
                  <h3 className="font-sans text-lg font-bold text-obsidian-text sm:text-xl">
                    {entry.role}
                  </h3>
                  <p className="font-mono text-caption text-accent-cyan">
                    {entry.organization} · {entry.location}
                  </p>
                </div>

                <span className="rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-obsidian-muted tabular-nums">
                  {entry.period}
                </span>
              </div>

              <p className="mb-4 font-sans text-sm leading-relaxed text-obsidian-muted">
                {entry.summary}
              </p>

              <ul className="space-y-1.5">
                {entry.highlights.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 font-mono text-micro text-obsidian-text"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-emerald" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Academic & Certification Footer Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-obsidian-border bg-obsidian-surface p-4 font-mono text-caption">
          <div className="flex items-center gap-2 text-obsidian-text">
            <Award className="h-4 w-4 text-accent-emerald" />
            <span>
              B.Tech in Environmental Technology — Federal University of
              Technology, Owerri
            </span>
          </div>
          <span className="text-micro text-obsidian-dim">
            AWS · GCP · JSNSD · POSTGRESQL 14
          </span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
