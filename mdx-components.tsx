import React, { type ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';

type HeadingProps = ComponentPropsWithoutRef<'h1'>;
type ParagraphProps = ComponentPropsWithoutRef<'p'>;
type AnchorProps = ComponentPropsWithoutRef<'a'>;
type StrongProps = ComponentPropsWithoutRef<'strong'>;
type EmphasisProps = ComponentPropsWithoutRef<'em'>;
type HrProps = ComponentPropsWithoutRef<'hr'>;
type ListProps = ComponentPropsWithoutRef<'ul'>;
type OrderedListProps = ComponentPropsWithoutRef<'ol'>;
type ListItemProps = ComponentPropsWithoutRef<'li'>;
type BlockquoteProps = ComponentPropsWithoutRef<'blockquote'>;
type CodeProps = ComponentPropsWithoutRef<'code'> & { 'data-language'?: string };
type PreProps = ComponentPropsWithoutRef<'pre'>;
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
        className="mt-10 mb-4 border-b border-white/10 pb-3 font-display text-2xl font-bold tracking-tight text-white scroll-mt-24"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3
        className="mt-7 mb-2.5 font-display text-xl font-semibold text-[#00D9FF] scroll-mt-24"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }: ParagraphProps) => (
      <p className="my-4 text-base leading-7 text-zinc-300" {...props}>
        {children}
      </p>
    ),
    a: ({ children, href, rel, target, ...props }: AnchorProps) => {
      const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          target={target ?? (isExternal ? '_blank' : undefined)}
          rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
          className="font-medium text-[#00D9FF] underline decoration-[#00D9FF]/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          {...props}
        >
          {children}
        </a>
      );
    },
    strong: ({ children, ...props }: StrongProps) => (
      <strong className="font-semibold text-white" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: EmphasisProps) => (
      <em className="italic text-zinc-200" {...props}>
        {children}
      </em>
    ),
    hr: (props: HrProps) => <hr className="my-8 border-white/10" {...props} />,
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
    pre: ({ children, ...props }: PreProps) => (
      <pre
        className="my-6 max-w-full overflow-x-auto border border-white/10 bg-[#0E0E10] py-4 text-[13px] leading-6 [&>code]:grid [&_[data-line]]:px-4"
        {...props}
      >
        {children}
      </pre>
    ),
    code: ({ children, className, ...props }: CodeProps) => {
      const isInline = !className && !props['data-language'];
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
