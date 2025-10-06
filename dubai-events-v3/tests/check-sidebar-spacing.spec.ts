import { test, expect } from '@playwright/test';

test('Check sidebar spacing and formatting issues', async ({ page }) => {
  console.log('🔍 Checking sidebar spacing and formatting...');
  
  // Navigate to the page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Wait for the map and data to load
  await page.waitForTimeout(3000);
  
  console.log('📸 Taking full page screenshot...');
  await page.screenshot({ 
    path: 'test-results/sidebar-spacing-full-page.png', 
    fullPage: true 
  });
  
  // Try to find and click a venue marker to open the sidebar
  console.log('🔍 Looking for venue markers...');
  
  // Look for any clickable map markers or elements
  const markerSelectors = [
    '[role="button"][aria-label*="venue"]',
    '[role="button"][aria-label*="Venue"]', 
    '.venue-marker',
    '[data-testid="venue-marker"]',
    'button[aria-label*="marker"]'
  ];
  
  let markerFound = false;
  for (const selector of markerSelectors) {
    const markers = await page.locator(selector).count();
    if (markers > 0) {
      console.log(`✅ Found ${markers} markers with selector: ${selector}`);
      await page.locator(selector).first().click();
      markerFound = true;
      break;
    }
  }
  
  if (!markerFound) {
    console.log('⚠️ No markers found, trying to manually trigger sidebar...');
    
    // Try to find any venue-related element
    const venueElements = await page.locator('[data-venue-id], [data-venue], .venue').count();
    if (venueElements > 0) {
      await page.locator('[data-venue-id], [data-venue], .venue').first().click();
    }
  }
  
  // Wait for sidebar to potentially appear
  await page.waitForTimeout(2000);
  
  // Check if sidebar is visible
  const sidebarSelectors = [
    '[data-testid="venue-sidebar"]',
    '.venue-sidebar',
    '.sidebar',
    '[class*="sidebar"]',
    '[class*="Sidebar"]',
    'div[class*="fixed"][class*="right-0"]'
  ];
  
  let sidebarVisible = false;
  for (const selector of sidebarSelectors) {
    const sidebar = page.locator(selector);
    if (await sidebar.isVisible()) {
      console.log(`✅ Sidebar found with selector: ${selector}`);
      
      // Take detailed sidebar screenshot
      await sidebar.screenshot({ path: 'test-results/sidebar-spacing-detailed.png' });
      
      // Get sidebar dimensions and spacing info
      const box = await sidebar.boundingBox();
      console.log('📐 Sidebar dimensions:', box);
      
      sidebarVisible = true;
      break;
    }
  }
  
  if (!sidebarVisible) {
    console.log('⚠️ Sidebar not visible, checking console for debug info...');
    
    // Get all elements that might be sidebars
    const potentialSidebars = await page.locator('div').evaluateAll(divs => 
      divs.filter(div => {
        const style = window.getComputedStyle(div);
        const className = div.className;
        return (
          style.position === 'fixed' ||
          className.includes('sidebar') ||
          className.includes('Sidebar') ||
          style.right === '0px'
        );
      }).map(div => ({
        className: div.className,
        id: div.id,
        text: div.textContent?.substring(0, 100)
      }))
    );
    
    console.log('🔍 Potential sidebar elements:', potentialSidebars);
  }
  
  // Take a final screenshot
  console.log('📸 Taking final screenshot...');
  await page.screenshot({ 
    path: 'test-results/sidebar-spacing-final.png', 
    fullPage: true 
  });
  
  // Check for any console errors
  page.on('console', msg => console.log('Browser console:', msg.text()));
  
  console.log('✅ Sidebar spacing check completed');
});