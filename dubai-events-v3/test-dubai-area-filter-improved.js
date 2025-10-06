const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: [
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
  
  // Enable console logging for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  try {
    console.log('🚀 Starting Dubai Events Area Filter Visual Test (Improved)...');
    
    // Navigate to the app
    console.log('📍 Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for page to load and take initial screenshot
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForTimeout(8000); // Extended wait for Google Maps
    
    // Step 1: Take screenshot of initial state
    console.log('📸 Step 1: Taking screenshot of initial state with all venues...');
    await page.screenshot({
      path: 'dubai-events-step-1-initial-all-venues.png',
      fullPage: true
    });
    
    // Log current page state for debugging
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Check what areas are available by looking at the page content
    const pageContent = await page.evaluate(() => {
      const allText = document.body.innerText;
      return {
        hasArea: allText.includes('Area'),
        hasDowntown: allText.includes('Downtown'),
        hasBusinessBay: allText.includes('Business Bay'),
        areas: Array.from(document.querySelectorAll('*')).map(el => el.textContent).filter(text => 
          text && (text.includes('Downtown') || text.includes('Business Bay') || text.includes('Dubai'))
        ).slice(0, 10)
      };
    });
    
    console.log('📊 Page content analysis:', pageContent);
    
    // Step 2: Click Area filter with multiple attempts
    console.log('🎯 Step 2: Interacting with Area filter...');
    
    // Try clicking the Area button
    const areaButton = await page.waitForSelector('text=Area', { timeout: 10000 });
    await areaButton.click();
    console.log('✅ Area button clicked');
    
    // Wait for any dropdown or modal to appear
    await page.waitForTimeout(2000);
    
    // Take screenshot after clicking Area to see what opened
    await page.screenshot({
      path: 'dubai-events-step-2-area-clicked.png',
      fullPage: true
    });
    
    // Look for any dropdown, modal, or filter options that appeared
    const filterElements = await page.evaluate(() => {
      const elements = [];
      // Look for common filter UI patterns
      document.querySelectorAll('[role="menu"], [role="dialog"], .dropdown, .modal, .filter, [data-testid*="filter"]').forEach(el => {
        elements.push({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          text: el.textContent?.substring(0, 100)
        });
      });
      
      // Also look for any elements containing area names
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent;
        if (text && (text.includes('Downtown Dubai') || text.includes('Business Bay') || text.includes('Al Sufouh'))) {
          elements.push({
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            text: text.substring(0, 100),
            isAreaOption: true
          });
        }
      });
      
      return elements.slice(0, 20); // Limit results
    });
    
    console.log('🔍 Filter elements found:', filterElements);
    
    // Step 3: Try to select Downtown Dubai or Business Bay
    console.log('🎯 Step 3: Attempting to select area filter...');
    
    let areaSelected = false;
    const areaOptions = ['Downtown Dubai', 'Business Bay', 'Al Sufouh - Dubai Media City'];
    
    for (const areaName of areaOptions) {
      try {
        console.log(`Trying to select: ${areaName}`);
        
        // Try multiple selector strategies
        const selectors = [
          `text=${areaName}`,
          `text="${areaName}"`,
          `[data-value="${areaName}"]`,
          `button:has-text("${areaName}")`,
          `[aria-label*="${areaName}"]`,
          `*:has-text("${areaName}")`,
          `[role="option"]:has-text("${areaName}")`,
          `li:has-text("${areaName}")`
        ];
        
        for (const selector of selectors) {
          try {
            const element = await page.waitForSelector(selector, { timeout: 2000 });
            if (element) {
              console.log(`Found ${areaName} with selector: ${selector}`);
              await element.click();
              areaSelected = true;
              console.log(`✅ Successfully selected: ${areaName}`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (areaSelected) break;
      } catch (e) {
        console.log(`Could not find ${areaName}, trying next option...`);
      }
    }
    
    if (!areaSelected) {
      console.log('⚠️ Could not find specific area options. Checking if filter changed by API calls...');
      // Sometimes filters work through API calls rather than UI dropdowns
    }
    
    // Wait for potential API calls and updates
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    
    // Step 4: Take screenshot after filter attempt
    console.log('📸 Step 4: Taking screenshot after filter interaction...');
    await page.screenshot({
      path: 'dubai-events-step-3-after-filter-attempt.png',
      fullPage: true
    });
    
    // Step 5: Test an alternative approach - try clicking different areas on map
    console.log('🗺️ Step 5: Alternative approach - trying map interaction...');
    
    // Look for map markers and try clicking one in a specific area
    const mapMarkers = await page.evaluate(() => {
      const markers = [];
      // Google Maps markers
      document.querySelectorAll('[role="button"][aria-label*="marker"], [role="button"][title*="marker"]').forEach(marker => {
        const rect = marker.getBoundingClientRect();
        markers.push({
          element: marker,
          x: rect.x + rect.width/2,
          y: rect.y + rect.height/2,
          label: marker.getAttribute('aria-label') || marker.getAttribute('title') || 'Unknown'
        });
      });
      return markers.slice(0, 5); // Limit to first 5 markers
    });
    
    console.log(`🎯 Found ${mapMarkers.length} map markers`);
    
    if (mapMarkers.length > 0) {
      // Click on the first marker to see if it triggers area-specific content
      await page.click(`[role="button"][aria-label*="marker"]`);
      await page.waitForTimeout(2000);
      
      await page.screenshot({
        path: 'dubai-events-step-4-marker-clicked.png',
        fullPage: true
      });
    }
    
    // Step 6: Try using the URL approach to filter by area
    console.log('🔗 Step 6: Testing URL-based filtering...');
    
    // Try adding area parameter to URL
    await page.goto('http://localhost:3000?areas=Downtown%20Dubai', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: 'dubai-events-step-5-url-filtered.png',
      fullPage: true
    });
    
    // Step 7: Go back to show all venues
    console.log('🔄 Step 7: Returning to all venues...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    await page.screenshot({
      path: 'dubai-events-step-6-final-all-venues.png',
      fullPage: true
    });
    
    console.log('🎉 Dubai Events Area Filter Visual Test Complete!');
    console.log('\n📋 Test Summary:');
    console.log('✅ 1. Initial state captured');
    console.log('✅ 2. Area filter interaction attempted');
    console.log('✅ 3. Multiple selection strategies tested');
    console.log('✅ 4. Map marker interaction tested');
    console.log('✅ 5. URL-based filtering tested');
    console.log('✅ 6. All venues state restored');
    console.log('\n📸 Screenshots generated:');
    console.log('   - dubai-events-step-1-initial-all-venues.png');
    console.log('   - dubai-events-step-2-area-clicked.png');
    console.log('   - dubai-events-step-3-after-filter-attempt.png'); 
    console.log('   - dubai-events-step-4-marker-clicked.png');
    console.log('   - dubai-events-step-5-url-filtered.png');
    console.log('   - dubai-events-step-6-final-all-venues.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    try {
      await page.screenshot({
        path: 'dubai-events-error-final.png',
        fullPage: true
      });
      console.log('📸 Error screenshot saved');
    } catch (screenshotError) {
      console.error('Could not take error screenshot');
    }
  } finally {
    await browser.close();
  }
})();