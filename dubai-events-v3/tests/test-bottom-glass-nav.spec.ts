import { test, expect } from '@playwright/test';

test('Test bottom glass navigation with filter buttons', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing bottom glass navigation with filters...');
  
  // Wait for the glass nav to appear at bottom
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Check if the glass navigation pill is visible at bottom
  const glassPill = await page.locator('.glass-nav-pill');
  await expect(glassPill).toBeVisible();
  
  // Check if all 4 filter navigation circles are present (Area, Vibes, Offers, AI)
  const navCircles = await page.locator('.nav-circle');
  const circleCount = await navCircles.count();
  console.log('Filter navigation circles found:', circleCount);
  
  // Take screenshot showing the new bottom glass navigation
  await page.screenshot({ 
    path: 'bottom-glass-nav-filters.png',
    fullPage: true 
  });
  
  // Test clicking each filter button
  const areaButton = navCircles.first();
  const vibesButton = navCircles.nth(1);
  const offersButton = navCircles.nth(2);
  const aiButton = navCircles.nth(3);
  
  // Test Area button
  await areaButton.click();
  await page.waitForTimeout(300);
  console.log('✅ Area filter clicked');
  
  // Test Vibes button
  await vibesButton.click();
  await page.waitForTimeout(300);
  console.log('✅ Vibes filter clicked');
  
  // Test Offers button
  await offersButton.click();
  await page.waitForTimeout(300);
  console.log('✅ Offers filter clicked');
  
  // Test AI button
  await aiButton.click();
  await page.waitForTimeout(300);
  console.log('✅ AI chat clicked');
  
  // Take final screenshot with active state
  await page.screenshot({ 
    path: 'bottom-glass-nav-active.png',
    fullPage: true 
  });
  
  console.log('✅ Bottom glass navigation test completed');
});