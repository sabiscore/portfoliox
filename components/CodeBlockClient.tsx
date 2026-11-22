'use client';

import React, { isValidElement, useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

export interface CodeBlockClientProps extends React.ComponentPropsWithoutRef<'pre'> {
  code?: string;
  language?: string;
  filename?: string;
  'data-language'?: string;
}

type CopyState = 'idle' | 'copied' | 'failed';

function resolveChildLanguage(children: React.ReactNode): string | undefined {
  if (!isValidElement(children)) return undefined;
  const props = children.props as { 'data-language'?: string; className?: string };
  if (typeof props['data-language'] === 'string' && props['data-language'].trim()) {
    return props['data-language'].trim();
  }
  if (typeof props.className === 'string') {
    const match = props.className.match(/language-([a-z0-9+#-]+)/i);
    if (match?.[1]) return match[1];
  }
  return undefined;
}

export const CodeBlockClient: React.FC<CodeBlockClientProps> = ({
  code,
  language,
  filename,
  children,
  className = '',
  'data-language': dataLanguage,
  ...preProps
}) => {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const preRef = useRef<HTMLPreElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    },
    []
  );

  const resolvedLanguage = (
    filename ||
    language ||
    dataLanguage ||
    resolveChildLanguage(children) ||
    'code'
  ).toUpperCase();

  const handleCopy = useCallback(async () => {
    const textToCopy = (code ?? preRef.current?.textContent ?? '').trimEnd();
    if (
      !textToCopy ||
      typeof navigator === 'undefined' ||
      typeof navigator.clipboard?.writeText !== 'function'
    ) {
      setCopyState('failed');
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyState('copied');
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setCopyState('idle'), 2000);
    } catch {
      setCopyState('failed');
    }
  }, [code]);

  const isCopied = copyState === 'copied';

  return (
    <div className="my-6 overflow-hidden border border-white/10 bg-obsidian-surface">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-obsidian-base px-4 py-1.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-micro uppercase tracking-wider text-zinc-400">
          <Terminal aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-accent-cyan" />
          <span className="truncate">{resolvedLanguage}</span>
        </div>

        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={
            isCopied ? `${resolvedLanguage} code copied to clipboard` : `Copy ${resolvedLanguage} snippet`
          }
          className={`inline-flex min-h-touch min-w-24 shrink-0 items-center justify-center gap-1.5 border px-3 py-1.5 font-mono text-2xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-reduce:transition-none ${
            isCopied
              ? 'border-accent-emerald/55 bg-accent-emerald/10 text-accent-emerald'
              : 'border-white/15 bg-obsidian-surface text-zinc-200 hover:border-accent-cyan/50 hover:text-accent-cyan'
          }`}
        >
          {isCopied ? (
            <>
              <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>COPIED</span>
            </>
          ) : (
            <>
              <Copy aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isCopied
          ? 'Code snippet copied to clipboard.'
          : copyState === 'failed'
            ? 'Clipboard copy is unavailable in this browser.'
            : ''}
      </span>

      <pre
        ref={preRef}
        data-language={dataLanguage ?? language}
        className={`mdx-code-pre max-w-full overflow-x-auto bg-obsidian-surface py-4 font-mono text-zinc-100 ${className}`.trim()}
        {...preProps}
      >
        {children ?? <code className="px-4">{code}</code>}
      </pre>
    </div>
  );
};

export default CodeBlockClient;
