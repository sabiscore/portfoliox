// Production smoke suite for the current App Router portfolio.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser, type Page } from '@playwright/test';

import { CONTACT_EMAIL } from '@/lib/config';

async function goto(page: Page): Promise<void> {
  const response = await page.goto('/');
  expect(response?.ok(), 'Homepage should return a successful HTTP response').toBe(true);
  await page.waitForLoadState('load');
}

async function expectNoOverflowAtWidth(browser: Browser, width: number): Promise<void> {
  const context = await browser.newContext({ viewport: { width, height: 812 } });

  try {
    const page = await context.newPage();
    const response = await page.goto('/');
    expect(response?.ok(), `Homepage should load successfully at ${width}px`).toBe(true);
    await page.waitForLoadState('load');

    const hasHorizontalOverflow = await page.evaluate(() => {
      const documentElement = document.documentElement;
      const documentWidth = Math.max(
        documentElement.scrollWidth,
        document.body?.scrollWidth ?? 0
      );
      return documentWidth > documentElement.clientWidth;
    });

    expect(
      hasHorizontalOverflow,
      `Horizontal overflow detected at a viewport width of ${width}px`
    ).toBe(false);
  } finally {
    await context.close();
  }
}

test.describe('Production portfolio smoke tests', () => {
  test('skip navigation is the first keyboard focus target', async ({ page }) => {
    await goto(page);

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
  });

  test('homepage renders the current positioning and one primary heading', async ({ page }) => {
    await goto(page);

    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Systems you can trust at'
    );
    await expect(page.locator('body')).toContainText(
      'STAFF BACKEND & PLATFORM ENGINEER'
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  });

  test('root theme defaults to dark semantics', async ({ page }) => {
    await goto(page);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');
    expect(
      await page.evaluate(() => document.documentElement.classList.contains('light'))
    ).toBe(false);
  });

  test('home has no horizontal overflow at supported mobile widths', async ({ browser }) => {
    for (const width of [320, 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
      await expectNoOverflowAtWidth(browser, width);
    }
  });

  test('primary navigation exposes the projects destination', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The desktop route links are replaced by the mobile drawer.');
    await goto(page);

    const navigation = page.getByRole('navigation', { name: 'Primary system navigation' });
    const projectsLink = navigation.getByRole('link', { name: /PROJECTS/i });
    await expect(projectsLink).toBeVisible();
    await expect(projectsLink).toHaveAttribute('href', '/#projects');
  });

  test('mobile navigation opens and closes with accessible state', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is scoped to the mobile navigation layout.');
    await goto(page);

    const menuButton = page.getByRole('button', { name: 'Open navigation menu' });
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-navigation-drawer')).toBeVisible();

    await page.getByRole('button', { name: 'Close navigation menu' }).click();
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  test('architecture selection uses an accessible live region without claiming live telemetry', async ({ page }) => {
    await goto(page);

    const architectureIndex = page.locator('#architecture-index');
    const announcement = architectureIndex.locator('[aria-live="polite"][aria-atomic="true"]');
    await expect(announcement).toBeVisible();
    await expect(architectureIndex).toContainText('not a live production monitor');

    const yapEngine = architectureIndex.getByRole('button', { name: /Yap Engine/i });
    await yapEngine.click();
    await expect(yapEngine).toHaveAttribute('aria-pressed', 'true');
    await expect(announcement).toContainText('content-addressed inputs');
  });

  test('representative routes have no serious or critical accessibility violations', async ({
    page,
  }) => {
    for (const route of [
      '/',
      '/writing',
      '/work/sabiscore',
      '/writing/building-sabiscore',
    ]) {
      const response = await page.goto(route);
      expect(response?.ok(), `${route} should return a successful HTTP response`).toBe(true);
      await page.waitForLoadState('load');

      const results = await new AxeBuilder({ page }).include('body').analyze();
      const blockingViolations = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical'
      );
      expect(blockingViolations, `${route} has serious or critical Axe violations`).toEqual([]);
    }
  });

  test('main landmark and primary architecture sections are present', async ({ page }) => {
    await goto(page);

    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('#architecture-index')).toBeAttached();
    await expect(page.locator('#deployments')).toBeAttached();
  });

  test('contact section exposes the canonical email and labelled brief form', async ({ page }) => {
    await goto(page);

    const section = page.locator('section#contact[aria-labelledby="contact-section-heading"]');
    await expect(section).toBeAttached();
    await expect(section.getByRole('heading', { name: 'Discuss a system.' })).toBeVisible();
    await expect(section.locator(`a[href="mailto:${CONTACT_EMAIL}"]`)).toBeVisible();
    await expect(section.locator('#contact-name')).toHaveAccessibleName(/NAME \/\/ IDENTIFIER/i);
    await expect(section.locator('#contact-email')).toHaveAccessibleName(/RETURN ENDPOINT/i);
    await expect(section.locator('#contact-scope')).toHaveAccessibleName(/SYSTEM DOMAIN/i);
    await expect(section.locator('#contact-message')).toHaveAccessibleName(/CONSTRAINTS & OBJECTIVES/i);
  });

  test('resume link points to the canonical PDF asset', async ({ page }) => {
    await goto(page);
    const resumeLink = page.locator('a[href="/cv/oscar-ndugbu-resume.pdf"]').first();
    await expect(resumeLink).toBeVisible();
    await expect(resumeLink).toHaveAttribute('target', '_blank');
  });

  test('all seven published case studies resolve from the MDX content registry', async ({ page }) => {
    const caseStudies = [
      '/work/taxbridge',
      '/work/sabiscore',
      '/work/swarmxq',
      '/work/yap-engine',
      '/work/hashablanca',
      '/work/ubec',
      '/work/ml-consulting',
    ];

    for (const route of caseStudies) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should resolve`).toBe(200);
      await expect(page.locator('main#main-content h1')).toBeVisible();
      await expect(page.locator('main#main-content h1')).not.toBeEmpty();
    }
  });

  test('writing index renders on its dedicated route', async ({ page }) => {
    const response = await page.goto('/writing');
    expect(response?.ok(), 'Writing index should return a successful HTTP response').toBe(true);
    await page.waitForLoadState('load');

    await expect(
      page.getByRole('heading', { name: /Writing that makes engineering decisions clear/i })
    ).toBeVisible();
    await expect(page.getByText(/articles$/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Read article/i }).first()).toHaveAttribute(
      'href',
      /\/writing\//
    );
  });

  test('all external target-blank links include noopener and noreferrer', async ({ page }) => {
    await goto(page);

    const targetBlankLinks = page.locator('a[target="_blank"]');
    await expect(targetBlankLinks).not.toHaveCount(0);
    const relTokens = await targetBlankLinks.evaluateAll((nodes) =>
      nodes.map((node) =>
        (node.getAttribute('rel') ?? '')
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
      )
    );

    for (const tokens of relTokens) {
      expect(tokens).toContain('noopener');
      expect(tokens).toContain('noreferrer');
    }
  });

  test('activity API returns uncached JSON with a relative-time field', async ({ page }) => {
    await goto(page);

    const response = await page.request.get('/api/activity');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()['cache-control']).toContain('no-store');

    const body: unknown = await response.json();
    expect(body).toEqual(expect.objectContaining({ ago: expect.any(String) }));
  });

  test('footer renders its current operating statement and external destinations', async ({ page }) => {
    await goto(page);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(
      'BACKEND SYSTEMS · PLATFORM INFRASTRUCTURE · AI ENGINEERING'
    );
    await expect(footer.getByRole('link', { name: /GITHUB/i })).toHaveAttribute(
      'href',
      'https://github.com/scardubu'
    );
    await expect(footer.getByRole('link', { name: /SABISCORE.APP/i })).toHaveAttribute(
      'href',
      'https://sabiscore.app'
    );
  });
});
