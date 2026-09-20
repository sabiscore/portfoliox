import { expect, test } from '@playwright/test';

test('recruiter journey moves from hero to projects to contact', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /The system has to work at 2am/i,
    })
  ).toBeVisible();
  await page.getByRole('link', { name: 'Review production evidence' }).click();
  await expect(page).toHaveURL(/#section-projects/);
  await expect(page.locator('#section-projects')).toBeAttached();

  await expect(
    page.getByRole('heading', { level: 2, name: /Built around\s+real constraints\./i })
  ).toBeVisible();
  await expect(page.locator('[data-project-id="sabiscore"]')).toBeVisible();

  await page.getByRole('link', { name: 'Contact' }).first().click();
  await expect(page).toHaveURL(/#section-contact/);
  await expect(page.locator('#section-contact')).toBeAttached();
  await expect(
    page.getByRole('heading', { level: 2, name: /Discuss the system\./i })
  ).toBeVisible();
});
