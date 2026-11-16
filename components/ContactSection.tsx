"use client";

import React, { useState } from "react";
import {
  Terminal,
  Send,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  FileText,
} from "lucide-react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const ADVISORY_SCOPES = [
  "Distributed Backend & Platform Architecture",
  "AI / ML Infrastructure (<512MB / Low-Latency)",
  "Fintech Compliance & Multi-Tenant RLS Audit",
  "Staff / Principal Engineering Advisory",
] as const;

export const ContactSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState<string>(ADVISORY_SCOPES[0]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const directEmail = "oscar@scardubu.dev";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(directEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fail-closed fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMsg("All required contract fields must be populated.");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: scope,
          message: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Endpoint returned non-200 status.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg(
        "Direct dispatch interrupted. Use the one-tap email copy or mailto link.",
      );
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-obsidian-border bg-obsidian-base"
    >
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Advisory Context & Direct Endpoints */}
          <div className="lg:col-span-5">
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-caption uppercase tracking-telemetry">
              <span className="font-semibold text-accent-cyan">04</span>
              <span className="text-obsidian-muted">DISCUSS A SYSTEM</span>
            </div>

            <h2
              id="contact-heading"
              className="mb-3 font-sans text-3xl font-bold tracking-tight text-obsidian-text sm:text-4xl"
            >
              Initiate an architectural review.
            </h2>

            <p className="mb-6 font-sans text-sm leading-relaxed text-obsidian-muted sm:text-base">
              Available for Staff/Principal Backend &amp; Platform roles,
              high-reliability infrastructure consulting, and architectural
              reviews for early-stage fintech and AI teams.
            </p>

            {/* Direct Telemetry Card */}
            <div className="mb-4 rounded-xl border border-obsidian-border bg-obsidian-surface p-4">
              <div className="mb-2 font-mono text-micro uppercase tracking-telemetry text-obsidian-dim">
                DIRECT DISPATCH ENDPOINT
              </div>

              <div className="flex items-center justify-between gap-2 rounded-lg border border-obsidian-border bg-obsidian-elevated px-3 py-2.5">
                <a
                  href={`mailto:${directEmail}`}
                  className="truncate font-mono text-caption text-accent-cyan hover:underline"
                >
                  {directEmail}
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy direct email address"
                  className="inline-flex min-h-pill items-center gap-1.5 rounded border border-obsidian-border bg-obsidian-surface px-2.5 py-1 font-mono text-micro text-obsidian-text transition-colors hover:border-accent-emerald hover:text-accent-emerald"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-accent-emerald" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-obsidian-muted" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Downloadable Engineering Dossier / Resume */}
            <a
              href="/cv/oscar-ndugbu-resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-touch w-full items-center justify-between rounded-xl border border-obsidian-border bg-obsidian-surface px-4 py-3 font-mono text-caption text-obsidian-text transition-colors hover:border-accent-cyan hover:text-accent-cyan"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-accent-emerald" />
                <span>Download Engineering Resume (PDF)</span>
              </span>
              <span className="text-micro text-obsidian-dim">VERIFIED</span>
            </a>
          </div>

          {/* Right Column: Touch-Safe Intake Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface p-5 sm:p-6"
            >
              <div
                className="absolute inset-x-0 top-0 h-px bg-illuminate-dual"
                aria-hidden="true"
              />

              <div className="mb-5 flex items-center justify-between border-b border-obsidian-border pb-3">
                <span className="inline-flex items-center gap-2 font-mono text-micro uppercase tracking-telemetry text-obsidian-text">
                  <Terminal className="h-3.5 w-3.5 text-accent-cyan" />
                  <span>SYSTEM SPECIFICATION INTAKE</span>
                </span>
                <span className="font-mono text-micro text-accent-emerald">
                  TLS 1.3 · FAIL-CLOSED
                </span>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block font-mono text-micro uppercase tracking-telemetry text-obsidian-muted"
                  >
                    Name / Organization *
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adaobi — CTO, PayStack"
                    className="w-full min-h-touch rounded-lg border border-obsidian-border bg-obsidian-base px-3.5 py-2.5 font-sans text-sm text-obsidian-text placeholder:text-obsidian-dim focus:border-accent-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block font-mono text-micro uppercase tracking-telemetry text-obsidian-muted"
                  >
                    Return Endpoint (Email) *
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full min-h-touch rounded-lg border border-obsidian-border bg-obsidian-base px-3.5 py-2.5 font-mono text-caption text-obsidian-text placeholder:text-obsidian-dim focus:border-accent-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="contact-scope"
                  className="mb-1.5 block font-mono text-micro uppercase tracking-telemetry text-obsidian-muted"
                >
                  Primary Architectural Scope
                </label>
                <select
                  id="contact-scope"
                  name="scope"
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full min-h-touch rounded-lg border border-obsidian-border bg-obsidian-base px-3.5 py-2.5 font-mono text-caption text-obsidian-text focus:border-accent-cyan focus:outline-none"
                >
                  {ADVISORY_SCOPES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block font-mono text-micro uppercase tracking-telemetry text-obsidian-muted"
                >
                  Operational Constraints &amp; Objectives *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your current throughput bottlenecks, latency targets, or compliance requirements..."
                  className="w-full rounded-lg border border-obsidian-border bg-obsidian-base p-3.5 font-sans text-sm text-obsidian-text placeholder:text-obsidian-dim focus:border-accent-cyan focus:outline-none"
                />
              </div>

              {/* Validation & Telemetry Feedback */}
              {status === "error" && (
                <div
                  role="alert"
                  className="mb-4 flex items-center gap-2 rounded-lg border border-accent-cyan bg-obsidian-elevated p-3 font-mono text-micro text-obsidian-text"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-accent-cyan" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {status === "success" && (
                <div
                  role="status"
                  className="mb-4 flex items-center gap-2 rounded-lg border border-accent-emerald bg-obsidian-elevated p-3 font-mono text-micro text-accent-emerald"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>
                    Payload verified and logged. Expect a deterministic response
                    within 24 hours.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex min-h-touch w-full items-center justify-center gap-2 rounded-lg border border-accent-emerald bg-accent-emerald px-6 font-sans text-sm font-semibold text-obsidian-base transition-colors hover:border-accent-cyan hover:bg-accent-cyan disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>
                  {status === "submitting"
                    ? "Dispatching payload..."
                    : "Transmit system inquiry"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
