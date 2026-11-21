/**
 * Browser regression suite for the current portfolio App Router.
 * These tests assert user-visible contracts rather than selectors from the
 * retired Skills/About tab layout.
 */
import { expect, test, type Page } from '@playwright/test';

const CONTACT_EMAIL = 'oscar@scardubu.dev';

async function gotoHome(page: Page): Promise<void> {
  const response = await page.goto('/');
  expect(response?.ok(), 'Homepage should load successfully').toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}

test.describe('Current portfolio interactions', () => {
  test('primary navigation exposes current destinations', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The desktop route links are replaced by the mobile drawer.');
    await gotoHome(page);

    const nav = page.getByRole('navigation', { name: 'Primary system navigation' });
    await expect(nav.getByRole('link', { name: /PROJECTS/i })).toHaveAttribute('href', '/#projects');
    await expect(nav.getByRole('link', { name: /ENGINEERING/i })).toHaveAttribute(
      'href',
      '/#failure-modes'
    );
    await expect(nav.getByRole('link', { name: /CONTACT/i })).toHaveAttribute('href', '/#contact');
    await expect(nav.getByRole('link', { name: /WRITING/i })).toHaveAttribute(
      'href',
      '/writing'
    );
  });

  test('mobile navigation opens and closes accessibly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoHome(page);

    const openButton = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(openButton).toBeVisible();
    await expect(openButton).toHaveAttribute('aria-expanded', 'false');
    await openButton.click();

    const closeButton = page.getByRole('button', { name: 'Close navigation menu' });
    await expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-navigation-drawer')).toBeVisible();
    await closeButton.click();
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('hero exposes both primary calls to action and the identity ledger', async ({ page }) => {
    await gotoHome(page);

    const hero = page.locator('section[aria-labelledby="hero-heading"]');
    await expect(hero.getByRole('link', { name: /Explore selected work/i })).toHaveAttribute(
      'href',
      '#projects'
    );
    await expect(hero.getByRole('link', { name: /Read engineering notes/i })).toHaveAttribute(
      'href',
      '/writing'
    );
    await expect(hero).toContainText('Oscar Ndugbu');
    await expect(page.getByLabel('Staff Backend and Platform Engineer profile')).toBeVisible();
    await expect(page.locator(`a[href="/cv/oscar-ndugbu-resume.pdf"]:visible`).first()).toBeVisible();
  });

  test('project secondary links are labelled by what they open', async ({ page }) => {
    await gotoHome(page);

    const projects = page.locator('#projects');
    const sabiscore = projects.locator('article').filter({ hasText: 'SabiScore' });
    await expect(sabiscore.getByRole('link', { name: /Live demo/i })).toHaveAttribute(
      'href',
      'https://sabiscore.app'
    );
    await expect(sabiscore.getByRole('link', { name: /View source/i })).toHaveCount(0);

    const yap = projects.locator('article').filter({ hasText: 'Yap Engine' });
    await expect(yap.getByRole('link', { name: /Read case study/i })).toHaveAttribute(
      'href',
      '/work/yap-engine'
    );
    await expect(yap.getByRole('link', { name: /View source/i })).toHaveAttribute(
      'href',
      'https://github.com/sabiscore/the-yap-engine'
    );
  });

  test('project cards link to their case-study routes', async ({ page }) => {
    await gotoHome(page);

    const projects = page.locator('#projects');
    await expect(projects).toBeAttached();
    await expect(projects.getByRole('heading', { name: 'TaxBridge' })).toBeVisible();
    await expect(projects.getByRole('heading', { name: 'SabiScore' })).toBeVisible();
    await expect(projects.locator('a[href="/work/taxbridge"]')).toHaveCount(1);
    await expect(projects.locator('a[href="/work/sabiscore"]')).toHaveCount(1);
  });

  test('failure-mode section is present and linked to its heading', async ({ page }) => {
    await gotoHome(page);

    const section = page.locator('section#failure-modes');
    await expect(section).toBeAttached();
    await expect(section).toHaveAttribute('aria-labelledby', 'failure-modes-heading');
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('contact form rejects invalid input before sending a request', async ({ page }) => {
    await gotoHome(page);

    const form = page.locator('#contact form');
    await form.locator('#contact-name').fill('A');
    await form.locator('#contact-email').fill('not-an-email');
    await form.locator('#contact-message').fill('short');
    await form.getByRole('button', { name: /SEND INQUIRY/i }).click();

    await expect(form.getByRole('alert')).toContainText('Check the form');
  });

  test('contact form displays its acknowledgement after a successful dispatch', async ({
    page,
  }) => {
    await gotoHome(page);
    await page.route('**/api/contact', async (route) => {
      const payload = route.request().postDataJSON() as Record<string, unknown>;
      expect(payload).toMatchObject({
        name: 'Ada Okafor',
        email: 'ada@example.com',
        scope: 'Backend & Platform Infrastructure',
        inquiryType: 'consulting',
        timeline: 'month',
        stakes: 'Payment reconciliation blocks settlement close.',
      });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    const form = page.locator('#contact form');
    await form.locator('#contact-name').fill('Ada Okafor');
    await form.locator('#contact-email').fill('ada@example.com');
    await form.locator('#contact-inquiry-type').selectOption('consulting');
    await form.locator('#contact-timeline').selectOption('month');
    await form.locator('#contact-scope').selectOption('Backend & Platform Infrastructure');
    await form.locator('#contact-stakes').fill('Payment reconciliation blocks settlement close.');
    await form.locator('#contact-message').fill(
      'Please review our payment reconciliation architecture and recovery plan.'
    );
    await form.getByRole('button', { name: /SEND INQUIRY/i }).click();

    await expect(form.getByRole('status')).toContainText('Message sent');
  });

  test('contact form provides a direct-email fallback when the endpoint fails', async ({
    page,
  }) => {
    await gotoHome(page);
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false }),
      });
    });

    const form = page.locator('#contact form');
    await form.locator('#contact-name').fill('Ada Okafor');
    await form.locator('#contact-email').fill('ada@example.com');
    await form.locator('#contact-inquiry-type').selectOption('consulting');
    await form.locator('#contact-timeline').selectOption('month');
    await form.locator('#contact-scope').selectOption('Backend & Platform Infrastructure');
    await form.locator('#contact-stakes').fill('Payment reconciliation blocks settlement close.');
    await form.locator('#contact-message').fill(
      'Please review our payment reconciliation architecture and recovery plan.'
    );
    await form.getByRole('button', { name: /SEND INQUIRY/i }).click();

    await expect(form.getByRole('alert')).toContainText('could not be sent');
    await expect(page.locator(`#contact a[href="mailto:${CONTACT_EMAIL}"]`)).toBeVisible();
  });

  test('case study routes render their matching project identity', async ({ page }) => {
    for (const [route, title] of [
      ['/work/sabiscore', 'SabiScore'],
      ['/work/taxbridge', 'TaxBridge'],
    ] as const) {
      const response = await page.goto(route);
      expect(response?.ok(), `${route} should load successfully`).toBe(true);
      await expect(page.getByRole('heading', { name: new RegExp(title, 'i') }).first()).toBeVisible();
    }
  });

  test('writing index links to published article routes', async ({ page }) => {
    const response = await page.goto('/writing');
    expect(response?.ok(), 'Writing index should load successfully').toBe(true);

    await expect(
      page.getByRole('heading', { name: /Writing that makes engineering decisions clear/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Read article/i }).first()).toHaveAttribute(
      'href',
      /\/writing\//
    );
  });

  test('homepage remains horizontally contained across the supported viewport matrix', async ({ page }) => {
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await gotoHome(page);
      const hasOverflow = await page.evaluate(
        () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > window.innerWidth
      );
      expect(hasOverflow, `Horizontal overflow at ${width}px`).toBe(false);
    }
  });
});
