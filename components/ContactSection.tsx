'use client';

import React, { useState } from 'react';

import {
  CONTACT_INQUIRY_TYPES,
  CONTACT_SCOPES,
  CONTACT_TIMELINES,
  contactSchema,
} from '@/app/lib/validations';
import { useCopyEmail } from '@/components/CopyEmail';
import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';

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
  job: 'Staff / principal role',
  consulting: 'Architecture / consulting',
  collaboration: 'Technical collaboration',
  advisory: 'Advisory / leadership',
};

const TIMELINE_LABELS: Record<InquiryPayload['timeline'], string> = {
  immediate: 'Immediately',
  month: 'Within one month',
  quarter: 'Within one quarter',
  exploring: 'Exploring / flexible',
};

const ENGAGEMENT_FORMATS: ReadonlyArray<{ title: string; detail: string }> = [
  {
    title: 'Staff & Principal engineering roles',
    detail: 'Backend services, platform reliability, AI infrastructure, and fintech systems.',
  },
  {
    title: 'Scoped architecture & incident reviews',
    detail: 'Deliverable-led failure-boundary audits, inference serving, and data pipelines.',
  },
  {
    title: 'Advisory & technical collaborations',
    detail: 'Early-stage system design, schema contracts, and operational readiness.',
  },
];

const FIELD_IDS: Partial<Record<keyof InquiryPayload, string>> = {
  name: 'contact-name',
  email: 'contact-email',
  inquiryType: 'contact-inquiry-type',
  timeline: 'contact-timeline',
  scope: 'contact-scope',
  stakes: 'contact-stakes',
  message: 'contact-message',
};

