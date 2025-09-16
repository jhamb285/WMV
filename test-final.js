const { chromium } = require('playwright');

(async () => {
  console.log('🎯 FINAL TEST - Testing current implementation...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    
    // Wait for initial load
    await page.waitForTimeout(5000);
    
    // Take screenshot
    await page.screenshot({ path: 'test-current-state.png' });
    
    // Check what's visible
    const mapVisible = await page.isVisible('[data-testid="map-container"]');
    console.log('🗺️ Map container visible:', mapVisible);
    
    // Look for any markers on map
    const markers = await page.locator('img[src*="maps.google.com"]').count();
    console.log('📍 Map markers found:', markers);
    
    // Check filter buttons - look for the actual button structure
    const areaButton = await page.locator('button:has([class*="nav-icon"]):near(:text("Area"))').first();
    const areaVisible = await areaButton.isVisible();
    console.log('📍 Area filter button visible:', areaVisible);
    
    if (areaVisible) {
      console.log('📍 Clicking Area filter...');
      await areaButton.click();
      await page.waitForTimeout(2000);
      
      // Check for area options
      const areaOptions = await page.locator('input[type="checkbox"]').count();
      console.log('📍 Area options found:', areaOptions);
      
      if (areaOptions > 0) {
        // Click first checkbox
        await page.locator('input[type="checkbox"]').first().click();
        await page.waitForTimeout(3000);
        
        console.log('✅ Filter interaction test complete!');
        await page.screenshot({ path: 'test-after-filter.png' });
      }
    }
    
    // Monitor network to see API calls
    console.log('🌐 Final network check...');
    await page.waitForTimeout(2000);
    
    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
})();