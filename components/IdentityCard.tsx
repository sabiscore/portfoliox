import React from "react";
import Image from "next/image";
import { Cpu, CheckCircle2 } from "lucide-react";
import { MetricCard, MetricCardProps } from "@/components/MetricCard";

export interface IdentityCardProps {
  portraitSrc?: string;
}

const OPERATING_MODEL_BOXES: MetricCardProps[] = [
  {
    index: "01",
    title: "FOCUS",
    variant: "focus",
    accent: "cyan",
    items: [
      { label: "Backend & Platform", detail: "p99 < 150ms" },
      { label: "System Reliability", detail: "Fail-Closed" },
      { label: "AI Infrastructure", detail: "< 512MB RAM" },
    ],
  },
  {
    index: "02",
    title: "PROOF",
    variant: "proof",
    accent: "emerald",
    items: [
      { label: "TaxBridge", detail: "Fintech", href: "#taxbridge" },
      { label: "SabiScore", detail: "ML Engine", href: "#sabiscore" },
      { label: "SwarmXQ", detail: "Agents", href: "#swarmxq" },
    ],
  },
  {
    index: "03",
    title: "METHOD",
    variant: "method",
    accent: "cyan",
    items: [
      { label: "Constraint" },
      { label: "decision" },
      { label: "outcome" },
      { label: "evidence" },
    ],
  },
];

const CAPABILITY_PILLS = [
  { label: "Backend · Platform", primary: true },
  { label: "AI infrastructure", primary: true },
  { label: "PostgreSQL RLS · Fastify", primary: false },
  { label: "Polars · DuckDB · FastAPI", primary: false },
] as const;

export const IdentityCard: React.FC<IdentityCardProps> = ({
  portraitSrc = "/headshot.webp",
}) => {
  return (
    <section
      id="operating-model"
      aria-label="Operating Model and Engineering Profile"
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
    >
      {/* Single-Bezel Obsidian Surface Card with 1px Structural Illumination */}
      <div className="relative overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-4 sm:p-6">
        <div
          className="absolute inset-x-0 top-0 h-px bg-illuminate-dual"
          aria-hidden="true"
        />

        {/* Two-Pole Card Header (Resolves 3-item mobile text wrapping collision) */}
        <div className="mb-5 flex items-center justify-between gap-2 border-b border-obsidian-border pb-3.5">
          <div className="inline-flex items-center gap-2 rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1">
            <Cpu className="h-3.5 w-3.5 text-accent-cyan" />
            <span className="font-mono text-micro font-semibold uppercase tracking-telemetry text-obsidian-text">
              OPERATING MODEL
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-obsidian-muted tabular-nums">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
            <span>UTC+1</span>
          </div>
        </div>

        {/* Profile Identity Block (Vertical stack on mobile, split row on tablet/desktop) */}
        <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start">
          {/* Portrait + Mobile Identity Header */}
          <div className="flex items-center gap-4 sm:block">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-obsidian-border bg-obsidian-elevated sm:h-36 sm:w-32">
              <Image
                src={portraitSrc}
                alt="Oscar Ndugbu — Staff Backend and Platform Engineer"
                fill
                sizes="(max-width: 640px) 80px, 128px"
                className="object-cover"
                priority
              />
            </div>

            {/* Mobile-Only Compact Identity Header Beside Portrait */}
            <div className="min-w-0 sm:hidden">
              <p className="mb-1 inline-flex items-center gap-1.5 font-mono text-micro text-accent-emerald">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>STAFF BACKEND &amp; PLATFORM</span>
              </p>
              <h2 className="font-sans text-xl font-bold tracking-tight text-obsidian-text">
                Oscar Ndugbu
              </h2>
              <p className="font-mono text-micro text-obsidian-dim">
                Distributed Systems · AI Infrastructure
              </p>
            </div>
          </div>

          {/* Right Column: Architectural Thesis & Domain Pills (100% width on mobile) */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 hidden items-center justify-between sm:flex">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-obsidian-text">
                  Oscar Ndugbu
                </h2>
                <p className="font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                  STAFF BACKEND AND PLATFORM ENGINEER
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-elevated px-2.5 py-1 font-mono text-micro text-accent-emerald">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>FAIL-CLOSED ARCHITECTURE</span>
              </span>
            </div>

            {/* Distinct Operating Specification Copy (Eliminates verbatim duplication from Hero) */}
            <p className="mb-4 font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
              Engineering deterministic backend platforms, replay-safe financial
              workflows, and low-memory ML inference pipelines. Every subsystem
              is built around strict data contracts, bounded compute envelopes,
              and verifiable production telemetry.
            </p>

            {/* Full-Width Wrapping Capability Pills */}
            <div className="flex flex-wrap gap-2">
              {CAPABILITY_PILLS.map((pill) => (
                <span
                  key={pill.label}
                  className={`inline-flex min-h-pill items-center rounded border px-3 py-1 font-mono text-caption ${
                    pill.primary
                      ? "border-accent-cyan/50 bg-obsidian-elevated text-obsidian-text"
                      : "border-obsidian-border bg-obsidian-base text-obsidian-muted"
                  }`}
                >
                  {pill.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive 1-to-3 Column Telemetry Grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {OPERATING_MODEL_BOXES.map((box) => (
            <MetricCard key={box.title} {...box} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default IdentityCard;
