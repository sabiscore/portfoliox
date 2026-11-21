'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export type CopyStatus = 'idle' | 'copied' | 'failed';

export function useCopyEmail(email: string, resetMs = 2500) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    },
    []
  );

  const copy = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === 'undefined' || typeof navigator.clipboard?.writeText !== 'function') {
      setStatus('failed');
      return false;
    }

    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setStatus('idle'), resetMs);
      return true;
    } catch {
      setStatus('failed');
      return false;
    }
  }, [email, resetMs]);

  return { status, copy };
}

export interface CopyEmailProps {
  email: string;
  className?: string;
  variant?: 'inline' | 'primary';
  label?: string;
  copiedLabel?: string;
  onStatusChange?: (status: CopyStatus) => void;
}

export function CopyEmail({
  email,
  className = '',
  variant = 'inline',
  label,
  copiedLabel = 'COPIED TO CLIPBOARD',
  onStatusChange,
}: Readonly<CopyEmailProps>): React.JSX.Element {
  const { status, copy } = useCopyEmail(email, variant === 'primary' ? 2500 : 1600);

  useEffect(() => {
    onStatusChange?.(status);
  }, [onStatusChange, status]);

  if (variant === 'primary') {
    const isCopied = status === 'copied';
    const buttonClasses = isCopied
      ? 'border-accent-emerald/55 bg-accent-emerald/10 text-accent-emerald'
      : 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan hover:text-obsidian-base';

    return (
      <button
        type="button"
        onClick={() => void copy()}
        aria-label={isCopied ? 'Email address copied to clipboard' : `Copy email address ${email}`}
        className={`inline-flex min-h-touch min-w-touch flex-1 items-center justify-center gap-2 border px-4 py-2.5 font-mono text-xs font-semibold tracking-wider transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-surface motion-safe:active:translate-y-px ${buttonClasses} ${className}`}
      >
        {isCopied ? <CheckIcon /> : <CopyIcon />}
        <span>{isCopied ? copiedLabel : (label ?? 'COPY EMAIL ADDRESS')}</span>
      </button>
    );
  }

  const handleLinkClick = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
      event.preventDefault();
      await copy();
    }
  };

  return (
    <a
      href={`mailto:${email}`}
      onClick={(event) => void handleLinkClick(event)}
      aria-label={status === 'copied' ? 'Email address copied to clipboard' : `Send email to ${email}`}
      className={`copy-email inline-flex min-h-touch items-center gap-1.5 font-mono text-xs tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan ${
        status === 'copied' ? 'text-accent-emerald' : 'text-zinc-300 hover:text-accent-cyan'
      } ${className}`}
    >
      {status === 'copied' ? (
        <>
          <CheckIcon />
          <span>Copied</span>
        </>
      ) : (
        <>
          <span>{label ?? email}</span>
          <CopyIcon />
        </>
      )}
    </a>
  );
}

function CopyIcon(): React.JSX.Element {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2.5 8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon(): React.JSX.Element {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M2 6.5L4.5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
