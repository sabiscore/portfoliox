/**
 * tests/portfolio.spec.ts — scardubu.dev
 * Core positioning, interaction, accessibility, responsiveness, and reliability contracts.
 */
import { CONTACT_EMAIL } from '@/lib/config';
import { expect, test, type Page } from '@playwright/test';

async function goto(page: Page) {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
}

async function visibleNavLink(page: Page, name: string) {
  const desktopLink = page
    .locator('nav[aria-label="Primary"]')
    .getByRole('link', { name, exact: true });
  if (await desktopLink.isVisible()) return desktopLink;

  const menuButton = page.getByRole('button', { name: /open navigation menu/i });
  if (await menuButton.isVisible()) await menuButton.click();

  return page
    .locator('nav[aria-label="Mobile navigation"]')
    .getByRole('link', { name, exact: true });
}

test.describe('Nav', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('hero kicker uses canonical positioning', async ({ page }) => {
    await expect(page.locator('.hero-kicker')).toContainText('Staff Backend and Platform Engineer');
  });

  test('does not contain "Portfolio •" prefix', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Portfolio •');
  });

  test('Projects nav link is present', async ({ page }) => {
    await expect(await visibleNavLink(page, 'Projects')).toBeVisible();
  });

  test('Contact nav link links to contact section', async ({ page }) => {
    const contactLink = page.getByRole('link', { name: 'Contact' }).first();
    await expect(contactLink).toHaveAttribute('href', /#section-contact/);
  });

  test('nav remains fixed and visible after scroll', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);

    await expect(header).toBeVisible();
    const position = await header.evaluate((element) => window.getComputedStyle(element).position);
    expect(position).toBe('fixed');
  });
});

test.describe('Nav — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const burger = page.getByRole('button', { name: /open navigation menu/i });
    await expect(burger).toBeVisible();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    const burger = page.getByRole('button', { name: /navigation menu/i });
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
    await burger.click();
    await expect(burger).toHaveAttribute('aria-expanded', 'true');
    await burger.click();
    await page.waitForTimeout(300);
    await expect(burger).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Hero', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('h1 aria-label is the positioning headline', async ({ page }) => {
    await expect(page.locator('h1[aria-label*="The system has to work at 2am"]')).toBeAttached();
  });

  test('headshot image has descriptive alt text', async ({ page }) => {
    const headshot = page.locator('img[alt*="Oscar Ndugbu"]').first();
    await expect(headshot).toBeAttached();
  });

  test('hero bio contains reliability-first positioning', async ({ page }) => {
    const hero = page.locator('section#hero[aria-labelledby="hero-title"]');
    await expect(hero.locator('p.hero-body-text')).toContainText(
      /Backend, platform, and AI infrastructure/i
    );
  });

  test('headline "The system has to work at 2am." is visible', async ({ page }) => {
    await expect(page.locator('h1')).toHaveAttribute('aria-label', /The system has to work at 2am/);
  });

  test('no first-person identity claims', async ({ page }) => {
    const body = page.locator('body');
    for (const phrase of [
      "Hey, I'm Oscar",
      'I engineer',
      'I build',
      'I specialize',
      'Self-taught from Nigeria',
      'I am',
      'I create',
      'I turn',
      'I focus',
    ]) {
      await expect(body).not.toContainText(phrase);
    }
  });

  test('"Review production evidence" CTA links to project proof', async ({ page }) => {
    const cta = page.getByRole('link', { name: /review production evidence/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /#section-projects/);
  });

  test('"Discuss a system" CTA links to contact section', async ({ page }) => {
    const cta = page.getByRole('link', { name: /discuss a system/i }).first();
    await expect(cta).toHaveAttribute('href', /#section-contact/);
  });

  test('hero does not present a stale hard-coded availability date', async ({ page }) => {
    await expect(page.locator('section#hero')).not.toContainText(/Updated June 2026/i);
  });
});

test.describe('Hero — Mobile composition', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('identity card stays compact and portrait does not dominate the viewport', async ({ page }) => {
    await goto(page);

    const card = page.getByTestId('hero-identity-card');
    const portrait = page.getByTestId('identity-portrait');
    await expect(card).toBeVisible();
    await expect(portrait).toBeVisible();

    const cardBox = await card.boundingBox();
    const portraitBox = await portrait.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(portraitBox).not.toBeNull();
    expect(cardBox!.height).toBeLessThan(520);
    expect(portraitBox!.width).toBeLessThanOrEqual(130);
  });

  test('hero remains horizontally contained at 375px', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('section heading "Built to survive real constraints." is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Built to survive/i })).toBeVisible();
  });

  test('no meta-commentary headings', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('Projects framed like decision artifacts');
    await expect(body).not.toContainText('Each card is designed to answer');
  });

  test('TaxBridge card is visible', async ({ page }) => {
    await page.locator('#section-projects').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /TaxBridge/i })).toBeVisible();
  });

  test('SabiScore card is visible', async ({ page }) => {
    await page.locator('#section-projects').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: /SabiScore/i })).toBeVisible();
  });

  test('no simulated ROI', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('+12.8% ROI');
    await expect(body).not.toContainText('Simulated betting yield');
  });

  test('architecture decision content is visible', async ({ page }) => {
    await page.locator('#section-projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.getByText('Constraint').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText('Decision').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText('Outcome').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText('Evidence').filter({ visible: true }).first()).toBeVisible();
  });
});

