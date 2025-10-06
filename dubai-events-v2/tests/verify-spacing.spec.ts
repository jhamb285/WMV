import { test, expect } from '@playwright/test';

test('Take screenshots of improved filter spacing', async ({ page }) => {
  // Navigate to the mobile web app
  await page.goto('http://localhost:3000');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('button:has-text("Area")', { timeout: 10000 });
  
  console.log('📸 Taking screenshots of improved shadcn spacing...');
  
  // Test Area filter
  await page.click('button:has-text("Area")');
  await page.waitForSelector('h3:has-text("Select Area")');
  
  // Verify shadcn spacing elements exist
  const areaHeader = await page.locator('div.flex.items-center.gap-3.mb-6');
  await expect(areaHeader.first()).toBeVisible();
  
  const iconContainer = await page.locator('div.w-8.h-8.rounded-lg.bg-yellow-500\\/10');
  await expect(iconContainer.first()).toBeVisible();
  
  // Take screenshot
  await page.screenshot({ 
    path: 'area-filter-improved.png',
    clip: { x: 0, y: 200, width: 400, height: 600 }
  });
  
  // Click outside to close (use different selector)
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Test Vibes filter
  await page.click('button:has-text("Vibes")');
  await page.waitForSelector('h3:has-text("Select Vibes")');
  
  await page.screenshot({ 
    path: 'vibes-filter-improved.png',
    clip: { x: 0, y: 200, width: 400, height: 600 }
  });
  
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  // Test Offers filter
  await page.click('button:has-text("Offers")');
  await page.waitForSelector('h3:has-text("Select Offers")');
  
  await page.screenshot({ 
    path: 'offers-filter-improved.png',
    clip: { x: 0, y: 200, width: 400, height: 600 }
  });
  
  console.log('✅ Screenshots saved showing improved shadcn spacing patterns');
});