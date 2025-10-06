import { test, expect } from '@playwright/test';

test('Test improved filter layouts and styling', async ({ page }) => {
  // Navigate to the app
  await page.goto('http://localhost:3000');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait for filter buttons to be visible
  await page.waitForSelector('button:has-text("Area")', { timeout: 10000 });
  
  // Test Area filter
  console.log('🔍 Testing Area filter layout...');
  await page.click('button:has-text("Area")');
  await page.waitForSelector('h3:has-text("Select Area")');
  
  // Check for 2-column layout
  const areaGrid = await page.locator('div.grid.grid-cols-2');
  await expect(areaGrid.first()).toBeVisible();
  
  // Check for radio buttons
  const radioButtons = await page.locator('input[type="radio"][name="area"]');
  const radioCount = await radioButtons.count();
  console.log(`📍 Found ${radioCount} area radio buttons`);
  
  // Take screenshot of area filter
  await page.screenshot({ 
    path: 'area-filter-layout.png',
    clip: { x: 0, y: 300, width: 400, height: 500 }
  });
  
  // Close area filter by clicking background
  await page.click('div[class*="bg-black/20"]');
  
  // Test Vibes filter
  console.log('✨ Testing Vibes filter layout...');
  await page.click('button:has-text("Vibes")');
  await page.waitForSelector('h3:has-text("Select Vibes")');
  
  // Check for checkboxes
  const vibesCheckboxes = await page.locator('input[type="checkbox"]').first();
  await expect(vibesCheckboxes).toBeVisible();
  
  // Take screenshot of vibes filter
  await page.screenshot({ 
    path: 'vibes-filter-layout.png',
    clip: { x: 0, y: 300, width: 400, height: 500 }
  });
  
  // Close vibes filter
  await page.click('div[class*="bg-black/20"]');
  
  // Test Offers filter
  console.log('🎁 Testing Offers filter layout...');
  await page.click('button:has-text("Offers")');
  await page.waitForSelector('h3:has-text("Select Offers")');
  
  // Check for 2-column layout in offers
  const offersGrid = await page.locator('div.grid.grid-cols-2').last();
  await expect(offersGrid).toBeVisible();
  
  // Take screenshot of offers filter
  await page.screenshot({ 
    path: 'offers-filter-layout.png',
    clip: { x: 0, y: 300, width: 400, height: 500 }
  });
  
  // Close offers filter
  await page.click('div[class*="bg-black/20"]');
  
  // Test AI Chat panel
  console.log('🤖 Testing AI Chat panel...');
  await page.click('button:has-text("AI")');
  await page.waitForSelector('h3:has-text("AI Chat")');
  
  // Check for centered content
  const chatContent = await page.locator('div.text-center');
  await expect(chatContent).toBeVisible();
  
  // Take screenshot of chat panel
  await page.screenshot({ 
    path: 'ai-chat-panel.png',
    clip: { x: 0, y: 300, width: 400, height: 500 }
  });
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'mobile-filter-ui-complete.png',
    fullPage: true 
  });
  
  console.log('✅ All filter layouts tested successfully!');
  console.log('📸 Screenshots saved: area-filter-layout.png, vibes-filter-layout.png, offers-filter-layout.png, ai-chat-panel.png, mobile-filter-ui-complete.png');
});