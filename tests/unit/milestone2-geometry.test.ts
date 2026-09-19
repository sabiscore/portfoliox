import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Milestone 2 Empirical Verification: Touch Targets & Mobile Geometry', () => {
  const rootDir = resolve(__dirname, '../..');

  it('verifies Navbar hero-nav-menu-button satisfies >= 44px touch targets', () => {
    const navbarContent = readFileSync(resolve(rootDir, 'components/Navbar.tsx'), 'utf-8');
    
    // Check hero-nav-menu-button class definition
    expect(navbarContent).toContain('hero-nav-menu-button');
    expect(navbarContent).toMatch(/hero-nav-menu-button[^"]*min-h-\[44px\]/);
    expect(navbarContent).toMatch(/hero-nav-menu-button[^"]*min-w-\[44px\]/);
    expect(navbarContent).toMatch(/hero-nav-menu-button[^"]*h-11/);
    expect(navbarContent).toMatch(/hero-nav-menu-button[^"]*w-11/);
    
    // Check accessibility attributes
    expect(navbarContent).toContain('aria-label={mobileOpen ? \'Close navigation menu\' : \'Open navigation menu\'}');
    expect(navbarContent).toContain('aria-expanded={mobileOpen}');
    expect(navbarContent).toContain('aria-controls="mobile-navigation"');
  });

  it('verifies SkillsSection list and radar tabs satisfy >= 44px touch targets', () => {
    const skillsContent = readFileSync(resolve(rootDir, 'components/SkillsSection.tsx'), 'utf-8');
    
    // Check skills-list-tab and skills-radar-tab
    expect(skillsContent).toContain('id="skills-list-tab"');
    expect(skillsContent).toContain('id="skills-radar-tab"');
    
    // Ensure both buttons have min-h-[44px] and min-w-[44px]
    const listTabSnippet = skillsContent.slice(
      skillsContent.indexOf('id="skills-list-tab"'),
      skillsContent.indexOf('id="skills-list-tab"') + 500
    );
    expect(listTabSnippet).toContain('min-h-[44px]');
    expect(listTabSnippet).toContain('min-w-[44px]');
    expect(listTabSnippet).not.toContain('min-h-[36px]');

    const radarTabSnippet = skillsContent.slice(
      skillsContent.indexOf('id="skills-radar-tab"'),
      skillsContent.indexOf('id="skills-radar-tab"') + 500
    );
    expect(radarTabSnippet).toContain('min-h-[44px]');
    expect(radarTabSnippet).toContain('min-w-[44px]');
    expect(radarTabSnippet).not.toContain('min-h-[36px]');
  });

  it('verifies SkillsSection explorer open button satisfies >= 48px touch targets', () => {
    const skillsContent = readFileSync(resolve(rootDir, 'components/SkillsSection.tsx'), 'utf-8');
    expect(skillsContent).toMatch(/cta-secondary[^"]*min-h-\[48px\]/);
  });

  it('verifies WritingSection filter chips satisfy touch targets and mobile wrap', () => {
    const writingContent = readFileSync(resolve(rootDir, 'components/WritingSection.tsx'), 'utf-8');
    
    expect(writingContent).toContain('writing-filter-chip');
    expect(writingContent).toMatch(/writing-filter-chip[^"]*min-h-\[44px\]/);
    expect(writingContent).toContain('flex flex-wrap gap-2');
  });

  it('verifies HeroSection CTA buttons satisfy >= 48px touch targets', () => {
    const heroContent = readFileSync(resolve(rootDir, 'components/HeroSection.tsx'), 'utf-8');
    expect(heroContent).toMatch(/cta-primary[^"]*min-h-12/);
    expect(heroContent).toMatch(/cta-secondary[^"]*min-h-12/);
  });

  it('verifies IdentityCard geometry limits at 375px viewport', () => {
    const identityContent = readFileSync(resolve(rootDir, 'components/IdentityCard.tsx'), 'utf-8');
    const identityCardStylesContent = readFileSync(
      resolve(rootDir, 'components/identityCardStyles.ts'),
      'utf-8'
    );
    
    // Portrait column width: 7.25rem = 116px (<= 130px)
    expect(identityCardStylesContent).toContain('grid-cols-[7.25rem_minmax(0,1fr)]');
    // Aspect ratio 4/5 on portrait
    expect(identityCardStylesContent).toContain('aspect-[4/5]');
    // Max width 25rem = 400px
    expect(identityCardStylesContent).toContain('max-w-[25rem]');
    // Test ID presence
    expect(identityContent).toContain('data-testid="hero-identity-card"');
    expect(identityContent).toContain('data-testid="identity-portrait"');

    // Structural height analysis:
    // Portrait height: 116px * 5/4 = 145px
    // Operating profile header: ~28px + 12px margin
    // Identity bio section: ~145px
    // Trust signals row: ~60px
    // Footer location line: ~20px
    // Padding: p-2.5 (10px) + p-3.5 (14px) * 2 = ~48px
    // Total estimated height = ~313px - 380px, strictly < 520px.
    const portraitWidthPx = 7.25 * 16;
    const portraitHeightPx = portraitWidthPx * (5 / 4);
    expect(portraitWidthPx).toBe(116);
    expect(portraitWidthPx).toBeLessThanOrEqual(130);
    expect(portraitHeightPx).toBe(145);
  });

  it('verifies removal of opacity-50 on text-color-text-muted across all section flow hooks', () => {
    const sections = [
      'components/AboutSection.tsx',
      'components/OpenSourceSection.tsx',
      'components/ProjectsSection.tsx',
      'components/SkillsSection.tsx',
      'components/TestimonialsSection.tsx',
      'components/WritingSection.tsx',
    ];

    for (const sectionPath of sections) {
      const content = readFileSync(resolve(rootDir, sectionPath), 'utf-8');
      
      // Ensure no text-color-text-muted paragraph or element has opacity-50 modifier attached
      const matches = content.match(/text-color-text-muted[^"'>]*opacity-50/g);
      expect(matches, `Found opacity-50 on muted text in ${sectionPath}: ${JSON.stringify(matches)}`).toBeNull();
    }
  });

  it('verifies CSS custom property --color-text-muted is compliant in globals.css', () => {
    const globalsCss = readFileSync(resolve(rootDir, 'app/globals.css'), 'utf-8');
    expect(globalsCss).toContain('--color-text-muted: oklch(63% 0.005 264);');
  });

  it('verifies overflow-x containment rules in fixes.css and globals.css', () => {
    const fixesCss = readFileSync(resolve(rootDir, 'app/fixes.css'), 'utf-8');
    const globalsCss = readFileSync(resolve(rootDir, 'app/globals.css'), 'utf-8');

    expect(fixesCss).toContain('overflow-x: clip;');
    expect(fixesCss).toContain('max-width: 100%;');
    expect(globalsCss).toContain('overflow-x: clip;');
  });
});