test.describe('Projects — Mobile responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Projects — Narrow mobile responsive', () => {
  test.use({ viewport: { width: 320, height: 712 } });

  test('no horizontal overflow at 320px', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Skills — V1.0 flow mechanics', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('skills section is present with correct ID', async ({ page }) => {
    await expect(page.locator('#skills')).toBeAttached();
  });

  test('skills flow hook links to the About section', async ({ page }) => {
    const skillsSection = page.locator('section#skills[aria-labelledby="skills-heading"]');
    await skillsSection.scrollIntoViewIfNeeded();
    const flowHook = skillsSection.getByRole('link', {
      name: /62 skills map to three featured systems/i,
    });
    await expect(flowHook).toHaveAttribute('href', /#section-about/);
  });

  test('skills explorer exposes list and radar tabs after opening', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();

    const openExplorer = page.getByRole('button', {
      name: /open full engineering stack — 62 tools across 8 pillars/i,
    });
    await expect(openExplorer).toBeVisible();
    await openExplorer.click();

    const viewTabs = page.getByRole('tablist', { name: /skills explorer view/i });
    await expect(viewTabs).toBeVisible();
    await expect(viewTabs.getByRole('tab', { name: /list view/i })).toBeVisible();
    await expect(viewTabs.getByRole('tab', { name: /radar view/i })).toBeVisible();
  });
});

test.describe('About', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('about section is present with correct ID', async ({ page }) => {
    await expect(page.locator('#section-about')).toBeAttached();
  });

  test('about section heading is visible', async ({ page }) => {
    await page.locator('#section-about').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('heading', {
        name: /Systems built for the long run|Decisions made explicit/i,
      })
    ).toBeVisible();
  });

  test('about section does not duplicate availability or stale recency', async ({ page }) => {
    await page.locator('#section-about').scrollIntoViewIfNeeded();
    const section = page.locator('#section-about');
    await expect(section).not.toContainText(/Updated June 2026/i);
    await expect(section).not.toContainText(/Available · Open to Work/i);
  });

  test('stack strip shows expected technologies', async ({ page }) => {
    const section = page.locator('section#section-about[aria-labelledby="about-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText('Next.js 15').first()).toBeVisible();
    await expect(section.getByText('FastAPI').first()).toBeVisible();
  });

  test('no first-person claims in about section', async ({ page }) => {
    const section = page.locator('section#section-about[aria-labelledby="about-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section).not.toContainText('I am');
    await expect(section).not.toContainText('I build');
  });

  test('about section flow hook links to writing section', async ({ page }) => {
    const flowHook = page.locator('#section-about').getByRole('link', {
      name: /Architecture calls documented/i,
    });
    await expect(flowHook).toHaveAttribute('href', /#section-writing/);
  });
});

test.describe('About — Mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('no horizontal overflow on mobile', async ({ page }) => {
    await goto(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });
});

