// CONVICTION ENGINE V1.0 — Oscar Ndugbu Design System
// Major Reset • Lagos → Global • Production Conviction Architecture
'use client';

import { m, useReducedMotion } from 'framer-motion';
import {
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { trackEvent } from '@/app/lib/analytics';
import { ChapterFrame } from '@/components/cinematic/ChapterFrame';
import { CopyEmail } from '@/components/CopyEmail';
import { SectionIntro } from '@/components/shared/SectionIntro';
import { getChapterBySectionId } from '@/lib/cinematic/chapters';
import { CONTACT_EMAIL, CV_ASSET_PATH } from '@/lib/config';
import { clipReveal, fadeRise, noMotion, staggerContainer } from '@/lib/motionVariants';

const USEFUL_BRIEF = [
  { label: 'Problem', body: 'The system, workflow, or operating constraint that needs attention.' },
  { label: 'Stakes', body: 'What breaks, slows down, or becomes risky if it is left unresolved.' },
  { label: 'Timeline', body: 'When a decision, review, or first delivery needs to happen.' },
  { label: 'Contact', body: 'A name and working email for the next conversation.' },
] as const;

const TRUST_BADGES = [
  'Staff backend and platform scope',
  'AI infrastructure and reliability',
  'Lagos · UTC+1',
] as const;

// V1.0 §Form State Copy — field validation messages (hoisted: static, no closure deps)
const FIELD_ERRORS: Record<string, string> = {
  name: 'A name is needed for the reply.',
  email: 'Need a working address to respond.',
  timeline: 'Choose the closest delivery horizon.',
  stakes: 'Name what is at risk if the problem remains unresolved.',
  // V1.3: 'describe the constraint' → 'tell the story' — removes the insider verb-noun pair.
  // 'This is the important part' stays — it signals priority correctly.
  // 'tell the story' works for both the technical founder writing a systems brief
  // and the non-technical founder writing a business situation. Mirrors the
  // portfolio's narrative voice ('the system has to work at 2am').
  message: 'This is the important part — tell the story.',
};

const TIMELINE_OPTIONS = [
  { value: 'immediate', label: 'Immediate · active incident or decision' },
  { value: 'month', label: 'Within one month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'exploring', label: 'Exploring · no fixed date yet' },
] as const;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.77.6-3.35-1.18-3.35-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.54 2.36 1.1 2.93.84.09-.65.35-1.1.63-1.36-2.21-.25-4.54-1.1-4.54-4.92 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.41.11 2.66.64.69 1.03 1.58 1.03 2.67 0 3.83-2.33 4.66-4.56 4.91.36.31.67.92.67 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M4.98 3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM3.5 8.75h2.96V20.5H3.5V8.75Zm7.17 0h2.84v1.6h.04c.39-.75 1.37-1.85 2.82-1.85 3.02 0 3.58 1.98 3.58 4.56v7.44H17V14c0-1.5-.03-3.42-2.08-3.42-2.08 0-2.4 1.63-2.4 3.31v6.61h-2.85V8.75Z" />
    </svg>
  );
}

/* ── Inline contact form ─────────────────────────────────────────────────── */
type FormState = 'idle' | 'loading' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  timeline: string;
  stakes: string;
  message: string;
}

function validateBrief(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (values.name.trim().length < 2) errors.name = FIELD_ERRORS.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = FIELD_ERRORS.email;
  }
  if (!values.timeline.trim()) errors.timeline = FIELD_ERRORS.timeline;
  if (values.stakes.trim().length < 5) errors.stakes = FIELD_ERRORS.stakes;
  if (values.message.trim().length < 10) errors.message = FIELD_ERRORS.message;

  return errors;
}

