"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, ArrowUpRight, Package } from "lucide-react";

export interface OpenSourcePackage {
  name: string;
  installCmd: string;
  description: string;
  highlight: string;
  repoUrl: string;
}

const OSS_PACKAGES: OpenSourcePackage[] = [
  {
    name: "pg-tenant",
    installCmd: "npm install pg-tenant",
    description:
      "Deterministic PostgreSQL Row-Level Security (RLS) tenant-scoping middleware with fail-closed transaction context guards.",
    highlight: "Zero-trust multi-tenant isolation",
    repoUrl: "https://github.com/Scardubu",
  },
  {
    name: "audit-chain",
    installCmd: "npm install audit-chain",
    description:
      "Cryptographic hash-linked append-only audit trail engine for financial ledgers and regulatory compliance systems.",
    highlight: "Tamper-evident SHA-256 state verification",
    repoUrl: "https://github.com/Scardubu",
  },
  {
    name: "node-debug-llm",
    installCmd: "npx node-debug-llm",
    description:
      "Automated root-cause log analyzer and stack-trace triage CLI with bounded token context and local model fallback.",
    highlight: "Sub-second structured crash diagnostics",
    repoUrl: "https://github.com/Scardubu",
  },
];

export const OpenSourceSection: React.FC = () => {
  const [copiedPkg, setCopiedPkg] = useState<string | null>(null);

  const handleCopy = async (pkgName: string, cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedPkg(pkgName);
      setTimeout(() => setCopiedPkg(null), 2000);
    } catch {
      // Fail-closed clipboard fallback
    }
  };

  return (
    <section
      id="open-source"
      aria-labelledby="oss-heading"
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
            <Package className="h-3.5 w-3.5 text-accent-cyan" />
            <span className="text-obsidian-muted">OPEN-SOURCE TOOLING</span>
          </div>
          <h2
            id="oss-heading"
            className="font-sans text-2xl font-bold tracking-tight text-obsidian-text sm:text-3xl"
          >
            Reusable infrastructure primitives.
          </h2>
        </div>

        <a
          href="https://github.com/Scardubu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-pill items-center gap-1.5 rounded-lg border border-obsidian-border bg-obsidian-surface px-3.5 py-1.5 font-mono text-caption text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        >
          <span>GitHub @Scardubu</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-accent-cyan" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {OSS_PACKAGES.map((pkg) => {
          const isCopied = copiedPkg === pkg.name;

          return (
            <article
              key={pkg.name}
              className="group relative flex flex-col justify-between rounded-xl border border-obsidian-border bg-obsidian-surface p-5 transition-colors hover:border-obsidian-subtle"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-illuminate-emerald opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-base font-semibold text-accent-cyan">
                    {pkg.name}
                  </span>
                  <a
                    href={pkg.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${pkg.name} on GitHub`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-obsidian-border bg-obsidian-elevated text-obsidian-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <p className="mb-3 font-sans text-caption leading-relaxed text-obsidian-muted">
                  {pkg.description}
                </p>

                <p className="mb-4 font-mono text-micro text-accent-emerald">
                  ✓ {pkg.highlight}
                </p>
              </div>

              {/* Touch-Friendly CLI Copy Button */}
              <button
                type="button"
                onClick={() => handleCopy(pkg.name, pkg.installCmd)}
                className="flex min-h-pill w-full items-center justify-between rounded-lg border border-obsidian-border bg-obsidian-base px-3 py-2 font-mono text-micro text-obsidian-text transition-colors hover:border-accent-cyan"
                aria-label={`Copy install command for ${pkg.name}`}
              >
                <span className="flex items-center gap-2 truncate">
                  <Terminal className="h-3.5 w-3.5 shrink-0 text-accent-cyan" />
                  <span className="truncate">{pkg.installCmd}</span>
                </span>
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent-emerald" />
                ) : (
                  <Copy className="h-3.5 w-3.5 shrink-0 text-obsidian-dim" />
                )}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default OpenSourceSection;
