'use client';

import { useActionState, useState } from 'react';
// TODO(wire-existing): Verify exported action name & ContactActionState shape in app/actions/contact.ts
import {
  submitContactForm,
  type ContactActionState,
} from '@/app/actions/contact';

export interface ContactSectionProps {
  email?: string;
  responseWindow?: string;
  sectionId?: string;
}

const INITIAL_STATE: ContactActionState = {
  status: 'idle',
  message: '',
  fieldErrors: {},
};

const INQUIRY_TYPES = [
  'Staff / Senior Engineering Role',
  'Architecture & Reliability Advisory',
  'Quantitative ML / Data Platform Build',
  'Technical Collaboration',
] as const;

export function ContactSection({
  email = 'oscar@scardubu.dev',
  responseWindow = 'Typically responds within 24 hours (UTC+1)',
  sectionId = 'contact',
}: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    INITIAL_STATE,
  );

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: focus mailto link naturally if clipboard API is restricted
      setCopied(false);
    }
  }

  const nameError = state.fieldErrors?.name?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const messageError = state.fieldErrors?.message?.[0];

  return (
    <section
      id={sectionId}
      aria-labelledby="contact-section-heading"
      className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24"
    >
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-cyan-400">
          Direct Channel
        </p>
        <h2
          id="contact-section-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl lg:text-4xl"
        >
          Discuss a system
        </h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">
          Share the problem space, constraints, or role scope. {responseWindow}.
        </p>
      </header>

      {/* Low-Friction Direct Email Copy Bar */}
      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-950/90 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            Direct Email
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-1 inline-block break-all font-mono text-sm font-medium text-zinc-100 underline-offset-4 hover:text-cyan-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:text-base"
          >
            {email}
          </a>
        </div>

        <button
          type="button"
          onClick={handleCopyEmail}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-zinc-900 px-4 py-2 font-mono text-xs font-medium text-zinc-100 transition-colors duration-200 hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 motion-reduce:transition-none"
        >
          {copied ? 'Copied to Clipboard' : 'Copy Email'}
        </button>

        <span role="status" aria-live="polite" className="sr-only">
          {copied ? `Copied ${email} to clipboard` : ''}
        </span>
      </div>

      {/* Scoped Inquiry Form */}
      <form
        action={formAction}
        noValidate
        className="mt-6 rounded-xl border border-white/10 bg-zinc-950/90 p-5 sm:p-7"
      >
        {/* Top Pair: Stacks cleanly on mobile (1 col -> 2 cols on sm+) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="block font-mono text-xs uppercase tracking-wider text-zinc-300"
            >
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'contact-name-error' : undefined}
              className="mt-2 block min-h-11 w-full rounded-lg border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            />
            {nameError && (
              <p
                id="contact-name-error"
                className="mt-1.5 font-mono text-xs text-rose-400"
              >
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block font-mono text-xs uppercase tracking-wider text-zinc-300"
            >
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'contact-email-error' : undefined}
              className="mt-2 block min-h-11 w-full rounded-lg border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
            />
            {emailError && (
              <p
                id="contact-email-error"
                className="mt-1.5 font-mono text-xs text-rose-400"
              >
                {emailError}
              </p>
            )}
          </div>
        </div>

        {/* Scope Selector */}
        <div className="mt-5">
          <label
            htmlFor="contact-scope"
            className="block font-mono text-xs uppercase tracking-wider text-zinc-300"
          >
            Engagement Scope
          </label>
          <select
            id="contact-scope"
            name="scope"
            defaultValue={INQUIRY_TYPES[0]}
            className="mt-2 block min-h-11 w-full rounded-lg border border-white/15 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
          >
            {INQUIRY_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Technical Context */}
        <div className="mt-5">
          <label
            htmlFor="contact-message"
            className="block font-mono text-xs uppercase tracking-wider text-zinc-300"
          >
            System Context &amp; Goals
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Briefly outline the architecture, team, or timeline."
            aria-invalid={Boolean(messageError)}
            aria-describedby={
              messageError ? 'contact-message-error' : undefined
            }
            className="mt-2 block w-full rounded-lg border border-white/15 bg-zinc-900 px-3.5 py-3 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 focus:border-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
          />
          {messageError && (
            <p
              id="contact-message-error"
              className="mt-1.5 font-mono text-xs text-rose-400"
            >
              {messageError}
            </p>
          )}
        </div>

        {/* Submission Feedback */}
        <div role="status" aria-live="polite" className="mt-4 min-h-5">
          {state.status === 'success' && (
            <p className="font-mono text-xs text-emerald-300">
              {state.message || 'Message received. I will follow up shortly.'}
            </p>
          )}
          {state.status === 'error' && state.message && (
            <p className="font-mono text-xs text-rose-400">{state.message}</p>
          )}
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 font-mono text-xs font-semibold text-zinc-950 transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto motion-reduce:transition-none"
        >
          {isPending ? 'Sending...' : 'Send Inquiry'}
        </button>
      </form>
    </section>
  );
}

export default ContactSection;
