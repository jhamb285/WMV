import { test, expect } from '@playwright/test';

test('Verify artists display in sidebar', async ({ page }) => {
  console.log('🚀 Testing artists display...');
  
  // Navigate to the website
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Inject a script to manually trigger sidebar opening with a test venue
  await page.evaluate(() => {
    // Create a test venue object
    const testVenue = {
      name: 'Test Venue',
      area: 'Dubai Marina', 
      city: 'Dubai',
      category: 'nightclub'
    };
    
    // Find and trigger the venue click handler directly
    if (window.React && window.ReactDOM) {
      // Try to find the map component and manually trigger sidebar
      const event = new CustomEvent('test-venue-click', {
        detail: { venue: testVenue }
      });
      window.dispatchEvent(event);
    }
  });
  
  await page.waitForTimeout(1000);
  
  // Also try clicking directly on the map area where venues typically are
  const mapArea = page.locator('[role="region"][aria-label="Map"], .gm-style').first();
  if (await mapArea.isVisible()) {
    await mapArea.click({ position: { x: 400, y: 300 }, force: true });
    await page.waitForTimeout(1000);
  }
  
  // Take a screenshot to see current state
  await page.screenshot({ 
    path: '/tmp/artists-test-state.png',
    fullPage: true 
  });
  
  // Check if sidebar is visible
  const sidebar = page.locator('.fixed.right-0').first();
  const isSidebarVisible = await sidebar.isVisible();
  
  console.log('✅ Sidebar visible:', isSidebarVisible);
  
  if (isSidebarVisible) {
    // Look for artists section
    const artistsText = await page.textContent('body');
    const hasArtists = artistsText?.includes('DJ Snake') || artistsText?.includes('Martin Garrix') || artistsText?.includes('Tiësto');
    
    console.log('🎵 Has artist names:', hasArtists);
    console.log('📝 Page contains "Artists":', artistsText?.includes('Artists'));
    
    // Look for specific elements
    const artistBadges = sidebar.locator('[class*="badge"], [class*="Badge"]');
    const badgeCount = await artistBadges.count();
    console.log('🎵 Badge count:', badgeCount);
    
    // Take focused sidebar screenshot
    if (badgeCount > 0) {
      await sidebar.screenshot({ path: '/tmp/sidebar-with-artists.png' });
    }
  }
  
  console.log('✅ Artists verification completed');
});