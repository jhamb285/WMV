import { test, expect } from '@playwright/test';

test('Simple venue markers test', async ({ page }) => {
  console.log('🧪 Starting venue markers test...');
  
  // Navigate to the application
  await page.goto('http://localhost:3004');
  console.log('✅ Page loaded');
  
  // Wait for venues API to return successfully
  const apiResponse = await page.waitForResponse(
    response => response.url().includes('/api/venues') && response.status() === 200,
    { timeout: 15000 }
  );
  console.log('✅ Venues API responded successfully');
  
  // Check API response content
  const apiData = await apiResponse.json();
  console.log(`📊 API returned ${apiData.data.length} venues`);
  console.log(`📍 First venue: ${apiData.data[0].name} (ID: ${apiData.data[0].venue_id})`);
  
  // Wait for Google Maps to load
  await expect(page.locator('.gm-style')).toBeVisible({ timeout: 15000 });
  console.log('✅ Google Maps loaded');
  
  // Wait a bit for markers to render
  await page.waitForTimeout(5000);
  
  // Take a screenshot for visual verification
  await page.screenshot({ 
    path: 'markers-verification.png',
    fullPage: true 
  });
  console.log('📸 Screenshot saved as markers-verification.png');
  
  // Look for Google Maps marker images
  const markerImages = page.locator('img[src*="maps.google.com/mapfiles/ms/icons"]');
  const markerCount = await markerImages.count();
  console.log(`🎯 Found ${markerCount} Google Maps markers`);
  
  // Log marker details if found
  if (markerCount > 0) {
    for (let i = 0; i < Math.min(markerCount, 3); i++) {
      const marker = markerImages.nth(i);
      const src = await marker.getAttribute('src');
      console.log(`🎯 Marker ${i + 1}: ${src}`);
    }
  }
  
  // Check if we have markers (should be > 0 since we have 50 venues)
  expect(markerCount).toBeGreaterThan(0);
  
  console.log('✅ Test completed successfully!');
});