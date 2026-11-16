import type { MDXComponents } from "mdx/types";
import React from "react";
import { ArchDecision } from "@/components/ArchDecision";
import { CodeBlockClient } from "@/components/CodeBlockClient";
import { MetricBadge } from "@/components/ui/MetricBadge";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-6 mt-8 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 border-b border-obsidian-border pb-2 font-sans text-2xl font-bold tracking-tight text-obsidian-text">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-6 font-sans text-xl font-semibold tracking-tight text-obsidian-text">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-5 font-sans text-sm text-obsidian-muted sm:text-base">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5 font-sans text-sm text-obsidian-muted sm:text-base">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-5 rounded-r-lg border-l-2 border-accent-cyan bg-obsidian-surface p-4 font-sans text-sm italic text-obsidian-text">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="rounded border border-obsidian-border bg-obsidian-elevated px-1.5 py-0.5 font-mono text-caption text-accent-cyan">
            {children}
          </code>
        );
      }
      const language = className.replace("language-", "");
      return (
        <CodeBlockClient
          code={String(children).trim()}
          language={language}
        />
      );
    },
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-obsidian-border bg-obsidian-surface">
        <table className="w-full border-collapse text-left font-mono text-caption">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-obsidian-border bg-obsidian-elevated px-4 py-2.5 font-mono text-micro font-semibold uppercase tracking-telemetry text-obsidian-text">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-obsidian-border px-4 py-2.5 text-obsidian-muted">
        {children}
      </td>
    ),
    ArchDecision,
    MetricBadge,
    ...components,
  };
}
