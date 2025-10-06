import { test, expect } from '@playwright/test';

test('Test even bigger navigation with text labels', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing even bigger navigation with text labels...');
  
  // Wait for the bigger glass nav to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Check if the glass navigation pill is visible
  const glassPill = await page.locator('.glass-nav-pill');
  await expect(glassPill).toBeVisible();
  
  // Check if nav button containers exist
  const buttonContainers = await page.locator('.nav-button-container');
  const containerCount = await buttonContainers.count();
  console.log('Button containers found:', containerCount);
  
  // Check if text labels are visible
  const labels = await page.locator('.nav-label');
  const labelCount = await labels.count();
  console.log('Text labels found:', labelCount);
  
  // Get the text content of each label
  for (let i = 0; i < labelCount; i++) {
    const labelText = await labels.nth(i).textContent();
    console.log(`Label ${i + 1}: ${labelText}`);
  }
  
  // Take screenshot showing the bigger navigation with labels
  await page.screenshot({ 
    path: 'bigger-nav-with-labels.png',
    fullPage: true 
  });
  
  console.log('📸 Navigation with labels screenshot taken');
  
  // Test clicking Area button to see if menu still works
  const firstContainer = buttonContainers.first();
  await firstContainer.click();
  await page.waitForTimeout(500);
  
  // Check if area menu opened
  const areaHeader = await page.locator('h3:has-text("Select Area")');
  const isAreaMenuVisible = await areaHeader.isVisible();
  console.log('Area menu still works:', isAreaMenuVisible);
  
  if (isAreaMenuVisible) {
    await page.screenshot({ 
      path: 'bigger-nav-labels-with-menu.png',
      fullPage: true 
    });
    console.log('📸 Navigation with labels and menu screenshot taken');
  }
  
  console.log('✅ Bigger navigation with labels test completed');
});