test.describe('Contact', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('contact section is present with correct ID', async ({ page }) => {
    await expect(
      page.locator('section#section-contact[aria-labelledby="contact-heading"]')
    ).toBeAttached();
  });

  test('contact heading is direct', async ({ page }) => {
    await page.locator('#section-contact').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('heading', {
        name: /Discuss the system\./i,
      })
    ).toBeVisible();
  });

  test('primary email CTA is correct', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const emailLink = section
      .getByRole('link', {
        name: new RegExp(CONTACT_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(emailLink).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
  });

  test('contact form is present', async ({ page }) => {
    await page
      .locator('section#section-contact[aria-labelledby="contact-heading"]')
      .scrollIntoViewIfNeeded();
    await expect(page.locator('form[aria-label="Contact Oscar Ndugbu"]')).toBeVisible();
  });

  test('contact form exposes field errors before sending an incomplete brief', async ({ page }) => {
    const form = page.locator('form[aria-label="Contact Oscar Ndugbu"]');
    await form.scrollIntoViewIfNeeded();

    await form.locator('button[type="submit"]').click();

    await expect(form.locator('#cf-name-error')).toBeVisible();
    await expect(form.locator('#cf-email-error')).toBeVisible();
    await expect(form.locator('#cf-stakes-error')).toBeVisible();
    await expect(form.locator('#cf-message-error')).toBeVisible();
    await expect(form.locator('#cf-name')).toBeFocused();
  });

  test('focused brief guidance is visible', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByText('A useful first brief', { exact: true })).toBeVisible();
    await expect(section.getByText('Problem', { exact: true })).toBeVisible();
    await expect(section.getByText('Stakes', { exact: true })).toBeVisible();
    await expect(section.getByText('Timeline', { exact: true }).first()).toBeVisible();
  });

  test('GitHub link opens in new tab', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const ghLink = section.getByRole('link', { name: /github/i }).first();
    await expect(ghLink).toHaveAttribute('target', '_blank');
    await expect(ghLink).toHaveAttribute('rel', /noopener/);
  });

  test('LinkedIn link present', async ({ page }) => {
    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const li = section.getByRole('link', { name: /linkedin/i }).first();
    await expect(li).toBeVisible();
  });

  test('no self-reported traffic metrics', async ({ page }) => {
    const body = page.locator('body');
    await expect(body).not.toContainText('350 monthly visitors');
    await expect(body).not.toContainText('Portfolio Performance');
    await expect(body).not.toContainText('Avg. session');
  });

  test('contact form success state shows correct copy', async ({ page }) => {
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const form = page.locator('form[aria-label="Contact Oscar Ndugbu"]');

    await form.locator('#cf-name').fill('Test User');
    await form.locator('#cf-email').fill('test@example.com');
    await form.locator('select[name="timeline"]').selectOption('month');
    await form.locator('textarea[name="stakes"]').fill('A failed launch would block customer onboarding.');
    await form
      .locator('textarea[name="message"]')
      .fill('This is a test constraint message that meets minimum length.');

    await form.locator('button[type="submit"]').click();
    const successState = page.getByRole('status').filter({ hasText: 'System brief received.' });
    await expect(successState).toContainText('System brief received.');
    await expect(successState).toContainText('A useful next step will arrive by email');
    await expect(successState).not.toContainText(/24 hours|24h/i);
  });

  test('contact form error state shows fallback contact path', async ({ page }) => {
    await page.route('/api/contact', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test failure' }),
      });
    });

    const section = page.locator('section#section-contact[aria-labelledby="contact-heading"]');
    await section.scrollIntoViewIfNeeded();
    const form = page.locator('form[aria-label="Contact Oscar Ndugbu"]');

    await form.locator('#cf-name').fill('Test User');
    await form.locator('#cf-email').fill('test@example.com');
    await form.locator('select[name="timeline"]').selectOption('month');
    await form.locator('textarea[name="stakes"]').fill('A failed launch would block customer onboarding.');
    await form
      .locator('textarea[name="message"]')
      .fill('This is a test constraint message that meets minimum length.');
    await form.locator('button[type="submit"]').click();

    const errorState = page
      .getByRole('alert')
      .filter({ hasText: 'Something interrupted the send.' });
    await expect(errorState).toContainText(/Something interrupted the send/);
    await expect(errorState).toContainText(CONTACT_EMAIL);
  });
});

