import React, { type ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type OrderedListProps = ComponentPropsWithoutRef<'ol'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;
type CodeProps = ComponentPropsWithoutRef<'code'>;
type TableProps = ComponentPropsWithoutRef<'table'>;
type ThProps = ComponentPropsWithoutRef<'th'>;
type TdProps = ComponentPropsWithoutRef<'td'>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }: HeadingProps) => (
      <h1
        className="mt-10 mb-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2
        className="mt-8 mb-3 border-b border-white/10 pb-2 font-display text-2xl font-bold tracking-tight text-white"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3
        className="mt-6 mb-2 font-display text-xl font-semibold text-[#00D9FF]"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }: ParagraphProps) => (
      <p className="my-4 leading-relaxed text-zinc-300" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: ListProps) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-zinc-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: OrderedListProps) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-zinc-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: ListItemProps) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }: BlockquoteProps) => (
      <blockquote
        className="my-6 border-l-2 border-[#00D9FF] bg-[#0E0E10] px-4 py-3 font-mono text-xs text-zinc-200"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, className, ...props }: CodeProps) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className="border border-white/10 bg-[#0E0E10] px-1.5 py-0.5 font-mono text-xs text-[#00D9FF]"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={`font-mono text-xs ${className ?? ''}`} {...props}>
          {children}
        </code>
      );
    },
    table: ({ children, ...props }: TableProps) => (
      <div className="my-6 w-full overflow-x-auto border border-white/10 bg-[#0E0E10]">
        <table className="w-full border-collapse text-left font-mono text-xs" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }: ThProps) => (
      <th
        className="border-b border-white/10 bg-[#08090C] px-4 py-3 font-semibold text-[#00D9FF] uppercase"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: TdProps) => (
      <td className="border-b border-white/10 px-4 py-3 text-zinc-300" {...props}>
        {children}
      </td>
    ),
    ...components,
  };
}
