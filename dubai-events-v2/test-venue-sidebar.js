const { chromium } = require('playwright');

async function testVenueSidebar() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🚀 Starting Dubai Event Discovery Platform test...');
    
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:3002');
    await page.goto('http://localhost:3002');
    
    // Wait for the page to load completely
    console.log('⏳ Waiting for page to load completely...');
    await page.waitForTimeout(8000); // Wait for Google Maps to initialize
    
    // Take initial screenshot
    console.log('📸 Taking initial state screenshot...');
    await page.screenshot({ 
      path: 'venue-sidebar-initial-state.png', 
      fullPage: true 
    });
    
    // Wait for venue pins to be rendered
    console.log('🔍 Looking for venue pins on the map...');
    
    // Try to find venue pins (they are OverlayView components)
    // We'll look for the pin elements by their distinctive styling
    const venuePin = await page.locator('div[style*="cursor: pointer"]').first();
    
    if (await venuePin.count() > 0) {
      console.log('✅ Found venue pins on the map!');
      
      // Click on the first venue pin
      console.log('👆 Clicking on venue pin to trigger sidebar...');
      await venuePin.click();
      
      // Wait a moment for the sidebar animation
      await page.waitForTimeout(1000);
      
      // Check if sidebar is open
      const sidebar = page.locator('[class*="fixed"][class*="right-0"][class*="bg-slate-900"]');
      const sidebarVisible = await sidebar.isVisible();
      
      if (sidebarVisible) {
        console.log('🎉 SUCCESS: Sidebar opened successfully!');
        
        // Test sidebar elements
        console.log('🔍 Testing sidebar content...');
        
        // Check for venue name
        const venueName = await page.locator('.text-xl.font-bold.text-white').textContent();
        console.log(`📍 Venue name: ${venueName}`);
        
        // Check for category badge
        const categoryBadge = page.locator('.bg-blue-600.text-white');
        if (await categoryBadge.count() > 0) {
          const category = await categoryBadge.textContent();
          console.log(`🏷️ Category: ${category}`);
        }
        
        // Check for Instagram stories section
        const storiesSection = page.locator('h3:has-text("Current Stories")');
        if (await storiesSection.count() > 0) {
          console.log('📱 ✅ Instagram Stories section found');
        } else {
          console.log('📱 ❌ Instagram Stories section not found');
        }
        
        // Check for Event Information section
        const eventSection = page.locator('h3:has-text("Event Information")');
        if (await eventSection.count() > 0) {
          console.log('📊 ✅ Event Information section found');
          
          // Check for confidence score
          const confidenceScore = page.locator('text=/\\d+% confidence/');
          if (await confidenceScore.count() > 0) {
            const score = await confidenceScore.textContent();
            console.log(`🎯 Confidence score: ${score}`);
          }
        } else {
          console.log('📊 ❌ Event Information section not found');
        }
        
        // Check for time remaining indicator
        const timeRemaining = page.locator('text=/\\d+h \\d+m left/');
        if (await timeRemaining.count() > 0) {
          const time = await timeRemaining.textContent();
          console.log(`⏰ Time remaining: ${time}`);
        }
        
        // Check dark theme styling
        const darkBg = await sidebar.getAttribute('class');
        if (darkBg.includes('bg-slate-900')) {
          console.log('🎨 ✅ Dark theme (slate-900) confirmed');
        } else {
          console.log('🎨 ❌ Dark theme styling not found');
        }
        
        // Take screenshot with sidebar open
        console.log('📸 Taking screenshot with sidebar open...');
        await page.screenshot({ 
          path: 'venue-sidebar-open.png', 
          fullPage: true 
        });
        
        // Test close functionality
        console.log('❌ Testing close button...');
        const closeButton = page.locator('button:has(svg)').last(); // X close button
        await closeButton.click();
        await page.waitForTimeout(500);
        
        const sidebarClosed = !(await sidebar.isVisible());
        if (sidebarClosed) {
          console.log('✅ Sidebar closes successfully!');
        } else {
          console.log('❌ Sidebar did not close');
        }
        
      } else {
        console.log('❌ FAILURE: Sidebar did not open after clicking venue pin');
        
        // Take screenshot for debugging
        await page.screenshot({ 
          path: 'venue-sidebar-failed.png', 
          fullPage: true 
        });
      }
      
    } else {
      console.log('❌ No venue pins found on the map');
      console.log('💡 This might be due to:');
      console.log('   - Google Maps API key not configured');
      console.log('   - Map still loading');
      console.log('   - Venue data not loaded');
    }
    
    // Final screenshot
    await page.screenshot({ 
      path: 'venue-sidebar-final.png', 
      fullPage: true 
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
    await page.screenshot({ 
      path: 'venue-sidebar-error.png', 
      fullPage: true 
    });
  } finally {
    await browser.close();
    console.log('🏁 Test completed!');
  }
}

// Run the test
testVenueSidebar().catch(console.error);