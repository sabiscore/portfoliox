import React from "react";
import Link from "next/link";
import { ArrowUpRight, Terminal } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          {/* Brand & Status */}
          <div>
            <div className="mb-2 flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-accent-emerald" />
              <span className="font-mono text-sm font-semibold tracking-wordmark text-obsidian-text">
                SCARDUBU.DEV
              </span>
            </div>
            <p className="font-mono text-micro text-obsidian-muted">
              Oscar Ndugbu · Staff Backend &amp; Platform Engineer · Lagos /
              Abuja (UTC+1)
            </p>
          </div>

          {/* External Verification Links */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "GitHub", href: "https://github.com/Scardubu" },
              { label: "SabiScore", href: "https://sabiscore.app" },
              {
                label: "Resume PDF",
                href: "/cv/oscar-ndugbu-resume.pdf",
              },
              { label: "RSS", href: "/rss.xml" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex min-h-pill items-center gap-1 rounded border border-obsidian-border bg-obsidian-elevated px-3 py-1 font-mono text-micro text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="h-3 w-3 text-accent-cyan" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-obsidian-border pt-4 font-mono text-micro text-obsidian-dim">
          <span className="inline-flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-accent-cyan" />
            <span>DESIGN SYSTEM: OBSIDIAN NOCTURNE V2 (#08090C / #0E0E10)</span>
          </span>
          <span>PRESS CMD+K FOR SYSTEM PALETTE</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
