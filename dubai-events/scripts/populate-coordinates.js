// Script to populate latitude and longitude for venues using Google Place IDs
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
  console.error('Missing environment variables. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getPlaceCoordinates(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${googleApiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result?.geometry?.location) {
      return {
        latitude: data.result.geometry.location.lat,
        longitude: data.result.geometry.location.lng
      };
    } else {
      console.warn(`Failed to get coordinates for place_id: ${placeId}`, data.status);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching coordinates for place_id: ${placeId}`, error);
    return null;
  }
}

async function updateVenueCoordinates(venueId, latitude, longitude) {
  const { error } = await supabase
    .from('places')
    .update({ lat: latitude, long: longitude })
    .eq('id', venueId);
    
  if (error) {
    console.error(`Error updating venue ${venueId}:`, error);
    return false;
  }
  
  return true;
}

async function populateCoordinates() {
  console.log('🗺️ Starting coordinate population...');
  
  // Get all venues without coordinates
  const { data: venues, error } = await supabase
    .from('places')
    .select('id, name, place_id, lat, long')
    .is('lat', null);
    
  if (error) {
    console.error('Error fetching venues:', error);
    return;
  }
  
  console.log(`📍 Found ${venues.length} venues without coordinates`);
  
  // Debug: Show the structure of the first venue
  if (venues.length > 0) {
    console.log('🔍 Sample venue structure:');
    console.log('Available columns:', Object.keys(venues[0]));
    console.log('Sample venue:', JSON.stringify(venues[0], null, 2));
  }
  
  let updated = 0;
  let skipped = 0;
  
  for (const venue of venues) {
    if (!venue.place_id) {
      console.log(`⚠️ Skipping ${venue.name} - no place_id`);
      skipped++;
      continue;
    }
    
    console.log(`🔍 Getting coordinates for: ${venue.name}`);
    
    const coordinates = await getPlaceCoordinates(venue.place_id);
    
    if (coordinates) {
      const success = await updateVenueCoordinates(
        venue.id, 
        coordinates.latitude, 
        coordinates.longitude
      );
      
      if (success) {
        console.log(`✅ Updated ${venue.name}: ${coordinates.latitude}, ${coordinates.longitude}`);
        updated++;
      }
    } else {
      skipped++;
    }
    
    // Rate limiting - Google Places API has limits
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
  }
  
  console.log(`\n🎉 Coordinate population complete!`);
  console.log(`✅ Updated: ${updated} venues`);
  console.log(`⚠️ Skipped: ${skipped} venues`);
}

// Run the script
populateCoordinates().catch(console.error);