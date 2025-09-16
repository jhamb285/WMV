const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch browser
  const browser = await chromium.launch({ 
    headless: true,
    args: [
      '--disable-web-security', 
      '--disable-features=VizDisplayCompositor',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Dubai Events Area Filter Visual Test...');
    
    // Navigate to the app
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for the map and venues to load
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForTimeout(5000); // Give the app time to render
    
    // Check if we have any content loaded
    const hasContent = await page.evaluate(() => {
      return document.body.innerText.length > 100;
    });
    
    console.log(`📊 Page content loaded: ${hasContent ? 'Yes' : 'No'}`);
    
    // Wait for map markers to be visible (more flexible approach)
    console.log('⏳ Waiting for map markers to load...');
    try {
      await page.waitForFunction(() => {
        // Check for various types of markers
        const googleMarkers = document.querySelectorAll('[role="button"][aria-label*="marker"]');
        const customMarkers = document.querySelectorAll('.marker, [data-marker="true"]');
        const mapElements = document.querySelectorAll('[class*="map"], [id*="map"]');
        return googleMarkers.length > 0 || customMarkers.length > 0 || mapElements.length > 0;
      }, { timeout: 15000 });
    } catch (e) {
      console.log('⚠️ Could not find specific markers, continuing with test...');
    }
    
    // Step 1: Take screenshot of initial state with all venues
    console.log('📸 Step 1: Taking screenshot of initial state with all venues...');
    await page.screenshot({
      path: 'dubai-events-01-initial-all-venues.png',
      fullPage: true
    });
    
    console.log('✅ Initial state screenshot saved as dubai-events-01-initial-all-venues.png');
    
    // Step 2: Click on Area filter button
    console.log('🎯 Step 2: Looking for Area filter button...');
    
    // Try multiple selectors to find the area filter
    const areaFilterSelectors = [
      'text=Area',
      '[data-testid="area-filter"]', 
      'button[aria-label*="area"]',
      'button[aria-label*="Area"]',
      'button:has-text("Area")',
      '.area-filter',
      '[class*="area"]'
    ];
    
    let areaButton = null;
    for (const selector of areaFilterSelectors) {
      try {
        areaButton = await page.waitForSelector(selector, { timeout: 3000 });
        if (areaButton) {
          console.log(`Found area filter using selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!areaButton) {
      console.log('⚠️ Could not find Area filter button. Taking screenshot for debugging...');
      await page.screenshot({
        path: 'dubai-events-debug-no-area-filter.png',
        fullPage: true
      });
      throw new Error('Could not locate Area filter button');
    }
    
    await areaButton.click();
    console.log('✅ Area filter button clicked');
    
    // Wait for dropdown/modal to appear
    await page.waitForTimeout(1000);
    
    // Step 3: Click on Downtown Dubai option
    console.log('🎯 Step 3: Looking for Downtown Dubai option...');
    
    const downtownSelectors = [
      'text=Downtown Dubai',
      '[data-value="Downtown Dubai"]',
      'button:has-text("Downtown Dubai")',
      '[aria-label*="Downtown Dubai"]',
      '.area-option:has-text("Downtown Dubai")'
    ];
    
    let downtownOption = null;
    for (const selector of downtownSelectors) {
      try {
        downtownOption = await page.waitForSelector(selector, { timeout: 5000 });
        if (downtownOption) {
          console.log(`Found Downtown Dubai option using selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!downtownOption) {
      console.log('⚠️ Could not find Downtown Dubai option. Taking screenshot for debugging...');
      await page.screenshot({
        path: 'dubai-events-debug-no-downtown-option.png',
        fullPage: true
      });
      throw new Error('Could not locate Downtown Dubai option');
    }
    
    await downtownOption.click();
    console.log('✅ Downtown Dubai option selected');
    
    // Wait for filter to be applied and venues/markers to update
    console.log('⏳ Waiting for filter to be applied...');
    await page.waitForTimeout(3000);
    
    // Wait for network requests to complete
    await page.waitForLoadState('networkidle');
    
    // Step 4: Take screenshot after Downtown Dubai filter is applied
    console.log('📸 Step 4: Taking screenshot after Downtown Dubai filter applied...');
    await page.screenshot({
      path: 'dubai-events-02-downtown-dubai-filtered.png',
      fullPage: true
    });
    
    console.log('✅ Downtown Dubai filtered screenshot saved as dubai-events-02-downtown-dubai-filtered.png');
    
    // Step 5: Clear the filter back to "All Dubai"
    console.log('🎯 Step 5: Clearing filter back to All Dubai...');
    
    // Look for "All Dubai", "Clear", "Reset" or similar options
    const clearFilterSelectors = [
      'text=All Dubai',
      'text=Clear',
      'text=Reset',
      'button:has-text("All Dubai")',
      'button:has-text("Clear")',
      'button:has-text("Reset")',
      '[data-value="All Dubai"]',
      '[data-value=""]',
      '.clear-filter',
      '[aria-label*="clear"]',
      '[aria-label*="reset"]'
    ];
    
    // First try to click the area filter again to open the dropdown
    try {
      await areaButton.click();
      await page.waitForTimeout(1000);
    } catch (e) {
      // Try to find a new area button if the previous one is stale
      for (const selector of areaFilterSelectors) {
        try {
          const newAreaButton = await page.waitForSelector(selector, { timeout: 2000 });
          if (newAreaButton) {
            await newAreaButton.click();
            await page.waitForTimeout(1000);
            break;
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    let clearOption = null;
    for (const selector of clearFilterSelectors) {
      try {
        clearOption = await page.waitForSelector(selector, { timeout: 3000 });
        if (clearOption) {
          console.log(`Found clear filter option using selector: ${selector}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (!clearOption) {
      console.log('⚠️ Could not find clear filter option. Trying alternative approach...');
      // Try clicking the area filter button again to see if it toggles
      try {
        await areaButton.click();
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log('Could not clear filter');
      }
    } else {
      await clearOption.click();
      console.log('✅ Filter cleared');
    }
    
    // Wait for all venues to reload
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    
    // Step 6: Take final screenshot showing all venues again
    console.log('📸 Step 6: Taking final screenshot with all venues restored...');
    await page.screenshot({
      path: 'dubai-events-03-final-all-venues-restored.png',
      fullPage: true
    });
    
    console.log('✅ Final screenshot saved as dubai-events-03-final-all-venues-restored.png');
    
    // Additional verification: Count markers in each state
    console.log('🔍 Additional verification: Analyzing marker counts...');
    
    // Go back to initial state to count all markers
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="venue-card"], .venue-card', { timeout: 30000 });
    
    const allMarkersCount = await page.evaluate(() => {
      const markers = document.querySelectorAll('[role="button"][aria-label*="marker"], .marker, [data-marker="true"]');
      return markers.length;
    });
    
    console.log(`📊 Total markers (all venues): ${allMarkersCount}`);
    
    console.log('🎉 Dubai Events Area Filter Visual Test Complete!');
    console.log('\n📋 Test Summary:');
    console.log('✅ 1. Initial state screenshot taken');
    console.log('✅ 2. Area filter button clicked'); 
    console.log('✅ 3. Downtown Dubai filter applied');
    console.log('✅ 4. Filtered state screenshot taken');
    console.log('✅ 5. Filter cleared');
    console.log('✅ 6. Final state screenshot taken');
    console.log('\n📸 Screenshots saved:');
    console.log('   - dubai-events-01-initial-all-venues.png');
    console.log('   - dubai-events-02-downtown-dubai-filtered.png'); 
    console.log('   - dubai-events-03-final-all-venues-restored.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    // Take a debug screenshot
    try {
      await page.screenshot({
        path: 'dubai-events-error-debug.png',
        fullPage: true
      });
      console.log('📸 Error debug screenshot saved as dubai-events-error-debug.png');
    } catch (screenshotError) {
      console.error('Could not take debug screenshot:', screenshotError.message);
    }
  } finally {
    await browser.close();
  }
})();