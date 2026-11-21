import { expect, test } from '@playwright/test';

test('recruiter journey moves from hero to projects to contact', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Systems you can trust at 2\s*AM/i,
    })
  ).toBeVisible();
  await page.getByRole('link', { name: /Explore selected work/i }).click();
  await expect(page).toHaveURL(/#projects/);
  await expect(page.locator('#projects')).toBeAttached();

  await expect(
    page.getByRole('heading', { level: 2, name: /Built around\s+real constraints\./i })
  ).toBeVisible();
  await expect(page.locator('[data-project-id="sabiscore"]')).toBeVisible();

  await page
    .getByRole('link', { name: /contact/i })
    .first()
    .click();
  await expect(page).toHaveURL(/#contact/);
  await expect(page.locator('#contact')).toBeAttached();
  await expect(page.getByRole('heading', { level: 2, name: /Discuss a system\./i })).toBeVisible();
});
