import { test, expect } from '@playwright/test';

test('Detailed sidebar spacing analysis', async ({ page }) => {
  console.log('🔍 Starting detailed sidebar spacing analysis...');
  
  // Navigate to the page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Wait for Google Maps to fully load
  await page.waitForTimeout(5000);
  
  console.log('📍 Looking for venue markers on the map...');
  
  // Try multiple approaches to find and click venue markers
  const markerApproaches = [
    // Google Maps marker approach
    async () => {
      const mapMarkers = await page.locator('div[role="button"][aria-label*="marker"]').count();
      console.log(`Found ${mapMarkers} Google Maps markers`);
      if (mapMarkers > 0) {
        await page.locator('div[role="button"][aria-label*="marker"]').first().click();
        return true;
      }
      return false;
    },
    
    // Custom venue marker approach  
    async () => {
      const venueMarkers = await page.locator('[data-venue-id]').count();
      console.log(`Found ${venueMarkers} venue markers`);
      if (venueMarkers > 0) {
        await page.locator('[data-venue-id]').first().click();
        return true;
      }
      return false;
    },
    
    // Advanced Marker Element approach
    async () => {
      const advancedMarkers = await page.locator('gmp-advanced-marker').count();
      console.log(`Found ${advancedMarkers} advanced markers`);
      if (advancedMarkers > 0) {
        await page.locator('gmp-advanced-marker').first().click();
        return true;
      }
      return false;
    },
    
    // Try clicking on any clickable elements within the map
    async () => {
      const clickableElements = await page.locator('.gm-style div[role="button"]').count();
      console.log(`Found ${clickableElements} clickable map elements`);
      if (clickableElements > 0) {
        await page.locator('.gm-style div[role="button"]').first().click();
        return true;
      }
      return false;
    },
    
    // Simulate clicking on the map area where venues should be
    async () => {
      console.log('🎯 Attempting to click on Dubai center area...');
      const mapDiv = page.locator('.gm-style').first();
      if (await mapDiv.isVisible()) {
        const box = await mapDiv.boundingBox();
        if (box) {
          // Click in the center of Dubai area
          await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
          return true;
        }
      }
      return false;
    }
  ];
  
  let markerClicked = false;
  for (const approach of markerApproaches) {
    if (await approach()) {
      console.log('✅ Successfully clicked a marker');
      await page.waitForTimeout(2000); // Wait for sidebar to appear
      markerClicked = true;
      break;
    }
  }
  
  if (!markerClicked) {
    console.log('⚠️ Could not click any markers, trying to manually trigger sidebar...');
    
    // Try to programmatically trigger the sidebar
    await page.evaluate(() => {
      // Try to find any venue data and trigger sidebar
      const venueData = {
        venue_id: 'test-venue',
        name: 'Test Venue',
        area: 'Downtown Dubai',
        address: 'Test Address'
      };
      
      // Look for any global functions that might open the sidebar
      if (typeof window !== 'undefined') {
        // Try common sidebar trigger patterns
        const possibleTriggers = ['openSidebar', 'showVenueDetails', 'openVenuePanel'];
        for (const trigger of possibleTriggers) {
          if (typeof (window as any)[trigger] === 'function') {
            (window as any)[trigger](venueData);
            break;
          }
        }
      }
    });
    
    await page.waitForTimeout(2000);
  }
  
  // Now check for the sidebar with multiple selectors
  const sidebarSelectors = [
    'div[class*="fixed"][class*="right-0"]',
    'div[class*="sidebar"]',
    'div[class*="Sidebar"]',
    '[data-testid="venue-sidebar"]',
    'aside',
    'div[role="complementary"]'
  ];
  
  let sidebarElement = null;
  for (const selector of sidebarSelectors) {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      console.log(`✅ Found sidebar with selector: ${selector}`);
      sidebarElement = element;
      break;
    }
  }
  
  if (sidebarElement) {
    console.log('📸 Taking detailed sidebar screenshots...');
    
    // Take sidebar screenshot
    await sidebarElement.screenshot({ 
      path: 'test-results/sidebar-spacing-analysis.png'
    });
    
    // Analyze spacing issues
    const spacingAnalysis = await sidebarElement.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      const children = Array.from(el.children);
      
      return {
        sidebarStyles: {
          padding: computedStyle.padding,
          margin: computedStyle.margin,
          gap: computedStyle.gap,
          width: computedStyle.width,
          height: computedStyle.height
        },
        childrenSpacing: children.map((child, index) => {
          const childStyle = window.getComputedStyle(child);
          return {
            index,
            className: child.className,
            margin: childStyle.margin,
            padding: childStyle.padding,
            gap: childStyle.gap,
            marginTop: childStyle.marginTop,
            marginBottom: childStyle.marginBottom,
            paddingTop: childStyle.paddingTop,
            paddingBottom: childStyle.paddingBottom
          };
        })
      };
    });
    
    console.log('📊 Spacing Analysis:', JSON.stringify(spacingAnalysis, null, 2));
    
    // Check for specific spacing issues
    const spacingIssues = await sidebarElement.evaluate((el) => {
      const issues = [];
      const children = Array.from(el.querySelectorAll('*'));
      
      children.forEach((element, index) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        
        // Check for excessive margins
        const marginTop = parseInt(style.marginTop);
        const marginBottom = parseInt(style.marginBottom);
        const paddingTop = parseInt(style.paddingTop);
        const paddingBottom = parseInt(style.paddingBottom);
        
        if (marginTop > 32) {
          issues.push({
            element: element.className || element.tagName,
            issue: 'Excessive top margin',
            value: marginTop
          });
        }
        
        if (marginBottom > 32) {
          issues.push({
            element: element.className || element.tagName,
            issue: 'Excessive bottom margin',
            value: marginBottom
          });
        }
        
        if (paddingTop > 32) {
          issues.push({
            element: element.className || element.tagName,
            issue: 'Excessive top padding',
            value: paddingTop
          });
        }
        
        if (paddingBottom > 32) {
          issues.push({
            element: element.className || element.tagName,
            issue: 'Excessive bottom padding',
            value: paddingBottom
          });
        }
        
        // Check for inconsistent spacing between elements
        if (element.nextElementSibling) {
          const nextRect = element.nextElementSibling.getBoundingClientRect();
          const gap = nextRect.top - rect.bottom;
          if (gap > 40) {
            issues.push({
              element: element.className || element.tagName,
              issue: 'Large gap to next element',
              value: gap
            });
          }
        }
      });
      
      return issues;
    });
    
    console.log('🚨 Spacing Issues Found:', spacingIssues);
    
  } else {
    console.log('❌ Sidebar not found. Taking screenshot of current state...');
  }
  
  // Take final full page screenshot
  await page.screenshot({ 
    path: 'test-results/sidebar-final-state.png', 
    fullPage: true 
  });
  
  console.log('✅ Detailed sidebar spacing analysis completed');
});