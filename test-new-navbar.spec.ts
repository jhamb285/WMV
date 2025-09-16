import { test } from '@playwright/test';

test('Test new dark navbar design', async ({ page }) => {
  console.log('🎨 Testing new dark navbar design...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take screenshot to see new navbar design
  await page.screenshot({ path: 'navbar-new-dark-design.png', fullPage: true });
  console.log('✅ Screenshot taken - check navbar-new-dark-design.png');
});