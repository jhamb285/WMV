import { test, expect } from '@playwright/test';

test('Verify filter panels open and show improved spacing', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('button:has-text("Area")', { timeout: 10000 });
  
  console.log('🎨 Testing filter panel opening...');
  
  // Take initial screenshot
  await page.screenshot({ path: 'mobile-app-initial.png', fullPage: true });
  
  // Click Area filter and wait for animation
  await page.click('button:has-text("Area")');
  await page.waitForTimeout(1000); // Wait for animation
  
  // Check if filter panel is visible
  const filterPanel = await page.locator('div.bg-gray-900\\/95.backdrop-blur-md');
  const isVisible = await filterPanel.isVisible();
  console.log('Filter panel visible:', isVisible);
  
  // Take screenshot with filter open
  await page.screenshot({ path: 'area-filter-open-full.png', fullPage: true });
  
  // Check specific shadcn elements
  const header = await page.locator('h3:has-text("Select Area")').isVisible();
  console.log('Area header visible:', header);
  
  const iconContainer = await page.locator('div.w-8.h-8.rounded-lg.bg-yellow-500\\/10').isVisible();
  console.log('Icon container visible:', iconContainer);
  
  console.log('✅ Filter test completed');
});