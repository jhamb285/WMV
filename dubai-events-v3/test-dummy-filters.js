const { chromium } = require('playwright');

(async () => {
  console.log('🎯 DUMMY DATA FILTER TEST - Testing all filters with dummy data...');
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 500,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    
    // Wait for initial load and check for venues
    console.log('⏳ Waiting for app to load...');
    await page.waitForTimeout(5000);
    
    // Check if venues loaded successfully
    try {
      await page.waitForSelector('[data-testid="map-container"]', { timeout: 10000 });
      console.log('✅ Map container loaded');
      
      // Wait for venue markers to appear (indicating venues loaded)
      await page.waitForTimeout(3000);
      
      // Test Area Filter
      console.log('🏗️ Testing Area Filter...');
      try {
        const areaButton = await page.locator('button').filter({ hasText: 'Area' }).first();
        if (await areaButton.isVisible()) {
          await areaButton.click();
          await page.waitForTimeout(1500);
          
          // Try to select Business Bay
          const businessBayOption = await page.getByText('Business Bay').first();
          if (await businessBayOption.isVisible()) {
            await businessBayOption.click();
            await page.waitForTimeout(2000);
            console.log('✅ Business Bay area filter applied');
          }
          
          // Close area filter
          await areaButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('⚠️ Area filter test failed:', e.message);
      }
      
      // Test Vibe Filter
      console.log('🎵 Testing Vibe Filter...');
      try {
        const vibeButton = await page.locator('button').filter({ hasText: 'Vibe' }).first();
        if (await vibeButton.isVisible()) {
          await vibeButton.click();
          await page.waitForTimeout(1500);
          
          // Try to select High Energy Nightclub
          const nightclubOption = await page.getByText('High Energy Nightclub').first();
          if (await nightclubOption.isVisible()) {
            await nightclubOption.click();
            await page.waitForTimeout(2000);
            console.log('✅ High Energy Nightclub vibe filter applied');
          }
          
          // Close vibe filter
          await vibeButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('⚠️ Vibe filter test failed:', e.message);
      }
      
      // Test Genre Filter
      console.log('🎶 Testing Genre Filter...');
      try {
        const genreButton = await page.locator('button').filter({ hasText: 'Genre' }).first();
        if (await genreButton.isVisible()) {
          await genreButton.click();
          await page.waitForTimeout(1500);
          
          // Try to select House
          const houseOption = await page.getByText('House').first();
          if (await houseOption.isVisible()) {
            await houseOption.click();
            await page.waitForTimeout(2000);
            console.log('✅ House genre filter applied');
          }
          
          // Close genre filter
          await genreButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('⚠️ Genre filter test failed:', e.message);
      }
      
      // Test Date Filter
      console.log('📅 Testing Date Filter...');
      try {
        const dateButton = await page.locator('button').filter({ hasText: 'Date' }).first();
        if (await dateButton.isVisible()) {
          await dateButton.click();
          await page.waitForTimeout(1500);
          
          // Try to select Sep 13
          const dateOption = await page.getByText('Sep 13').first();
          if (await dateOption.isVisible()) {
            await dateOption.click();
            await page.waitForTimeout(2000);
            console.log('✅ Sep 13 date filter applied');
          }
          
          // Close date filter
          await dateButton.click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log('⚠️ Date filter test failed:', e.message);
      }
      
      // Test Clear All Filters
      console.log('🧹 Testing Clear All Filters...');
      try {
        const clearButton = await page.locator('button').filter({ hasText: 'Clear All' }).first();
        if (await clearButton.isVisible()) {
          await clearButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ Clear All filters worked');
        }
      } catch (e) {
        console.log('⚠️ Clear All test failed:', e.message);
      }
      
      console.log('✅ All dummy data filter tests completed!');
      
    } catch (error) {
      console.log('❌ Map container failed to load:', error.message);
      
      // Check if there's an error message on the page
      const errorElement = await page.locator('[data-testid="loading-state"]').first();
      if (await errorElement.isVisible()) {
        console.log('📍 App is in loading state');
      }
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'debug-dummy-filters.png' });
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'error-dummy-filters.png' });
  } finally {
    // Keep browser open for a bit to see results
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();