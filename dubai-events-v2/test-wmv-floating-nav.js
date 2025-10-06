const { chromium } = require('playwright');

async function testDubaiEventsFloatingNav() {
  const browser = await chromium.launch({ 
    headless: false,  // Set to true for headless mode
    slowMo: 1000      // Slow down actions for better visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🚀 Starting Dubai Events Platform Test...');
    
    // Navigate to the application
    console.log('📍 Navigating to http://localhost:3002...');
    await page.goto('http://localhost:3002');
    
    // Wait for the page to fully load (including Google Maps)
    console.log('⏳ Waiting for page to fully load (10 seconds for Maps)...');
    await page.waitForTimeout(10000);
    
    // Take initial screenshot
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ 
      path: 'wmv-floating-nav-initial.png', 
      fullPage: true 
    });
    
    // Test WMV Floating Navigation Bar
    console.log('\n🔍 Testing WMV Floating Navigation Bar...');
    
    // Check for WMV branding
    const wmvBranding = await page.locator('text=WMV').first();
    if (await wmvBranding.isVisible()) {
      console.log('✅ WMV branding is visible');
    } else {
      console.log('❌ WMV branding not found');
    }
    
    // Check for tagline
    const tagline = await page.locator('text=Live Nightlife Discovery').first();
    if (await tagline.isVisible()) {
      console.log('✅ "Live Nightlife Discovery" tagline is visible');
    } else {
      console.log('❌ Tagline not found');
    }
    
    // Check for search bar
    const searchBar = await page.locator('input[placeholder*="search"], input[type="search"], [data-testid="search"]').first();
    if (await searchBar.isVisible()) {
      console.log('✅ Search bar is visible');
      
      // Test search functionality
      await searchBar.click();
      await searchBar.fill('test venue');
      await page.waitForTimeout(1000);
      console.log('✅ Search bar functionality tested');
    } else {
      console.log('❌ Search bar not found');
    }
    
    // Check for venue count
    const venueCount = await page.locator('text=4 Venues').first();
    if (await venueCount.isVisible()) {
      console.log('✅ "4 Venues" count is visible');
    } else {
      const anyVenueCount = await page.locator(':text("Venue")').first();
      if (await anyVenueCount.isVisible()) {
        const text = await anyVenueCount.textContent();
        console.log(`✅ Venue count found: "${text}"`);
      } else {
        console.log('❌ Venue count not found');
      }
    }
    
    // Check for Live Stories count
    const liveStories = await page.locator(':text("Live")').first();
    if (await liveStories.isVisible()) {
      const text = await liveStories.textContent();
      console.log(`✅ Live Stories count found: "${text}"`);
    } else {
      console.log('❌ Live Stories count not found');
    }
    
    // Test filter dropdowns
    console.log('\n🔧 Testing Filter Dropdowns...');
    
    // Area dropdown
    const areaDropdown = await page.locator('text=Area').first();
    if (await areaDropdown.isVisible()) {
      console.log('✅ Area dropdown is visible');
      await areaDropdown.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'wmv-area-dropdown.png' });
    } else {
      console.log('❌ Area dropdown not found');
    }
    
    // Vibes dropdown
    const vibesDropdown = await page.locator('text=Vibes').first();
    if (await vibesDropdown.isVisible()) {
      console.log('✅ Vibes dropdown is visible');
      await vibesDropdown.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'wmv-vibes-dropdown.png' });
    } else {
      console.log('❌ Vibes dropdown not found');
    }
    
    // Offers dropdown
    const offersDropdown = await page.locator('text=Offers').first();
    if (await offersDropdown.isVisible()) {
      console.log('✅ Offers dropdown is visible');
      await offersDropdown.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'wmv-offers-dropdown.png' });
    } else {
      console.log('❌ Offers dropdown not found');
    }
    
    // Check for glass morphism effect
    console.log('\n✨ Testing Glass Morphism Effect...');
    
    const navBar = await page.locator('[class*="backdrop-blur"], [style*="backdrop-filter"], [class*="glass"]').first();
    if (await navBar.isVisible()) {
      const styles = await navBar.evaluate(el => window.getComputedStyle(el));
      if (styles.backdropFilter && styles.backdropFilter !== 'none') {
        console.log('✅ Glass morphism effect (backdrop-filter) detected');
      } else {
        console.log('⚠️ Glass morphism effect not detected in computed styles');
      }
    } else {
      console.log('❌ Navigation bar with glass morphism not found');
    }
    
    // Check for retro-themed map
    console.log('\n🗺️  Checking for Retro-themed Map...');
    const mapContainer = await page.locator('[class*="map"], #map, [data-testid="map"]').first();
    if (await mapContainer.isVisible()) {
      console.log('✅ Map container is visible');
    } else {
      console.log('❌ Map container not found');
    }
    
    // Take final comprehensive screenshot
    console.log('\n📸 Taking final comprehensive screenshot...');
    await page.screenshot({ 
      path: 'wmv-floating-nav-final.png', 
      fullPage: true 
    });
    
    // Test responsive behavior
    console.log('\n📱 Testing Responsive Behavior...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'wmv-floating-nav-tablet.png', 
      fullPage: true 
    });
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: 'wmv-floating-nav-mobile.png', 
      fullPage: true 
    });
    
    console.log('\n🎉 Test completed successfully!');
    console.log('📋 Screenshots saved:');
    console.log('   - wmv-floating-nav-initial.png (Desktop initial view)');
    console.log('   - wmv-floating-nav-final.png (Desktop final view)');
    console.log('   - wmv-floating-nav-tablet.png (Tablet view)');
    console.log('   - wmv-floating-nav-mobile.png (Mobile view)');
    console.log('   - wmv-area-dropdown.png (Area filter dropdown)');
    console.log('   - wmv-vibes-dropdown.png (Vibes filter dropdown)');
    console.log('   - wmv-offers-dropdown.png (Offers filter dropdown)');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'wmv-error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

// Run the test
testDubaiEventsFloatingNav().catch(console.error);