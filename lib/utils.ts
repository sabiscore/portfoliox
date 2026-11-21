import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names and cleanly resolves Tailwind CSS class conflicts.
 * Essential for maintaining runtime performance across nested Framer Motion layouts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }
): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('en-GB', options);
}

export function formatMonthYear(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Recently verified';
  }
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** Clamp a number between min and max — used by useReadingProgress. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Truncate a string to n characters with an ellipsis. */
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '\u2026' : str;
}