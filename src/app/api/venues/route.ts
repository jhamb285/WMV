// Venues API route - fetching from Supabase final_1 table
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface VenueResponse {
  venue_id: number;
  name: string;
  area: string;
  address: string;
  country: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  category: string;
  created_at: string;
  final_instagram: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filter parameters
    const selectedAreas = searchParams.get('areas')?.split(',').filter(a => a && a !== 'All Dubai') || [];
    const activeVibes = searchParams.get('vibes')?.split(',').filter(v => v) || [];
    // Parse dates handling both comma and pipe-separated values from frontend
    const dateParam = searchParams.get('dates');
    let activeDates: string[] = [];
    if (dateParam) {
      // Split by comma first, then split by pipe for malformed concatenated strings
      const dateStrings = dateParam.split(',').flatMap(d => d.split('|')).filter(d => d && d.trim());
      // Accept both "17 Sept 25" and "17/September/2025" formats
      activeDates = dateStrings
        .map(d => d.trim())
        .filter(d => {
          // Accept "DD/Month/YYYY" format or "DD Month YY" format
          return /^\d{1,2}\/[A-Za-z]+\/\d{4}$/.test(d) || /^\d{1,2}\s[A-Za-z]+\s\d{2}$/.test(d);
        });
    }
    const activeGenres = searchParams.get('genres')?.split(',').filter(g => g) || [];
    const activeOffers = searchParams.get('offers')?.split(',').filter(o => o) || [];

    console.log('🔍 Venue filtering (Supabase):', { selectedAreas, activeVibes, activeDates, activeGenres, activeOffers });

    // Base query to get venue data from final_1 table
    let query = supabase
      .from('final_1')
      .select(`
        venue_venue_id,
        venue_name_original,
        venue_area,
        venue_address,
        venue_country,
        venue_lat,
        venue_lng,
        venue_phone_number,
        venue_website,
        venue_category,
        venue_created_at,
        venue_final_instagram,
        event_vibe,
        event_date,
        music_genre
      `)
      .not('venue_venue_id', 'is', null) // Only get records with venue data
      .not('venue_lat', 'is', null) // Must have coordinates for map
      .not('venue_lng', 'is', null)
      .not('event_date', 'is', null) // Only get venues that have events
      .order('venue_name_original', { ascending: true });

    // Apply area filter
    if (selectedAreas.length > 0) {
      const areaConditions = selectedAreas.map(area => {
        // Handle JBR special case
        if (area === 'JBR') {
          return `venue_area.ilike.*Jumeirah Beach Residence*,venue_area.ilike.*JBR*`;
        }
        return `venue_area.ilike.*${area}*`;
      }).join(',');
      query = query.or(areaConditions);
    }

    // Apply vibes filter (event_vibe is an array column with combined tags)  
    // We'll fetch all data first and filter in memory for complex tag matching
    if (activeVibes.length > 0) {
      console.log('🎯 VIBE FILTERING - Selected vibes for individual tag filtering:', activeVibes);
      // Will apply filtering after data fetch for complex string matching
    }

    // Apply dates filter (event_date column)
    // We'll also filter dates in memory to handle date format matching
    if (activeDates.length > 0) {
      console.log('🗓️ DATE FILTERING - Selected dates for filtering:', activeDates);
      // Will apply filtering after data fetch for date format matching
    }

    // Apply genre filter (music_genre is an array column)
    if (activeGenres.length > 0) {
      console.log('🎵 GENRE FILTERING - Selected genres for filtering:', activeGenres);
      // Will apply filtering after data fetch for complex array matching
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        data: [],
        error: error.message
      }, { status: 500 });
    }

    // Transform data but don't deduplicate yet - we need to filter first
    let venues = data?.map(record => ({
      venue_id: record.venue_venue_id,
      name: record.venue_name_original,
      area: record.venue_area,
      address: record.venue_address,
      country: record.venue_country || 'UAE',
      lat: record.venue_lat,
      lng: record.venue_lng,
      phone: record.venue_phone_number,
      website: record.venue_website,
      category: record.venue_category,
      created_at: record.venue_created_at,
      final_instagram: record.venue_final_instagram,
      event_vibe: record.event_vibe, // Keep event_vibe for filtering
      event_date: record.event_date, // Keep event_date for filtering
      music_genre: record.music_genre // Keep music_genre for filtering
    })) || [];

    // Apply vibes filtering in memory for complex string matching
    if (activeVibes.length > 0) {
      console.log('🎯 VIBE FILTERING - Applying in-memory filtering for individual tags');
      venues = venues.filter(venue => {
        if (!venue.event_vibe || !Array.isArray(venue.event_vibe)) return false;
        
        // Check if any selected vibe appears in any of the venue's vibe strings
        return activeVibes.some(selectedVibe => 
          venue.event_vibe.some((vibeString: string) => 
            vibeString && vibeString.toLowerCase().includes(selectedVibe.toLowerCase())
          )
        );
      });
      console.log('🎯 VIBE FILTERING - Filtered venues count:', venues.length);
    }

    // Apply date filtering in memory for date format matching
    if (activeDates.length > 0) {
      console.log('🗓️ DATE FILTERING - Applying in-memory filtering for dates');
      console.log('🗓️ DATE FILTERING - Selected dates:', activeDates);

      venues = venues.filter(venue => {
        if (!venue.event_date) return false;

        // Parse venue date (ISO format like "2025-09-17T00:00:00+00:00")
        const venueDate = venue.event_date.toString();

        return activeDates.some(selectedDate => {
          try {
            // Parse venue date from ISO format
            const venueDateObj = new Date(venueDate);

            // Parse selected date - handle both "17 Sept 25" and "17/September/2025" formats
            const selectedDateStr = selectedDate.trim();
            let selectedDateObj: Date;

            if (selectedDateStr.includes('/')) {
              // Old format: "17/September/2025"
              const [day, monthPart, year] = selectedDateStr.split('/');
              const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
              if (monthIndex === -1) {
                console.log('🗓️ ERROR - Invalid month name:', monthPart);
                return false;
              }
              selectedDateObj = new Date(parseInt(year), monthIndex, parseInt(day));
            } else {
              // New format: "17 Sept 25"
              const [day, monthPart, year] = selectedDateStr.split(' ');
              const monthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
              ];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
              if (monthIndex === -1) {
                console.log('🗓️ ERROR - Invalid month name:', monthPart);
                return false;
              }
              // Handle 2-digit year
              const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
              selectedDateObj = new Date(fullYear, monthIndex, parseInt(day));
            }

            if (!isNaN(venueDateObj.getTime()) && !isNaN(selectedDateObj.getTime())) {
              // Compare just the date parts (year, month, day) - use UTC to avoid timezone issues
              const venueDateOnly = new Date(venueDateObj.getUTCFullYear(), venueDateObj.getUTCMonth(), venueDateObj.getUTCDate());
              const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());

              const match = venueDateOnly.getTime() === selectedDateOnly.getTime();
              if (match) {
                console.log('🗓️ MATCH - Date match found:', {
                  venue: venue.venue_id + ' - ' + venue.name,
                  venueDate: venueDate,
                  selectedDate: selectedDate,
                  venueDateOnly: venueDateOnly.toISOString().split('T')[0],
                  selectedDateOnly: selectedDateOnly.toISOString().split('T')[0]
                });
              }
              return match;
            }
          } catch (e) {
            console.log('🗓️ ERROR - Date parsing failed for:', venueDate, selectedDate, e instanceof Error ? e.message : 'Unknown error');
          }

          return false;
        });
      });
      console.log('🗓️ DATE FILTERING - Filtered venues count:', venues.length);
    }

    // Apply genre filtering in memory for complex array matching
    if (activeGenres.length > 0) {
      console.log('🎵 GENRE FILTERING - Applying in-memory filtering for genres');
      venues = venues.filter(venue => {
        if (!venue.music_genre || !Array.isArray(venue.music_genre)) return false;

        // Check if any selected genre exactly matches any of the venue's genres
        return activeGenres.some(selectedGenre =>
          venue.music_genre.some((genreString: string) =>
            genreString && genreString.trim().toLowerCase() === selectedGenre.trim().toLowerCase()
          )
        );
      });
      console.log('🎵 GENRE FILTERING - Filtered venues count:', venues.length);
    }

    // NOW deduplicate venues after all filtering is applied
    console.log('🔄 DEDUPLICATION - Starting venue deduplication after filtering...');
    console.log('🔄 DEDUPLICATION - Venues before dedup:', venues.length);

    const venuesMap = new Map();
    venues.forEach(venue => {
      const venueId = venue.venue_id;
      if (!venuesMap.has(venueId)) {
        venuesMap.set(venueId, venue);
      }
    });

    venues = Array.from(venuesMap.values());
    console.log('🔄 DEDUPLICATION - Venues after dedup:', venues.length);

    // Remove event_vibe, event_date, and music_genre from final response
    const venueResponse: VenueResponse[] = venues.map(({event_vibe: _event_vibe, event_date: _event_date, music_genre: _music_genre, ...venue}) => venue as VenueResponse);

    return NextResponse.json({
      success: true,
      data: venueResponse,
      message: `Retrieved ${venues.length} venues from Supabase final_1`
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}