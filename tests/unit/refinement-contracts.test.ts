import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ArchDecision } from '@/components/ArchDecision';
import { BrandWordmark } from '@/components/BrandWordmark';
import { isQualifyingCommitMessage } from '@/components/Liveactivitybar';
import { STATIC_PALETTE_ITEMS, getProjectPaletteCommand } from '@/constants/palette';
import { CV_ASSET_PATH } from '@/lib/config';
import { formatDate } from '@/lib/utils';

const rootDir = resolve(__dirname, '../..');
const read = (relativePath: string) =>
  readFileSync(resolve(rootDir, relativePath), 'utf8');

describe('Production refinement P0/P1 contracts', () => {
  it('filters low-signal maintenance commits and accepts qualifying engineering commits', () => {
    const lowSignalMessages = [
      'Update tailwind.',
      'update css tokens',
      'update deps in lockfile',
      'update readme badges',
      'Update package.json',
      'chore: bump lockfile',
      'chore(deps): upgrade next',
      'style: prettier format',
      'docs: clarify setup',
      'ci: tweak cache key',
      'wip: scratch',
      'Merge pull request #42 from main',
      'format files',
      'lint fixes',
      'refactor(css): tweak spacing',
      'fix typo in header',
      'fix: typo in readme',
      'fix(css): align border',
      'Initial commit',
      'tiny',
      '',
      null,
      undefined,
    ];

    for (const message of lowSignalMessages) {
      expect(
        isQualifyingCommitMessage(message),
        `Expected low-signal rejection for "${String(message)}"`
      ).toBe(false);
    }

    const qualifyingMessages = [
      'feat(api): enforce idempotent retry boundary on fiscal queue',
      'fix(writing): bind related article date to entry frontmatter',
      'perf(pipeline): stream state partitions with bounded Polars batches',
    ];

    for (const message of qualifyingMessages) {
      expect(
        isQualifyingCommitMessage(message),
        `Expected acceptance for "${message}"`
      ).toBe(true);
    }
  });

  it('formats canonical editorial dates deterministically in UTC', () => {
    expect(formatDate('2025-12-08')).toBe('08 Dec 2025');
    expect(formatDate('2025-10-15')).toBe('15 Oct 2025');
  });

  it('prevents duplicate title suffix across root, writing, and work metadata routes', () => {
    const rootLayout = read('app/layout.tsx');
    const writingLayout = read('app/writing/layout.tsx');
    const writingPage = read('app/writing/page.tsx');
    const writingSlug = read('app/writing/[slug]/page.tsx');
    const workSlug = read('app/work/[slug]/page.tsx');

    expect(rootLayout).toContain("template: '%s · Oscar Ndugbu'");
    expect(writingLayout).not.toMatch(/export const metadata/);
    expect(writingPage).toMatch(/^ {2}title: 'Writing',$/m);
    expect(writingPage).not.toMatch(/^ {2}title:\s*'Writing · Oscar Ndugbu'/m);
    expect(writingSlug).toContain('title: post.frontmatter.title,');
    expect(workSlug).toMatch(/return\s*\{[\s\S]{0,120}\btitle,/);
  });

  it('prevents ScardubuSCARDUBU wordmark text duplication in source and rendered markup', () => {
    const navbar = read('components/Navbar.tsx');
    const wordmark = read('components/BrandWordmark.tsx');

    expect(navbar).toContain('aria-label="Oscar Ndugbu — Home"');
    expect(navbar).toContain('<span aria-hidden="true">SCARDUBU</span>');
    expect(wordmark).not.toContain('sr-only');
    expect(wordmark).toContain('aria-label={label}');
    expect(wordmark).toContain('aria-hidden="true"');

    const html = renderToStaticMarkup(React.createElement(BrandWordmark));
    const plainText = html.replace(/<[^>]+>/g, '');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Oscar Ndugbu — Home"');
    expect(html).toContain('aria-hidden="true"');
    expect(plainText).toBe('SCARDUBU');
    expect(plainText).not.toMatch(/ScardubuSCARDUBU/i);
  });

  it('unifies all resume links onto the canonical CV_ASSET_PATH and redirects legacy PDF path', () => {
    expect(CV_ASSET_PATH).toBe('/cv/oscar-ndugbu-resume.pdf');
    for (const file of [
      'components/Navbar.tsx',
      'components/HeroSection.tsx',
      'components/IdentityCard.tsx',
      'components/ContactSection.tsx',
      'components/Footer.tsx',
      'components/CommandPalette.tsx',
      'constants/palette.ts',
    ]) {
      const source = read(file);
      expect(source, `${file} should import CV_ASSET_PATH`).toContain('CV_ASSET_PATH');
      expect(source, `${file} must not hardcode legacy resume path`).not.toContain(
        'oscar-scardubu-resume.pdf'
      );
    }

    const nextConfig = read('next.config.ts');
    expect(nextConfig).toContain("source: '/oscar-scardubu-resume.pdf'");
    expect(nextConfig).toContain("destination: '/cv/oscar-ndugbu-resume.pdf'");
  });

  it('renders semantic dl/dt/dd with sr-only colon separators in ArchDecision', () => {
    const html = renderToStaticMarkup(
      React.createElement(ArchDecision, {
        title: 'Record linkage strategy',
        chosen: 'Blocking + probabilistic record linkage (dedupe.io)',
        over: 'Exact-match deduplication on school_name',
        rationale: 'School names vary across 36 state ministry submissions.',
      })
    );
    const plainText = html.replace(/<[^>]+>/g, '');

    expect(html).toContain('<dl');
    expect(html).toContain('<dt');
    expect(html).toContain('<dd');
    expect(html).toContain('<span class="sr-only">: </span>');
    expect(plainText).toContain('Chosen: Blocking + probabilistic record linkage (dedupe.io)');
    expect(plainText).toContain('Over: Exact-match deduplication on school_name');
    expect(plainText).not.toContain('ChosenBlocking');
    expect(plainText).not.toContain('OverExact-match');
  });

  it('enforces uniform flagship CTA geometry and responsive secondary case-study grid', () => {
    const projects = read('components/ProjectsSection.tsx');

    expect(projects).toContain('sm:flex-row sm:flex-wrap sm:items-center');
    expect(projects).toContain('min-h-11 w-full');
    expect(projects).toContain('sm:w-auto');
    expect(projects).toContain(
      'grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3'
    );
  });

  it('enforces token-only Tailwind styling and primary/secondary CTA hierarchy on Hero and IdentityCard', () => {
    const upgradedFiles = [
      'components/HeroSection.tsx',
      'components/IdentityCard.tsx',
      'components/IdentityCardMotion.tsx',
      'components/identityCardStyles.ts',
      'components/CopyEmail.tsx',
      'components/cinematic/HeroPortraitShader.tsx',
    ];
    const arbitraryUtilityPattern = /\b(?:bg|text|border|min-h|min-w|max-w|grid-cols|aspect|tracking|z)-\[[^\]]+\]/;

    for (const file of upgradedFiles) {
      const source = read(file);
      expect(source, `${file} must not use arbitrary Tailwind bracket tokens`).not.toMatch(
        arbitraryUtilityPattern
      );
    }

    const identity = read('components/IdentityCard.tsx');
    expect(identity).toContain('<CopyEmail');
    expect(identity).toContain('variant="primary"');
    expect(identity).toContain('oscar-headshot.jpg');
    expect(identity).toContain('identity-portrait-scrim');
  });

  it('keeps command palette work routes, identity anchor, and canonical CV entry synchronized', () => {
    expect(getProjectPaletteCommand('yap-engine')?.href).toBe('/work/yap-engine');
    expect(getProjectPaletteCommand('swarmxq')?.href).toBe('/work/swarmxq');
    expect(getProjectPaletteCommand('sabiscore')?.href).toBe('/work/sabiscore');
    expect(getProjectPaletteCommand('taxbridge')?.href).toBe('/work/taxbridge');
    expect(STATIC_PALETTE_ITEMS.some((item) => item.href === '/#identity')).toBe(true);
    expect(STATIC_PALETTE_ITEMS.some((item) => item.href === CV_ASSET_PATH)).toBe(true);
  });
});
