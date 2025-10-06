const { chromium } = require('playwright');

async function testVenueSidebarImproved() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow down for better visibility
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Starting improved Dubai Event Discovery Platform test...');
    
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:3002');
    await page.goto('http://localhost:3002');
    
    // Wait for the page to load completely
    console.log('⏳ Waiting for page to load completely...');
    await page.waitForTimeout(10000); // Extended wait for Google Maps
    
    // Take initial screenshot
    console.log('📸 Taking initial state screenshot...');
    await page.screenshot({ 
      path: 'venue-sidebar-initial-improved.png', 
      fullPage: true 
    });
    
    // Look for venue pins with multiple strategies
    console.log('🔍 Looking for venue pins using multiple strategies...');
    
    // Strategy 1: Look for elements with emoji icons (from VenuePin component)
    let venuePin = await page.locator('span:text("🎵")').first(); // nightclub icon
    if (await venuePin.count() === 0) {
      venuePin = await page.locator('span:text("🍽️")').first(); // restaurant icon
    }
    if (await venuePin.count() === 0) {
      venuePin = await page.locator('span:text("🍸")').first(); // bar icon
    }
    if (await venuePin.count() === 0) {
      venuePin = await page.locator('span:text("🏖️")').first(); // beach club icon
    }
    
    // Strategy 2: Look for elements with venue pin styling
    if (await venuePin.count() === 0) {
      venuePin = await page.locator('div[class*="rounded-full"][class*="border-2"][class*="shadow-lg"]').first();
    }
    
    // Strategy 3: Look for clickable elements in the map area
    if (await venuePin.count() === 0) {
      venuePin = await page.locator('div[class*="cursor-pointer"][class*="transform"]').first();
    }
    
    // Strategy 4: Look for any elements with venue-related classes
    if (await venuePin.count() === 0) {
      venuePin = await page.locator('[class*="venue"]').first();
    }
    
    // Check what we found
    const pinCount = await venuePin.count();
    console.log(`Found ${pinCount} potential venue pins`);
    
    if (pinCount > 0) {
      console.log('✅ Found venue pin elements!');
      
      // Get pin location for debugging
      const boundingBox = await venuePin.boundingBox();
      if (boundingBox) {
        console.log(`📍 Pin location: x=${boundingBox.x}, y=${boundingBox.y}`);
      }
      
      // Try clicking on the venue pin
      console.log('👆 Attempting to click on venue pin...');
      await venuePin.click({ force: true });
      
      // Wait for sidebar animation
      await page.waitForTimeout(2000);
      
      // Check multiple sidebar selectors
      const sidebarSelectors = [
        '[class*="fixed"][class*="right-0"][class*="bg-slate-900"]',
        '[class*="translate-x-0"]',
        '.fixed.top-0.right-0',
        '[data-testid="venue-sidebar"]'
      ];
      
      let sidebarFound = false;
      let sidebar = null;
      
      for (const selector of sidebarSelectors) {
        sidebar = page.locator(selector);
        if (await sidebar.count() > 0 && await sidebar.isVisible()) {
          sidebarFound = true;
          console.log(`✅ Sidebar found with selector: ${selector}`);
          break;
        }
      }
      
      if (sidebarFound && sidebar) {
        console.log('🎉 SUCCESS: Sidebar opened successfully!');
        
        // Test sidebar content
        console.log('🔍 Testing sidebar content...');
        
        // Check for close button
        const closeButton = page.locator('button').filter({ hasText: /×|✕|Close/i });
        if (await closeButton.count() > 0) {
          console.log('❌ ✅ Close button found');
        }
        
        // Look for venue information
        const venueNames = ['WHITE Dubai', 'Zero Gravity', 'Atmosphere', 'SkyBar'];
        let venueFound = false;
        
        for (const name of venueNames) {
          const venueElement = page.locator(`text="${name}"`);
          if (await venueElement.count() > 0) {
            console.log(`📍 ✅ Venue name found: ${name}`);
            venueFound = true;
            break;
          }
        }
        
        if (!venueFound) {
          console.log('📍 ❌ No venue names found in sidebar');
        }
        
        // Check for specific sidebar sections
        const sectionsToCheck = [
          { name: 'Current Stories', selector: 'text="Current Stories"' },
          { name: 'Event Information', selector: 'text="Event Information"' },
          { name: 'Instagram icon', selector: 'svg' },
          { name: 'Confidence score', selector: 'text=/\\d+% confidence/' },
          { name: 'Time remaining', selector: 'text=/\\d+h \\d+m left/' }
        ];
        
        for (const section of sectionsToCheck) {
          const element = page.locator(section.selector);
          const found = await element.count() > 0;
          console.log(`${section.name}: ${found ? '✅' : '❌'}`);
        }
        
        // Take screenshot with sidebar open
        console.log('📸 Taking screenshot with sidebar open...');
        await page.screenshot({ 
          path: 'venue-sidebar-open-improved.png', 
          fullPage: true 
        });
        
        // Test close functionality
        console.log('❌ Testing close functionality...');
        if (await closeButton.count() > 0) {
          await closeButton.first().click();
          await page.waitForTimeout(1000);
          
          const sidebarClosed = !(await sidebar.isVisible());
          console.log(`Close button test: ${sidebarClosed ? '✅ Sidebar closed' : '❌ Sidebar still open'}`);
        }
        
      } else {
        console.log('❌ FAILURE: Sidebar did not open after clicking venue pin');
        
        // Debug information
        console.log('🐛 Debug info:');
        const allElements = await page.locator('div').count();
        console.log(`- Total div elements on page: ${allElements}`);
        
        const fixedElements = await page.locator('.fixed').count();
        console.log(`- Elements with .fixed class: ${fixedElements}`);
        
        // Look for any sidebar-like elements
        const potentialSidebars = await page.locator('[class*="sidebar"], [class*="drawer"], [class*="panel"]').count();
        console.log(`- Potential sidebar elements: ${potentialSidebars}`);
        
        // Take screenshot for debugging
        await page.screenshot({ 
          path: 'venue-sidebar-debug-improved.png', 
          fullPage: true 
        });
      }
      
    } else {
      console.log('❌ No venue pins found on the map');
      console.log('💡 Debugging suggestions:');
      console.log('   - Check if Google Maps API key is configured');
      console.log('   - Verify venue data is loading');
      console.log('   - Check console for JavaScript errors');
      
      // Get console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log(`🚨 Console error: ${msg.text()}`);
        }
      });
      
      // Check for loading states
      const loadingElement = page.locator('text="Loading"');
      if (await loadingElement.count() > 0) {
        console.log('⏳ Found loading indicator - waiting longer...');
        await page.waitForTimeout(5000);
      }
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'venue-sidebar-final-improved.png', 
      fullPage: true 
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await page.screenshot({ 
      path: 'venue-sidebar-error-improved.png', 
      fullPage: true 
    });
  } finally {
    await browser.close();
    console.log('🏁 Improved test completed!');
  }
}

// Run the test
testVenueSidebarImproved().catch(console.error);