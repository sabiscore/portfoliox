"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export interface CodeBlockClientProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlockClient: React.FC<CodeBlockClientProps> = ({
  code,
  language = "ts",
  filename,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fail-closed clipboard fallback
    }
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-obsidian-border bg-obsidian-elevated px-3.5 py-2">
        <div className="flex items-center gap-2 font-mono text-micro text-obsidian-muted">
          <Terminal className="h-3.5 w-3.5 text-accent-cyan" />
          <span>{filename || language.toUpperCase()}</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code snippet"
          className="inline-flex min-h-pill items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-surface px-2.5 py-1 font-mono text-micro text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-accent-emerald" />
              <span className="text-accent-emerald">COPIED</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 text-obsidian-muted" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Horizontal-Scroll Safe Monospace Viewport */}
      <pre className="overflow-x-auto p-4 font-mono text-caption leading-relaxed text-obsidian-text">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlockClient;
