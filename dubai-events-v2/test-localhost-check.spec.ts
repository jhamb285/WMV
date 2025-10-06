import { test, expect } from '@playwright/test';

test('Check if localhost:3000 is accessible', async ({ page }) => {
  try {
    // Try to navigate to localhost:3000
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });

    // Take a screenshot for verification
    await page.screenshot({ 
      path: 'localhost-accessibility-test.png', 
      fullPage: true 
    });

    // Check if page loaded successfully
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Check for common elements that should be present
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    console.log('✅ localhost:3000 is accessible');
  } catch (error) {
    console.log(`❌ Error accessing localhost:3000: ${error.message}`);
    throw error;
  }
});