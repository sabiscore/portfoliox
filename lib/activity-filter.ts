export const LOW_SIGNAL_COMMIT_PATTERN =
  /^(chore|style|docs|ci|wip|merge|format|lint|refactor\(css\)|update\s+(tailwind|css|deps|readme|lockfile|packages?))/i;

export const LOW_SIGNAL_COMMIT_PATTERNS: readonly RegExp[] = [
  LOW_SIGNAL_COMMIT_PATTERN,
  /^fix\(css\)/i,
  /^fix(?::|\([^)]*\):)?\s+(typo|formatting|lint|css|whitespace)\b/i,
  /^merge\s+(pull request|branch|remote-tracking)\b/i,
  /^initial\s+commit$/i,
];

export function sanitizeCommitTitle(rawMessage: string | null | undefined): string {
  if (!rawMessage) return '';
  return rawMessage.split(/\r?\n/)[0]?.trim().replace(/\.+$/, '') ?? '';
}

export function isQualifyingCommitMessage(message: string | null | undefined): boolean {
  const cleaned = sanitizeCommitTitle(message);
  if (cleaned.length < 10) return false;
  return !LOW_SIGNAL_COMMIT_PATTERNS.some((pattern) => pattern.test(cleaned));
}
