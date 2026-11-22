import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CodeBlockClient } from '@/components/CodeBlockClient';
import { extractMarkdownHeadings, slugifyHeading } from '@/lib/content';
import { getRelatedWorkForWriting, getRelatedWritingSlugsForWork } from '@/lib/work-meta';

const rootDir = resolve(__dirname, '../..');
const read = (relativePath: string) => readFileSync(resolve(rootDir, relativePath), 'utf8');

describe('Patch 02 secondary-route polish, ergonomics, and token contracts', () => {
  it('slugifies markdown headings to match rehype-slug / github-slugger anchor IDs', () => {
    expect(
      slugifyHeading('Key decision: FastAPI + Redis Pub/Sub over synchronous REST with polling')
    ).toBe('key-decision-fastapi--redis-pubsub-over-synchronous-rest-with-polling');

    expect(slugifyHeading('Why "we will add reliability later" fails')).toBe(
      'why-we-will-add-reliability-later-fails'
    );

    const extracted = extractMarkdownHeadings(`
## Overview

\`\`\`python
## not a heading inside code
\`\`\`

## Trade-offs
## Trade-offs
`);
    expect(extracted).toEqual([
      { id: 'overview', text: 'Overview' },
      { id: 'trade-offs', text: 'Trade-offs' },
      { id: 'trade-offs-1', text: 'Trade-offs' },
    ]);
  });

  it('maintains bidirectional mapping between engineering notes and case studies', () => {
    expect(getRelatedWorkForWriting('building-sabiscore').map((item) => item.slug)).toEqual([
      'sabiscore',
    ]);
    expect(getRelatedWorkForWriting('taxbridge-compliance-architecture')[0]?.slug).toBe(
      'taxbridge'
    );
    expect(getRelatedWritingSlugsForWork('sabiscore')).toContain('building-sabiscore');
    expect(getRelatedWritingSlugsForWork('sabiscore')).toContain('production-ml-reliability');
    expect(getRelatedWritingSlugsForWork('taxbridge')).toContain(
      'taxbridge-compliance-architecture'
    );
  });

  it('renders CodeBlockClient with accessible copy button, live status, and token styling', () => {
    const html = renderToStaticMarkup(
      React.createElement(CodeBlockClient, {
        code: 'const ready = true;',
        language: 'ts',
      })
    );

    expect(html).toContain('TS');
    expect(html).toContain('COPY');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('bg-obsidian-surface');
    expect(html).not.toContain('obsidian-border');
  });

  it('removes deprecated unreferenced server action app/actions/contact.ts', () => {
    expect(existsSync(resolve(rootDir, 'app/actions/contact.ts'))).toBe(false);
  });

  it('enforces pure Obsidian Nocturne v2 tokens without arbitrary brackets on Patch 02 surfaces', () => {
    const files = [
      'app/writing/page.tsx',
      'app/writing/[slug]/page.tsx',
      'app/work/[slug]/page.tsx',
      'app/not-found.tsx',
      'app/error.tsx',
      'components/CodeBlockClient.tsx',
      'components/ArticleOutline.tsx',
      'components/ArchDecision.tsx',
      'components/Footer.tsx',
      'components/shared/StaticSectionIntro.tsx',
      'mdx-components.tsx',
    ];

    const arbitraryClassRegex =
      /\b(?:bg|text|border|min-h|min-w|max-w|grid-cols|aspect|tracking|shadow|transition|z|p|px|py|m|mt|mb|gap|rounded|w|h)-\[[^\]]+\]/;
    const deadLegacyTokenRegex =
      /\b(?:obsidian-border|obsidian-text|obsidian-muted|obsidian-dim|obsidian-elevated|bg-illuminate-cyan|text-caption|tracking-telemetry)\b/;

    for (const file of files) {
      const source = read(file);
      expect(source, `${file} contains arbitrary Tailwind brackets`).not.toMatch(
        arbitraryClassRegex
      );
      expect(source, `${file} references dead legacy tokens`).not.toMatch(deadLegacyTokenRegex);
      expect(source, `${file} uses low-contrast text-zinc-500`).not.toContain('text-zinc-500');
    }
  });
});
