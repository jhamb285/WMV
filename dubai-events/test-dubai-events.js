const { chromium } = require('playwright');

async function testDubaiEventsApp() {
  console.log('Starting Playwright test for Dubai Events Platform...');
  
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Set viewport to get a good screenshot
    await page.setViewportSize({ width: 1400, height: 900 });
    
    console.log('Navigating to http://localhost:3002...');
    await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
    
    // Wait for initial content to load
    await page.waitForTimeout(2000);
    
    // Wait for Google Maps to load - look for map container
    console.log('Waiting for Google Maps to load...');
    try {
      await page.waitForSelector('[data-testid="map-container"], .google-map, #map', { timeout: 10000 });
      console.log('Map container found, waiting additional time for full map load...');
    } catch (e) {
      console.log('Map container selector not found, waiting for general map elements...');
    }
    
    // Wait additional time for Google Maps JavaScript to fully initialize
    await page.waitForTimeout(8000);
    
    // Check for venue markers or pins
    console.log('Looking for venue markers...');
    const markerElements = await page.$$('img[src*="marker"], div[title*="WHITE"], div[title*="Zero"], div[title*="Atmosphere"], div[title*="SkyBar"], [role="button"][aria-label*="Dubai"]');
    console.log(`Found ${markerElements.length} potential marker elements`);
    
    // Take screenshot
    console.log('Taking screenshot...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `/Users/arpitjhamb/Desktop/WMV/dubai-events/screenshot-${timestamp}.png`;
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Analyze page content
    console.log('\n=== PAGE ANALYSIS ===');
    
    // Check page title
    const title = await page.title();
    console.log(`Page Title: ${title}`);
    
    // Check for retro styling elements
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computedStyles = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyles.backgroundColor,
        fontFamily: computedStyles.fontFamily,
        color: computedStyles.color
      };
    });
    console.log('Body Styles:', bodyStyles);
    
    // Look for specific venue names in the DOM
    const venueNames = ['WHITE Dubai', 'Zero Gravity', 'Atmosphere', 'SkyBar'];
    for (const venueName of venueNames) {
      const venueElements = await page.$$(`text="${venueName}"`);
      const venueElementsPartial = await page.$$(`[title*="${venueName}"], [aria-label*="${venueName}"]`);
      console.log(`Venue "${venueName}": ${venueElements.length + venueElementsPartial.length} references found`);
    }
    
    // Check for map-related elements
    const mapElements = await page.$$('[class*="map"], [id*="map"], [data-testid*="map"]');
    console.log(`Map-related elements: ${mapElements.length}`);
    
    // Check for Google Maps specific elements
    const googleMapElements = await page.$$('div[style*="webkit-transform"], div[draggable="false"]');
    console.log(`Google Maps elements: ${googleMapElements.length}`);
    
    // Get any error messages
    const errorElements = await page.$$('.error, [class*="error"], [data-testid*="error"]');
    if (errorElements.length > 0) {
      console.log(`Warning: ${errorElements.length} potential error elements found`);
    }
    
    // Check console for any JavaScript errors
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));
    
    await page.waitForTimeout(1000);
    
    console.log('\n=== CONSOLE MESSAGES ===');
    logs.forEach(log => console.log('Console:', log));
    
    console.log('\n=== TEST COMPLETED ===');
    console.log(`Screenshot saved at: ${screenshotPath}`);
    
    return screenshotPath;
    
  } catch (error) {
    console.error('Error during testing:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testDubaiEventsApp().catch(console.error);