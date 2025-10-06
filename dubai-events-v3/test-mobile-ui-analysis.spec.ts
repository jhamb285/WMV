import { test, expect } from '@playwright/test';

test('Comprehensive mobile UI analysis and alignment check', async ({ browser }) => {
  // Create mobile context with touch support
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE size
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  console.log('📱 Starting comprehensive mobile UI analysis...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 1. FLOATING NAVBAR ANALYSIS
  console.log('\n🔍 1. ANALYZING FLOATING NAVBAR...');
  const navbar = page.locator('.absolute.top-4.left-1\\/2.transform.-translate-x-1\\/2');
  const navbarExists = await navbar.count() > 0;
  console.log(`Navbar exists: ${navbarExists}`);
  
  if (navbarExists) {
    const navbarBox = await navbar.boundingBox();
    console.log(`Navbar position: x=${navbarBox?.x}, y=${navbarBox?.y}`);
    console.log(`Navbar size: width=${navbarBox?.width}, height=${navbarBox?.height}`);
    
    // Check if navbar overflows viewport
    const overflowsRight = (navbarBox?.x || 0) + (navbarBox?.width || 0) > 375;
    const overflowsLeft = (navbarBox?.x || 0) < 0;
    console.log(`Navbar overflow - Right: ${overflowsRight}, Left: ${overflowsLeft}`);
  }

  // 2. NAVBAR CONTENT ANALYSIS
  console.log('\n🔍 2. ANALYZING NAVBAR CONTENT...');
  const wmvLogo = page.locator('text=WMV');
  const areaDropdown = page.locator('text=All Dubai');
  const vibesButton = page.locator('text=Vibes');
  const offersButton = page.locator('text=Offers');
  
  console.log(`WMV Logo visible: ${await wmvLogo.isVisible()}`);
  console.log(`Area dropdown visible: ${await areaDropdown.isVisible()}`);
  console.log(`Vibes button visible: ${await vibesButton.isVisible()}`);
  console.log(`Offers button visible: ${await offersButton.isVisible()}`);

  // Check if buttons are properly sized for touch
  const vibesBox = await vibesButton.boundingBox();
  const offersBox = await offersButton.boundingBox();
  console.log(`Vibes button size: ${vibesBox?.width}x${vibesBox?.height}`);
  console.log(`Offers button size: ${offersBox?.width}x${offersBox?.height}`);
  
  // Touch target should be at least 44px for mobile
  const vibesGoodSize = (vibesBox?.width || 0) >= 44 && (vibesBox?.height || 0) >= 44;
  const offersGoodSize = (offersBox?.width || 0) >= 44 && (offersBox?.height || 0) >= 44;
  console.log(`Vibes button proper touch size: ${vibesGoodSize}`);
  console.log(`Offers button proper touch size: ${offersGoodSize}`);

  // 3. MAP CONTAINER ANALYSIS  
  console.log('\n🔍 3. ANALYZING MAP CONTAINER...');
  const mapContainer = page.locator('.relative.h-screen.w-full');
  const mapExists = await mapContainer.count() > 0;
  console.log(`Map container exists: ${mapExists}`);
  
  if (mapExists) {
    const mapBox = await mapContainer.boundingBox();
    console.log(`Map container size: ${mapBox?.width}x${mapBox?.height}`);
    console.log(`Map fills viewport: ${mapBox?.width === 375 && mapBox?.height === 667}`);
  }

  // 4. VENUE PIN ANALYSIS
  console.log('\n🔍 4. ANALYZING VENUE PINS...');
  await page.waitForTimeout(2000); // Wait for pins to load
  
  const pins = page.locator('div[role="button"][tabindex="0"]');
  const pinCount = await pins.count();
  console.log(`Total venue pins found: ${pinCount}`);
  
  if (pinCount > 0) {
    // Analyze first few pins
    for (let i = 0; i < Math.min(3, pinCount); i++) {
      const pin = pins.nth(i);
      const pinBox = await pin.boundingBox();
      const isVisible = await pin.isVisible();
      console.log(`Pin ${i + 1}: visible=${isVisible}, size=${pinBox?.width}x${pinBox?.height}, pos=${pinBox?.x},${pinBox?.y}`);
    }
  }

  // Take screenshot of current state
  await page.screenshot({ path: 'mobile-ui-analysis-initial.png', fullPage: true });

  // 5. CLICK A VENUE PIN AND ANALYZE SIDEBAR
  console.log('\n🔍 5. ANALYZING SIDEBAR AFTER PIN CLICK...');
  if (pinCount > 0) {
    await pins.first().click();
    await page.waitForTimeout(1000);
    
    // Analyze sidebar
    const sidebar = page.locator('.fixed.top-0.right-0.h-full');
    const sidebarVisible = await sidebar.isVisible();
    console.log(`Sidebar visible after click: ${sidebarVisible}`);
    
    if (sidebarVisible) {
      const sidebarBox = await sidebar.boundingBox();
      console.log(`Sidebar position: x=${sidebarBox?.x}, y=${sidebarBox?.y}`);
      console.log(`Sidebar size: ${sidebarBox?.width}x${sidebarBox?.height}`);
      
      // Check if sidebar covers map appropriately
      const coversMap = (sidebarBox?.x || 0) < 375;
      const fullHeight = sidebarBox?.height === 667;
      console.log(`Sidebar covers map: ${coversMap}`);
      console.log(`Sidebar full height: ${fullHeight}`);
      
      // Check sidebar width on mobile
      const sidebarWidth = sidebarBox?.width || 0;
      const reasonableWidth = sidebarWidth > 250 && sidebarWidth <= 375;
      console.log(`Sidebar width: ${sidebarWidth}px (reasonable: ${reasonableWidth})`);
    }

    // 6. ANALYZE SIDEBAR CONTENT
    console.log('\n🔍 6. ANALYZING SIDEBAR CONTENT LAYOUT...');
    const venueName = page.locator('.fixed.top-0.right-0 h1, .fixed.top-0.right-0 h2');
    const closeButton = page.locator('.fixed.top-0.right-0 button');
    const venueDetails = page.locator('.fixed.top-0.right-0 .text-slate-300');
    
    console.log(`Venue name visible: ${await venueName.isVisible()}`);
    console.log(`Close button visible: ${await closeButton.isVisible()}`);
    console.log(`Venue details visible: ${await venueDetails.isVisible()}`);
    
    // Check close button position and size
    const closeBox = await closeButton.boundingBox();
    if (closeBox) {
      console.log(`Close button size: ${closeBox.width}x${closeBox.height}`);
      console.log(`Close button position: x=${closeBox.x}, y=${closeBox.y}`);
      const goodTouchTarget = closeBox.width >= 44 && closeBox.height >= 44;
      console.log(`Close button good touch target: ${goodTouchTarget}`);
    }

    // Take screenshot with sidebar open
    await page.screenshot({ path: 'mobile-ui-analysis-with-sidebar.png', fullPage: true });

    // 7. CHECK FOR CONTENT OVERFLOW
    console.log('\n🔍 7. CHECKING FOR CONTENT OVERFLOW...');
    
    // Check if content is cut off or overflowing
    const sidebarContent = page.locator('.fixed.top-0.right-0');
    const scrollHeight = await sidebarContent.evaluate(el => el.scrollHeight);
    const clientHeight = await sidebarContent.evaluate(el => el.clientHeight);
    const hasScroll = scrollHeight > clientHeight;
    
    console.log(`Sidebar scroll height: ${scrollHeight}px`);
    console.log(`Sidebar client height: ${clientHeight}px`);
    console.log(`Content requires scrolling: ${hasScroll}`);
    
    // 8. TEST SCROLLING BEHAVIOR
    if (hasScroll) {
      console.log('\n🔍 8. TESTING SCROLL BEHAVIOR...');
      await page.mouse.wheel(0, 100); // Scroll down
      await page.waitForTimeout(500);
      console.log('Scrolled down in sidebar');
      await page.screenshot({ path: 'mobile-ui-analysis-scrolled.png', fullPage: true });
    }

    // 9. TEST CLOSE FUNCTIONALITY
    console.log('\n🔍 9. TESTING CLOSE FUNCTIONALITY...');
    try {
      await closeButton.click();
      await page.waitForTimeout(1000);
      const sidebarStillVisible = await sidebar.isVisible();
      console.log(`Sidebar closed successfully: ${!sidebarStillVisible}`);
    } catch (error) {
      console.log(`Close button click failed: ${error}`);
    }
  }

  // 10. FINAL VIEWPORT AND POSITIONING ANALYSIS
  console.log('\n🔍 10. FINAL POSITIONING ANALYSIS...');
  
  // Check if any elements are positioned outside viewport
  const allElements = page.locator('*');
  const elementCount = await allElements.count();
  let elementsOutsideViewport = 0;
  
  for (let i = 0; i < Math.min(50, elementCount); i++) { // Check first 50 elements
    const element = allElements.nth(i);
    const box = await element.boundingBox();
    if (box) {
      const outsideRight = box.x > 375;
      const outsideLeft = box.x + box.width < 0;
      const outsideBottom = box.y > 667;
      const outsideTop = box.y + box.height < 0;
      
      if (outsideRight || outsideLeft || outsideBottom || outsideTop) {
        elementsOutsideViewport++;
      }
    }
  }
  
  console.log(`Elements outside viewport: ${elementsOutsideViewport}`);

  // Take final screenshot
  await page.screenshot({ path: 'mobile-ui-analysis-final.png', fullPage: true });

  console.log('\n✅ Mobile UI analysis completed!');
  console.log('\n📋 SUMMARY OF ISSUES TO INVESTIGATE:');
  console.log('1. Check navbar positioning and overflow');
  console.log('2. Verify touch target sizes (minimum 44px)');
  console.log('3. Analyze sidebar width and positioning');
  console.log('4. Check content overflow and scrolling');
  console.log('5. Verify close button accessibility');
  console.log('6. Look for elements outside viewport bounds');

  // Clean up
  await context.close();
});