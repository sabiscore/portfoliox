'use client';

import React, { useState, useCallback } from 'react';

interface InquiryPayload {
  name: string;
  email: string;
  scope: string;
  message: string;
}

const INITIAL_PAYLOAD: InquiryPayload = {
  name: '',
  email: '',
  scope: 'Fintech / Compliance Architecture',
  message: '',
};

const ARCHITECTURAL_SCOPES: ReadonlyArray<string> = [
  'Fintech / Compliance Architecture',
  'Quantitative ML & Out-of-Core Pipelines',
  'Zero-USD Edge AI / Conversational Commerce',
  'Advisory / Principal Engineering Role',
];

export function ContactSection(): React.JSX.Element {
  const [formState, setFormState] = useState<InquiryPayload>(INITIAL_PAYLOAD);
  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SENT' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const directEmail = 'oscar@scardubu.dev';

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(directEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(false);
    }
  }, [directEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();
    const trimmedMessage = formState.message.trim();

    if (trimmedName.length < 2 || !trimmedEmail.includes('@') || trimmedMessage.length < 10) {
      setStatus('ERROR');
      setErrorMessage(
        'SCHEMA_VALIDATION_ERROR: Provide a valid name, email address, and architectural brief (min 10 chars).'
      );
      return;
    }

    setStatus('SUBMITTING');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          subject: formState.scope,
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP_${response.status}`);
      }

      setStatus('SENT');
      setFormState(INITIAL_PAYLOAD);
    } catch {
      setStatus('ERROR');
      setErrorMessage(
        'TRANSMISSION_FALLBACK: Endpoint rate-limited or offline. Copy direct email below to dispatch immediately.'
      );
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-section-heading"
      className="w-full bg-[#08090C] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10"
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Direct Dispatch & Operating Window */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#00D9FF]">
              03 // INITIATE CHANNEL
            </div>
            <h2
              id="contact-section-heading"
              className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
            >
              Discuss a system.
            </h2>
            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
              Available for Staff/Principal backend architecture engagements, quantitative research systems, and high-throughput fintech infrastructure across Nigeria and global remote teams.
            </p>
          </div>

          <div className="border border-white/15 bg-[#0E0E10]/90 backdrop-blur-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-white/60">
                DIRECT TELEMETRY ENDPOINT
              </span>
              <span className="font-mono text-[11px] font-semibold text-[#00FF66]">
                ● WAT (UTC+1)
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs text-white/50">PRIMARY ELECTRONIC MAIL</div>
              <div className="font-mono text-sm sm:text-base font-bold text-white break-all">
                {directEmail}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="min-h-[44px] flex-1 px-4 inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#00D9FF] bg-[#08090C] font-mono text-xs font-semibold uppercase tracking-wider text-white hover:text-[#00D9FF] transition-colors"
              >
                <span>{copiedEmail ? 'COPIED TO CLIPBOARD ✓' : 'COPY ADDRESS'}</span>
              </button>

              <a
                href={`mailto:${directEmail}`}
                className="min-h-[44px] px-4 inline-flex items-center justify-center gap-2 border border-[#00D9FF]/40 bg-[#00D9FF]/10 font-mono text-xs font-semibold uppercase tracking-wider text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-colors"
              >
                <span>MAIL CLIENT ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Fail-Closed Architectural Brief Form */}
        <div className="lg:col-span-7 border border-white/15 bg-[#0E0E10]/90 backdrop-blur-xl p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-xs uppercase tracking-wider text-white/75"
                >
                  NAME // IDENTIFIER *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Adaobi Okafor"
                  className="min-h-[44px] w-full border border-white/15 focus:border-[#00D9FF] bg-[#08090C] px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-xs uppercase tracking-wider text-white/75"
                >
                  RETURN ENDPOINT (EMAIL) *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="cto@organization.com"
                  className="min-h-[44px] w-full border border-white/15 focus:border-[#00D9FF] bg-[#08090C] px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-scope"
                className="block font-mono text-xs uppercase tracking-wider text-white/75"
              >
                SYSTEM DOMAIN
              </label>
              <select
                id="contact-scope"
                name="scope"
                value={formState.scope}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, scope: e.target.value }))
                }
                className="min-h-[44px] w-full border border-white/15 focus:border-[#00D9FF] bg-[#08090C] px-3.5 py-2.5 font-mono text-sm text-white focus:outline-none"
              >
                {ARCHITECTURAL_SCOPES.map((scopeOption) => (
                  <option key={scopeOption} value={scopeOption} className="bg-[#08090C] text-white">
                    {scopeOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-message"
                className="block font-mono text-xs uppercase tracking-wider text-white/75"
              >
                CONSTRAINTS &amp; OBJECTIVES *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                value={formState.message}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Outline throughput targets, regulatory constraints, or system bottlenecks..."
                className="w-full border border-white/15 focus:border-[#00D9FF] bg-[#08090C] p-3.5 font-mono text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            {status === 'ERROR' && (
              <div
                role="alert"
                className="border border-red-500/50 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-300"
              >
                {errorMessage}
              </div>
            )}

            {status === 'SENT' && (
              <div
                role="status"
                className="border border-[#00FF66]/50 bg-[#00FF66]/10 px-4 py-3 font-mono text-xs text-[#00FF66]"
              >
                ACK_RECEIVED: Architectural inquiry logged deterministically.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'SUBMITTING'}
              className="min-h-[48px] w-full px-6 inline-flex items-center justify-center gap-2 border border-[#00D9FF] bg-[#00D9FF] text-[#08090C] font-mono text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-[#00D9FF]/90 disabled:opacity-50 transition-colors"
            >
              <span>
                {status === 'SUBMITTING'
                  ? 'TRANSMITTING PAYLOAD...'
                  : 'DISPATCH ARCHITECTURAL BRIEF →'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
