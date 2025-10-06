const { chromium } = require('playwright');

(async () => {
  console.log('🧪 Starting filter functionality test...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('📱 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({ path: 'test-initial.png' });
    
    // Check if map container is visible
    const mapVisible = await page.isVisible('[data-testid="map-container"]');
    console.log('🗺️ Map container visible:', mapVisible);
    
    // Look for filter buttons
    const vibesButton = await page.locator('button:has-text("Vibes")').first();
    const vibesVisible = await vibesButton.isVisible();
    console.log('🎭 Vibes filter button visible:', vibesVisible);
    
    if (vibesVisible) {
      console.log('🎭 Clicking Vibes filter...');
      await vibesButton.click();
      await page.waitForTimeout(2000);
      
      // Take screenshot after clicking vibes
      await page.screenshot({ path: 'test-vibes-clicked.png' });
      
      // Look for vibe options
      const vibeOptions = await page.locator('input[type="checkbox"]').count();
      console.log('🎭 Found vibe options:', vibeOptions);
      
      if (vibeOptions > 0) {
        console.log('✅ Clicking first vibe option...');
        await page.locator('input[type="checkbox"]').first().click();
        await page.waitForTimeout(3000);
        
        // Take screenshot after selecting vibe
        await page.screenshot({ path: 'test-vibe-selected.png' });
      }
    }
    
    // Check network requests
    console.log('🌐 Monitoring network requests...');
    page.on('response', response => {
      if (response.url().includes('/api/venues')) {
        console.log('🌐 API Request:', response.url(), 'Status:', response.status());
      }
    });
    
    await page.waitForTimeout(5000);
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
})();