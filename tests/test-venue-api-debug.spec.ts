import { test, expect } from '@playwright/test';

test('Debug venue API loading', async ({ page }) => {
  // Navigate to localhost with console logging
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('response', response => {
    console.log('RESPONSE:', response.url(), response.status());
  });
  
  await page.goto('http://localhost:3000');
  
  // Wait for the page to load and check what happens
  await page.waitForTimeout(5000);
  
  // Check if venues loaded
  const errorElement = page.locator('text=Error Loading Venues');
  const loadingElement = page.locator('text=Loading Venues');
  
  const hasError = await errorElement.isVisible().catch(() => false);
  const hasLoading = await loadingElement.isVisible().catch(() => false);
  
  console.log('Has error:', hasError);
  console.log('Has loading:', hasLoading);
  
  if (hasError) {
    const errorText = await page.locator('.text-muted-foreground').textContent();
    console.log('Error text:', errorText);
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'venue-api-debug.png', fullPage: true });
});