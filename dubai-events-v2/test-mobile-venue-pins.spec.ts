import { test, expect, devices } from '@playwright/test';

test('Test venue pin click functionality on mobile and capture screenshots', async ({ browser }) => {
  // Create mobile context with touch support
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE size
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`📱 MOBILE BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });

  // Navigate to the application
  console.log('📱 Navigating to localhost:3002 on mobile...');
  await page.goto('http://localhost:3002');

  // Wait for the page to load
  console.log('⏳ Waiting for mobile page to load...');
  await page.waitForLoadState('networkidle');

  // Wait for Google Maps to load
  console.log('🗺️ Waiting for Google Maps to load on mobile...');
  try {
    await page.waitForSelector('[role="application"]', { timeout: 5000 });
    console.log('✅ Found Google Maps with role="application" on mobile');
  } catch {
    console.log('⚠️ No role="application" found, trying other selectors...');
    try {
      await page.waitForSelector('.gm-style', { timeout: 5000 });
      console.log('✅ Found Google Maps with class="gm-style" on mobile');
    } catch {
      console.log('⚠️ No .gm-style found either, continuing anyway...');
    }
  }

  // Wait a bit more for markers to render
  await page.waitForTimeout(3000);

  // Take initial mobile screenshot
  console.log('📸 Taking initial mobile screenshot...');
  await page.screenshot({ path: 'mobile-initial-state.png', fullPage: true });

  // Try to find and click on a venue pin
  console.log('🔍 Looking for venue pins on mobile...');
  
  const possibleMarkerSelectors = [
    'img[role="button"]',
    'img[src*="marker"]', 
    'img[alt*="marker"]',
    '[role="application"] img[role="button"]',
    'div[role="button"][tabindex="0"]'
  ];

  let clicked = false;
  for (const selector of possibleMarkerSelectors) {
    const elements = await page.locator(selector).count();
    console.log(`🔍 Found ${elements} elements with selector on mobile: ${selector}`);
    
    if (elements > 0) {
      console.log(`📱 Attempting to tap first element with selector: ${selector}`);
      await page.locator(selector).first().tap(); // Use tap instead of click for mobile
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    console.log('❌ No venue pins found to tap on mobile');
  }

  // Wait a moment for any UI response
  await page.waitForTimeout(2000);

  // Take screenshot after tapping
  console.log('📸 Taking mobile screenshot after tap attempt...');
  await page.screenshot({ path: 'mobile-after-tap.png', fullPage: true });

  // Check if sidebar opened on mobile
  const mobileSidebarSelectors = [
    '[data-testid="venue-sidebar"]',
    '.fixed.right-0.h-full',
    'div:has-text("WHITE Dubai")',
    '.bg-slate-900',
  ];

  let sidebarFound = false;
  for (const selector of mobileSidebarSelectors) {
    const isVisible = await page.locator(selector).isVisible().catch(() => false);
    console.log(`🔍 Checking mobile sidebar selector "${selector}": ${isVisible}`);
    if (isVisible) {
      sidebarFound = true;
      console.log(`✅ Mobile sidebar found with selector: ${selector}`);
      break;
    }
  }

  console.log(`📱 Overall sidebar visible on mobile after tap: ${sidebarFound}`);

  // Check for mobile-specific overlay elements
  const mobileOverlays = await page.locator('.fixed.inset-0, [role="dialog"], .modal, .sidebar').count();
  console.log(`📱 Found ${mobileOverlays} potential mobile overlay/modal/fixed elements`);

  // Check for backdrop on mobile
  const mobileBackdrop = await page.locator('.bg-black\\/20.backdrop-blur-sm').count();
  console.log(`🌫️ Found ${mobileBackdrop} mobile backdrop elements`);

  // Test mobile sidebar interaction if it opened
  if (sidebarFound) {
    console.log('📱 Testing mobile sidebar interactions...');
    
    // Try to close sidebar by tapping backdrop or close button
    const closeButton = page.locator('button:has-text("×"), [aria-label="Close"]');
    const closeButtonCount = await closeButton.count();
    console.log(`📱 Found ${closeButtonCount} close buttons on mobile`);
    
    if (closeButtonCount > 0) {
      console.log('📱 Tapping close button on mobile...');
      await closeButton.first().tap();
      await page.waitForTimeout(1000);
      
      // Check if sidebar closed
      const sidebarStillVisible = await page.locator('.fixed.right-0.h-full').isVisible().catch(() => false);
      console.log(`📱 Sidebar still visible after close tap: ${sidebarStillVisible}`);
    }
  }

  // Take final mobile screenshot
  console.log('📸 Taking final mobile screenshot...');
  await page.screenshot({ path: 'mobile-final-state.png', fullPage: true });

  console.log('✅ Mobile test completed');
  
  // Clean up
  await context.close();
});

test('Test venue pin functionality on tablet', async ({ page }) => {
  // Set tablet viewport  
  await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`📟 TABLET BROWSER CONSOLE [${msg.type()}]:`, msg.text());
  });

  console.log('📟 Testing on tablet viewport...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  // Wait for maps to load
  await page.waitForTimeout(3000);
  
  // Take tablet screenshot
  await page.screenshot({ path: 'tablet-state.png', fullPage: true });
  
  // Try to interact with venue pins on tablet
  const tabletMarkers = await page.locator('div[role="button"][tabindex="0"]').count();
  console.log(`📟 Found ${tabletMarkers} clickable elements on tablet`);
  
  if (tabletMarkers > 0) {
    await page.locator('div[role="button"][tabindex="0"]').first().click();
    await page.waitForTimeout(1000);
    
    const tabletSidebarVisible = await page.locator('.fixed.right-0.h-full').isVisible().catch(() => false);
    console.log(`📟 Sidebar visible on tablet: ${tabletSidebarVisible}`);
    
    await page.screenshot({ path: 'tablet-after-click.png', fullPage: true });
  }
  
  console.log('✅ Tablet test completed');
});