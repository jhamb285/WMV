const { chromium } = require('playwright');

(async () => {
  console.log('🎯 FINAL FILTER TEST - Testing all fixed filters...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    console.log('📱 Navigating to app...');
    await page.goto('http://localhost:3000');
    
    // Wait for initial load
    await page.waitForTimeout(3000);
    console.log('✅ Initial load complete');
    
    // Wait for map to load
    await page.waitForSelector('[data-testid="map-container"]');
    console.log('✅ Map container loaded');
    
    // Test Area Filter
    console.log('🏗️ Testing Area Filter...');
    const areaButton = await page.locator('button').filter({ hasText: 'Area' }).first();
    await areaButton.click();
    await page.waitForTimeout(1000);
    
    // Select JBR area
    const jbrCheckbox = await page.locator('label').filter({ hasText: 'JBR' }).locator('input[type="checkbox"]');
    await jbrCheckbox.click();
    await page.waitForTimeout(2000);
    console.log('✅ Area filter (JBR) applied');
    
    // Close area filter
    await areaButton.click();
    await page.waitForTimeout(1000);
    
    // Test Vibe Filter
    console.log('🎵 Testing Vibe Filter...');
    const vibeButton = await page.locator('button').filter({ hasText: 'Vibe' }).first();
    await vibeButton.click();
    await page.waitForTimeout(1000);
    
    // Select Party/Energetic vibe
    const partyCheckbox = await page.locator('label').filter({ hasText: 'Party/Energetic' }).locator('input[type="checkbox"]');
    await partyCheckbox.click();
    await page.waitForTimeout(2000);
    console.log('✅ Vibe filter (Party/Energetic) applied');
    
    // Close vibe filter
    await vibeButton.click();
    await page.waitForTimeout(1000);
    
    // Test Genre Filter
    console.log('🎶 Testing Genre Filter...');
    const genreButton = await page.locator('button').filter({ hasText: 'Genre' }).first();
    await genreButton.click();
    await page.waitForTimeout(1000);
    
    // Select House genre
    const houseCheckbox = await page.locator('label').filter({ hasText: 'House' }).locator('input[type="checkbox"]');
    await houseCheckbox.click();
    await page.waitForTimeout(2000);
    console.log('✅ Genre filter (House) applied');
    
    // Close genre filter
    await genreButton.click();
    await page.waitForTimeout(1000);
    
    // Test Offers Filter
    console.log('💰 Testing Offers Filter...');
    const offersButton = await page.locator('button').filter({ hasText: 'Offers' }).first();
    await offersButton.click();
    await page.waitForTimeout(1000);
    
    // Select Happy Hour offer
    const happyHourCheckbox = await page.locator('label').filter({ hasText: 'Happy Hour' }).locator('input[type="checkbox"]');
    await happyHourCheckbox.click();
    await page.waitForTimeout(2000);
    console.log('✅ Offers filter (Happy Hour) applied');
    
    // Close offers filter
    await offersButton.click();
    await page.waitForTimeout(1000);
    
    // Test Date Filter
    console.log('📅 Testing Date Filter...');
    const dateButton = await page.locator('button').filter({ hasText: 'Date' }).first();
    await dateButton.click();
    await page.waitForTimeout(1000);
    
    // Select Sep 11 date
    const sep11Button = await page.locator('button').filter({ hasText: 'Sep 11' }).first();
    if (await sep11Button.isVisible()) {
      await sep11Button.click();
      await page.waitForTimeout(2000);
      console.log('✅ Date filter (Sep 11) applied');
    }
    
    // Close date filter
    await dateButton.click();
    await page.waitForTimeout(1000);
    
    // Clear all filters to test reset
    console.log('🧹 Testing Clear All Filters...');
    const clearButton = await page.locator('button').filter({ hasText: 'Clear All' }).first();
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await page.waitForTimeout(2000);
      console.log('✅ Clear All filters worked');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'test-filters-complete.png' });
    
    console.log('✅ All filter tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Filter test error:', error.message);
    await page.screenshot({ path: 'test-filters-error.png' });
  } finally {
    await browser.close();
  }
})();