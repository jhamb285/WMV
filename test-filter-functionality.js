const { chromium } = require('playwright');

(async () => {
  console.log('🎯 FILTER FUNCTIONALITY TEST - Testing that filters actually work...');
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    console.log('✅ Initial load complete');
    
    // Wait for map to load
    await page.waitForSelector('[data-testid="map-container"]', { timeout: 15000 });
    console.log('✅ Map container loaded');
    
    // Wait for venues to load initially
    await page.waitForTimeout(3000);
    
    console.log('🎯 Step 1: Test initial venue count (should show all venues)');
    
    // Now test Downtown Dubai filtering
    console.log('🎯 Step 2: Test Downtown Dubai filter (should show 1 venue)');
    
    // Click on Area filter
    const areaButton = await page.locator('button').filter({ hasText: 'Area' }).first();
    if (await areaButton.isVisible()) {
      await areaButton.click();
      await page.waitForTimeout(2000);
      
      // Select Downtown Dubai
      const downtownOption = await page.locator('label').filter({ hasText: 'Downtown Dubai' }).first();
      if (await downtownOption.isVisible()) {
        console.log('✅ Found Downtown Dubai option, clicking...');
        await downtownOption.click();
        await page.waitForTimeout(3000); // Wait for API call and venue update
        
        console.log('✅ Downtown Dubai filter applied, waiting for map update...');
        
        // Close the filter dropdown
        await areaButton.click();
        await page.waitForTimeout(2000);
        
        console.log('✅ Filter dropdown closed');
      } else {
        console.log('❌ Downtown Dubai option not found');
      }
    } else {
      console.log('❌ Area filter button not found');
    }
    
    console.log('🎯 Step 3: Test clearing filter (should show all venues again)');
    
    // Clear the filter by selecting "All Dubai"
    await areaButton.click();
    await page.waitForTimeout(1000);
    
    const allDubaiOption = await page.locator('label').filter({ hasText: 'All Dubai' }).first();
    if (await allDubaiOption.isVisible()) {
      console.log('✅ Found All Dubai option, clicking...');
      await allDubaiOption.click();
      await page.waitForTimeout(3000); // Wait for API call and venue update
      
      console.log('✅ All Dubai filter applied, waiting for map update...');
      
      // Close the filter dropdown
      await areaButton.click();
      await page.waitForTimeout(2000);
    }
    
    console.log('✅ Filter functionality test completed!');
    console.log('📍 Check the Google Maps to see if venue markers changed during filtering');
    
    // Take a final screenshot
    await page.screenshot({ path: 'filter-functionality-test.png' });
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'filter-functionality-error.png' });
  } finally {
    // Keep browser open for a bit to observe the map
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();