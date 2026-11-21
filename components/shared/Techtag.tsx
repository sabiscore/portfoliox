export interface TechTagProps {
  label: string;
  tone?: 'default' | 'accent' | 'positive';
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<TechTagProps['tone']>, string> = {
  default: 'border-white/10 bg-zinc-900 text-zinc-300',
  accent: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-300',
  positive: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
};

export function TechTag({
  label,
  tone = 'default',
  className = '',
}: TechTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-medium tracking-tight ${TONE_CLASSES[tone]} ${className}`}
    >
      {label}
    </span>
  );
}

export const Techtag = TechTag;
export default TechTag;
