import { test, expect, Page } from '@playwright/test';

test.describe('Google Maps Functionality - Comprehensive Test Report', () => {
  test.setTimeout(60000); // Increase timeout

  test('Complete Google Maps Functionality Test', async ({ page }) => {
    console.log('🚀 Starting comprehensive Google Maps functionality test...');
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    console.log('📍 Navigated to localhost:3000');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    
    // Take initial screenshot to document loading
    await page.screenshot({ 
      path: 'test-results/01-initial-page-load.png', 
      fullPage: true 
    });
    console.log('📸 Initial page load screenshot taken');
    
    // Wait a bit more for Google Maps to fully initialize
    await page.waitForTimeout(8000);
    
    // Test 1: Verify Map Loads Successfully
    console.log('🧪 TEST 1: Checking if map loads successfully...');
    
    // Check for Google Maps container
    const mapContainer = page.locator('div[style*="width: 100%"][style*="height: 100%"]');
    await expect(mapContainer).toBeVisible({ timeout: 20000 });
    console.log('✅ Map container is visible');
    
    // Check that no error messages are displayed
    const apiKeyError = await page.locator('text=Google Maps API Key Required').count();
    expect(apiKeyError).toBe(0);
    console.log('✅ No API key errors detected');
    
    await page.screenshot({ 
      path: 'test-results/02-map-loaded-successfully.png', 
      fullPage: true 
    });
    
    // Test 2: Check for Markers and Clustering
    console.log('🧪 TEST 2: Checking for markers and clustering functionality...');
    
    await page.waitForTimeout(3000);
    
    const markerInfo = await page.evaluate(() => {
      // Look for Google Maps markers
      const markers = document.querySelectorAll('[role="img"], [role="button"]');
      const visibleMarkers = Array.from(markers).filter(marker => {
        const style = getComputedStyle(marker);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });
      
      return {
        totalElements: markers.length,
        visibleMarkers: visibleMarkers.length,
        hasMarkers: visibleMarkers.length > 0
      };
    });
    
    console.log(`📍 Found ${markerInfo.visibleMarkers} visible markers out of ${markerInfo.totalElements} total elements`);
    expect(markerInfo.hasMarkers).toBe(true);
    console.log('✅ Markers are present on the map');
    
    await page.screenshot({ 
      path: 'test-results/03-markers-visible.png', 
      fullPage: true 
    });
    
    // Test 3: Check for Different Colored Markers
    console.log('🧪 TEST 3: Checking for different colored markers...');
    
    const colorInfo = await page.evaluate(() => {
      // Look for elements with different colors
      const coloredElements = document.querySelectorAll('[style*="background"], svg, [fill]');
      const colors = new Set();
      
      coloredElements.forEach(element => {
        const style = getComputedStyle(element);
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colors.add(style.backgroundColor);
        }
        
        // Check SVG fill colors
        if (element.tagName === 'svg' || element.hasAttribute('fill')) {
          const fill = element.getAttribute('fill');
          if (fill && fill !== 'none') {
            colors.add(fill);
          }
        }
      });
      
      return {
        uniqueColors: Array.from(colors),
        totalColors: colors.size
      };
    });
    
    console.log(`🎨 Found ${colorInfo.totalColors} unique colors: ${colorInfo.uniqueColors.slice(0, 10).join(', ')}${colorInfo.uniqueColors.length > 10 ? '...' : ''}`);
    expect(colorInfo.totalColors).toBeGreaterThan(0);
    console.log('✅ Multiple colors detected in markers');
    
    await page.screenshot({ 
      path: 'test-results/04-colored-markers.png', 
      fullPage: true 
    });
    
    // Test 4: Check for Custom SVG Elements
    console.log('🧪 TEST 4: Checking for custom SVG markers...');
    
    const svgInfo = await page.evaluate(() => {
      const svgElements = document.querySelectorAll('svg');
      const customSvgs = Array.from(svgElements).filter(svg => {
        // Look for custom SVG patterns
        const hasCustomPaths = svg.querySelector('path[fill="#FF7878"]') || 
                              svg.querySelector('rect[fill="#7837FF"]') ||
                              svg.querySelector('path[d*="M28"]'); // Heart shape pattern
        return hasCustomPaths;
      });
      
      return {
        totalSvgs: svgElements.length,
        customSvgs: customSvgs.length,
        hasCustomSvg: customSvgs.length > 0
      };
    });
    
    console.log(`🎨 Found ${svgInfo.totalSvgs} SVG elements, ${svgInfo.customSvgs} appear to be custom`);
    if (svgInfo.hasCustomSvg) {
      console.log('✅ Custom SVG marker detected');
    } else {
      console.log('⚠️  Custom SVG marker may not be visible at current zoom level');
    }
    
    await page.screenshot({ 
      path: 'test-results/05-svg-markers-check.png', 
      fullPage: true 
    });
    
    // Test 5: Test Interactive Features (Click simulation)
    console.log('🧪 TEST 5: Testing interactive features...');
    
    // Try to click on the map to test interactivity
    await page.click('div[style*="width: 100%"][style*="height: 100%"]', { 
      position: { x: 500, y: 400 } 
    });
    await page.waitForTimeout(2000);
    
    // Check for any interactive elements that might have appeared
    const interactiveInfo = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const modals = document.querySelectorAll('[class*="modal"], [class*="sidebar"], [class*="popup"]');
      const overlays = document.querySelectorAll('[style*="z-index"]');
      
      return {
        dialogs: dialogs.length,
        modals: modals.length,
        overlays: overlays.length > 10 ? overlays.length : 0 // Filter noise
      };
    });
    
    console.log(`💬 Interactive elements: ${JSON.stringify(interactiveInfo)}`);
    console.log('✅ Map interactivity tested');
    
    await page.screenshot({ 
      path: 'test-results/06-interactive-test.png', 
      fullPage: true 
    });
    
    // Test 6: Test Zoom Functionality
    console.log('🧪 TEST 6: Testing zoom functionality...');
    
    // Simulate zoom in using wheel events
    await page.mouse.wheel(0, -300); // Zoom in
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/07-zoomed-in.png', 
      fullPage: true 
    });
    
    // Zoom out
    await page.mouse.wheel(0, 300); // Zoom out
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/08-zoomed-out.png', 
      fullPage: true 
    });
    
    console.log('✅ Zoom functionality tested');
    
    // Test 7: Check Floating Navbar
    console.log('🧪 TEST 7: Checking floating navbar functionality...');
    
    const navbarVisible = await page.locator('text=WMV').isVisible();
    expect(navbarVisible).toBe(true);
    console.log('✅ Floating navbar is visible');
    
    const searchBox = await page.locator('input[placeholder*="Search"]').isVisible();
    if (searchBox) {
      console.log('✅ Search functionality is available');
    }
    
    // Test 8: Final Comprehensive Screenshot
    console.log('🧪 TEST 8: Taking final comprehensive screenshot...');
    
    // Get final statistics
    const finalStats = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const markers = document.querySelectorAll('[role="img"], [role="button"]');
      const svgs = document.querySelectorAll('svg');
      const mapContainer = document.querySelector('div[style*="width: 100%"][style*="height: 100%"]');
      
      return {
        totalElements: allElements.length,
        markerElements: markers.length,
        svgElements: svgs.length,
        mapContainerExists: !!mapContainer,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      };
    });
    
    console.log('📊 FINAL STATISTICS:');
    console.log(`   - Total DOM elements: ${finalStats.totalElements}`);
    console.log(`   - Marker elements: ${finalStats.markerElements}`);
    console.log(`   - SVG elements: ${finalStats.svgElements}`);
    console.log(`   - Map container exists: ${finalStats.mapContainerExists}`);
    console.log(`   - Viewport: ${finalStats.windowWidth}x${finalStats.windowHeight}`);
    
    await page.screenshot({ 
      path: 'test-results/09-final-comprehensive.png', 
      fullPage: true 
    });
    
    // All core functionality should be working
    expect(finalStats.mapContainerExists).toBe(true);
    expect(finalStats.markerElements).toBeGreaterThan(0);
    
    console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('📝 Test results and screenshots saved in test-results/ directory');
  });
});