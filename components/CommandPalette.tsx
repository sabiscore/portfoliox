'use client';

import { ArrowUpRight, Code2, FileText, Layers, Search, Terminal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { STATIC_PALETTE_ITEMS, type PaletteItem } from '@/constants/palette';
import { CV_ASSET_PATH } from '@/lib/config';

interface CommandOption {
  id: string;
  label: string;
  subtitle?: string;
  category: 'NAVIGATION' | 'EVIDENCE' | 'ARTIFACT';
  href: string;
  keywords: string[];
  external?: boolean;
}

const SECTION_COMMANDS: readonly CommandOption[] = [
  {
    id: 'nav-projects',
    label: '01 // Selected Work & Case Studies',
    subtitle: 'SabiScore, TaxBridge, The Yap Engine & UBEC Data Pipeline',
    category: 'NAVIGATION',
    href: '/#projects',
    keywords: ['projects', 'work', 'case studies', 'flagship'],
  },
  {
    id: 'nav-failure-modes',
    label: '02 // Failure Modes & Recovery Design',
    subtitle: 'Fail-closed boundaries, observability, and replay semantics',
    category: 'NAVIGATION',
    href: '/#failure-modes',
    keywords: ['engineering', 'failure', 'patterns', 'reliability'],
  },
  {
    id: 'nav-contact',
    label: '03 // Discuss a System',
    subtitle: 'Direct email, engagement scope, and inquiry form',
    category: 'NAVIGATION',
    href: '/#contact',
    keywords: ['contact', 'hire', 'email', 'consulting', 'advisory'],
  },
];

function mapPaletteItem(item: PaletteItem): CommandOption {
  const isResume = item.href === CV_ASSET_PATH || item.category === 'system';
  return {
    id: item.id,
    label: item.title,
    subtitle: item.subtitle,
    category: isResume ? 'ARTIFACT' : item.category === 'project' ? 'EVIDENCE' : 'NAVIGATION',
    href: item.href,
    keywords: item.keywords,
    external: isResume,
  };
}

const COMMAND_OPTIONS: readonly CommandOption[] = [
  ...SECTION_COMMANDS,
  ...STATIC_PALETTE_ITEMS.map(mapPaletteItem),
];

type CommandPaletteWindow = Window & {
  __commandPaletteRequested?: boolean;
};

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const commandWindow = window as CommandPaletteWindow;
    if (commandWindow.__commandPaletteRequested) {
      commandWindow.__commandPaletteRequested = false;
      return true;
    }
    return false;
  });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return COMMAND_OPTIONS;
    return COMMAND_OPTIONS.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        (item.subtitle?.toLowerCase().includes(term) ?? false) ||
        item.category.toLowerCase().includes(term) ||
        item.keywords.some((keyword) => keyword.toLowerCase().includes(term))
    );
  }, [query]);

  const closePalette = useCallback((restoreFocus = true) => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    if (restoreFocus) {
      previousFocusRef.current?.focus();
    }
    previousFocusRef.current = null;
  }, []);

  const handleSelect = useCallback(
    (item: CommandOption) => {
      closePalette(false);
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        router.push(item.href);
      }
    },
    [closePalette, router]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const commandWindow = window as CommandPaletteWindow;
        commandWindow.__commandPaletteRequested = false;
        if (open) {
          closePalette();
        } else {
          previousFocusRef.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
          setOpen(true);
        }
        return;
      }

      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closePalette();
      } else if (event.key === 'ArrowDown' && filtered.length > 0) {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      } else if (event.key === 'ArrowUp' && filtered.length > 0) {
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (event.key === 'Enter' && filtered[activeIndex]) {
        event.preventDefault();
        handleSelect(filtered[activeIndex]);
      }
    };

    const handleOpenRequest = () => {
      const commandWindow = window as CommandPaletteWindow;
      commandWindow.__commandPaletteRequested = false;
      if (!open) {
        previousFocusRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      setOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('command-palette:open', handleOpenRequest);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('command-palette:open', handleOpenRequest);
    };
  }, [activeIndex, closePalette, filtered, handleSelect, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="System Command Palette"
      onClick={(event) => {
        if (event.target === event.currentTarget) closePalette();
      }}
      className="bg-obsidian-base/85 fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 backdrop-blur-sm"
    >
      <div className="command-palette-panel bg-obsidian-surface relative overflow-hidden border border-white/15">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-white/10 px-4 py-2.5">
          <Search aria-hidden="true" className="text-accent-cyan mr-3 h-4 w-4 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Filter sections, case studies, or artifacts"
            placeholder="Filter sections, case studies, or artifacts..."
            className="min-h-touch flex-1 bg-transparent font-mono text-xs text-white placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => closePalette()}
            aria-label="Close command palette"
            className="min-h-touch min-w-touch bg-obsidian-base hover:border-accent-cyan hover:text-accent-cyan focus-visible:ring-accent-cyan inline-flex items-center justify-center border border-white/15 text-zinc-300 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <ul className="max-h-80 divide-y divide-white/10 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <li className="py-6 text-center font-mono text-xs text-zinc-400">
              No matching routes or specifications found.
            </li>
          ) : (
            filtered.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => handleSelect(item)}
                    className={`min-h-touch focus-visible:ring-accent-cyan flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset ${
                      isActive
                        ? 'bg-accent-cyan/10 text-accent-cyan'
                        : 'hover:text-accent-cyan text-zinc-100 hover:bg-white/5'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {item.category === 'ARTIFACT' ? (
                        <FileText
                          aria-hidden="true"
                          className="text-accent-emerald h-3.5 w-3.5 shrink-0"
                        />
                      ) : item.category === 'EVIDENCE' ? (
                        <Layers
                          aria-hidden="true"
                          className="text-accent-cyan h-3.5 w-3.5 shrink-0"
                        />
                      ) : (
                        <Code2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{item.label}</span>
                        {item.subtitle ? (
                          <span className="text-micro block truncate font-sans text-zinc-400">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </span>
                    </span>

                    <span className="text-2xs ml-2 flex shrink-0 items-center gap-1 tracking-wider text-zinc-400 uppercase">
                      <span>{item.category}</span>
                      <ArrowUpRight aria-hidden="true" className="text-accent-cyan h-3 w-3" />
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer Telemetry Bar */}
        <div className="bg-obsidian-base text-2xs flex items-center justify-between border-t border-white/10 px-4 py-2 font-mono tracking-wider text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <Terminal aria-hidden="true" className="text-accent-emerald h-3 w-3" />
            <span>OBSIDIAN NOCTURNE V2 // ROUTER</span>
          </span>
          <span>↑↓ NAVIGATE · ↵ OPEN · ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
