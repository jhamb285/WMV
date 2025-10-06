import { test, expect } from '@playwright/test';

test('Test venue pin click functionality and capture screenshots', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => {
    console.log(`🌐 BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });

  // Navigate to the application
  console.log('📍 Navigating to localhost:3002...');
  await page.goto('http://localhost:3002');

  // Wait for the page to load
  console.log('⏳ Waiting for page to load...');
  await page.waitForLoadState('networkidle');

  // Wait for Google Maps to load - try different selectors
  console.log('🗺️ Waiting for Google Maps to load...');
  try {
    await page.waitForSelector('[role="application"]', { timeout: 5000 });
    console.log('✅ Found Google Maps with role="application"');
  } catch {
    console.log('⚠️ No role="application" found, trying other selectors...');
    try {
      await page.waitForSelector('.gm-style', { timeout: 5000 });
      console.log('✅ Found Google Maps with class="gm-style"');
    } catch {
      console.log('⚠️ No .gm-style found either, continuing anyway...');
    }
  }

  // Wait a bit more for markers to render
  await page.waitForTimeout(3000);

  // Take initial screenshot regardless
  console.log('📸 Taking initial screenshot...');
  await page.screenshot({ path: 'initial-state.png', fullPage: true });

  // Try to find Google Maps markers
  console.log('🔍 Looking for Google Maps markers...');
  
  // Google Maps markers are typically img elements with specific attributes
  const markers = await page.locator('img[src*="marker"]').count();
  console.log(`📍 Found ${markers} markers with marker in src`);

  // Also try to find markers by other attributes
  const allMarkers = await page.locator('img[role="button"]').count();
  console.log(`📍 Found ${allMarkers} clickable images (potential markers)`);

  // Try to find any clickable elements within the map
  const mapClickables = await page.locator('[role="application"] img[role="button"]').count();
  console.log(`📍 Found ${mapClickables} clickable elements within map`);

  // Get all images within the map to see what we have
  const mapImages = await page.locator('[role="application"] img').count();
  console.log(`📍 Total images in map: ${mapImages}`);

  // Try to click on the first marker we can find
  try {
    console.log('🖱️ Attempting to click on first marker...');
    
    // Try different selectors for Google Maps markers
    const possibleMarkerSelectors = [
      'img[role="button"]',
      'img[src*="marker"]',
      'img[alt*="marker"]',
      '[role="application"] img[role="button"]',
      'div[role="button"][tabindex="0"]' // Sometimes markers are divs
    ];

    let clicked = false;
    for (const selector of possibleMarkerSelectors) {
      const elements = await page.locator(selector).count();
      console.log(`🔍 Found ${elements} elements with selector: ${selector}`);
      
      if (elements > 0) {
        console.log(`🖱️ Clicking on first element with selector: ${selector}`);
        await page.locator(selector).first().click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      console.log('❌ No markers found to click');
    }

    // Wait a moment for any UI response
    await page.waitForTimeout(2000);

    // Take screenshot after clicking
    console.log('📸 Taking screenshot after click attempt...');
    await page.screenshot({ path: 'after-click.png', fullPage: true });

    // Check if sidebar opened - try multiple selectors for the VenueDetailsSidebar
    const sidebarSelectors = [
      '[data-testid="venue-sidebar"]',
      '.fixed.right-0.h-full', // The sidebar has these classes
      'div:has-text("WHITE Dubai")', // Should contain the venue name
      '.bg-slate-900', // Sidebar background class
    ];

    let sidebarFound = false;
    for (const selector of sidebarSelectors) {
      const isVisible = await page.locator(selector).isVisible().catch(() => false);
      console.log(`🔍 Checking selector "${selector}": ${isVisible}`);
      if (isVisible) {
        sidebarFound = true;
        console.log(`✅ Sidebar found with selector: ${selector}`);
        break;
      }
    }

    console.log(`🔍 Overall sidebar visible after click: ${sidebarFound}`);

    // Check for any overlays that might indicate sidebar opened
    const overlays = await page.locator('.fixed.inset-0, [role="dialog"], .modal, .sidebar').count();
    console.log(`📱 Found ${overlays} potential overlay/modal/fixed elements`);

    // Check for backdrop
    const backdrop = await page.locator('.bg-black\\/20.backdrop-blur-sm').count();
    console.log(`🌫️ Found ${backdrop} backdrop elements`);

  } catch (error) {
    console.log('❌ Error clicking marker:', error);
    await page.screenshot({ path: 'error-state.png', fullPage: true });
  }

  // Log final page state
  console.log('✅ Test completed');
});