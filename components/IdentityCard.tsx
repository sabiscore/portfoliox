import Image from 'next/image';
import type { JSX } from 'react';

import {
  IDENTITY_CARD_CONTENT_CLASSNAME,
  IDENTITY_CARD_FRAME_CLASSNAME,
  IDENTITY_CARD_META_ROW_CLASSNAME,
  IDENTITY_CARD_PORTRAIT_CLASSNAME,
  IDENTITY_CARD_PROFILE_GRID_CLASSNAME,
  IDENTITY_CARD_SURFACE_CLASSNAME,
  IDENTITY_CARD_TRUST_SIGNAL_CLASSNAME,
  IDENTITY_CARD_TRUST_SIGNALS_GRID_CLASSNAME,
} from '@/components/identityCardStyles';
import { PROFILE } from '@/lib/portfolio-data';

type IdentityCardProps = {
  className?: string;
};

const STACK_SIGNALS = ['Backend · Platform', 'AI infrastructure'] as const;

const TRUST_SIGNALS = [
  { label: 'Focus', value: 'Backend · platform reliability' },
  { label: 'Proof', value: 'TaxBridge · SabiScore · SwarmXQ' },
  { label: 'Method', value: 'Constraint → decision → outcome → evidence' },
] as const;

export default function IdentityCard({ className = '' }: IdentityCardProps): JSX.Element {
  return (
    <article
      aria-label="Oscar Ndugbu identity card"
      data-testid="hero-identity-card"
      className={[IDENTITY_CARD_FRAME_CLASSNAME, className].join(' ')}
    >
      <div className={IDENTITY_CARD_SURFACE_CLASSNAME}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(56,189,248,0.14),transparent_36%)]" />

        <div className={IDENTITY_CARD_CONTENT_CLASSNAME}>
          <div className={IDENTITY_CARD_META_ROW_CLASSNAME}>
            <p className="min-w-0 rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1.5 font-mono text-[0.56rem] tracking-[0.2em] text-sky-100/90 uppercase sm:px-3 sm:text-[0.62rem] sm:tracking-[0.28em]">
              Operating model
            </p>

            <span className="shrink-0 rounded-full border border-orange-300/20 bg-orange-300/10 px-2.5 py-1.5 font-mono text-[0.56rem] tracking-[0.18em] text-orange-100/85 uppercase sm:px-3 sm:text-[0.62rem] sm:tracking-[0.24em]">
              UTC+1
            </span>
          </div>

          <div className={IDENTITY_CARD_PROFILE_GRID_CLASSNAME}>
            <div className={IDENTITY_CARD_PORTRAIT_CLASSNAME} data-testid="identity-portrait">
              <Image
                src="/headshot.webp"
                alt="Portrait of Oscar Ndugbu"
                fill
                priority
                sizes="(max-width: 640px) 116px, 190px"
                className="object-cover object-center opacity-95 transition duration-700 motion-safe:group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_46%,rgba(2,6,23,0.68))]" />
            </div>

            <div className="min-w-0 space-y-2.5 sm:space-y-3">
              <div>
                <p className="font-mono text-[0.56rem] leading-4 tracking-[0.18em] text-white/50 uppercase sm:text-[0.65rem] sm:tracking-[0.24em]">
                  {PROFILE.role}
                </p>
                <h2 className="mt-1.5 text-pretty text-2xl leading-[1.02] font-semibold tracking-[-0.035em] text-white sm:mt-2 sm:text-4xl">
                  Oscar Ndugbu
                </h2>
              </div>

              <p className="text-xs leading-5 text-white/62 sm:text-sm sm:leading-6">
                Backend, platform, and AI systems designed to make failure visible, recovery deliberate, and operations easier to understand.
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {STACK_SIGNALS.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.065] px-2.5 py-1 text-[0.68rem] font-medium text-white/76 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={IDENTITY_CARD_TRUST_SIGNALS_GRID_CLASSNAME}>
            {TRUST_SIGNALS.map((signal) => (
              <div key={signal.label} className={IDENTITY_CARD_TRUST_SIGNAL_CLASSNAME}>
                <p className="font-mono text-[0.48rem] tracking-[0.12em] text-sky-200/75 uppercase sm:text-[0.55rem] sm:tracking-[0.16em]">
                  {signal.label}
                </p>
                <p className="mt-1 text-[0.6rem] leading-[0.85rem] text-white/68 sm:text-[0.7rem] sm:leading-4">
                  {signal.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 hidden font-mono text-[0.62rem] leading-4 tracking-[0.24em] text-white/42 uppercase sm:block">
            Lagos · UTC+1 · Backend · Platform · AI infrastructure
          </p>
        </div>
      </div>
    </article>
  );
}
