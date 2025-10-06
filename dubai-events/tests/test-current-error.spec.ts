import { test, expect } from '@playwright/test';

test('Check current error state', async ({ page }) => {
  // Log all console messages and network requests
  page.on('console', msg => {
    console.log(`BROWSER LOG: ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('response', response => {
    console.log(`NETWORK: ${response.url()} - ${response.status()}`);
  });
  
  page.on('requestfailed', request => {
    console.log(`FAILED REQUEST: ${request.url()} - ${request.failure()?.errorText}`);
  });
  
  // Go to the page
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  
  // Wait a bit for everything to load
  await page.waitForTimeout(3000);
  
  // Check what's currently visible
  const hasError = await page.locator('text=Error Loading Venues').isVisible();
  const hasLoading = await page.locator('text=Loading Venues').isVisible();
  const hasMap = await page.locator('[data-testid="map"]').isVisible().catch(() => false);
  
  console.log(`\nCURRENT STATE:`);
  console.log(`- Error visible: ${hasError}`);
  console.log(`- Loading visible: ${hasLoading}`);
  console.log(`- Map visible: ${hasMap}`);
  
  if (hasError) {
    const errorText = await page.locator('.text-muted-foreground').textContent();
    console.log(`- Error message: ${errorText}`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'current-error-state.png', fullPage: true });
  console.log('Screenshot saved as current-error-state.png');
  
  // Also check the network tab for any failed requests
  console.log('\nWaiting 5 more seconds to catch any delayed requests...');
  await page.waitForTimeout(5000);
});