function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    timeline: 'month',
    stakes: '',
    message: '',
  });
  // Change 1d — V1.0: field-level validation errors per spec §Form State Copy
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'success') {
      successRef.current?.focus();
    }
  }, [state]);

  function handleBlur(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (!value.trim()) {
      setFieldErrors((prev) => ({ ...prev, [name]: FIELD_ERRORS[name] }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'loading') return;

    const validationErrors = validateBrief(values);
    const firstInvalidField = Object.keys(validationErrors)[0] as keyof FormValues | undefined;

    if (firstInvalidField) {
      setFieldErrors(validationErrors);
      const field = e.currentTarget.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    setFieldErrors({});
    setState('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, inquiryType: 'advisory', honeypot: '' }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      trackEvent('Portfolio', 'ContactSubmit', values.timeline, undefined, {
        status: 'success',
      });
      setState('success');
      setValues({ name: '', email: '', timeline: 'month', stakes: '', message: '' });
    } catch {
      trackEvent('Portfolio', 'ContactSubmit', values.timeline, undefined, {
        status: 'error',
      });
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div
        data-cinematic="panel"
        ref={successRef}
        className="flex flex-col items-center justify-center gap-4 rounded-[var(--radius-xl)] border border-[oklch(65%_0.18_155_/_0.4)] bg-[oklch(65%_0.18_155_/_0.06)] p-8 text-center sm:p-10"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(65%_0.18_155_/_0.15)]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-color-success"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-display text-color-text-primary text-lg font-bold">
          System brief received.
        </p>
        <p className="text-color-text-secondary max-w-[40ch] text-sm leading-7">
          The problem, stakes, and timeline are queued for review. A useful next step will arrive by email.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="text-color-text-muted mt-2 min-h-[48px] px-4 font-mono text-xs tracking-widest uppercase transition hover:opacity-70"
          aria-label="Send another message"
        >
          Send another ↩
        </button>
      </div>
    );
  }

  return (
    <form
      data-cinematic="panel"
      onSubmit={(e) => void handleSubmit(e)}
      className="border-color-border rounded-[var(--radius-xl)] border bg-[oklch(100%_0_0_/_0.02)] p-5 sm:p-7"
      noValidate
      aria-label="Contact Oscar Ndugbu"
      aria-busy={state === 'loading'}
    >
      <p className="label-mono text-color-film-teal mb-5">START A CONVERSATION</p>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="contact-field-group">
          <label htmlFor="cf-name" className="contact-field-label">
            Name{' '}
            <span aria-hidden="true" className="text-color-success">
              *
            </span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={50}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your name"
            className="contact-field-input"
            disabled={state === 'loading'}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'cf-name-error' : undefined}
          />
          {fieldErrors.name && (
            <p
              id="cf-name-error"
              className="text-2xs text-color-film-teal mt-1 font-mono"
              role="alert"
            >
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div className="contact-field-group">
          <label htmlFor="cf-email" className="contact-field-label">
            Email{' '}
            <span aria-hidden="true" className="text-color-success">
              *
            </span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@company.com"
            className="contact-field-input"
            disabled={state === 'loading'}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'cf-email-error' : undefined}
          />
          {fieldErrors.email && (
            <p
              id="cf-email-error"
              className="text-2xs text-color-film-teal mt-1 font-mono"
              role="alert"
            >
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="contact-field-group mb-4">
        <label htmlFor="cf-timeline" className="contact-field-label">
          Timeline{' '}
          <span aria-hidden="true" className="text-color-success">
            *
          </span>
        </label>
        <select
          id="cf-timeline"
          name="timeline"
          required
          value={values.timeline}
          onChange={handleChange}
          onBlur={handleBlur}
          className="contact-field-input contact-field-select"
          disabled={state === 'loading'}
          aria-invalid={Boolean(fieldErrors.timeline)}
          aria-describedby={fieldErrors.timeline ? 'cf-timeline-error' : undefined}
        >
          {TIMELINE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {fieldErrors.timeline && (
          <p
            id="cf-timeline-error"
            className="text-2xs text-color-film-teal mt-1 font-mono"
            role="alert"
          >
            {fieldErrors.timeline}
          </p>
        )}
      </div>

      <div className="contact-field-group mb-4">
        <label htmlFor="cf-stakes" className="contact-field-label">
          What is at stake?{' '}
          <span aria-hidden="true" className="text-color-success">
            *
          </span>
        </label>
        <textarea
          id="cf-stakes"
          name="stakes"
          required
          minLength={5}
          maxLength={240}
          rows={2}
          value={values.stakes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Customer impact, delivery risk, audit exposure, or operational cost."
          className="contact-field-input contact-field-textarea"
          disabled={state === 'loading'}
          aria-invalid={Boolean(fieldErrors.stakes)}
          aria-describedby={fieldErrors.stakes ? 'cf-stakes-error' : undefined}
        />
        {fieldErrors.stakes && (
          <p
            id="cf-stakes-error"
            className="text-2xs text-color-film-teal mt-1 font-mono"
            role="alert"
          >
            {fieldErrors.stakes}
          </p>
        )}
      </div>

      <div className="contact-field-group mb-5">
        <label htmlFor="cf-message" className="contact-field-label">
          Problem or constraint{' '}
          <span aria-hidden="true" className="text-color-success">
            *
          </span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          minLength={10}
          maxLength={500}
          rows={4}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="What is the system doing now, and what needs to change?"
          className="contact-field-input contact-field-textarea"
          disabled={state === 'loading'}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={
            fieldErrors.message ? 'cf-message-error cf-message-count' : 'cf-message-count'
          }
        />
        {fieldErrors.message && (
          <p
            id="cf-message-error"
            className="text-2xs text-color-film-teal mt-1 font-mono"
            role="alert"
          >
            {fieldErrors.message}
          </p>
        )}
        <p id="cf-message-count" className="text-2xs text-color-text-muted mt-1.5 font-mono">
          {values.message.length}/500 characters
        </p>
      </div>

      {state === 'error' && (
        <p
          className="mb-4 rounded-lg border border-[oklch(60%_0.22_25_/_0.25)] bg-[oklch(60%_0.22_25_/_0.10)] px-3 py-2.5 text-sm font-medium text-[oklch(72%_0.18_28)]"
          role="alert"
          aria-live="assertive"
        >
          Something interrupted the send. Try again, or use the direct email path at{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-color-film-teal underline underline-offset-2"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="cta-primary cta-primary--lg tactile-press w-full justify-center"
      >
        {state === 'loading' ? (
          <>
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            {/* V1.3: 'constraint' removed from loading state — this is the post-commitment moment.
                The visitor has just pressed Send. They need reassurance that the message is going,
                not a reminder of insider vocabulary. 'Sending your message...' is warm,
                universal, and matches the reassurance register of the idle state copy. */}
            Sending your message...
          </>
        ) : (
          <>
            <span
              className="bg-color-success inline-block h-2 w-2 rounded-full"
              aria-hidden="true"
            />
            Send system brief
          </>
        )}
      </button>

      <p className="text-2xs text-color-text-muted mt-3 text-center font-mono">
        Or email directly:{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-color-film-teal underline underline-offset-2 transition hover:opacity-70"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </form>
  );
}

/* ── Main ContactSection ─────────────────────────────────────────────────── */
export function ContactSection() {
  const reducedMotion = useReducedMotion();
  const chapter = getChapterBySectionId('section-contact');

  const container = useMemo(() => staggerContainer(0.07, 0.05), []);
  const child = reducedMotion ? noMotion : fadeRise;
  const headingVariant = reducedMotion ? noMotion : clipReveal;

  return (
    <ChapterFrame
      chapter={chapter}
      ariaLabelledBy="contact-heading"
      className="border-color-border"
    >
      <div>
        <m.div variants={child} className="mb-6 sm:mb-8">
          <SectionIntro
            eyebrowNumber="06"
            eyebrowLabel="Contact"
            headingId="contact-heading"
            title={<>Discuss the system.</>}
            description={
              'For Staff backend and platform roles, architecture reviews, AI infrastructure, or reliability work: send the problem, the stakes, and the timeline.'
            }
            eyebrowVariant={child}
            titleVariant={headingVariant}
            descriptionVariant={child}
            titleClassName="mt-4 lg:mt-0"
            descriptionClassName="text-color-text-secondary mt-4 max-w-[52ch] text-base leading-8 lg:mt-0"
          />
        </m.div>

        <m.div
          variants={child}
          data-cinematic="proof"
          className="mb-8 flex flex-wrap gap-2"
          aria-label="Trust signals"
        >
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="text-2xs text-color-text-muted inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border-glass)] bg-[oklch(100%_0_0_/_0.03)] px-3 py-1 font-mono tracking-widest uppercase"
            >
              {badge}
            </span>
          ))}
        </m.div>

        {/* Two-column: Form left, Cards right */}
        <m.div variants={container} className="grid gap-6 lg:grid-cols-2">
          <m.div variants={child}>
            <ContactForm />
          </m.div>

          <m.aside
            variants={child}
            data-cinematic="panel"
            className="border-color-border rounded-[var(--radius-xl)] border bg-[oklch(100%_0_0_/_0.02)] p-5 sm:p-7"
            aria-label="What to include in a system brief"
          >
            <p className="label-mono text-color-film-teal">A useful first brief</p>
            <p className="text-color-text-secondary mt-3 max-w-[42ch] text-sm leading-7">
              Four signals are enough to begin. Technical detail can follow once the operating context is clear.
            </p>
            <ol className="border-color-border-subtle mt-6 divide-y divide-[var(--color-border-subtle)] border-y">
              {USEFUL_BRIEF.map((item, index) => (
                <li key={item.label} className="grid grid-cols-[2rem_1fr] gap-3 py-4">
                  <span className="text-color-film-teal font-mono text-xs" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-color-text-primary text-sm font-semibold">{item.label}</p>
                    <p className="text-color-text-muted mt-1 text-xs leading-6">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-color-text-muted mt-5 font-mono text-[10px] leading-5 tracking-wide uppercase">
              Backend · Platform · AI infrastructure · Production reliability
            </p>
          </m.aside>
        </m.div>

        {/* Social links */}
        <m.div
          variants={child}
          data-cinematic="cta"
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Scardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-color-text-muted inline-flex min-h-11 min-w-11 items-center gap-2 text-sm transition-colors"
              aria-label="GitHub profile"
            >
              <GitHubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/oscardubu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-color-text-muted inline-flex min-h-11 min-w-11 items-center gap-2 text-sm transition-colors"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <CopyEmail email={CONTACT_EMAIL} />
            <a
              href={CV_ASSET_PATH}
              download
              className="text-color-text-muted hidden min-h-11 items-center gap-1.5 text-sm transition-colors hover:text-white sm:inline-flex"
              aria-label="Download Oscar's resume PDF"
            >
              Resume <span aria-hidden="true">↓</span>
            </a>
          </div>

          <p className="hidden max-w-[36ch] text-right font-mono text-[10px] tracking-wider text-[oklch(93%_0.006_264_/_0.28)] uppercase md:block">
            Systems that work at 2am.
            <br />
            That&apos;s the standard.
          </p>
        </m.div>
      </div>
    </ChapterFrame>
  );
}
