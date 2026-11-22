'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Link2 } from 'lucide-react';

import type { ContentHeading } from '@/lib/content';

export interface ArticleOutlineProps {
  readonly headings: readonly ContentHeading[];
}

export function ArticleOutline({ headings }: Readonly<ArticleOutlineProps>): React.JSX.Element | null {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (headings.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const visibleIds = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleIds.add(entry.target.id);
          else visibleIds.delete(entry.target.id);
        }

        const firstVisible = headings.find((heading) => visibleIds.has(heading.id));
        if (firstVisible) {
          setActiveId(firstVisible.id);
        }
      },
      { rootMargin: '-18% 0px -68% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleCopySectionLink = useCallback(async () => {
    if (
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      typeof navigator.clipboard?.writeText !== 'function'
    ) {
      setCopyStatus('failed');
      return;
    }

    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const shareUrl = activeId ? `${baseUrl}#${activeId}` : baseUrl;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('copied');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
    } catch {
      setCopyStatus('failed');
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  const isCopied = copyStatus === 'copied';

  return (
    <div className="hidden border border-white/10 bg-obsidian-surface p-4 lg:block">
      <p className="font-mono text-2xs font-semibold uppercase tracking-kicker text-zinc-400">
        ON THIS PAGE
      </p>

      <nav aria-label="On this page" className="mt-3">
        <ol className="space-y-1 border-l border-white/10">
          {headings.map((heading) => {
            const isCurrent = heading.id === activeId;
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  aria-current={isCurrent ? 'location' : undefined}
                  onClick={() => setActiveId(heading.id)}
                  className={`block border-l-2 py-1.5 pl-3 text-xs leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-reduce:transition-none ${
                    isCurrent
                      ? 'border-l-accent-cyan font-medium text-accent-cyan'
                      : 'border-l-transparent text-zinc-400 hover:border-l-white/30 hover:text-zinc-100'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-4 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => void handleCopySectionLink()}
          aria-label={isCopied ? 'Section link copied to clipboard' : 'Copy direct link to active section'}
          className={`inline-flex min-h-touch w-full items-center justify-center gap-2 border px-3 py-2 font-mono text-2xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-reduce:transition-none ${
            isCopied
              ? 'border-accent-emerald/55 bg-accent-emerald/10 text-accent-emerald'
              : 'border-white/15 bg-obsidian-base text-zinc-200 hover:border-accent-cyan/50 hover:text-accent-cyan'
          }`}
        >
          {isCopied ? (
            <>
              <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>LINK COPIED</span>
            </>
          ) : (
            <>
              <Link2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent-cyan" />
              <span>COPY SECTION LINK</span>
            </>
          )}
        </button>
        <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isCopied
            ? 'Direct section link copied to clipboard.'
            : copyStatus === 'failed'
              ? 'Clipboard copy is unavailable in this browser.'
              : ''}
        </span>
      </div>
    </div>
  );
}

export default ArticleOutline;
