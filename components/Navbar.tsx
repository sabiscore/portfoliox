"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Mail, ArrowUpRight, Terminal } from "lucide-react";

const NAV_ITEMS = [
  { index: "00", label: "Operating Model", href: "#operating-model" },
  { index: "01", label: "Projects", href: "#projects" },
  { index: "02", label: "Patterns", href: "#patterns" },
  { index: "03", label: "Writing", href: "#writing" },
  { index: "04", label: "Contact", href: "#contact" },
] as const;

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-obsidian-border bg-obsidian-base/95 backdrop-blur-md">
      {/* 1px Top Structural Illumination Line */}
      <div
        className="h-px w-full bg-illuminate-cyan opacity-60"
        aria-hidden="true"
      />

      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Wordmark + Live Status Node */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 py-2 focus:outline-none"
          aria-label="SCARDUBU Home"
        >
          <span
            className="h-2 w-2 rounded-full bg-accent-emerald"
            aria-hidden="true"
          />
          <span className="font-mono text-sm font-semibold tracking-wordmark text-obsidian-text transition-colors group-hover:text-accent-cyan">
            SCARDUBU
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex md:items-center md:gap-1"
          aria-label="Primary Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-3 py-1.5 font-mono text-caption text-obsidian-muted transition-colors hover:border-obsidian-border hover:bg-obsidian-surface hover:text-accent-cyan"
            >
              <span className="text-obsidian-dim">{item.index}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Touch-Safe Action Controls (Replaces overlapping bottom-right FAB) */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            aria-label="Discuss a system or send direct message"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-obsidian-border bg-obsidian-surface text-obsidian-muted transition-colors hover:border-accent-cyan hover:text-accent-cyan md:w-auto md:gap-2 md:px-3.5"
          >
            <Mail className="h-4 w-4 text-accent-cyan" />
            <span className="hidden font-mono text-caption text-obsidian-text md:inline">
              Contact
            </span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-obsidian-border bg-obsidian-surface text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan md:hidden"
          >
            {isOpen ? (
              <X className="h-4 w-4 text-accent-cyan" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Mobile Navigation"
          className="border-t border-obsidian-border bg-obsidian-surface px-4 py-3 md:hidden"
        >
          <ul className="space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-touch items-center justify-between rounded-lg border border-obsidian-border bg-obsidian-elevated px-3.5 py-2.5 font-mono text-caption text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-accent-emerald">{item.index}</span>
                    <span>{item.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-accent-cyan" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-center justify-between border-t border-obsidian-border pt-3 font-mono text-micro text-obsidian-dim">
            <span className="inline-flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-accent-emerald" />
              <span>FAIL-CLOSED TELEMETRY</span>
            </span>
            <span>LOS · ABV // UTC+1</span>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
