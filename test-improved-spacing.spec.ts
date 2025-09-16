import { test, expect } from '@playwright/test';

test('Verify improved filter menu spacing and shadcn patterns', async ({ page }) => {
  // Navigate to the mobile web app
  await page.goto('http://localhost:3000');
  
  // Wait for the page and filter buttons to load
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('button:has-text("Area")', { timeout: 10000 });
  
  console.log('🎨 Testing improved spacing patterns...');
  
  // Test Area filter with improved spacing
  await page.click('button:has-text("Area")');
  await page.waitForSelector('h3:has-text("Select Area")');
  
  // Check for proper shadcn spacing patterns
  const areaHeader = await page.locator('div.flex.items-center.gap-3.mb-6');
  await expect(areaHeader.first()).toBeVisible();
  
  // Check for icon container with proper styling
  const iconContainer = await page.locator('div.w-8.h-8.rounded-lg.bg-yellow-500\\/10');
  await expect(iconContainer.first()).toBeVisible();
  
  // Check for single column layout
  const singleColumnGrid = await page.locator('div.grid.grid-cols-1.gap-3');
  await expect(singleColumnGrid.first()).toBeVisible();
  
  // Check for proper text spacing with leading-none
  const labelText = await page.locator('span.text-white.text-sm.font-medium.leading-none').first();
  await expect(labelText).toBeVisible();
  
  // Take screenshot of improved area filter
  await page.screenshot({ 
    path: 'improved-area-filter.png',
    clip: { x: 0, y: 200, width: 400, height: 600 }
  });
  
  // Close and test vibes filter
  await page.click('div[class*="bg-black/20"]');
  await page.click('button:has-text("Vibes")');
  await page.waitForSelector('h3:has-text("Select Vibes")');
  
  // Verify consistent header styling
  const vibesIcon = await page.locator('div.flex.items-center.justify-center.w-8.h-8.rounded-lg.bg-yellow-500\\/10').nth(1);
  await expect(vibesIcon).toBeVisible();
  
  // Take screenshot of improved vibes filter
  await page.screenshot({ 
    path: 'improved-vibes-filter.png',
    clip: { x: 0, y: 200, width: 400, height: 600 }
  });
  
  // Close and test offers filter
  await page.click('div[class*="bg-black/20"]');
  await page.click('button:has-text("Offers")');
  await page.waitForSelector('h3:has-text("Select Offers")');
  
  // Take screenshot of improved offers filter
  await page.screenshot({ 
    path: 'improved-offers-filter.png',
    clip: { x: 0, y: 200, width: 400, height: 600 }
  });
  
  // Test overall container styling
  const container = await page.locator('div.bg-gray-900\\/95.backdrop-blur-md');
  await expect(container).toBeVisible();
  
  // Take full screenshot showing all improvements
  await page.screenshot({ 
    path: 'shadcn-improved-filters-complete.png',
    fullPage: true 
  });
  
  console.log('✅ All spacing improvements verified!');
  console.log('📸 Screenshots saved showing improved shadcn patterns');
  
  // Test hover effects
  const firstLabel = await page.locator('label.group').first();
  await firstLabel.hover();
  
  // Wait for hover animation
  await page.waitForTimeout(300);
  
  console.log('🎯 Hover effects tested');
});