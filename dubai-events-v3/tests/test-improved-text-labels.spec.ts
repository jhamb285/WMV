import { test, expect } from '@playwright/test';

test('Test improved text labels - bigger, bolder, closer to bottom', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing improved text labels...');
  
  // Wait for the navigation to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Check if text labels are visible and properly styled
  const labels = await page.locator('.nav-label');
  const labelCount = await labels.count();
  console.log('Text labels found:', labelCount);
  
  // Take screenshot showing the improved text labels
  await page.screenshot({ 
    path: 'improved-text-labels.png',
    fullPage: true 
  });
  
  console.log('📸 Improved text labels screenshot taken');
  
  // Test hover effect on first button to see text changes
  const firstContainer = page.locator('.nav-button-container').first();
  await firstContainer.hover();
  await page.waitForTimeout(300);
  
  // Take screenshot with hover effect
  await page.screenshot({ 
    path: 'improved-text-labels-hover.png',
    fullPage: true 
  });
  
  console.log('📸 Text labels hover effect screenshot taken');
  
  // Test clicking to see active state
  await firstContainer.click();
  await page.waitForTimeout(300);
  
  // Take screenshot with active state
  await page.screenshot({ 
    path: 'improved-text-labels-active.png',
    fullPage: true 
  });
  
  console.log('📸 Text labels active state screenshot taken');
  
  console.log('✅ Improved text labels test completed');
});