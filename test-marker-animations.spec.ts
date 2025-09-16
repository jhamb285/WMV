import { test } from '@playwright/test';

test('Test marker animations', async ({ page }) => {
  console.log('🎬 Testing marker animations...');
  
  // Enable console logging to see animation logs
  page.on('console', msg => {
    console.log(`🌐 BROWSER: ${msg.text()}`);
  });
  
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  console.log('⏳ Waiting for markers to load and animate...');
  await page.waitForTimeout(2000); // Wait for DROP animation
  
  // Take screenshot of initial state with markers
  await page.screenshot({ path: 'markers-with-animations-initial.png', fullPage: true });
  
  console.log('🖱️ Clicking marker to test BOUNCE animation...');
  const markers = page.locator('div[role="button"][tabindex="0"]');
  const markerCount = await markers.count();
  console.log(`Found ${markerCount} markers`);
  
  if (markerCount > 0) {
    // Click first marker to trigger bounce
    await markers.first().click();
    
    console.log('⏳ Waiting for bounce animation and sidebar...');
    await page.waitForTimeout(2000);
    
    // Take screenshot during/after bounce animation
    await page.screenshot({ path: 'markers-with-bounce-animation.png', fullPage: true });
  }
  
  console.log('✅ Animation test completed');
});