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
  event_date: string;
  rating: number;
  rating_count: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Force client-side filtering by ignoring all parameters
    console.log('🔄 Loading ALL venues for client-side filtering');

    // Use empty filters since we want client-side filtering
    const selectedAreas: string[] = [];
    const activeVibes: string[] = [];
    const activeDates: string[] = [];
    const activeGenres: string[] = [];

    // Base query to get venue data from final_1 table - only with processed genres
    let query = supabase
      .from('final_1')
      .select(`
        venue_id,
        venue_name_original,
        venue_area,
        venue_address,
        venue_country,
        venue_lat,
        venue_lng,
        venue_phone,
        venue_website,
        venue_category,
        venue_created_at,
        venue_final_instagram,
        event_vibe,
        event_date,
        music_genre_processed,
        venue_rating,
        venue_rating_count
      `)
      .not('venue_id', 'is', null) // Only get records with venue data
      .not('venue_lat', 'is', null) // Must have coordinates for map
      .not('venue_lng', 'is', null)
      .not('music_genre_processed', 'is', null) // Only get venues with processed genres
      .order('venue_name_original', { ascending: true })
      .limit(1000); // Fetch up to 1000 records (Supabase default is often 1000)

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

    console.log('📊 SUPABASE QUERY - Raw records returned:', data?.length || 0);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        data: [],
        error: error.message
      }, { status: 500 });
    }

    // Helper function to transform event_vibe string into hierarchical structure
    const transformEventVibeToProcessed = (eventVibeArray: string[] | null | undefined) => {
      if (!eventVibeArray || !Array.isArray(eventVibeArray)) return null;

      // Define the same vibe categories as in filter-options
      const vibeCategories: Record<string, {keywords: string[], color: string}> = {
        "Energy": {
          keywords: ["high energy", "nightclub", "packed", "party", "dance", "energetic"],
          color: "orange"
        },
        "Atmosphere": {
          keywords: ["open-air", "rooftop", "terrace", "lounge", "intimate", "casual", "chill"],
          color: "teal"
        },
        "Event Type": {
          keywords: ["beach", "pool", "dayclub", "brunch", "vip", "exclusive", "luxury", "fine dining"],
          color: "pink"
        },
        "Music Style": {
          keywords: ["techno", "house", "hip-hop", "r&b", "live", "rock", "indie", "jazz"],
          color: "indigo"
        }
      };

      // Extract individual tags from pipe-separated strings
      const vibeTags = eventVibeArray
        .flatMap(vibe => vibe.split('|').map(tag => tag.trim()))
        .filter(tag => tag);

      const primaries: string[] = [];
      const secondariesByPrimary: Record<string, string[]> = {};
      const colorFamilies: string[] = [];

      // Categorize each vibe tag
      Object.entries(vibeCategories).forEach(([primary, {keywords, color}]) => {
        const matchingTags = vibeTags.filter(tag =>
          keywords.some(keyword => tag.toLowerCase().includes(keyword.toLowerCase()))
        );

        if (matchingTags.length > 0) {
          primaries.push(primary);
          secondariesByPrimary[primary] = [...new Set(matchingTags)].sort();
          colorFamilies.push(color);
        }
      });

      if (primaries.length === 0) return null;

      return {
        primaries,
        secondariesByPrimary,
        colorFamilies
      };
    };

    // Transform data but don't deduplicate yet - we need to filter first
    let venues = data?.map(record => ({
      venue_id: record.venue_id,
      name: record.venue_name_original,
      area: record.venue_area,
      address: record.venue_address,
      country: record.venue_country || 'UAE',
      lat: record.venue_lat,
      lng: record.venue_lng,
      phone: record.venue_phone,
      website: record.venue_website,
      category: record.venue_category,
      created_at: record.venue_created_at,
      final_instagram: record.venue_final_instagram,
      event_vibe: record.event_vibe,
      event_date: record.event_date,
      music_genre_processed: record.music_genre_processed,
      event_vibe_processed: transformEventVibeToProcessed(record.event_vibe), // Transform vibes
      rating: record.venue_rating,
      rating_count: record.venue_rating_count
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

    // Apply genre filtering using music_genre_processed primaries
    if (activeGenres.length > 0) {
      console.log('🎵 GENRE FILTERING - Applying in-memory filtering for genres');
      console.log('🎵 GENRE FILTERING - Selected genres:', activeGenres);
      venues = venues.filter(venue => {
        if (!venue.music_genre_processed?.primaries) return false;

        // Check if any selected genre matches the venue's primary genres
        const hasMatch = activeGenres.some(selectedGenre =>
          venue.music_genre_processed.primaries.includes(selectedGenre)
        );

        if (hasMatch) {
          console.log('🎵 MATCH - Venue:', venue.name, 'Primaries:', venue.music_genre_processed.primaries);
        }

        return hasMatch;
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

    // Remove internal fields from final response
    const venueResponse: VenueResponse[] = venues.map((venue) => {
      return venue as VenueResponse;
    });

    console.log('🔄 FINAL RESPONSE - venueResponse length:', venueResponse.length);

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