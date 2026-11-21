import { expect, test } from '@playwright/test';

test.describe('P0/P1 production refinement behavioral & geometry checks', () => {
  test('metadata titles never duplicate the Oscar Ndugbu suffix', async ({ page }) => {
    await page.goto('/writing');
    expect(await page.title()).toBe('Writing · Oscar Ndugbu');

    await page.goto('/writing/swarmxq-agent-orchestration');
    const writingSlugTitle = await page.title();
    expect(writingSlugTitle).toContain('SwarmXQ');
    expect(writingSlugTitle.endsWith(' · Oscar Ndugbu')).toBe(true);
    expect(writingSlugTitle).not.toContain('· Oscar Ndugbu · Oscar Ndugbu');

    await page.goto('/work/ubec');
    expect(await page.title()).toBe('UBEC Data Pipeline · Oscar Ndugbu');
    await expect(page.locator('body')).not.toContainText('Case study. Case study and architecture review.');
  });

  test('navbar brand link exposes a single accessible label without ScardubuSCARDUBU duplication', async ({
    page,
  }) => {
    await page.goto('/');
    const brandLink = page.locator('header nav a[href="/"]').first();
    await expect(brandLink).toHaveAccessibleName('Oscar Ndugbu — Home');
    const rawText = (await brandLink.textContent())?.trim() ?? '';
    expect(rawText).toBe('SCARDUBU');
    expect(rawText).not.toMatch(/ScardubuSCARDUBU/i);
  });

  test('identity card portrait renders headshot.webp with explicit dimensions and zero CLS risk', async ({
    page,
  }) => {
    await page.goto('/');
    const portrait = page
      .locator('#identity img[alt*="Oscar Ndugbu"]')
      .first();
    await expect(portrait).toBeVisible();
    await expect(portrait).toHaveAttribute('width', '64');
    await expect(portrait).toHaveAttribute('height', '64');
    const src = (await portrait.getAttribute('src')) ?? '';
    expect(src).toContain('headshot.webp');
    const naturalWidth = await portrait.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('writing index renders one semantic <time> per article and related SwarmXQ date is 08 Dec 2025', async ({
    page,
  }) => {
    await page.goto('/writing');
    const featuredTimes = await page.locator('main section > article time').count();
    expect(featuredTimes).toBe(1);

    const listRows = page.locator('main ol[aria-label="All articles"] > li');
    const rowCount = await listRows.count();
    expect(rowCount).toBeGreaterThan(0);
    for (let i = 0; i < rowCount; i += 1) {
      await expect(listRows.nth(i).locator('time')).toHaveCount(1);
    }

    await page.goto('/writing/taxbridge-compliance-architecture');
    await expect(page.locator('header time').first()).toHaveText('15 Oct 2025');
    const swarmCard = page
      .locator('aside[aria-labelledby="related-writing-heading"] article')
      .filter({ hasText: 'SwarmXQ' });
    await expect(swarmCard).toHaveCount(1);
    await expect(swarmCard.locator('time')).toHaveAttribute('datetime', '2025-12-08');
    await expect(swarmCard.locator('time')).toHaveText('08 Dec 2025');
  });

  test('flagship CTA geometry, secondary grid, contact stacking, and footer grid hold at 375px, 768px, and 1440px', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop project resizes across the full 375/768/1440 matrix.');

    for (const width of [375, 768, 1440] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      // 1. Flagship CTA buttons: all >= 44px height; full-width at 375px, compact auto-width at 768px/1440px
      const flagshipArticles = page.locator('#projects article[data-project-id]');
      await expect(flagshipArticles).toHaveCount(4);
      for (let i = 0; i < 4; i += 1) {
        const footer = flagshipArticles.nth(i).locator('footer');
        const footerBox = await footer.boundingBox();
        expect(footerBox, `Flagship card ${i} footer box missing at ${width}px`).not.toBeNull();
        const links = footer.locator('a');
        const linkCount = await links.count();
        expect(linkCount).toBeGreaterThanOrEqual(1);

        for (let j = 0; j < linkCount; j += 1) {
          const box = await links.nth(j).boundingBox();
          expect(box, `CTA ${j} on card ${i} missing at ${width}px`).not.toBeNull();
          expect(box!.height, `CTA touch height < 44px at ${width}px`).toBeGreaterThanOrEqual(44);
          if (width === 375) {
            expect(box!.width).toBeGreaterThan(footerBox!.width * 0.8);
          } else {
            expect(
              box!.width,
              `CTA ${j} on card ${i} unexpectedly stretched at ${width}px`
            ).toBeLessThan(260);
          }
        }
      }

      // 2. Secondary case-study grid: 1 col @375, 2 cols @768, 3 cols @1440
      const secondaryItems = page.locator('ul[aria-labelledby="more-case-studies-heading"] > li');
      await expect(secondaryItems).toHaveCount(3);
      const secBoxes = await Promise.all([
        secondaryItems.nth(0).boundingBox(),
        secondaryItems.nth(1).boundingBox(),
        secondaryItems.nth(2).boundingBox(),
      ]);
      const distinctSecCols = new Set(secBoxes.map((b) => Math.round(b!.x))).size;
      const expectedSecCols = width === 375 ? 1 : width === 768 ? 2 : 3;
      expect(distinctSecCols, `Secondary grid column count at ${width}px`).toBe(expectedSecCols);

      // 3. Contact form top inputs stack at 375px and sit side-by-side at 768px/1440px
      const nameBox = await page.locator('#contact-name').boundingBox();
      const emailBox = await page.locator('#contact-email').boundingBox();
      expect(nameBox!.height).toBeGreaterThanOrEqual(44);
      expect(emailBox!.height).toBeGreaterThanOrEqual(44);
      if (width === 375) {
        expect(emailBox!.y).toBeGreaterThan(nameBox!.y + nameBox!.height - 2);
      } else {
        expect(Math.abs(emailBox!.y - nameBox!.y)).toBeLessThan(4);
      }

      // 4. Footer bottom nav: 2 cols @375, 4 cols @768/1440, all links >= 44px, consistent "2 AM"
      const footerEl = page.locator('footer[class*="border-t"]').last();
      await expect(footerEl).toContainText('Systems you can trust at 2 AM.');
      const footerLinks = footerEl.locator('nav a');
      const footerLinkCount = await footerLinks.count();
      expect(footerLinkCount).toBe(8);
      const xs: number[] = [];
      for (let i = 0; i < footerLinkCount; i += 1) {
        const box = await footerLinks.nth(i).boundingBox();
        expect(box!.height, `Footer link ${i} height < 44px at ${width}px`).toBeGreaterThanOrEqual(44);
        xs.push(Math.round(box!.x));
      }
      const distinctFooterCols = new Set(xs).size;
      expect(distinctFooterCols, `Footer column count at ${width}px`).toBe(width === 375 ? 2 : 4);
    }
  });

  test('legacy resume PDF URL redirects permanently to the canonical CV asset', async ({ request }) => {
    const response = await request.get('/oscar-scardubu-resume.pdf', { maxRedirects: 0 });
    expect([301, 308]).toContain(response.status());
    expect(response.headers()['location']).toBe('/cv/oscar-ndugbu-resume.pdf');
  });
});
