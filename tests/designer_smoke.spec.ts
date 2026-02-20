import { test, expect } from '@playwright/test';

test('Stall Map Designer - White Theme Check', async ({ page }) => {
    await page.goto('/admin/designer');

    // Verify white theme
    const canvas = page.locator('.bg-white.shadow-xl');
    await expect(canvas).toBeVisible();

    // Verify modal on click (placeholder)
    // await page.click('.stall-box');
    // await expect(page.locator('text=Edit Stall')).toBeVisible();
});