export function ContactSection(): React.JSX.Element {
  const [formState, setFormState] = useState<InquiryPayload>(INITIAL_PAYLOAD);
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SENT' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof InquiryPayload, string>>>({});
  const directEmail = CONTACT_EMAIL;
  const { status: copyState, copy: handleCopyEmail } = useCopyEmail(directEmail);

  const updateField = <K extends keyof InquiryPayload>(field: K, value: InquiryPayload[K]) => {
    setFormState((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    if (status === 'ERROR' || status === 'SENT') {
      setStatus('IDLE');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrorMessage('');
    setFieldErrors({});

    const parsed = contactSchema.safeParse({
      ...formState,
      honeypot: '',
    });

    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof InquiryPayload, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof InquiryPayload | undefined;
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      const firstIssue = parsed.error.issues[0];
      const fieldKey = firstIssue?.path[0] as keyof InquiryPayload | undefined;
      setStatus('ERROR');
      setFieldErrors(nextErrors);
      setErrorMessage(`Check the form: ${firstIssue?.message ?? 'Complete all required fields.'}`);
      if (fieldKey && FIELD_IDS[fieldKey]) {
        document.getElementById(FIELD_IDS[fieldKey])?.focus();
      }
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
      setFieldErrors({});
      setFormState(INITIAL_PAYLOAD);
    } catch {
      setStatus('ERROR');
      setErrorMessage(
        `The message could not be sent right now. Email ${directEmail} directly and the brief will arrive the same way.`
      );
    }
  };

  const getFieldClass = (field: keyof InquiryPayload): string =>
    `min-h-touch w-full border ${
      fieldErrors[field] ? 'border-red-400/70' : 'border-white/15'
    } bg-obsidian-base px-3.5 py-2.5 font-mono text-sm text-white transition-colors focus:border-accent-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-section-heading"
      className="bg-obsidian-base w-full border-b border-white/10 px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="max-w-hero mx-auto grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="space-y-6 lg:col-span-5">
          <header className="space-y-3">
            <p className="tracking-section flex items-center gap-2.5 font-mono text-xs uppercase">
              <span className="text-accent-cyan font-bold">03</span>
              <span className="text-zinc-400">CONTACT // START A CONVERSATION</span>
            </p>
            <h2
              id="contact-section-heading"
              className="type-section font-display font-bold text-white"
            >
              Discuss a system.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
              For backend and platform opportunities, architecture reviews, technical
              collaborations, and advisory work across Nigeria and remote teams.
            </p>
          </header>

          {/* Direct one-click email copy bar above the form on mobile */}
          <div className="identity-card-shell bg-obsidian-surface space-y-4 border border-white/15 p-5">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <span className="font-mono text-xs tracking-wider text-zinc-400 uppercase">
                DIRECT CONTACT
              </span>
              <span className="text-micro font-mono text-zinc-300">LAGOS · UTC+1</span>
            </div>
            <div>
              <p className="text-2xs font-mono tracking-wider text-zinc-400 uppercase">Email</p>
              <p className="mt-1 font-mono text-sm font-semibold break-all text-white sm:text-base">
                {directEmail}
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleCopyEmail()}
                className={`min-h-touch focus-visible:ring-accent-cyan inline-flex flex-1 items-center justify-center border px-4 py-2.5 font-mono text-xs font-semibold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                  copyState === 'copied'
                    ? 'border-accent-emerald/55 bg-accent-emerald/10 text-accent-emerald'
                    : 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan hover:border-accent-cyan hover:bg-accent-cyan hover:text-obsidian-base'
                }`}
              >
                {copyState === 'copied' ? 'COPIED TO CLIPBOARD ✓' : 'COPY ADDRESS'}
              </button>
              <a
                href={`mailto:${directEmail}`}
                className="min-h-touch bg-obsidian-base hover:border-accent-cyan/50 focus-visible:ring-accent-cyan inline-flex items-center justify-center border border-white/20 px-4 py-2.5 font-mono text-xs font-semibold tracking-wider text-zinc-200 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:outline-none"
              >
                EMAIL DIRECTLY ↗
              </a>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={
                copyState === 'idle'
                  ? 'sr-only'
                  : copyState === 'copied'
                    ? 'text-micro text-accent-emerald font-mono'
                    : 'text-micro font-mono text-zinc-300'
              }
            >
              {copyState === 'copied'
                ? 'Email address copied.'
                : copyState === 'failed'
                  ? 'Copy is unavailable in this browser. Select the address above or use Email directly.'
                  : ''}
            </p>
          </div>

          <div className="bg-obsidian-surface space-y-4 border border-white/10 p-5">
            <p className="border-b border-white/10 pb-3 font-mono text-xs tracking-wider text-zinc-400 uppercase">
              ENGAGEMENT SCOPE
            </p>
            <ul className="space-y-3.5">
              {ENGAGEMENT_FORMATS.map((item) => (
                <li key={item.title} className="space-y-1">
                  <p className="font-mono text-xs font-semibold text-white">{item.title}</p>
                  <p className="text-xs leading-5 text-zinc-400">{item.detail}</p>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
              <a
                href={CV_ASSET_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-touch bg-obsidian-base text-micro hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:ring-accent-cyan inline-flex items-center gap-1.5 border border-white/15 px-3.5 py-2 font-mono tracking-wider text-zinc-200 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span>Résumé (PDF)</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://github.com/Scardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-touch bg-obsidian-base text-micro hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:ring-accent-cyan inline-flex items-center gap-1.5 border border-white/15 px-3.5 py-2 font-mono tracking-wider text-zinc-200 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span>GitHub</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://linkedin.com/in/oscardubu"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-touch bg-obsidian-base text-micro hover:border-accent-cyan/50 hover:text-accent-cyan focus-visible:ring-accent-cyan inline-flex items-center gap-1.5 border border-white/15 px-3.5 py-2 font-mono tracking-wider text-zinc-200 uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span>LinkedIn</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-obsidian-surface min-w-0 border border-white/10 p-5 sm:p-8 lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
                >
                  Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={50}
                  aria-invalid={Boolean(fieldErrors.name) || undefined}
                  aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                  value={formState.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Adaobi Okafor"
                  className={getFieldClass('name')}
                />
                {fieldErrors.name ? (
                  <p id="contact-name-error" className="font-mono text-xs text-red-300">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
                >
                  Email *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={Boolean(fieldErrors.email) || undefined}
                  aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                  value={formState.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="cto@organization.com"
                  className={getFieldClass('email')}
                />
                {fieldErrors.email ? (
                  <p id="contact-email-error" className="font-mono text-xs text-red-300">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="contact-inquiry-type"
                  className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
                >
                  Engagement type *
                </label>
                <select
                  id="contact-inquiry-type"
                  name="inquiryType"
                  value={formState.inquiryType}
                  onChange={(event) =>
                    updateField('inquiryType', event.target.value as InquiryPayload['inquiryType'])
                  }
                  className={getFieldClass('inquiryType')}
                >
                  {CONTACT_INQUIRY_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-obsidian-base text-white">
                      {INQUIRY_TYPE_LABELS[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="contact-timeline"
                  className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
                >
                  Timeline *
                </label>
                <select
                  id="contact-timeline"
                  name="timeline"
                  value={formState.timeline}
                  onChange={(event) =>
                    updateField('timeline', event.target.value as InquiryPayload['timeline'])
                  }
                  className={getFieldClass('timeline')}
                >
                  {CONTACT_TIMELINES.map((timeline) => (
                    <option key={timeline} value={timeline} className="bg-obsidian-base text-white">
                      {TIMELINE_LABELS[timeline]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-scope"
                className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
              >
                System domain *
              </label>
              <select
                id="contact-scope"
                name="scope"
                value={formState.scope}
                onChange={(event) =>
                  updateField('scope', event.target.value as InquiryPayload['scope'])
                }
                className={getFieldClass('scope')}
              >
                {CONTACT_SCOPES.map((scope) => (
                  <option key={scope} value={scope} className="bg-obsidian-base text-white">
                    {scope}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="contact-stakes"
                  className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
                >
                  Operational or business impact *
                </label>
                <span className="text-2xs font-mono text-zinc-400">
                  {formState.stakes.length}/240
                </span>
              </div>
              <input
                id="contact-stakes"
                name="stakes"
                required
                minLength={5}
                maxLength={240}
                aria-invalid={Boolean(fieldErrors.stakes) || undefined}
                value={formState.stakes}
                onChange={(event) => updateField('stakes', event.target.value)}
                placeholder="What is at risk if this remains unresolved?"
                aria-describedby={
                  fieldErrors.stakes
                    ? 'contact-stakes-error contact-stakes-hint'
                    : 'contact-stakes-hint'
                }
                className={getFieldClass('stakes')}
              />
              {fieldErrors.stakes ? (
                <p id="contact-stakes-error" className="font-mono text-xs text-red-300">
                  {fieldErrors.stakes}
                </p>
              ) : null}
              <p id="contact-stakes-hint" className="text-xs leading-5 text-zinc-400">
                A sentence is enough. This helps establish scope before the first conversation.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs tracking-wider text-zinc-300 uppercase"
                >
                  Constraints and objectives *
                </label>
                <span className="text-2xs font-mono text-zinc-400">
                  {formState.message.length}/500
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={500}
                aria-invalid={Boolean(fieldErrors.message) || undefined}
                aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                value={formState.message}
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Outline the system, constraints, desired outcome, or role..."
                className={`${getFieldClass('message')} min-h-32 resize-y`}
              />
              {fieldErrors.message ? (
                <p id="contact-message-error" className="font-mono text-xs text-red-300">
                  {fieldErrors.message}
                </p>
              ) : null}
            </div>

            {status === 'ERROR' ? (
              <div
                role="alert"
                className="border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs leading-5 text-red-300"
              >
                {errorMessage}
              </div>
            ) : null}

            {status === 'SENT' ? (
              <div
                role="status"
                className="border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan border px-4 py-3 font-mono text-xs leading-5"
              >
                Message sent. The inquiry was accepted by the contact service.
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === 'SUBMITTING'}
              className="min-h-cta border-accent-cyan bg-accent-cyan text-obsidian-base hover:border-accent-cyanHover hover:bg-accent-cyanHover focus-visible:ring-accent-cyan focus-visible:ring-offset-obsidian-surface inline-flex w-full items-center justify-center border px-6 py-3 font-mono text-xs font-bold tracking-wider uppercase transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60 sm:text-sm"
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
