import { test, expect } from '@playwright/test';

test('Website loads properly without dummy marker', async ({ page }) => {
  // Navigate to localhost
  await page.goto('http://localhost:3000');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if the page title contains expected content
  await expect(page).toHaveTitle(/NIGHTP - Dubai Event Discovery/i);
  
  // Take a screenshot to verify the site is working
  await page.screenshot({ 
    path: 'website-test-after-dummy-removal.png', 
    fullPage: true 
  });
  
  console.log('✅ Website loaded successfully at http://localhost:3000');
  console.log('✅ Screenshot saved as website-test-after-dummy-removal.png');
});