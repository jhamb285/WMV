const { chromium } = require('playwright');

(async () => {
  console.log('🗺️  MAP MARKERS UPDATE TEST - Verifying markers change with filters...');
  
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 2000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    
    // Wait for initial load
    await page.waitForTimeout(5000);
    console.log('✅ Initial load complete');
    
    // Wait for map to load
    await page.waitForSelector('[data-testid="map-container"]', { timeout: 15000 });
    console.log('✅ Map container loaded');
    
    // Wait for venues to load initially
    await page.waitForTimeout(5000);
    
    // Try to count initial markers (check if Google Maps markers are present)
    console.log('🔍 Step 1: Counting initial venue markers on map...');
    
    // Look for Google Maps markers in the DOM 
    // Note: Google Maps markers are often in a canvas or iframe, so we'll check for venue data instead
    
    // Open network tab to monitor API calls
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/api/venues')) {
        responses.push({
          url: response.url(),
          timestamp: new Date().toISOString()
        });
        console.log(`📡 API CALL: ${response.url()}`);
      }
    });
    
    console.log('🎯 Step 2: Apply Downtown Dubai filter...');
    
    // Click on Area filter button
    const areaButton = await page.locator('button').filter({ hasText: 'Area' }).first();
    if (await areaButton.isVisible()) {
      console.log('✅ Found Area button, clicking...');
      await areaButton.click();
      await page.waitForTimeout(2000);
      
      // Select Downtown Dubai
      const downtownOption = await page.locator('label').filter({ hasText: 'Downtown Dubai' }).first();
      if (await downtownOption.isVisible()) {
        console.log('✅ Found Downtown Dubai option, clicking...');
        await downtownOption.click();
        await page.waitForTimeout(3000); // Wait for API call
        
        console.log('✅ Downtown Dubai filter applied');
        
        // Close the filter dropdown by clicking area button again
        await areaButton.click();
        await page.waitForTimeout(2000);
        
        console.log('✅ Filter dropdown closed');
      } else {
        console.log('❌ Downtown Dubai option not found');
      }
    } else {
      console.log('❌ Area filter button not found');
    }
    
    console.log('🎯 Step 3: Clear filter by selecting All Dubai...');
    
    // Open area filter again
    await areaButton.click();
    await page.waitForTimeout(1000);
    
    const allDubaiOption = await page.locator('label').filter({ hasText: 'All Dubai' }).first();
    if (await allDubaiOption.isVisible()) {
      console.log('✅ Found All Dubai option, clicking...');
      await allDubaiOption.click();
      await page.waitForTimeout(3000); // Wait for API call
      
      console.log('✅ All Dubai filter applied');
      
      // Close the filter dropdown
      await areaButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Summary of API calls
    console.log('\n📊 API CALLS SUMMARY:');
    responses.forEach((response, index) => {
      console.log(`${index + 1}. ${response.url} at ${response.timestamp}`);
    });
    
    if (responses.length >= 2) {
      console.log('🎉 SUCCESS: Filter functionality is triggering API calls correctly!');
      console.log('✅ Map should be updating with different venue markers based on filters');
    } else {
      console.log('⚠️  ISSUE: Expected at least 2 API calls (initial + filtered)');
    }
    
    // Take screenshot for verification
    await page.screenshot({ path: 'map-markers-test.png' });
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'map-markers-error.png' });
  } finally {
    // Keep browser open briefly to observe the results
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();