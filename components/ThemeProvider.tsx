'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Obsidian Nocturne v2 is a dedicated dark-surface design system.
 * Locking resolved theme semantics to dark prevents stale `localStorage`
 * preferences from an earlier release from flipping native scrollbars or
 * form controls into light mode against #08090C backgrounds.
 */
export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.style.colorScheme = 'dark';

    try {
      if (globalThis.localStorage.getItem('theme') === 'light') {
        globalThis.localStorage.setItem('theme', 'dark');
      }
    } catch {
      // Ignore storage access restrictions in private or sandboxed contexts.
    }
  }, []);

  const setTheme = useCallback((_nextTheme: Theme) => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.documentElement.style.colorScheme = 'dark';
    try {
      globalThis.localStorage.setItem('theme', 'dark');
    } catch {
      // Ignore storage access restrictions.
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: 'dark', resolvedTheme: 'dark', setTheme }),
    [setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}