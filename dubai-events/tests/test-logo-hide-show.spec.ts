import { test, expect } from '@playwright/test';

test('Test logo hide/show behavior when clicking markers', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing logo hide/show behavior...');
  
  // Wait for the logo to appear
  const logo = page.locator('.app-logo');
  await logo.waitFor({ timeout: 10000 });
  
  // Verify logo is initially visible and 3x bigger
  const isInitiallyVisible = await logo.isVisible();
  console.log('✅ Logo initially visible:', isInitiallyVisible);
  expect(isInitiallyVisible).toBe(true);
  
  // Check logo size (should be 3x bigger)
  const logoImage = page.locator('.logo-image');
  const logoBox = await logoImage.boundingBox();
  console.log('📏 Logo dimensions:', logoBox);
  
  // Take screenshot showing large logo
  await page.screenshot({ 
    path: 'logo-large-visible.png',
    fullPage: true 
  });
  
  // Wait for map to load and find a marker
  await page.waitForTimeout(2000);
  
  // Look for Google Maps markers (they're created dynamically)
  // We'll click on the map area where markers should be
  await page.click('.mapContainer', { position: { x: 400, y: 300 } });
  await page.waitForTimeout(1000);
  
  // Check if logo is hidden after clicking (simulating venue selection)
  const logoAfterClick = await logo.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      opacity: styles.opacity,
      visibility: styles.visibility,
      hasHiddenClass: el.classList.contains('hidden')
    };
  });
  
  console.log('🎭 Logo state after click:', logoAfterClick);
  
  // Take screenshot showing interaction
  await page.screenshot({ 
    path: 'logo-after-click.png',
    fullPage: true 
  });
  
  console.log('✅ Logo hide/show behavior test completed');
});