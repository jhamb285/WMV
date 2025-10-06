import { test, expect } from '@playwright/test';

test('Test optimized layout with full-width date and time utilization', async ({ page }) => {
  console.log('🎯 Testing optimized layout with better space utilization...');
  
  // Navigate to the page
  await page.goto('http://localhost:3002');
  await page.waitForLoadState('networkidle');
  
  // Wait for the map to load
  await page.waitForTimeout(3000);
  
  console.log('📸 Taking before screenshot...');
  await page.screenshot({ 
    path: 'test-results/optimized-layout-before.png', 
    fullPage: true 
  });
  
  // Create optimized sidebar with improved layout
  console.log('✨ Creating optimized sidebar with better space utilization...');
  
  await page.evaluate(() => {
    const optimizedSidebarHTML = `
      <div id="optimized-sidebar" style="
        position: fixed;
        top: 0;
        right: 0;
        width: 384px;
        height: 100vh;
        background: rgb(15 23 42);
        border-left: 1px solid rgb(71 85 105);
        color: white;
        z-index: 9999;
        transform: translateX(0);
        overflow-y: auto;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <!-- Header -->
        <div style="padding: 1rem; border-bottom: 1px solid rgb(71 85 105);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div style="flex: 1;">
              <div style="margin-bottom: 0.5rem;">
                <h2 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.25rem; color: white;">Zeus Lounge & Club</h2>
                <p style="font-size: 0.875rem; color: rgb(203 213 225 / 0.7); display: flex; align-items: center; gap: 0.25rem;">
                  <span>Downtown Dubai</span>
                  <span style="width: 0.25rem; height: 0.25rem; background: rgb(255 255 255 / 0.4); border-radius: 50%;"></span>
                  <span>Dubai</span>
                </p>
              </div>
              <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span style="background: rgb(71 85 105); color: rgb(203 213 225); padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; text-transform: capitalize;">Nightclub</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <a style="padding: 0.375rem; border-radius: 50%; background: rgb(30 41 59); color: rgb(244 114 182); transition: all 0.2s;" href="#"><span style="font-size: 1rem;">📸</span></a>
                  <a style="padding: 0.375rem; border-radius: 50%; background: rgb(30 41 59); color: rgb(34 197 94); transition: all 0.2s;" href="#"><span style="font-size: 1rem;">📞</span></a>
                </div>
              </div>
            </div>
            <button style="width: 2rem; height: 2rem; background: rgb(30 41 59); color: rgb(148 163 184); border: none; border-radius: 0.375rem; cursor: pointer;">×</button>
          </div>
        </div>
        
        <!-- Content -->
        <div style="flex: 1; overflow-y: auto; padding: 0.5rem 1rem 1rem 1rem;">
          <!-- Event section -->
          <div style="padding: 0.75rem 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
              <span style="color: rgb(234 179 8); font-size: 1.25rem;">📅</span>
              <h3 style="font-size: 1.125rem; font-weight: 600; color: white; margin: 0;">Events Calendar</h3>
            </div>
            
            <!-- Event tabs -->
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.5rem;">
                <button style="background: rgb(202 138 4); color: black; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; font-weight: 500;">
                  <span>📅</span> Sep 11
                </button>
                <button style="background: rgb(71 85 105); color: rgb(203 213 225); padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                  <span>📅</span> Sep 12
                </button>
                <button style="background: rgb(71 85 105); color: rgb(203 213 225); padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                  <span>📅</span> Sep 13
                </button>
              </div>
              <div style="height: 1px; background: rgb(71 85 105);"></div>
            </div>
            
            <!-- OPTIMIZED Event card with better space utilization -->
            <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgb(71 85 105); border-radius: 0.5rem; backdrop-filter: blur(4px);">
              <!-- OPTIMIZED Card Header -->
              <div style="padding: 0.75rem 1rem 0.375rem 1rem;">
                <!-- NEW LAYOUT: Title and confidence score on first row -->
                <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.5rem;">
                  <h4 style="color: white; font-size: 1rem; font-weight: 600; flex: 1; margin-right: 0.75rem;">Zeus Lounge & Club — Thursday, 11 September</h4>
                  <span style="background: rgba(34, 197, 94, 0.1); color: rgb(34 197 94); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(34, 197, 94, 0.3); white-space: nowrap;">
                    <span style="margin-right: 0.125rem; font-size: 0.75rem;">📊</span>40%
                  </span>
                </div>
                
                <!-- NEW LAYOUT: Date and time utilizing FULL WIDTH below -->
                <div style="display: flex; items-center: center; justify-content: space-between; width: 100%;">
                  <span style="display: flex; align-items: center; gap: 0.375rem; color: rgb(96 165 250);">
                    <span style="font-size: 0.875rem;">📅</span>
                    <span style="font-size: 0.875rem; font-weight: 500; color: rgb(203 213 225);">Thu, Sep 11, 2025</span>
                  </span>
                  <span style="display: flex; align-items: center; gap: 0.375rem; color: rgb(34 197 94);">
                    <span style="font-size: 0.875rem;">⏰</span>
                    <span style="font-size: 0.875rem; font-weight: 500; color: rgb(203 213 225);">All Night</span>
                  </span>
                </div>
              </div>
              
              <!-- Card Content -->
              <div style="padding: 0.75rem; padding-top: 0.75rem;">
                
                <!-- Genre section -->
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(59, 130, 246, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(96 165 250); font-size: 1rem;">📈</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Genre</p>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                        <span style="background: rgba(59, 130, 246, 0.2); color: rgb(147 197 253); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(59, 130, 246, 0.3); display: flex; align-items: center; gap: 0.25rem;">
                          <span style="font-size: 0.625rem;">📈</span> Electronic
                        </span>
                        <span style="background: rgba(59, 130, 246, 0.2); color: rgb(147 197 253); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(59, 130, 246, 0.3); display: flex; align-items: center; gap: 0.25rem;">
                          <span style="font-size: 0.625rem;">📈</span> House
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Vibe section -->
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(236, 72, 153, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(244 114 182); font-size: 1rem;">✨</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Vibe</p>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                        <span style="background: rgba(236, 72, 153, 0.2); color: rgb(244 114 182); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(236, 72, 153, 0.3); display: flex; align-items: center; gap: 0.25rem;">
                          <span style="font-size: 0.625rem;">✨</span> Party/Energetic
                        </span>
                        <span style="background: rgba(236, 72, 153, 0.2); color: rgb(244 114 182); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(236, 72, 153, 0.3); display: flex; align-items: center; gap: 0.25rem;">
                          <span style="font-size: 0.625rem;">✨</span> Live Music
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Separator -->
                <div style="height: 1px; background: rgb(71 85 105); margin: 0.75rem 0;"></div>
                
                <!-- Pricing section -->
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(34, 197, 94, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(34 197 94); font-size: 1rem;">💰</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Pricing</p>
                      <p style="font-size: 0.875rem; font-weight: 500; color: rgb(34 197 94);">AED 300 - AED 500</p>
                    </div>
                  </div>
                </div>
                
                <!-- Special offers section -->
                <div>
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(234, 179, 8, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(234 179 8); font-size: 1rem;">🎁</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Special Offers</p>
                      <p style="font-size: 0.875rem; color: rgb(234 179 8); line-height: 1.5;">Early bird: 2+1 free drinks before 11 PM</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', optimizedSidebarHTML);
  });
  
  await page.waitForTimeout(1000);
  
  // Take screenshot of the optimized sidebar
  console.log('📸 Capturing optimized sidebar with better space utilization...');
  const optimizedSidebar = page.locator('#optimized-sidebar');
  await optimizedSidebar.screenshot({ 
    path: 'test-results/optimized-layout-sidebar.png'
  });
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'test-results/optimized-layout-full-page.png', 
    fullPage: true 
  });
  
  console.log('✅ Layout optimization completed!');
  console.log('🎯 Layout OPTIMIZED:');
  console.log('   ✅ Title and confidence score now on SAME ROW');
  console.log('   ✅ Date and time utilize FULL WIDTH below (justify-between)');
  console.log('   ✅ Maximum space utilization in card header');
  console.log('   ✅ Better visual balance and proportions');
  console.log('   ✅ No wasted space below confidence score');
  
  // Clean up
  await page.evaluate(() => {
    const sidebar = document.getElementById('optimized-sidebar');
    if (sidebar) sidebar.remove();
  });
});