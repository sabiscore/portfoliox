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
    await expect(nav.getByRole('link', { name: /FAILURE MODES/i })).toHaveAttribute(
      'href',
      '/#failure-modes'
    );
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

    await expect(page.getByRole('link', { name: /INSPECT_SYSTEM_ARCHITECTURE/i })).toHaveAttribute(
      'href',
      '#deployments'
    );
    await expect(page.getByRole('link', { name: /READ_ENGINEERING_MONOGRAPHS/i })).toHaveAttribute(
      'href',
      '/writing'
    );
    await expect(page.getByLabel('Staff Backend and Platform Engineer profile')).toBeVisible();
    await expect(page.locator(`a[href="/cv/oscar-ndugbu-resume.pdf"]`).first()).toBeVisible();
  });

  test('architecture index switches project records without claiming live telemetry', async ({ page }) => {
    await gotoHome(page);

    const index = page.locator('#architecture-index');
    await expect(
      index.getByRole('heading', { name: 'Systems, constraints, and implementation choices' })
    ).toBeVisible();
    await expect(index).toContainText('not a live production monitor');

    const yapNode = index.getByRole('button', { name: /Yap Engine/i });
    await yapNode.click();
    await expect(yapNode).toHaveAttribute('aria-pressed', 'true');
    await expect(index).toContainText('content-addressed inputs');
    await expect(index).toContainText('No throughput or production latency SLO is claimed here.');
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
    await form.getByRole('button', { name: /DISPATCH ARCHITECTURAL BRIEF/i }).click();

    await expect(form.getByRole('alert')).toContainText('SCHEMA_VALIDATION_ERROR');
  });

  test('contact form displays its acknowledgement after a successful dispatch', async ({
    page,
  }) => {
    await gotoHome(page);
    await page.route('**/api/contact', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    const form = page.locator('#contact form');
    await form.locator('#contact-name').fill('Ada Okafor');
    await form.locator('#contact-email').fill('ada@example.com');
    await form.locator('#contact-message').fill(
      'Please review our payment reconciliation architecture and recovery plan.'
    );
    await form.getByRole('button', { name: /DISPATCH ARCHITECTURAL BRIEF/i }).click();

    await expect(form.getByRole('status')).toContainText('ACK_RECEIVED');
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
    await form.locator('#contact-message').fill(
      'Please review our payment reconciliation architecture and recovery plan.'
    );
    await form.getByRole('button', { name: /DISPATCH ARCHITECTURAL BRIEF/i }).click();

    await expect(form.getByRole('alert')).toContainText('TRANSMISSION_FALLBACK');
    await expect(page.locator(`a[href="mailto:${CONTACT_EMAIL}"]`)).toBeVisible();
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