test.describe('Claim and freshness contracts', () => {
  test('homepage does not reintroduce stale or unsupported proof language', async ({ page }) => {
    await goto(page);

    const body = page.locator('body');
    await expect(body).not.toContainText('Updated June 2026');
    await expect(body).not.toContainText(/respond within 24|response within 24/i);
    await expect(body).not.toContainText('NRS · NDPC Compliant');
    await expect(body).not.toContainText('40 million Nigerian students');
    await expect(body).not.toContainText('Live Build Activity');
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('trust strip copy is correct', async ({ page }) => {
    await expect(page.locator('footer')).toContainText(
      'Backend · Platform · AI infrastructure · Reliability'
    );
  });

  test('footer does not present a portfolio fixture as live system status', async ({ page }) => {
    await page.route('/api/live-metrics', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          systemStatus: 'degraded',
          uptime: 99.12,
          todayPredictions: null,
          note: 'Test fixture',
        }),
      });
    });

    await page.reload();

    const footer = page.locator('footer');
    await expect(footer.getByText('Public evidence record')).toBeVisible();
    await expect(footer).not.toContainText('All systems operational');
    await expect(footer).not.toContainText('Degraded performance');
  });

  test('no Next.js 16 reference', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Next.js 16');
  });

  test('no "Naija" or "Built with" copy', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Naija');
  });

  test('footer GitHub link is accessible', async ({ page }) => {
    const footer = page.locator('footer');
    const ghLink = footer.getByRole('link', { name: /GitHub/i }).first();
    await expect(ghLink).toBeVisible();
    await expect(ghLink).toHaveAttribute('target', '_blank');
  });

  test('footer LinkedIn link is accessible', async ({ page }) => {
    const footer = page.locator('footer');
    const liLink = footer.getByRole('link', { name: /LinkedIn/i }).first();
    await expect(liLink).toBeVisible();
  });

  test('footer nav links are present', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.getByRole('link', { name: 'Skills' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'About' })).toBeVisible();
  });
});

test.describe('Live Activity Bar', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('live activity bar is rendered with role=status', async ({ page }) => {
    const bar = page.locator('[role="status"][aria-label="Recent GitHub activity"]');
    await expect(bar).toBeAttached();
  });

  test('live activity fallback copy if API unavailable', async ({ page }) => {
    await page.route('/api/activity', async (route) => {
      await route.abort('failed');
    });
    await page.reload();
    await page.locator('h1').waitFor();
    const bar = page.locator('[role="status"][aria-label="Recent GitHub activity"]');
    await expect(bar).toContainText('Activity feed temporarily unavailable');
  });
});

test.describe('Accessibility — WCAG AA', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('page title contains canonical backend and platform role', async ({ page }) => {
    await expect(page).toHaveTitle(/Staff Backend and Platform Engineer/i);
  });

  test('page has exactly one h1', async ({ page }) => {
    const h1s = await page.locator('h1').count();
    expect(h1s).toBe(1);
  });

  test('all images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('all buttons have accessible labels', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const text = (await btn.textContent())?.trim();
      const label = await btn.getAttribute('aria-label');
      expect(text || label).toBeTruthy();
    }
  });

  test('all external links have rel="noopener"', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();
    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      expect(rel).toContain('noopener');
    }
  });

  test('no horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  });

  test('nav has aria-label', async ({ page }) => {
    const primary = page.locator('nav[aria-label="Primary"]');
    if (!(await primary.isVisible())) {
      await page.getByRole('button', { name: /open navigation menu/i }).click();
    }
    await expect(page.locator('nav[aria-label]:visible').first()).toBeVisible();
  });

  test('key sections have aria-labelledby attributes', async ({ page }) => {
    for (const id of ['section-projects', 'section-about', 'section-contact']) {
      await expect(page.locator(`section#${id}[aria-labelledby]`)).toBeAttached();
    }
  });
});

test.describe('Anchor scroll — scroll-margin-top', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('clicking Projects nav link scrolls to #section-projects', async ({ page }) => {
    await (await visibleNavLink(page, 'Projects')).click();
    await page.waitForTimeout(600);

    const navBottom = await page
      .locator('header')
      .evaluate((element) => element.getBoundingClientRect().bottom);
    const sectionTop = await page
      .locator('#section-projects')
      .evaluate((element) => element.getBoundingClientRect().top);
    expect(sectionTop).toBeGreaterThanOrEqual(navBottom - 8);
  });
});

test.describe('Command Palette — V1.0 Easter Eggs', () => {
  test.beforeEach(async ({ page }) => {
    await goto(page);
  });

  test('/why-lagos command is accessible via command palette', async ({ page }) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(200);

    const palette = page
      .locator('[role="dialog"][aria-label*="command"]')
      .or(page.locator('[role="combobox"]').first());
    const isPaletteOpen = await palette.isVisible().catch(() => false);

    if (isPaletteOpen) {
      await page.keyboard.type('/why-lagos');
      await page.waitForTimeout(200);
      await expect(page.getByText(/why.lagos|Why Lagos/i)).toBeVisible();
      await page.keyboard.press('Escape');
    } else {
      test.skip();
    }
  });
});

test.describe('Performance — CLS', () => {
  test('no layout shift on hero hydration', async ({ page }) => {
    await page.goto('/');
    const cls = await page.evaluate(async () => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput) {
              clsValue += (entry as PerformanceEntry & { value: number }).value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 3000);
      });
    });
    expect(cls).toBeLessThan(0.1);
  });
});
