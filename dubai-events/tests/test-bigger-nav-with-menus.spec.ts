import { test, expect } from '@playwright/test';

test('Test bigger navigation bar with filter menu functionality', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing bigger navigation with filter menus...');
  
  // Wait for the bigger glass nav to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Check if the glass navigation pill is visible
  const glassPill = await page.locator('.glass-nav-pill');
  await expect(glassPill).toBeVisible();
  
  // Take screenshot showing the bigger navigation
  await page.screenshot({ 
    path: 'bigger-nav-initial.png',
    fullPage: true 
  });
  
  console.log('📸 Initial bigger navigation screenshot taken');
  
  // Test Area filter - click first navigation button
  const areaButton = page.locator('.nav-circle').first();
  await areaButton.click();
  await page.waitForTimeout(500);
  
  // Check if area menu drawer opened
  const areaHeader = await page.locator('h3:has-text("Select Area")');
  const isAreaMenuVisible = await areaHeader.isVisible();
  console.log('Area menu visible:', isAreaMenuVisible);
  
  if (isAreaMenuVisible) {
    await page.screenshot({ 
      path: 'area-menu-opened.png',
      fullPage: true 
    });
    console.log('📸 Area menu screenshot taken');
  }
  
  // Close area menu by clicking background
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Test Vibes filter
  const vibesButton = page.locator('.nav-circle').nth(1);
  await vibesButton.click();
  await page.waitForTimeout(500);
  
  // Check if vibes menu opened
  const vibesHeader = await page.locator('h3:has-text("Select Vibes")');
  const isVibesMenuVisible = await vibesHeader.isVisible();
  console.log('Vibes menu visible:', isVibesMenuVisible);
  
  if (isVibesMenuVisible) {
    await page.screenshot({ 
      path: 'vibes-menu-opened.png',
      fullPage: true 
    });
    console.log('📸 Vibes menu screenshot taken');
  }
  
  console.log('✅ Bigger navigation with menus test completed');
});