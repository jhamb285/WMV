import { test, expect } from '@playwright/test';

test('Test sidebar artists display', async ({ page }) => {
  console.log('🚀 Testing sidebar artists display...');
  
  // Navigate to the website
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  
  console.log('📍 Navigated to localhost:3001');
  
  // Wait for map and markers to load
  await page.waitForTimeout(3000);
  
  // Look for any clickable markers on the map
  const markers = await page.locator('[role="button"]').filter({ hasText: /venue|location|marker/i }).or(
    page.locator('div[style*="cursor: pointer"]')
  ).or(
    page.locator('[data-testid*="marker"]')
  ).or(
    page.locator('.gm-style div[role="button"]')
  );
  
  console.log(`📍 Found ${await markers.count()} potential markers`);
  
  // If we can't find specific markers, try clicking somewhere on the map where markers typically are
  if (await markers.count() === 0) {
    console.log('🎯 No specific markers found, trying to click on map area');
    
    // Try clicking in different areas of the map where venues might be
    const mapContainer = page.locator('.gm-style, [role="region"][aria-label="Map"]').first();
    if (await mapContainer.isVisible()) {
      // Click in center-left area (typical Dubai Marina/JBR area)
      await mapContainer.click({ position: { x: 400, y: 300 } });
      await page.waitForTimeout(1000);
      
      // Try another area if sidebar didn't open
      if (!(await page.locator('[data-testid="venue-sidebar"]').or(page.locator('.fixed.right-0')).isVisible())) {
        await mapContainer.click({ position: { x: 600, y: 400 } });
        await page.waitForTimeout(1000);
      }
    }
  } else {
    // Use force click to bypass overlay issues
    await markers.first().click({ force: true });
    await page.waitForTimeout(1500);
  }
  
  // Look for the sidebar - it should be a fixed right panel
  const sidebar = page.locator('.fixed.right-0, [data-testid="venue-sidebar"]').first();
  
  if (await sidebar.isVisible()) {
    console.log('✅ Sidebar is visible!');
    
    // Take screenshot of the sidebar
    await page.screenshot({ 
      path: '/tmp/sidebar-with-artists.png',
      fullPage: true 
    });
    
    // Look for artists section
    const artistsSection = sidebar.locator('text=Artists').or(sidebar.locator('text=Artist')).first();
    const artistBadges = sidebar.locator('[class*="badge"], [class*="Badge"]').filter({ hasText: /DJ|Artist|Music/ });
    
    console.log('🎵 Artists section visible:', await artistsSection.isVisible());
    console.log('🎵 Artist badges count:', await artistBadges.count());
    
    // Print all text content in the sidebar for debugging
    const sidebarText = await sidebar.textContent();
    console.log('📝 Sidebar content preview:', sidebarText?.substring(0, 500));
    
    // Look for specific artist names from our dummy data
    const djSnake = sidebar.locator('text=DJ Snake');
    const martinGarrix = sidebar.locator('text=Martin Garrix');
    const tiesto = sidebar.locator('text=Tiësto');
    
    console.log('🎵 DJ Snake visible:', await djSnake.isVisible());
    console.log('🎵 Martin Garrix visible:', await martinGarrix.isVisible());
    console.log('🎵 Tiësto visible:', await tiesto.isVisible());
    
  } else {
    console.log('❌ Sidebar is not visible');
    
    // Take screenshot anyway to see current state
    await page.screenshot({ 
      path: '/tmp/no-sidebar-state.png',
      fullPage: true 
    });
  }
  
  console.log('✅ Test completed');
});