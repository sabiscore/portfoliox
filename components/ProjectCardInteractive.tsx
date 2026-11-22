'use client';

import React, { useId, useRef, useState } from 'react';

export interface FlowStage {
  readonly code: string;
  readonly label: string;
  readonly boundary: string;
  readonly failurePrevented: string;
}

export interface ProjectCardNarrativeProps {
  readonly title: string;
  readonly ownership: string;
  readonly consumerSummary: string;
  readonly problemSolved: string;
  readonly verifiableProof: string;
  readonly constraint: string;
  readonly decision: string;
  readonly chosen: string;
  readonly over: string;
  readonly evidence: string;
}

type ViewMode = 'plain' | 'technical';

export function ProjectCardNarrative({
  title,
  ownership,
  consumerSummary,
  problemSolved,
  verifiableProof,
  constraint,
  decision,
  chosen,
  over,
  evidence,
}: Readonly<ProjectCardNarrativeProps>): React.JSX.Element {
  const [mode, setMode] = useState<ViewMode>('plain');
  const baseId = useId();
  const plainTabRef = useRef<HTMLButtonElement>(null);
  const techTabRef = useRef<HTMLButtonElement>(null);

  const plainTabId = `${baseId}-plain-tab`;
  const techTabId = `${baseId}-tech-tab`;
  const plainPanelId = `${baseId}-plain-panel`;
  const techPanelId = `${baseId}-tech-panel`;

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'End') {
      event.preventDefault();
      setMode('technical');
      techTabRef.current?.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'Home') {
      event.preventDefault();
      setMode('plain');
      plainTabRef.current?.focus();
    }
  };

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <p className="font-mono text-2xs uppercase tracking-wider text-zinc-400">{ownership}</p>
        <div
          role="tablist"
          aria-label={`${title} explanation depth`}
          className="inline-flex border border-white/15 bg-obsidian-base p-0.5"
        >
          <button
            ref={plainTabRef}
            id={plainTabId}
            type="button"
            role="tab"
            aria-selected={mode === 'plain'}
            aria-controls={plainPanelId}
            tabIndex={mode === 'plain' ? 0 : -1}
            onClick={() => setMode('plain')}
            onKeyDown={handleTabKeyDown}
            className={`min-h-chip px-2.5 py-1 font-mono text-2xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-reduce:transition-none ${
              mode === 'plain'
                ? 'bg-accent-cyan text-obsidian-base'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Plain English
          </button>
          <button
            ref={techTabRef}
            id={techTabId}
            type="button"
            role="tab"
            aria-selected={mode === 'technical'}
            aria-controls={techPanelId}
            tabIndex={mode === 'technical' ? 0 : -1}
            onClick={() => setMode('technical')}
            onKeyDown={handleTabKeyDown}
            className={`min-h-chip px-2.5 py-1 font-mono text-2xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-reduce:transition-none ${
              mode === 'technical'
                ? 'bg-accent-cyan text-obsidian-base'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Under the hood
          </button>
        </div>
      </div>

      <div className="card-panel-stable mt-4">
        <div
          id={plainPanelId}
          role="tabpanel"
          aria-labelledby={plainTabId}
          hidden={mode !== 'plain'}
        >
          <p className="max-w-prose text-sm leading-6 text-zinc-200 sm:text-base sm:leading-7">
            {consumerSummary}
          </p>
          <dl className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <div>
              <dt className="font-mono text-2xs font-bold uppercase tracking-domain text-accent-cyan">
                Problem solved
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300">{problemSolved}</dd>
            </div>
            <div>
              <dt className="font-mono text-2xs font-bold uppercase tracking-domain text-accent-cyan">
                What holds up
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300">{verifiableProof}</dd>
            </div>
          </dl>
        </div>

        <div
          id={techPanelId}
          role="tabpanel"
          aria-labelledby={techTabId}
          hidden={mode !== 'technical'}
        >
          <dl className="space-y-3">
            <div>
              <dt className="font-mono text-2xs font-bold uppercase tracking-domain text-accent-cyan">
                Operating constraint
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300">{constraint}</dd>
            </div>
            <div>
              <dt className="font-mono text-2xs font-bold uppercase tracking-domain text-accent-cyan">
                Architecture decision
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300">{decision}</dd>
            </div>
            <div>
              <dt className="font-mono text-2xs font-bold uppercase tracking-domain text-accent-cyan">
                Key trade-off
              </dt>
              <dd className="mt-1 text-sm leading-6 text-zinc-300">
                <strong className="font-semibold text-white">Chosen:</strong> {chosen}{' '}
                <span className="text-zinc-400">over</span> {over}.
              </dd>
            </div>
            <div className="border-t border-white/10 pt-3">
              <dt className="font-mono text-2xs font-semibold uppercase tracking-domain text-zinc-400">
                Evidence scope
              </dt>
              <dd className="mt-1 text-xs leading-5 text-zinc-300">{evidence}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export interface FailureFlowStepperProps {
  readonly projectTitle: string;
  readonly stages: readonly FlowStage[];
}

export function FailureFlowStepper({
  projectTitle,
  stages,
}: Readonly<FailureFlowStepperProps>): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex] ?? stages[0];

  if (!activeStage) return <></>;

  return (
    <div className="mb-4 border-b border-white/10 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-2xs font-semibold uppercase tracking-domain text-accent-cyan">
          System flow
        </p>
        <span className="font-mono text-2xs uppercase tracking-wider text-zinc-400">
          Design boundary
        </span>
      </div>

      <ol
        aria-label={`${projectTitle} failure-containment stages`}
        className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-3"
      >
        {stages.map((stage, index) => {
          const isSelected = index === activeIndex;
          return (
            <li key={stage.code}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveIndex(index)}
                className={`flex min-h-touch w-full flex-col items-start justify-center border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan motion-reduce:transition-none ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/10 text-white'
                    : 'border-white/10 bg-obsidian-surface text-zinc-300 hover:border-white/25 hover:text-white'
                }`}
              >
                <span className="font-mono text-2xs text-accent-cyan">{stage.code}</span>
                <span className="mt-0.5 font-mono text-xs font-semibold leading-tight">
                  {stage.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        role="region"
        aria-live="polite"
        aria-label={`${projectTitle} stage boundary detail`}
        className="mt-2.5 border-l-2 border-accent-cyan/60 bg-obsidian-surface px-3 py-2.5"
      >
        <p className="font-mono text-micro font-semibold text-white">{activeStage.boundary}</p>
        <p className="mt-1 text-xs leading-5 text-zinc-300">{activeStage.failurePrevented}</p>
      </div>
    </div>
  );
}
