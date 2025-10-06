import { test, expect } from '@playwright/test';

test('Extract retro Google Maps color scheme for gradient', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🎨 Extracting retro Google Maps colors...');
  
  // Wait for the map to load
  await page.waitForSelector('div[style*="background-color"]', { timeout: 10000 });
  await page.waitForTimeout(3000); // Let map fully render
  
  // Take screenshot for color analysis
  await page.screenshot({ 
    path: 'map-color-analysis.png',
    fullPage: true 
  });
  
  // Extract colors from different map elements
  const mapColors = await page.evaluate(() => {
    const colors: string[] = [];
    
    // Get computed styles from various map elements
    const mapContainer = document.querySelector('[role="main"]') || document.querySelector('.gm-style');
    if (mapContainer) {
      const containerStyle = window.getComputedStyle(mapContainer);
      colors.push(containerStyle.backgroundColor);
    }
    
    // Look for elements with background colors
    const allElements = document.querySelectorAll('*');
    const backgroundColors = new Set<string>();
    
    Array.from(allElements).forEach(el => {
      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;
      
      // Filter for colors that aren't transparent or white
      if (bgColor && 
          bgColor !== 'rgba(0, 0, 0, 0)' && 
          bgColor !== 'rgb(255, 255, 255)' && 
          bgColor !== 'transparent' &&
          !bgColor.includes('255, 255, 255')) {
        backgroundColors.add(bgColor);
      }
    });
    
    return {
      extractedColors: Array.from(backgroundColors),
      totalElements: allElements.length
    };
  });
  
  console.log('🎨 Extracted map colors:', mapColors);
  
  // Check our retro map style definition
  const retroColors = await page.evaluate(() => {
    // Based on the RETRO_MAP_STYLE in types/index.ts
    return {
      landColor: '#ebe3cd', // Main land color
      roadColor: '#f5f1e6', // Road color
      roadArterial: '#fdfcf8', // Arterial road
      highway: '#f8c967', // Highway color
      highwayStroke: '#e9bc62', // Highway stroke
      controlledAccess: '#e98d58', // Controlled access
      controlledStroke: '#db8555', // Controlled access stroke
      naturalLandscape: '#dfd2ae', // Natural landscape
      waterColor: '#b9d3c2', // Water color
      adminStroke: '#c9b2a6', // Administrative stroke
      landParcelStroke: '#dcd2be', // Land parcel stroke
      parkFill: '#a5b076' // Park fill
    };
  });
  
  console.log('🗺️ Retro map color palette:', retroColors);
  
  // Generate optimal gradient colors based on retro palette
  const gradientColors = [
    retroColors.landColor,
    retroColors.roadColor, 
    retroColors.naturalLandscape,
    retroColors.highway,
    retroColors.controlledAccess
  ];
  
  console.log('🎨 Recommended gradient colors:', gradientColors);
  console.log('✅ Color extraction completed successfully');
});