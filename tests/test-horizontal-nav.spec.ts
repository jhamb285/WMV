import { test, expect } from '@playwright/test';

test('Verify horizontal navigation bar implementation', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing horizontal navigation bar...');
  
  // Wait for the horizontal nav to appear
  await page.waitForSelector('.horizontal-nav-container', { timeout: 10000 });
  
  // Check if the navigation pill is visible
  const navPill = await page.locator('.horizontal-nav-pill');
  await expect(navPill).toBeVisible();
  
  // Check if all navigation items are present
  const navItems = await page.locator('.nav-item');
  const navItemCount = await navItems.count();
  console.log('Navigation items found:', navItemCount);
  
  // Take screenshot showing the new horizontal navigation
  await page.screenshot({ 
    path: 'horizontal-nav-implementation.png',
    fullPage: true 
  });
  
  // Test hover effects on navigation items
  const firstNavItem = navItems.first();
  await firstNavItem.hover();
  await page.waitForTimeout(500);
  
  // Take screenshot with hover effect
  await page.screenshot({ 
    path: 'horizontal-nav-hover-effect.png',
    fullPage: true 
  });
  
  // Test clicking navigation items
  await firstNavItem.click();
  await page.waitForTimeout(500);
  
  // Take screenshot with active state
  await page.screenshot({ 
    path: 'horizontal-nav-active-state.png',
    fullPage: true 
  });
  
  console.log('✅ Horizontal navigation test completed');
});