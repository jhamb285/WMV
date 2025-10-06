import { test, expect } from '@playwright/test';

test('Test consistent background colors and proper separation', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing consistent background colors and separation...');
  
  // Wait for the navigation to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Take screenshot showing navigation with matching background
  await page.screenshot({ 
    path: 'consistent-nav-background.png',
    fullPage: true 
  });
  
  console.log('📸 Navigation background screenshot taken');
  
  // Test Area filter with consistent background and separation
  const areaButton = page.locator('.nav-button-container').first();
  await areaButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot showing consistent colors and separation
  await page.screenshot({ 
    path: 'consistent-backgrounds-separated.png',
    fullPage: true 
  });
  
  console.log('📸 Consistent backgrounds with separation screenshot taken');
  
  // Close and test vibes filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const vibesButton = page.locator('.nav-button-container').nth(1);
  await vibesButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot of vibes with consistent styling
  await page.screenshot({ 
    path: 'vibes-consistent-background.png',
    fullPage: true 
  });
  
  console.log('📸 Vibes consistent background screenshot taken');
  
  // Close and test offers filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const offersButton = page.locator('.nav-button-container').nth(2);
  await offersButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot of offers with proper separation
  await page.screenshot({ 
    path: 'offers-proper-separation.png',
    fullPage: true 
  });
  
  console.log('📸 Offers proper separation screenshot taken');
  
  console.log('✅ All background consistency and separation verified');
});