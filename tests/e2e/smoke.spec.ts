import { expect, test } from '@playwright/test';

const sections = [
  { name: 'Projects', id: 'section-projects' },
  { name: 'About', id: 'section-about' },
  { name: 'Contact', id: 'section-contact' },
] as const;

test('hero is visible above the fold', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Systems you can trust at 2\s*AM/i,
    })
  ).toBeVisible();
  await expect(page.getByText('Oscar Ndugbu', { exact: true }).first()).toBeVisible();
  await expect(page.locator('section[aria-labelledby="hero-heading"]')).not.toContainText(
    /Updated June 2026/i
  );
});

test('mobile viewport has no horizontal overflow', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Single overflow check is enough on Chromium.');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const hasOverflow = await page.evaluate(() => {
    const startX = window.scrollX;
    window.scrollTo({ left: window.innerWidth * 2, top: window.scrollY, behavior: 'auto' });
    const canScrollHorizontally = window.scrollX > startX;
    window.scrollTo({ left: startX, top: window.scrollY, behavior: 'auto' });
    return canScrollHorizontally;
  });

  expect(hasOverflow).toBe(false);
});

test('all required project cards render', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('[data-project-id="sabiscore"]')).toBeVisible();
  await expect(page.locator('[data-project-id="hashablanca"]')).toBeVisible();
  await expect(page.locator('[data-project-id="taxbridge"]')).toBeVisible();
});

test.skip('nav links scroll to matching sections', async ({ page }) => {
  await page.goto('/');

  const navToggle = page.getByRole('button', {
    name: /Open navigation menu|Close navigation menu/i,
  });
  const isMobileNavigation = await navToggle.isVisible();

  for (const section of sections) {
    if (isMobileNavigation) {
      await navToggle.click();
      await page
        .getByRole('dialog', { name: 'Navigation menu' })
        .getByRole('link', { name: section.name })
        .click();
    } else {
      await page.getByRole('link', { name: section.name }).first().click();
    }

    await expect(page).toHaveURL(new RegExp(`#${section.id}`));
    await expect(page.locator(`#${section.id}`)).toBeAttached();
  }
});

test('all target blank links include noopener noreferrer', async ({ page }) => {
  await page.goto('/');
  // Live metrics/activity requests keep the page busy beyond initial readiness.
  await page.waitForLoadState('load');

  const relValues = await page
    .locator('a[target="_blank"]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('rel') ?? ''));

  for (const rel of relValues) {
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  }
});
