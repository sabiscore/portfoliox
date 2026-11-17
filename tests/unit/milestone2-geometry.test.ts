import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const rootDir = resolve(__dirname, '../..');
const read = (relativePath: string) =>
  readFileSync(resolve(rootDir, relativePath), 'utf8');

describe('Current portfolio geometry and accessibility contracts', () => {
  it('keeps the mobile navigation control keyboard-accessible and touch-sized', () => {
    const navbar = read('components/Navbar.tsx');
    const buttonStart = navbar.indexOf('<button');
    const buttonEnd = navbar.indexOf('</button>', buttonStart);
    const mobileMenuButton =
      buttonStart >= 0 && buttonEnd > buttonStart
        ? navbar.slice(buttonStart, buttonEnd)
        : '';

    expect(mobileMenuButton).toContain('onClick={toggleMobileMenu}');
    expect(mobileMenuButton).toContain('aria-expanded={isMobileMenuOpen}');
    expect(mobileMenuButton).toContain('aria-controls="mobile-navigation-drawer"');
    expect(mobileMenuButton).toContain('min-h-[44px]');
    expect(mobileMenuButton).toContain('min-w-[44px]');
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
    expect(writingPage).toContain('id="writing-list-heading"');
  });

  it('keeps both hero calls to action at a 48px minimum height', () => {
    const hero = read('components/HeroSection.tsx');

    const inspectIndex = hero.indexOf('INSPECT_SYSTEM_ARCHITECTURE');
    const inspectStart = hero.lastIndexOf('<Link', inspectIndex);
    const inspectEnd = hero.indexOf('</Link>', inspectIndex);
    const inspectCta = hero.slice(inspectStart, inspectEnd);

    const writingIndex = hero.indexOf('READ_ENGINEERING_MONOGRAPHS');
    const writingStart = hero.lastIndexOf('<Link', writingIndex);
    const writingEnd = hero.indexOf('</Link>', writingIndex);
    const writingCta = hero.slice(writingStart, writingEnd);

    expect(inspectCta).toContain('href="#deployments"');
    expect(inspectCta).toContain('min-h-[48px]');
    expect(inspectCta).toContain('min-w-[44px]');
    expect(writingCta).toContain('href="/writing"');
    expect(writingCta).toContain('min-h-[48px]');
    expect(writingCta).toContain('min-w-[44px]');
  });

  it('keeps the identity ledger portrait and profile grid within their mobile geometry', () => {
    const identity = read('components/IdentityCard.tsx');
    const styles = read('components/identityCardStyles.ts');

    expect(identity).toContain('aria-label="Principal Architect Identity Ledger"');
    expect(identity).toContain('IDENTITY_CARD_PROFILE_GRID_CLASSNAME');
    expect(identity).toContain('IDENTITY_CARD_PORTRAIT_CLASSNAME');
    expect(styles).toContain('grid-cols-[7.25rem_minmax(0,1fr)]');
    expect(styles).toContain('aspect-[4/5]');
    expect(styles).toContain('max-w-[25rem]');
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
});
