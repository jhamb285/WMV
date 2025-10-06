import { test, expect } from '@playwright/test';

test('Test darker glass effects on navigation and popups', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing darker glass effects...');
  
  // Wait for the darker glass navigation to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Check if the glass navigation pill is visible
  const glassPill = await page.locator('.glass-nav-pill');
  await expect(glassPill).toBeVisible();
  
  // Take screenshot showing the darker navigation
  await page.screenshot({ 
    path: 'darker-glass-navigation.png',
    fullPage: true 
  });
  
  console.log('📸 Darker glass navigation screenshot taken');
  
  // Test Area filter to see darker popup
  const areaButton = page.locator('.nav-button-container').first();
  await areaButton.click();
  await page.waitForTimeout(500);
  
  // Check if darker popup appeared
  const darkPopup = await page.locator('.dark-glass-popup');
  await expect(darkPopup).toBeVisible();
  
  // Take screenshot with darker popup visible
  await page.screenshot({ 
    path: 'darker-glass-popup.png',
    fullPage: true 
  });
  
  console.log('📸 Darker glass popup screenshot taken');
  
  // Close popup and test another filter
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Test Vibes filter
  const vibesButton = page.locator('.nav-button-container').nth(1);
  await vibesButton.click();
  await page.waitForTimeout(500);
  
  // Take screenshot with vibes popup
  await page.screenshot({ 
    path: 'darker-glass-vibes-popup.png',
    fullPage: true 
  });
  
  console.log('📸 Darker vibes popup screenshot taken');
  
  // Test hover effect on navigation
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  
  await glassPill.hover();
  await page.waitForTimeout(300);
  
  // Take screenshot with hover effect
  await page.screenshot({ 
    path: 'darker-glass-hover.png',
    fullPage: true 
  });
  
  console.log('📸 Darker glass hover effect screenshot taken');
  
  console.log('✅ Darker glass effects test completed');
});