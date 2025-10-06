import { test, expect } from '@playwright/test';

test.describe('Production Readiness Tests', () => {
  
  test('Page loads and displays core elements', async ({ page }) => {
    await page.goto('http://localhost:3002');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that main navigation is present
    await expect(page.locator('text=Where\'s My Vibe?')).toBeVisible();
    
    // Wait a bit longer for the map to fully initialize
    await page.waitForTimeout(5000);
    
    // Check that the bottom navigation is present (these are clearly visible in the screenshot)
    await expect(page.locator('text=Area')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Vibes')).toBeVisible();
    await expect(page.locator('text=Dates')).toBeVisible();
    await expect(page.locator('text=Genre')).toBeVisible();
    
    // Verify the page main element is rendered
    await expect(page.locator('main')).toBeVisible();
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/homepage-loaded.png',
      fullPage: true 
    });
    
    console.log('✅ Page loaded successfully with all core elements visible');
  });

  test('Performance metrics', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`🚀 Page load time: ${loadTime}ms`);
    
    // Ensure page loads within reasonable time (10 seconds)
    expect(loadTime).toBeLessThan(10000);
    
    // Check for JavaScript errors
    const jsErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(3000);
    
    console.log(`📊 JavaScript errors found: ${jsErrors.length}`);
    if (jsErrors.length > 0) {
      console.log('Errors:', jsErrors);
    }
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Check that elements are properly sized for mobile
    const logo = page.locator('text=Where\'s My Vibe?');
    await expect(logo).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'test-results/mobile-view.png',
      fullPage: true 
    });
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.screenshot({ 
      path: 'test-results/tablet-view.png',
      fullPage: true 
    });
  });

  test('SEO and accessibility basics', async ({ page }) => {
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    // Check for title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    console.log(`📄 Page title: "${title}"`);
    
    // Check for meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    if (metaDescription) {
      console.log(`📝 Meta description: "${metaDescription}"`);
    }
    
    // Check for proper heading structure
    const h1Count = await page.locator('h1').count();
    console.log(`📊 H1 tags found: ${h1Count}`);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      console.log(`🖼️ Image ${src}: alt="${alt}"`);
    }
  });

  test('Network requests and bundle size', async ({ page }) => {
    const requests: any[] = [];
    
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');
    
    console.log(`📊 Total network requests: ${requests.length}`);
    
    const jsRequests = requests.filter(r => r.resourceType === 'script');
    const cssRequests = requests.filter(r => r.resourceType === 'stylesheet');
    const imageRequests = requests.filter(r => r.resourceType === 'image');
    
    console.log(`📄 JavaScript files: ${jsRequests.length}`);
    console.log(`🎨 CSS files: ${cssRequests.length}`);
    console.log(`🖼️ Images: ${imageRequests.length}`);
    
    // Log main bundle information
    jsRequests.forEach(req => {
      if (req.url.includes('chunks/') || req.url.includes('.js')) {
        console.log(`📦 JS Bundle: ${req.url}`);
      }
    });
  });
});