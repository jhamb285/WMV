import { test, expect } from '@playwright/test';

test('Test clean filter menus without headings and white text', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing clean filter menus without headings...');
  
  // Wait for the navigation to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Take screenshot showing white text on navigation
  await page.screenshot({ 
    path: 'white-text-navigation.png',
    fullPage: true 
  });
  
  console.log('📸 White text navigation screenshot taken');
  
  // Test Area filter - should open without heading
  const areaButton = page.locator('.nav-button-container').first();
  await areaButton.click();
  await page.waitForTimeout(500);
  
  // Check that there's no heading in the popup
  const selectAreaHeading = await page.locator('h3:has-text("Select Area")');
  const hasHeading = await selectAreaHeading.isVisible().catch(() => false);
  console.log('Area heading removed (should be false):', hasHeading);
  
  // Take screenshot of clean area filter
  await page.screenshot({ 
    path: 'clean-area-filter-no-heading.png',
    fullPage: true 
  });
  
  console.log('📸 Clean area filter screenshot taken');
  
  // Close and test vibes filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const vibesButton = page.locator('.nav-button-container').nth(1);
  await vibesButton.click();
  await page.waitForTimeout(500);
  
  // Check that there's no vibes heading
  const selectVibesHeading = await page.locator('h3:has-text("Select Vibes")');
  const hasVibesHeading = await selectVibesHeading.isVisible().catch(() => false);
  console.log('Vibes heading removed (should be false):', hasVibesHeading);
  
  // Take screenshot of clean vibes filter
  await page.screenshot({ 
    path: 'clean-vibes-filter-no-heading.png',
    fullPage: true 
  });
  
  console.log('📸 Clean vibes filter screenshot taken');
  
  // Close and test offers filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const offersButton = page.locator('.nav-button-container').nth(2);
  await offersButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot of clean offers filter
  await page.screenshot({ 
    path: 'clean-offers-filter-no-heading.png',
    fullPage: true 
  });
  
  console.log('📸 Clean offers filter screenshot taken');
  
  // Test chat filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  const chatButton = page.locator('.nav-button-container').nth(3);
  await chatButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot of clean chat panel
  await page.screenshot({ 
    path: 'clean-chat-panel-no-heading.png',
    fullPage: true 
  });
  
  console.log('📸 Clean chat panel screenshot taken');
  
  console.log('✅ Clean filter menus test completed');
});