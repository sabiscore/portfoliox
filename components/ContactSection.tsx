'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  CONTACT_INQUIRY_TYPES,
  CONTACT_SCOPES,
  CONTACT_TIMELINES,
  contactSchema,
} from '@/app/lib/validations';

interface InquiryPayload {
  name: string;
  email: string;
  scope: (typeof CONTACT_SCOPES)[number];
  inquiryType: (typeof CONTACT_INQUIRY_TYPES)[number];
  timeline: (typeof CONTACT_TIMELINES)[number];
  stakes: string;
  message: string;
}

const INITIAL_PAYLOAD: InquiryPayload = {
  name: '',
  email: '',
  scope: 'Backend & Platform Infrastructure',
  inquiryType: 'consulting',
  timeline: 'exploring',
  stakes: '',
  message: '',
};

const INQUIRY_TYPE_LABELS: Record<InquiryPayload['inquiryType'], string> = {
  job: 'Professional opportunity',
  consulting: 'Consulting / architecture review',
  collaboration: 'Technical collaboration',
  advisory: 'Advisory / technical leadership',
};

const TIMELINE_LABELS: Record<InquiryPayload['timeline'], string> = {
  immediate: 'Immediately',
  month: 'Within one month',
  quarter: 'Within one quarter',
  exploring: 'Exploring / no fixed date',
};

export function ContactSection(): React.JSX.Element {
  const [formState, setFormState] = useState<InquiryPayload>(INITIAL_PAYLOAD);
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SENT' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const directEmail = 'oscar@scardubu.dev';

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(directEmail);
      setCopiedEmail(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  }, []);

  const updateField = <K extends keyof InquiryPayload>(field: K, value: InquiryPayload[K]) => {
    setFormState((current) => ({ ...current, [field]: value }));
    if (status === 'ERROR') {
      setStatus('IDLE');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');

    const parsed = contactSchema.safeParse({
      ...formState,
      honeypot: '',
    });

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setStatus('ERROR');
      setErrorMessage(
        `SCHEMA_VALIDATION_ERROR: ${firstIssue?.message ?? 'Complete all required fields.'}`
      );
      return;
    }

    setStatus('SUBMITTING');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      setStatus('SENT');
      setFormState(INITIAL_PAYLOAD);
    } catch {
      setStatus('ERROR');
      setErrorMessage(
        'TRANSMISSION_FALLBACK: The contact endpoint is unavailable. Use the direct email address below to send the brief.'
      );
    }
  };

  const fieldClass =
    'min-h-[44px] w-full border border-white/15 bg-[#08090C] px-3.5 py-2.5 font-mono text-sm text-white transition-colors focus:border-[#00D9FF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]';

  return (
    <section
      id="contact"
      aria-labelledby="contact-section-heading"
      className="w-full border-b border-white/10 bg-[#08090C] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-5">
          <header className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#00D9FF]">
              03 // START A CONVERSATION
            </p>
            <h2
              id="contact-section-heading"
              className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
            >
              Discuss a system.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              For backend and platform opportunities, architecture reviews, technical
              collaborations, and advisory work across Nigeria and remote teams.
            </p>
          </header>

          <div className="space-y-4 border border-white/10 bg-[#0E0E10] p-5">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                DIRECT CONTACT
              </span>
              <span className="font-mono text-[11px] text-zinc-500">LAGOS · UTC+1</span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Email
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-white sm:text-base">
                {directEmail}
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleCopyEmail()}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center border border-white/20 bg-[#08090C] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:border-[#00D9FF]/50 hover:text-[#00D9FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
              >
                {copiedEmail ? 'COPIED TO CLIPBOARD ✓' : 'COPY ADDRESS'}
              </button>
              <a
                href={`mailto:${directEmail}`}
                className="inline-flex min-h-[44px] items-center justify-center border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#00D9FF] transition-colors hover:bg-[#00D9FF]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
              >
                MAIL CLIENT ↗
              </a>
            </div>
            <p role="status" aria-live="polite" aria-atomic="true" className="min-h-4 text-xs text-zinc-500">
              {copiedEmail ? 'Email address copied.' : ''}
            </p>
          </div>
        </div>

        <div className="min-w-0 border border-white/10 bg-[#0E0E10] p-5 sm:p-8 lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                  Name // Identifier *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={50}
                  value={formState.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Adaobi Okafor"
                  className={fieldClass}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                  Return endpoint (email) *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={formState.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="cto@organization.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-inquiry-type" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                  Engagement type *
                </label>
                <select
                  id="contact-inquiry-type"
                  name="inquiryType"
                  value={formState.inquiryType}
                  onChange={(event) =>
                    updateField('inquiryType', event.target.value as InquiryPayload['inquiryType'])
                  }
                  className={fieldClass}
                >
                  {CONTACT_INQUIRY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {INQUIRY_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-timeline" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                  Timeline *
                </label>
                <select
                  id="contact-timeline"
                  name="timeline"
                  value={formState.timeline}
                  onChange={(event) =>
                    updateField('timeline', event.target.value as InquiryPayload['timeline'])
                  }
                  className={fieldClass}
                >
                  {CONTACT_TIMELINES.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {TIMELINE_LABELS[timeline]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-scope" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                System domain *
              </label>
              <select
                id="contact-scope"
                name="scope"
                value={formState.scope}
                onChange={(event) =>
                  updateField('scope', event.target.value as InquiryPayload['scope'])
                }
                className={fieldClass}
              >
                {CONTACT_SCOPES.map((scope) => (
                  <option key={scope} value={scope}>
                    {scope}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-stakes" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                Operational or business impact *
              </label>
              <input
                id="contact-stakes"
                name="stakes"
                required
                minLength={5}
                maxLength={240}
                value={formState.stakes}
                onChange={(event) => updateField('stakes', event.target.value)}
                placeholder="What is at risk if this remains unresolved?"
                className={fieldClass}
              />
              <p className="text-xs leading-5 text-zinc-500">
                A sentence is enough. This helps establish scope before the first conversation.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-message" className="block font-mono text-xs uppercase tracking-wider text-zinc-300">
                Constraints and objectives *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={500}
                value={formState.message}
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Outline the system, constraints, desired outcome, or role..."
                className={`${fieldClass} min-h-32 resize-y`}
              />
            </div>

            {status === 'ERROR' ? (
              <div role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs leading-5 text-red-300">
                {errorMessage}
              </div>
            ) : null}

            {status === 'SENT' ? (
              <div role="status" className="border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-3 font-mono text-xs leading-5 text-[#00D9FF]">
                ACK_RECEIVED: The inquiry was accepted by the contact service.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === 'SUBMITTING'}
              className="inline-flex min-h-[48px] w-full items-center justify-center border border-[#00D9FF] bg-[#00D9FF] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#08090C] transition-colors hover:bg-[#7AEAFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0E10] disabled:cursor-wait disabled:opacity-60 sm:text-sm"
            >
              {status === 'SUBMITTING' ? 'SENDING INQUIRY…' : 'SEND INQUIRY ↗'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
