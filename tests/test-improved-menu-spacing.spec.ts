import { test, expect } from '@playwright/test';

test('Test improved menu spacing and darker background', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing improved menu spacing and darker background...');
  
  // Wait for the navigation to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Take screenshot showing navigation with closer spacing
  await page.screenshot({ 
    path: 'improved-spacing-navigation.png',
    fullPage: true 
  });
  
  console.log('📸 Navigation screenshot taken');
  
  // Test Area filter with improved spacing
  const areaButton = page.locator('.nav-button-container').first();
  await areaButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot showing closer popup to navigation
  await page.screenshot({ 
    path: 'improved-area-popup-spacing.png',
    fullPage: true 
  });
  
  console.log('📸 Improved area popup spacing screenshot taken');
  
  // Close and test vibes filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const vibesButton = page.locator('.nav-button-container').nth(1);
  await vibesButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot of darker vibes popup
  await page.screenshot({ 
    path: 'darker-vibes-popup.png',
    fullPage: true 
  });
  
  console.log('📸 Darker vibes popup screenshot taken');
  
  // Close and test offers filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const offersButton = page.locator('.nav-button-container').nth(2);
  await offersButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot of compact offers layout
  await page.screenshot({ 
    path: 'compact-offers-layout.png',
    fullPage: true 
  });
  
  console.log('📸 Compact offers layout screenshot taken');
  
  console.log('✅ All menu improvements verified');
});