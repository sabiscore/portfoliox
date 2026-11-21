"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Search,
  ArrowUpRight,
  X,
  FileText,
  Layers,
  Code2,
} from "lucide-react";

import { CV_ASSET_PATH } from "@/lib/config";

interface CommandOption {
  id: string;
  label: string;
  category: string;
  href: string;
  external?: boolean;
}

const COMMAND_OPTIONS: CommandOption[] = [
  {
    id: "nav-operating-model",
    label: "00 // Operating Model & Profile",
    category: "NAVIGATION",
    href: "#operating-model",
  },
  {
    id: "nav-projects",
    label: "01 // Production Case Studies",
    category: "NAVIGATION",
    href: "#projects",
  },
  {
    id: "nav-patterns",
    label: "02 // Fail-Closed Production Patterns",
    category: "NAVIGATION",
    href: "#patterns",
  },
  {
    id: "nav-writing",
    label: "03 // Technical Engineering Guides",
    category: "NAVIGATION",
    href: "#writing",
  },
  {
    id: "nav-contact",
    label: "04 // Discuss a System",
    category: "NAVIGATION",
    href: "#contact",
  },
  {
    id: "work-taxbridge",
    label: "Case Study: TaxBridge Compliance Platform",
    category: "EVIDENCE",
    href: "/work/taxbridge",
  },
  {
    id: "work-sabiscore",
    label: "Case Study: SabiScore Real-Time ML Engine",
    category: "EVIDENCE",
    href: "/work/sabiscore",
  },
  {
    id: "work-swarmxq",
    label: "Case Study: SwarmXQ & The Yap Engine",
    category: "EVIDENCE",
    href: "/work/swarmxq",
  },
  {
    id: "asset-resume",
    label: "Download Resume (oscar-ndugbu-resume.pdf)",
    category: "ARTIFACT",
    href: CV_ASSET_PATH,
    external: true,
  },
];

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;

  const filtered = COMMAND_OPTIONS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (item: CommandOption) => {
    setOpen(false);
    setQuery("");
    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else if (item.href.startsWith("#")) {
      window.location.hash = item.href;
    } else {
      router.push(item.href);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="System Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-obsidian-base/85 px-4 pt-20 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface">
        <div
          className="absolute inset-x-0 top-0 h-px bg-illuminate-cyan"
          aria-hidden="true"
        />

        {/* Search Input Bar */}
        <div className="flex items-center border-b border-obsidian-border px-4 py-3">
          <Search className="mr-3 h-4 w-4 text-accent-cyan" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter sections, case studies, or artifacts..."
            className="flex-1 bg-transparent font-mono text-caption text-obsidian-text placeholder:text-obsidian-dim focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close command palette"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-obsidian-border bg-obsidian-elevated text-obsidian-muted hover:border-accent-cyan hover:text-accent-cyan"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Results List */}
        <ul className="max-h-80 overflow-y-auto divide-y divide-obsidian-border p-2">
          {filtered.length === 0 ? (
            <li className="py-6 text-center font-mono text-caption text-obsidian-dim">
              No matching routes or specifications found.
            </li>
          ) : (
            filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex min-h-touch w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-caption text-obsidian-text transition-colors hover:bg-obsidian-elevated hover:text-accent-cyan"
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {item.category === "ARTIFACT" ? (
                      <FileText className="h-3.5 w-3.5 shrink-0 text-accent-emerald" />
                    ) : item.category === "EVIDENCE" ? (
                      <Layers className="h-3.5 w-3.5 shrink-0 text-accent-cyan" />
                    ) : (
                      <Code2 className="h-3.5 w-3.5 shrink-0 text-obsidian-muted" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </span>

                  <span className="ml-2 flex shrink-0 items-center gap-1 text-micro text-obsidian-dim">
                    <span>{item.category}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Footer Telemetry Bar */}
        <div className="flex items-center justify-between border-t border-obsidian-border bg-obsidian-base px-4 py-2 font-mono text-micro text-obsidian-dim">
          <span className="inline-flex items-center gap-1.5">
            <Terminal className="h-3 w-3 text-accent-emerald" />
            <span>OBSIDIAN NOCTURNE V2 // ROUTER</span>
          </span>
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
