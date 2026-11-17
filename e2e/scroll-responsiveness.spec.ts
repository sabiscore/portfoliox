import { devices, expect, test, type Page } from '@playwright/test';

async function gotoHome(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('load');
}

async function waitForEngine(page: Page, expected: 'lenis' | 'native') {
  await page.waitForFunction(
    (engine) => document.documentElement.dataset.scrollEngine === engine,
    expected,
    { timeout: 8_000 }
  );
}

test.describe('Scroll responsiveness contract', () => {
  test.beforeEach(async ({ browserName }) => {
    if (browserName === 'firefox') test.skip();
  });

  test('[desktop] a wheel gesture advances the document without an interception dead zone', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop fine-pointer contract.');

    await gotoHome(page);
    await waitForEngine(page, 'lenis');

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 700);

    await page.waitForFunction(
      (start) => window.scrollY >= Number(start) + 120,
      before,
      { timeout: 2_500 }
    );

    const after = await page.evaluate(() => window.scrollY);
    expect(after - before).toBeGreaterThanOrEqual(120);
  });

  test('[mobile] coarse-pointer devices keep direct native vertical scrolling', async ({ browser }) => {
    const context = await browser.newContext({ ...devices['Pixel 5'] });
    const page = await context.newPage();

    try {
      await gotoHome(page);
      await waitForEngine(page, 'native');

      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'auto' }));
      await page.waitForFunction(() => window.scrollY >= 300, undefined, { timeout: 2_000 });

      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(300);
      expect(
        await page.evaluate(() => document.documentElement.dataset.scrollCinemaRuntime)
      ).toBeUndefined();
    } finally {
      await context.close();
    }
  });

  test('[desktop] hash navigation reveals the projects heading below the sticky nav', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop hash-navigation contract.');

    await gotoHome(page);
    await waitForEngine(page, 'lenis');

    await page
      .locator('nav[aria-label="Primary system navigation"]')
      .getByRole('link', { name: /PROJECTS/i })
      .click();
    await expect(page).toHaveURL(/#projects$/);

    await page.waitForFunction(
      () => {
        const target = document.getElementById('projects');
        const heading = document.getElementById('projects-section-heading');
        const nav = document.querySelector<HTMLElement>('header.sticky');
        if (!target || !heading || !nav) return false;

        const navBottom = nav.getBoundingClientRect().bottom;
        const headingRect = heading.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        // Hash navigation succeeds when the requested chapter is actually in the
        // viewport and its labelled destination remains fully readable below the
        // fixed navigation. Do not couple this contract to editorial top-padding:
        // section rhythm may change without changing navigation correctness.
        return (
          targetRect.bottom > navBottom &&
          headingRect.top >= navBottom &&
          headingRect.top < window.innerHeight &&
          headingRect.bottom <= window.innerHeight
        );
      },
      undefined,
      { timeout: 5_000 }
    );
  });
});
