import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const rootDir = resolve(__dirname, '../..');
const read = (relativePath: string) => readFileSync(resolve(rootDir, relativePath), 'utf8');

describe('Current portfolio geometry and accessibility contracts', () => {
  it('keeps the mobile navigation control keyboard-accessible and touch-sized via design tokens', () => {
    const navbar = read('components/Navbar.tsx');
    const tailwindConfig = read('tailwind.config.js');
    const buttonStart = navbar.indexOf('<button');
    const buttonEnd = navbar.indexOf('</button>', buttonStart);
    const mobileMenuButton =
      buttonStart >= 0 && buttonEnd > buttonStart ? navbar.slice(buttonStart, buttonEnd) : '';

    expect(tailwindConfig).toContain("touch: '44px'");
    expect(mobileMenuButton).toContain('onClick={toggleMobileMenu}');
    expect(mobileMenuButton).toContain('aria-expanded={isMobileMenuOpen}');
    expect(mobileMenuButton).toContain('aria-controls="mobile-navigation-drawer"');
    expect(mobileMenuButton).toContain('min-h-touch');
    expect(mobileMenuButton).toContain('min-w-touch');
    expect(navbar).toContain(
      "aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}"
    );
    expect(navbar).toContain('id="mobile-navigation-drawer"');
  });

  it('keeps the capabilities matrix responsive and semantically labelled', () => {
    const skills = read('components/SkillsSection.tsx');

    expect(skills).toContain('id="capabilities"');
    expect(skills).toContain('aria-labelledby="capabilities-heading"');
    expect(skills).toContain('id="capabilities-heading"');
    expect(skills).toContain('grid grid-cols-1 gap-4 md:grid-cols-2');
    expect(skills).toContain('domain.items.map');
    expect(skills).toContain('<ul className="space-y-2">');
  });

  it('keeps the editorial route data-driven and links articles to canonical slugs', () => {
    const writingPage = read('app/writing/page.tsx');

    expect(writingPage).toContain('getWritingPosts()');
    expect(writingPage).toContain('href={`/writing/${featured.slug}`}');
    expect(writingPage).toContain('href={`/writing/${post.slug}`}');
    expect(writingPage).toContain('headingId="writing-list-heading"');
  });

  it('keeps both hero calls to action at a 48px minimum height via design tokens', () => {
    const hero = read('components/HeroSection.tsx');
    const tailwindConfig = read('tailwind.config.js');

    expect(tailwindConfig).toContain("cta: '48px'");
    expect(tailwindConfig).toContain("touch: '44px'");

    const inspectIndex = hero.indexOf('href="#projects"');
    const inspectStart = hero.lastIndexOf('<Link', inspectIndex);
    const inspectEnd = hero.indexOf('</Link>', inspectIndex);
    const inspectCta =
      inspectIndex >= 0 && inspectStart >= 0 && inspectEnd > inspectStart
        ? hero.slice(inspectStart, inspectEnd)
        : '';

    const writingIndex = hero.indexOf('href="/writing"');
    const writingStart = hero.lastIndexOf('<Link', writingIndex);
    const writingEnd = hero.indexOf('</Link>', writingIndex);
    const writingCta =
      writingIndex >= 0 && writingStart >= 0 && writingEnd > writingStart
        ? hero.slice(writingStart, writingEnd)
        : '';

    expect(inspectCta).toContain('href="#projects"');
    expect(inspectCta).toContain('min-h-cta');
    expect(inspectCta).toContain('min-w-touch');
    expect(writingCta).toContain('href="/writing"');
    expect(writingCta).toContain('min-h-cta');
    expect(writingCta).toContain('min-w-touch');
  });

  it('keeps the identity ledger portrait, editorial frame, and 2x2 capability symmetry compliant', () => {
    const identity = read('components/IdentityCard.tsx');
    const identityStyles = read('components/identityCardStyles.ts');
    const hero = read('components/HeroSection.tsx');

    expect(identity).toContain('aria-label="Staff Backend and Platform Engineer profile"');
    expect(identity).toContain("const PORTRAIT_ASSET_PATH = '/images/oscar-headshot.jpg';");
    expect(identity).toContain('const PORTRAIT_WIDTH = 240;');
    expect(identity).toContain('const PORTRAIT_HEIGHT = 300;');
    expect(identity).toContain('priority');
    expect(identity).toContain('IDENTITY_CARD_PROFILE_GRID_CLASSNAME');
    expect(identity).toContain('IDENTITY_CARD_PORTRAIT_CLASSNAME');
    expect(identityStyles).toContain('grid-cols-profile-mobile');
    expect(identityStyles).toContain('aspect-portrait');

    // Enforce balanced 3-term capability rows across all 4 quadrants
    expect(hero).toContain(
      "{ label: 'AI systems', terms: ['Local GGUF', 'Inference', 'Model pipelines'] }"
    );
  });

  it('keeps the app-level theme tokens and dark color-scheme contract', () => {
    const globalsCss = read('app/globals.css');
    const layout = read('app/layout.tsx');

    expect(globalsCss).toContain('--bg-oled-base: #08090c;');
    expect(globalsCss).toContain('--accent-cyan: #00d9ff;');
    expect(globalsCss).toContain('color-scheme: dark;');
    expect(layout).toContain('<meta name="color-scheme" content="dark" />');
  });

  it('prevents horizontal overflow at the document boundary', () => {
    const fixesCss = read('app/fixes.css');
    const globalsCss = read('app/globals.css');

    expect(fixesCss).toContain('html,');
    expect(fixesCss).toContain('body {');
    expect(fixesCss).toContain('overflow-x: hidden;');
    expect(globalsCss).toContain('overflow-x: hidden;');
  });

  it('keeps pnpm runtime and native build-script approvals explicit', () => {
    const packageJson = JSON.parse(read('package.json')) as {
      packageManager: string;
      engines: { node: string };
      pnpm?: unknown;
    };
    const workspace = read('pnpm-workspace.yaml');

    expect(packageJson.packageManager).toBe('pnpm@10.34.9');
    expect(packageJson.engines.node).toBe('22.x');
    expect(packageJson.pnpm).toBeUndefined();
    expect(workspace).toContain('strictDepBuilds: true');
    expect(workspace).toContain('allowBuilds:');
    for (const dependency of ['esbuild', 'sharp', 'unrs-resolver']) {
      expect(workspace).toContain(`  ${dependency}: true`);
    }
    expect(workspace).not.toContain('dangerouslyAllowAllBuilds');
  });
});
