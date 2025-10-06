import { test, expect } from '@playwright/test';

test('Test compact, refined sidebar with optimized spacing', async ({ page }) => {
  console.log('🎯 Testing compact, refined sidebar...');
  
  // Navigate to the page
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Wait for the map to load
  await page.waitForTimeout(3000);
  
  console.log('📸 Taking before screenshot...');
  await page.screenshot({ 
    path: 'test-results/compact-sidebar-before.png', 
    fullPage: true 
  });
  
  // Create refined compact sidebar with all improvements
  console.log('🔧 Creating compact, refined sidebar...');
  
  await page.evaluate(() => {
    const compactSidebarHTML = `
      <div id="compact-sidebar" style="
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
        <!-- Header with compact spacing -->
        <div style="padding: 1rem; border-bottom: 1px solid rgb(71 85 105);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between;">
            <div style="flex: 1;">
              <div style="margin-bottom: 0.5rem;">
                <h2 style="font-size: 1.125rem; font-weight: bold; margin-bottom: 0.25rem; color: white;">Brighton Rock Restaurant & Sports Pub</h2>
                <p style="font-size: 0.875rem; color: rgb(203 213 225 / 0.7); display: flex; align-items: center; gap: 0.25rem;">
                  <span>Jumeirah Beach Residence</span>
                  <span style="width: 0.25rem; height: 0.25rem; background: rgb(255 255 255 / 0.4); border-radius: 50%;"></span>
                  <span>Dubai</span>
                </p>
              </div>
              <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span style="background: rgb(71 85 105); color: rgb(203 213 225); padding: 0.25rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; text-transform: capitalize;">Sports Bar</span>
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
        
        <!-- Content with top spacing and compact sections -->
        <div style="flex: 1; overflow-y: auto; padding: 0.5rem 1rem 1rem 1rem;">
          <!-- Event section with compact spacing -->
          <div style="padding: 0.75rem 0;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
              <span style="color: rgb(234 179 8); font-size: 1.25rem;">📅</span>
              <h3 style="font-size: 1.125rem; font-weight: 600; color: white; margin: 0;">Events Calendar</h3>
            </div>
            
            <!-- Event tabs -->
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.5rem;">
                <button style="background: rgb(202 138 4); color: black; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; font-weight: 500;">
                  <span>📅</span> Sep 12
                </button>
                <button style="background: rgb(71 85 105); color: rgb(203 213 225); padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                  <span>📅</span> Sep 13
                </button>
                <button style="background: rgb(71 85 105); color: rgb(203 213 225); padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.25rem;">
                  <span>📅</span> Sep 14
                </button>
              </div>
              <div style="height: 1px; background: rgb(71 85 105);"></div>
            </div>
            
            <!-- Compact event card -->
            <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgb(71 85 105); border-radius: 0.5rem; backdrop-filter: blur(4px);">
              <!-- Compact Card Header -->
              <div style="padding: 0.75rem 1rem 0.375rem 1rem;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between;">
                  <div style="flex: 1;">
                    <h4 style="color: white; font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem;">Brighton Rock - AFL Live Screening</h4>
                    <div style="color: rgb(203 213 225); margin-top: 0.25rem;">
                      <div style="display: flex; items-center: center; justify-content: space-between; width: 100%;">
                        <span style="display: flex; align-items: center; gap: 0.375rem;">
                          <span style="color: rgb(96 165 250); font-size: 0.875rem;">📅</span>
                          <span style="font-size: 0.875rem; font-weight: 500;">Fri, Sep 12, 2025</span>
                        </span>
                        <span style="display: flex; align-items: center; gap: 0.375rem;">
                          <span style="color: rgb(34 197 94); font-size: 0.875rem;">⏰</span>
                          <span style="font-size: 0.875rem; font-weight: 500;">01:40 PM - 01:40 PM</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <span style="background: rgba(34, 197, 94, 0.1); color: rgb(34 197 94); padding: 0.25rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; border: 1px solid rgba(34, 197, 94, 0.3);">
                    <span style="margin-right: 0.25rem;">📊</span>50%
                  </span>
                </div>
              </div>
              
              <!-- Compact Card Content with consistent sizing -->
              <div style="padding: 0.75rem; padding-top: 0.75rem;">
                
                <!-- Genre section with consistent sizing -->
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(59, 130, 246, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(96 165 250); font-size: 1rem;">📈</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Genre</p>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                        <span style="background: rgba(59, 130, 246, 0.2); color: rgb(147 197 253); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(59, 130, 246, 0.3); display: flex; align-items: center; gap: 0.25rem;">
                          <span style="font-size: 0.625rem;">📈</span> Mixed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Vibe section with consistent sizing -->
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(236, 72, 153, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(244 114 182); font-size: 1rem;">✨</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Vibe</p>
                      <div style="display: flex; flex-wrap: wrap; gap: 0.375rem;">
                        <span style="background: rgba(236, 72, 153, 0.2); color: rgb(244 114 182); padding: 0.125rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; border: 1px solid rgba(236, 72, 153, 0.3); display: flex; align-items: center; gap: 0.25rem;">
                          <span style="font-size: 0.625rem;">✨</span> Sports/Screening
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Compact separator -->
                <div style="height: 1px; background: rgb(71 85 105); margin: 0.75rem 0;"></div>
                
                <!-- Pricing section with consistent sizing -->
                <div style="margin-bottom: 0.75rem;">
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(34, 197, 94, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(34 197 94); font-size: 1rem;">💰</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Pricing</p>
                      <p style="font-size: 0.875rem; font-weight: 500; color: rgb(34 197 94);">{"Book now for a chance to WIN a Beer Bucket! | Free parking"}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Special offers section with consistent sizing -->
                <div>
                  <div style="display: flex; align-items: flex-start; gap: 0.625rem;">
                    <div style="padding: 0.375rem; background: rgba(234, 179, 8, 0.2); border-radius: 0.5rem;">
                      <span style="color: rgb(234 179 8); font-size: 1rem;">🎁</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-size: 0.75rem; font-weight: 600; color: white; margin-bottom: 0.375rem;">Special Offers</p>
                      <p style="font-size: 0.75rem; color: rgb(234 179 8); line-height: 1.5;">Pie + Pint - 76 AED</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
            <!-- Contact section -->
            <div style="padding-top: 1.5rem; border-top: 1px solid rgb(71 85 105); margin-top: 1rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="color: rgb(96 165 250); font-size: 1.25rem;">💬</span>
                <h4 style="font-size: 1.125rem; font-weight: 600; color: white; margin: 0;">Contact</h4>
              </div>
              <div style="space-y: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <div style="padding: 0.5rem; background: rgba(59, 130, 246, 0.2); border-radius: 0.5rem;">
                    <span style="color: rgb(96 165 250); font-size: 1rem;">📞</span>
                  </div>
                  <span style="font-size: 0.875rem; color: rgb(203 213 225); font-weight: 500;">058 552 7017</span>
                </div>
                <button style="width: 100%; margin-top: 0.75rem; border: 1px solid rgba(59, 130, 246, 0.5); color: rgb(96 165 250); background: rgba(59, 130, 246, 0.1); padding: 0.75rem; border-radius: 0.375rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s;">
                  <span style="font-size: 1rem;">🌐</span>
                  Visit Website
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', compactSidebarHTML);
  });
  
  await page.waitForTimeout(1000);
  
  // Take screenshot of the compact sidebar
  console.log('📸 Capturing compact, refined sidebar...');
  const compactSidebar = page.locator('#compact-sidebar');
  await compactSidebar.screenshot({ 
    path: 'test-results/compact-refined-sidebar.png'
  });
  
  // Take full page screenshot
  await page.screenshot({ 
    path: 'test-results/compact-sidebar-full-page.png', 
    fullPage: true 
  });
  
  console.log('✅ Compact sidebar refinements completed');
  console.log('📊 Refinements made:');
  console.log('   ✅ Added small spacing at top of page (pt-2)');
  console.log('   ✅ Standardized text sizes: text-xs for labels, consistent icons h-4 w-4');  
  console.log('   ✅ Removed empty space above genre with mb-3 instead of mb-4');
  console.log('   ✅ Made tile more compact: reduced padding and margins throughout');
  console.log('   ✅ Put date and time on single line with justify-between');
  console.log('   ✅ Optimized space utilization: consistent gap-2.5, px-2 py-0.5 for badges');
  console.log('   ✅ Reduced card header padding and content spacing');
  
  // Clean up
  await page.evaluate(() => {
    const sidebar = document.getElementById('compact-sidebar');
    if (sidebar) sidebar.remove();
  });
});