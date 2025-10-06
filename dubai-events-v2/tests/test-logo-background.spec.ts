import { test, expect } from '@playwright/test';

test('Test logo has transparent background (no white background)', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing logo background...');
  
  // Wait for the logo to appear
  const logo = page.locator('.app-logo img');
  await logo.waitFor({ timeout: 10000 });
  
  // Take screenshot of the logo area
  await page.screenshot({ 
    path: 'logo-background-test.png',
    fullPage: true 
  });
  
  console.log('📸 Logo screenshot taken');
  
  // Get the logo element's computed styles
  const logoContainer = page.locator('.app-logo');
  const logoImage = page.locator('.logo-image');
  
  // Check container background
  const containerBg = await logoContainer.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      background: styles.background
    };
  });
  
  console.log('🎨 Container background styles:', containerBg);
  
  // Check image background
  const imageBg = await logoImage.evaluate(el => {
    const styles = window.getComputedStyle(el);
    return {
      backgroundColor: styles.backgroundColor,
      background: styles.background
    };
  });
  
  console.log('🖼️ Image background styles:', imageBg);
  
  // Verify no white background
  expect(containerBg.backgroundColor).not.toBe('rgb(255, 255, 255)');
  expect(imageBg.backgroundColor).not.toBe('rgb(255, 255, 255)');
  
  // Check if backgrounds are transparent
  const isContainerTransparent = containerBg.backgroundColor === 'rgba(0, 0, 0, 0)' || 
                                  containerBg.backgroundColor === 'transparent';
  const isImageTransparent = imageBg.backgroundColor === 'rgba(0, 0, 0, 0)' || 
                            imageBg.backgroundColor === 'transparent';
  
  console.log('✅ Container transparent:', isContainerTransparent);
  console.log('✅ Image transparent:', isImageTransparent);
  
  expect(isContainerTransparent).toBe(true);
  expect(isImageTransparent).toBe(true);
  
  console.log('✅ Logo background test completed successfully');
});