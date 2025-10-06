const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('🔍 Starting localhost:3000 verification...');
    
    const browser = await puppeteer.launch({ 
      headless: false,
      args: ['--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    console.log('📡 Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    const screenshotPath = `localhost-verification-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    // Get page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);
    
    // Check if main elements are present
    const navbar = await page.$('.floating-navbar, nav, [class*="navbar"]');
    const mapContainer = await page.$('[class*="map"], #map');
    
    console.log(`🗺️ Navigation element found: ${!!navbar}`);
    console.log(`🗺️ Map container found: ${!!mapContainer}`);
    
    // Get page content info
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 200));
    console.log(`📝 Page content preview: ${bodyText}...`);
    
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
    console.log('✅ Website verification complete!');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    process.exit(1);
  }
})();