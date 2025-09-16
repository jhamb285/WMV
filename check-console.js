// Simple script to check console output in browser
// Open browser dev tools and run this in the console:

console.log('🔍 === CHECKING CURRENT STATE ===');
console.log('🔍 Current URL:', window.location.href);
console.log('🔍 Google Maps loaded:', typeof google !== 'undefined' && typeof google.maps !== 'undefined');
console.log('🔍 Current date:', new Date().toISOString());

// Check if there are any Google Maps markers on the page
if (typeof google !== 'undefined' && google.maps) {
  console.log('🔍 Google Maps API available');
  
  // Try to find map elements
  const mapElements = document.querySelectorAll('.gm-style');
  console.log('🔍 Map elements found:', mapElements.length);
  
  // Try to find marker elements
  const markerElements = document.querySelectorAll('img[src*="maps.google.com/mapfiles/ms/icons"]');
  console.log('🔍 Marker images found:', markerElements.length);
  
  markerElements.forEach((marker, i) => {
    console.log(`🔍 Marker ${i + 1}:`, marker.src);
  });
  
} else {
  console.log('🔍 Google Maps API not available');
}

console.log('🔍 === CHECK COMPLETE ===');