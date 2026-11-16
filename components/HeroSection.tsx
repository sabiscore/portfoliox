import React from "react";
import { ShieldCheck, Terminal } from "lucide-react";
import { Liveactivitybar } from "@/components/Liveactivitybar";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative border-b border-obsidian-border bg-obsidian-base"
    >
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-8 sm:px-6 sm:pb-16 sm:pt-14">
        {/* Engineer Identity & Role Kicker */}
        <div className="mb-6">
          <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
            <span className="font-sans text-lg font-semibold tracking-tight text-obsidian-text sm:text-xl">
              Oscar Ndugbu
            </span>
            <span className="inline-flex items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-surface px-2 py-0.5 font-mono text-micro text-accent-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
              <span>UTC+1 · LAGOS / ABUJA</span>
            </span>
          </div>

          <p className="font-mono text-micro font-medium uppercase tracking-telemetry text-obsidian-muted">
            STAFF BACKEND AND PLATFORM ENGINEER
          </p>
        </div>

        {/* Primary Value Proposition */}
        <h1
          id="hero-heading"
          className="mb-4 font-sans text-hero font-bold tracking-tight text-obsidian-text sm:text-5xl md:text-6xl"
        >
          Systems you can{" "}
          <span className="bg-gradient-to-r from-obsidian-text via-obsidian-text to-accent-cyan bg-clip-text text-transparent">
            trust at 2 AM.
          </span>
        </h1>

        {/* High-Contrast Subheadline */}
        <p className="mb-4 max-w-2xl font-sans text-lg font-medium leading-snug text-obsidian-text sm:text-xl">
          Scalable backend, platform, and AI infrastructure.
        </p>

        {/* Supporting Empirical Narrative */}
        <p className="mb-8 max-w-2xl font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
          I build resilient architectures designed for high availability and
          easy maintenance. My work makes failure visible, recovery deliberate,
          and day-to-day operations simple to understand.
        </p>

        {/* Touch-Target Optimized CTA Stack (48px min-height, 12px mobile gap) */}
        <div className="mb-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <a
            href="#projects"
            className="inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border border-accent-emerald bg-accent-emerald px-6 font-sans text-sm font-semibold text-obsidian-base transition-colors hover:bg-accent-cyan hover:border-accent-cyan focus:outline-none"
          >
            <ShieldCheck className="h-4 w-4 stroke-2" />
            <span>Review production evidence</span>
          </a>

          <a
            href="#contact"
            className="inline-flex min-h-touch items-center justify-center gap-2 rounded-lg border border-obsidian-border bg-obsidian-surface px-6 font-sans text-sm font-medium text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan focus:outline-none"
          >
            <Terminal className="h-4 w-4 text-accent-cyan" />
            <span>Discuss a system</span>
          </a>
        </div>

        {/* Contained Telemetry Commit Bar */}
        <Liveactivitybar />
      </div>
    </section>
  );
};

export default HeroSection;
