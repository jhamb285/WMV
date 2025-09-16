const { chromium } = require('playwright');

async function testGoogleMaps() {
  console.log('🎭 Starting Playwright test of Google Maps implementation');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Log console messages from the browser
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser Error:', msg.text());
    } else if (msg.text().includes('Google Maps') || msg.text().includes('MAP') || msg.text().includes('🗺️') || msg.text().includes('API Key')) {
      console.log('🗺️ Map Log:', msg.text());
    }
  });
  
  // Log failed requests
  page.on('requestfailed', request => {
    if (request.url().includes('googleapis') || request.url().includes('maps')) {
      console.log('❌ Failed Request:', request.url(), request.failure());
    }
  });
  
  try {
    console.log('📄 Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait a bit for React to hydrate
    await page.waitForTimeout(3000);
    
    // Check if the page loaded
    const title = await page.title();
    console.log('📋 Page Title:', title);
    
    // Check for navigation elements
    const navElements = await page.evaluate(() => {
      const wmv = document.querySelector('h1')?.textContent;
      const venues = document.querySelector('[data-slot="badge"]')?.textContent;
      const loading = document.body.textContent.includes('Loading');
      
      return {
        hasWMVLogo: !!wmv,
        venueCount: venues,
        isLoading: loading,
        bodyText: document.body.textContent.substring(0, 200)
      };
    });
    
    console.log('🧭 Navigation Check:', navElements);
    
    // Check for Google Maps specific elements
    const mapsElements = await page.evaluate(() => {
      const mapDiv = document.querySelector('#map');
      const loadScript = document.querySelector('script[src*="googleapis"]');
      const hasReactGoogleMaps = window.google !== undefined;
      
      return {
        hasMapDiv: !!mapDiv,
        hasGoogleScript: !!loadScript,
        hasGoogleObject: hasReactGoogleMaps,
        mapDivContent: mapDiv ? mapDiv.innerHTML : 'Not found'
      };
    });
    
    console.log('🗺️ Google Maps Check:', mapsElements);
    
    // Wait for map to potentially load
    console.log('⏳ Waiting 10 seconds for map to load...');
    await page.waitForTimeout(10000);
    
    // Check again after waiting
    const finalCheck = await page.evaluate(() => {
      const mapDiv = document.querySelector('#map');
      const hasMarkers = document.querySelectorAll('[data-marker]').length > 0;
      const hasCanvas = document.querySelector('canvas');
      const loadingText = document.body.textContent.includes('Loading');
      
      return {
        hasMapDiv: !!mapDiv,
        hasMarkers,
        hasCanvas: !!hasCanvas,
        stillLoading: loadingText,
        canvasCount: document.querySelectorAll('canvas').length
      };
    });
    
    console.log('🏁 Final Check:', finalCheck);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('📸 Screenshot saved as test-screenshot.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testGoogleMaps();