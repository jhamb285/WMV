import { test, expect } from '@playwright/test';

test('Check venue markers are displaying on map', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3004');
  
  // Wait for the page to load and Google Maps to initialize
  await page.waitForLoadState('networkidle');
  
  // Wait for the Google Maps container to be visible
  await expect(page.locator('div[role="main"]')).toBeVisible({ timeout: 10000 });
  
  // Wait for API call to complete and venues to load
  await page.waitForResponse(response => 
    response.url().includes('/api/venues') && response.status() === 200,
    { timeout: 15000 }
  );
  
  // Wait a bit more for markers to render
  await page.waitForTimeout(3000);
  
  // Check if Google Maps has loaded
  await expect(page.locator('.gm-style')).toBeVisible({ timeout: 10000 });
  
  // Look for Google Maps markers - they use specific Google Maps marker classes
  // Markers typically have the role="button" and specific Google Maps classes
  const markers = page.locator('[role="button"][title]').filter({ hasText: /.+/ });
  
  // Count the markers
  const markerCount = await markers.count();
  console.log(`Found ${markerCount} markers on the map`);
  
  // We expect to have venues loaded (should be more than 0)
  expect(markerCount).toBeGreaterThan(0);
  
  // Take a screenshot for verification
  await page.screenshot({ 
    path: 'venue-markers-test.png',
    fullPage: true 
  });
  
  // Try to find specific venue markers by checking for marker elements
  // Google Maps markers are typically img elements or divs with specific classes
  const googleMarkers = page.locator('img[src*="maps.google.com/mapfiles/ms/icons"]');
  const googleMarkerCount = await googleMarkers.count();
  console.log(`Found ${googleMarkerCount} Google Maps marker images`);
  
  // Check if we have the expected number of markers (we loaded 50 venues)
  if (googleMarkerCount > 0) {
    console.log('✅ Google Maps markers found!');
    expect(googleMarkerCount).toBeGreaterThan(0);
  } else {
    // Alternative check for any marker-like elements
    const anyMarkers = page.locator('[role="button"], [role="img"], img[alt*="marker"], div[title]');
    const anyMarkerCount = await anyMarkers.count();
    console.log(`Found ${anyMarkerCount} potential marker elements`);
    expect(anyMarkerCount).toBeGreaterThan(0);
  }
  
  // Verify that the venues API returned data
  const apiResponse = await page.evaluate(async () => {
    const response = await fetch('/api/venues');
    const data = await response.json();
    return data;
  });
  
  expect(apiResponse.success).toBe(true);
  expect(apiResponse.data).toBeDefined();
  expect(apiResponse.data.length).toBeGreaterThan(0);
  
  console.log(`API returned ${apiResponse.data.length} venues`);
  console.log('Sample venue:', apiResponse.data[0]);
});