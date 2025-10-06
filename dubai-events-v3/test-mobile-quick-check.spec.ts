import { test } from '@playwright/test';

test('Quick mobile UI check', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true
  });
  
  const page = await context.newPage();
  
  console.log('📱 Quick mobile check...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take initial screenshot
  await page.screenshot({ path: 'mobile-improved-initial.png', fullPage: true });

  // Click venue pin
  const pins = page.locator('div[role="button"][tabindex="0"]');
  if (await pins.count() > 0) {
    await pins.first().click();
    await page.waitForTimeout(1000);
    
    // Take screenshot with sidebar
    await page.screenshot({ path: 'mobile-improved-with-sidebar.png', fullPage: true });
  }

  await context.close();
});