import { test, expect } from '@playwright/test';

test('Test new glass morphism navigation bar', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  console.log('🔍 Testing new glass morphism navigation...');
  
  // Wait for the new glass nav to appear
  await page.waitForSelector('.glass-nav-pill', { timeout: 10000 });
  
  // Check if the glass navigation pill is visible
  const glassPill = await page.locator('.glass-nav-pill');
  await expect(glassPill).toBeVisible();
  
  // Check if all navigation circles are present
  const navCircles = await page.locator('.nav-circle');
  const circleCount = await navCircles.count();
  console.log('Navigation circles found:', circleCount);
  
  // Take screenshot showing the new glass morphism navigation
  await page.screenshot({ 
    path: 'glass-nav-morphism.png',
    fullPage: true 
  });
  
  // Test hover effects on navigation circles
  const firstCircle = navCircles.first();
  await firstCircle.hover();
  await page.waitForTimeout(500);
  
  // Take screenshot with hover effect
  await page.screenshot({ 
    path: 'glass-nav-hover.png',
    fullPage: true 
  });
  
  // Test clicking navigation circles
  await firstCircle.click();
  await page.waitForTimeout(500);
  
  // Take screenshot with active state
  await page.screenshot({ 
    path: 'glass-nav-active.png',
    fullPage: true 
  });
  
  console.log('✅ Glass morphism navigation test completed');
});