import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';

test.describe('Dubai Events Frontend Comprehensive Test', () => {
  test('Analyze page loading, console errors, network failures, and map functionality', async ({ page }) => {
    // Arrays to collect all errors and network failures
    const consoleErrors: string[] = [];
    const networkFailures: any[] = [];
    const networkRequests: any[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
      }
    });
    
    // Listen for network requests and failures
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
    });
    
    page.on('requestfailed', request => {
      networkFailures.push({
        url: request.url(),
        method: request.method(),
        failure: request.failure()?.errorText,
        timestamp: new Date().toISOString()
      });
    });
    
    // Test 1: Page Loading
    console.log('1. Testing page load...');
    let pageLoaded = false;
    let loadError = '';
    
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      pageLoaded = true;
    } catch (error: any) {
      loadError = error.message;
      pageLoaded = false;
    }
    
    // Wait a bit for any async operations
    await page.waitForTimeout(3000);
    
    // Test 2: Check for JavaScript console errors (already collected above)
    console.log('2. Console errors collected:', consoleErrors.length);
    
    // Test 3: Check for network request failures (already collected above)
    console.log('3. Network failures collected:', networkFailures.length);
    
    // Test 4: Check for map markers
    console.log('4. Checking for Google Maps and markers...');
    let mapVisible = false;
    let markersCount = 0;
    let googleMapsLoaded = false;
    
    try {
      // Wait for Google Maps to load
      await page.waitForFunction(() => window.google && window.google.maps, { timeout: 10000 });
      googleMapsLoaded = true;
      
      // Check if map container exists
      const mapContainer = await page.locator('[data-testid="map-container"], .map-container, #map, [class*="map"]').first();
      mapVisible = await mapContainer.isVisible().catch(() => false);
      
      // Look for markers in various ways
      const markerSelectors = [
        '[data-testid="venue-marker"]',
        '.venue-marker',
        'div[title*="venue"]',
        'div[title*="restaurant"]',
        'div[title*="bar"]',
        'img[src*="marker"]',
        'div[role="button"][tabindex="0"]' // Google Maps markers often have these attributes
      ];
      
      for (const selector of markerSelectors) {
        try {
          const markers = await page.locator(selector);
          const count = await markers.count();
          if (count > 0) {
            markersCount += count;
          }
        } catch (e) {
          // Selector might not exist, continue
        }
      }
      
      // Also check for Google Maps API markers specifically
      const googleMarkers = await page.evaluate(() => {
        if (window.google && window.google.maps) {
          // Try to access any global markers or map instances
          const mapElements = document.querySelectorAll('div[style*="position: absolute"]');
          return mapElements.length;
        }
        return 0;
      });
      
      if (googleMarkers > markersCount) {
        markersCount = googleMarkers;
      }
      
    } catch (error) {
      console.log('Map/markers check failed:', error);
    }
    
    // Test 5: Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = `dubai-events-test-${timestamp}.png`;
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    // Collect additional page information
    const pageTitle = await page.title();
    const pageUrl = page.url();
    
    // Check for specific API endpoints
    const apiRequests = networkRequests.filter(req => req.url.includes('/api/'));
    const venuesApiRequests = apiRequests.filter(req => req.url.includes('/api/venues'));
    
    // Analyze network responses
    const responses: any[] = [];
    for (const request of apiRequests.slice(0, 10)) { // Limit to first 10 API requests
      try {
        const response = await page.request.get(request.url);
        responses.push({
          url: request.url,
          status: response.status(),
          statusText: response.statusText(),
          headers: await response.allHeaders(),
        });
        
        if (request.url.includes('/api/venues')) {
          try {
            const body = await response.text();
            responses[responses.length - 1].body = body.substring(0, 500); // First 500 chars
          } catch (e) {
            // Body might not be readable
          }
        }
      } catch (e) {
        responses.push({
          url: request.url,
          error: e instanceof Error ? e.message : 'Unknown error'
        });
      }
    }
    
    // Check for specific elements that should be present
    const elementsCheck = {
      navigation: await page.locator('nav, [data-testid="navigation"]').count(),
      buttons: await page.locator('button').count(),
      searchBox: await page.locator('input[type="search"], input[placeholder*="search" i]').count(),
      filterOptions: await page.locator('[data-testid*="filter"], .filter, button[class*="filter" i]').count(),
    };
    
    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      testResults: {
        pageLoaded,
        loadError,
        pageTitle,
        pageUrl,
        googleMapsLoaded,
        mapVisible,
        markersCount
      },
      consoleErrors,
      networkFailures,
      networkRequestsCount: networkRequests.length,
      apiRequestsCount: apiRequests.length,
      venuesApiRequestsCount: venuesApiRequests.length,
      responses,
      elementsFound: elementsCheck,
      screenshot: screenshotPath,
      allNetworkRequests: networkRequests.slice(0, 20), // First 20 requests
    };
    
    // Save detailed report
    const reportPath = `test-report-${timestamp}.json`;
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Console output for immediate feedback
    console.log('\n=== DUBAI EVENTS FRONTEND TEST REPORT ===');
    console.log(`\n1. PAGE LOADING:`);
    console.log(`   ✓ Page loaded successfully: ${pageLoaded}`);
    if (loadError) console.log(`   ✗ Load error: ${loadError}`);
    console.log(`   ✓ Page title: "${pageTitle}"`);
    console.log(`   ✓ Page URL: ${pageUrl}`);
    
    console.log(`\n2. JAVASCRIPT CONSOLE ERRORS: ${consoleErrors.length} found`);
    consoleErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
    
    console.log(`\n3. NETWORK REQUEST FAILURES: ${networkFailures.length} found`);
    networkFailures.forEach((failure, i) => {
      console.log(`   ${i + 1}. ${failure.method} ${failure.url} - ${failure.failure}`);
    });
    
    console.log(`\n4. GOOGLE MAPS & MARKERS:`);
    console.log(`   ✓ Google Maps API loaded: ${googleMapsLoaded}`);
    console.log(`   ✓ Map container visible: ${mapVisible}`);
    console.log(`   ✓ Markers found: ${markersCount}`);
    
    console.log(`\n5. API REQUESTS ANALYSIS:`);
    console.log(`   ✓ Total network requests: ${networkRequests.length}`);
    console.log(`   ✓ API requests: ${apiRequests.length}`);
    console.log(`   ✓ Venues API requests: ${venuesApiRequestsCount}`);
    
    console.log(`\n6. API RESPONSES (sample):`);
    responses.slice(0, 5).forEach((resp, i) => {
      console.log(`   ${i + 1}. ${resp.url}`);
      if (resp.status) {
        console.log(`      Status: ${resp.status} ${resp.statusText}`);
        if (resp.body) {
          console.log(`      Body (first 200 chars): ${resp.body.substring(0, 200)}...`);
        }
      } else if (resp.error) {
        console.log(`      Error: ${resp.error}`);
      }
    });
    
    console.log(`\n7. PAGE ELEMENTS FOUND:`);
    Object.entries(elementsCheck).forEach(([key, count]) => {
      console.log(`   ✓ ${key}: ${count}`);
    });
    
    console.log(`\n8. FILES GENERATED:`);
    console.log(`   ✓ Screenshot: ${screenshotPath}`);
    console.log(`   ✓ Detailed report: ${reportPath}`);
    
    console.log('\n=== END REPORT ===\n');
    
    // Make assertions for the test framework
    expect(pageLoaded).toBe(true);
    // Note: We're not failing the test for other issues since they might be expected during development
  });
});