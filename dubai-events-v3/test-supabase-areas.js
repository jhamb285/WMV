const { chromium } = require('playwright');

(async () => {
  console.log('🎯 SUPABASE AREAS TEST - Verifying areas come from database...');
  
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
    await page.waitForTimeout(5000);
    console.log('✅ Initial load complete');
    
    // Wait for map to load
    await page.waitForSelector('[data-testid="map-container"]');
    console.log('✅ Map container loaded');
    
    // Click on Area filter
    console.log('🏗️ Testing Area Filter...');
    const areaButton = await page.locator('button').filter({ hasText: 'Area' }).first();
    await areaButton.click();
    await page.waitForTimeout(2000);
    
    // Get all area options (excluding "All Dubai")
    const areaOptions = await page.locator('label').filter({ hasText: /^(?!All Dubai).+/ }).allTextContents();
    console.log('📍 Found area options:', areaOptions);
    
    // Expected Supabase areas (from our database tests)
    const expectedAreas = [
      'Al Sufouh - Dubai Media City',
      'Business Bay', 
      'Downtown Dubai',
      'Jumeirah Beach Residence'
    ];
    
    // OLD hardcoded areas that should NOT appear
    const oldHardcodedAreas = [
      'Dubai Marina',
      'JBR', 
      'DIFC',
      'City Walk',
      'La Mer',
      'Bluewaters'
    ];
    
    console.log('🔍 Expected Supabase areas:', expectedAreas);
    console.log('❌ Old hardcoded areas (should not appear):', oldHardcodedAreas);
    
    // Check if we have the correct Supabase areas
    let supabaseAreasFound = 0;
    let hardcodedAreasFound = 0;
    
    for (const area of expectedAreas) {
      const found = areaOptions.some(option => option.includes(area));
      if (found) {
        console.log(`✅ SUPABASE AREA FOUND: ${area}`);
        supabaseAreasFound++;
      } else {
        console.log(`❌ SUPABASE AREA MISSING: ${area}`);
      }
    }
    
    for (const area of oldHardcodedAreas) {
      const found = areaOptions.some(option => option.includes(area));
      if (found) {
        console.log(`❌ OLD HARDCODED AREA STILL PRESENT: ${area}`);
        hardcodedAreasFound++;
      } else {
        console.log(`✅ OLD HARDCODED AREA REMOVED: ${area}`);
      }
    }
    
    // Test specific area selection
    if (supabaseAreasFound > 0) {
      console.log('🎯 Testing area selection with Supabase data...');
      
      // Try to select "Business Bay" (should be in Supabase data)
      const businessBayOption = await page.locator('label').filter({ hasText: 'Business Bay' }).first();
      if (await businessBayOption.isVisible()) {
        await businessBayOption.click();
        await page.waitForTimeout(2000);
        console.log('✅ Successfully selected Business Bay area');
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY:');
    console.log(`✅ Supabase areas found: ${supabaseAreasFound}/${expectedAreas.length}`);
    console.log(`❌ Old hardcoded areas still present: ${hardcodedAreasFound}/${oldHardcodedAreas.length}`);
    
    if (supabaseAreasFound === expectedAreas.length && hardcodedAreasFound === 0) {
      console.log('🎉 SUCCESS: Area filter now uses Supabase data correctly!');
    } else {
      console.log('⚠️  ISSUE: Area filter still has problems with data source');
    }
    
    // Take screenshot for verification
    await page.screenshot({ path: 'supabase-areas-test.png' });
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
    await page.screenshot({ path: 'supabase-areas-error.png' });
  } finally {
    // Keep browser open for a bit to see results
    await page.waitForTimeout(3000);
    await browser.close();
  }
})();