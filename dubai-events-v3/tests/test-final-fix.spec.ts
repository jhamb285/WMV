import { test, expect } from '@playwright/test';

test('Test final fix for venue loading', async ({ page }) => {
  // Log all console messages
  page.on('console', msg => {
    console.log(`BROWSER: ${msg.text()}`);
  });
  
  // Log network requests
  page.on('response', response => {
    if (response.url().includes('/api/venues')) {
      console.log(`API CALL: ${response.url()} - ${response.status()}`);
    }
  });
  
  console.log('🔄 Testing with improved error handling...');
  await page.goto('http://localhost:3000');
  
  // Wait for loading to complete
  await page.waitForTimeout(5000);
  
  // Check the current state
  const hasError = await page.locator('text=Error Loading Venues').isVisible();
  const hasLoading = await page.locator('text=Loading Venues').isVisible();
  
  console.log(`\n📊 FINAL STATUS:`);
  console.log(`- Error visible: ${hasError}`);
  console.log(`- Loading visible: ${hasLoading}`);
  
  if (hasError) {
    const errorText = await page.locator('.text-muted-foreground').textContent();
    console.log(`- Error message: "${errorText}"`);
  }
  
  // Take a screenshot of the current state
  await page.screenshot({ 
    path: 'final-fix-test.png', 
    fullPage: true 
  });
  
  console.log('✅ Screenshot saved as final-fix-test.png');
});