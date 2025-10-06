import { test } from '@playwright/test';

test('Test POI and icon hiding', async ({ page }) => {
  console.log('🗺️ Testing POI/Icon hiding...');
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Take screenshot to verify POIs/icons are hidden
  await page.screenshot({ path: 'map-clean-no-pois.png', fullPage: true });
  console.log('✅ Screenshot taken - check map-clean-no-pois.png');
});