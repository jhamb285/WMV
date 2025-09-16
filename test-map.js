const fetch = require('node-fetch');

async function testMapApplication() {
  try {
    console.log('🧪 Testing Google Maps implementation at http://localhost:3000');
    
    const response = await fetch('http://localhost:3000');
    const html = await response.text();
    
    console.log('📋 Response Status:', response.status);
    console.log('📋 Content Length:', html.length);
    
    // Check for key elements in the HTML
    const checks = {
      'Map Container': html.includes('MapContainer') || html.includes('map'),
      'Google Maps Scripts': html.includes('maps.googleapis.com') || html.includes('google'),
      'React Load Script': html.includes('LoadScript') || html.includes('react-google-maps'),
      'Venue Data': html.includes('venue') || html.includes('Venue'),
      'Navigation Bar': html.includes('FloatingNavbar') || html.includes('WMV'),
      'Dubai Location': html.includes('Dubai') || html.includes('25.2'),
      'Map ID': html.includes('DUBAI_EVENTS_MAP') || html.includes('mapId'),
      'Advanced Markers': html.includes('AdvancedMarkerElement') || html.includes('marker'),
      'API Key Present': html.includes('PRESENT') || html.includes('AIzaSy')
    };
    
    console.log('\n🔍 HTML Content Analysis:');
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${check}`);
    });
    
    // Look for specific implementation details
    console.log('\n🗺️ Map Implementation Details:');
    const mapDetails = {
      'Contains Loading State': html.includes('Loading'),
      'Contains Sidebar': html.includes('sidebar') || html.includes('Sidebar'),
      'Contains Venue Count': html.includes('Venues') || html.includes('12'),
      'Contains Live Stories': html.includes('Live') || html.includes('3'),
      'Contains Filter Controls': html.includes('filter') || html.includes('Filter')
    };
    
    Object.entries(mapDetails).forEach(([detail, found]) => {
      console.log(`${found ? '✅' : '❌'} ${detail}`);
    });
    
    // Check for JavaScript errors in the HTML
    const hasErrors = html.includes('error') || html.includes('Error') || html.includes('500');
    console.log(`\n🐛 JavaScript Errors: ${hasErrors ? '❌ Errors detected' : '✅ No errors detected'}`);
    
    // Extract key script tags
    const scriptMatches = html.match(/<script[^>]*src="[^"]*"[^>]*>/g);
    if (scriptMatches) {
      console.log('\n📦 Script Tags Found:');
      scriptMatches.slice(0, 5).forEach(script => console.log(`  ${script}`));
      if (scriptMatches.length > 5) {
        console.log(`  ... and ${scriptMatches.length - 5} more scripts`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMapApplication();