// Events API route - now using final_1 table (with special character cleaning)
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface EventRecord {
  event_vibe?: string[];
  event_date?: string;
  id?: number;
  venue_name?: string;
  special_offers?: string;
  music_genre_processed?: {
    primaries: string[];
    secondariesByPrimary: Record<string, string[]>;
  };
  venue_id?: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venue_name = searchParams.get('venue_name');
    const limit = searchParams.get('limit') || '50';
    const genres = searchParams.get('genres'); // comma-separated list
    const vibes = searchParams.get('vibes'); // comma-separated list
    const offers = searchParams.get('offers'); // comma-separated list
    const dates = searchParams.get('dates'); // comma-separated list

    let query = supabase
      .from('final_1')
      .select('*')
      .not('event_id', 'is', null) // Only get records with event data
      .order('event_date', { ascending: false }) // Show newest dates first
      .limit(parseInt(limit));

    // Filter by venue if specified - now including Instagram handle matching
    if (venue_name) {
      // First, try to find the venue's Instagram handle
      const { data: venueData, error: venueError } = await supabase
        .from('final_1')
        .select('venue_final_instagram')
        .ilike('venue_name_original', `%${venue_name}%`)
        .limit(1);

      if (!venueError && venueData && venueData.length > 0 && venueData[0].venue_final_instagram) {
        const instagramHandle = venueData[0].venue_final_instagram;
        console.log(`🔗 Found Instagram handle for ${venue_name}: ${instagramHandle}`);
        console.log(`🧹 Cleaning venue name "${venue_name}" for Supabase query`);

        // Match by venue name OR Instagram handle for better venue-event linking
        // Remove special characters and extra spaces from venue name for safer Supabase query matching
        const cleanVenueName = venue_name.replace(/[&%#,]/g, '').trim().replace(/\s+/g, ' ');
        query = query.or(`venue_name.ilike.%${cleanVenueName}%,venue_name_original.ilike.%${cleanVenueName}%,instagram_id.eq.${instagramHandle}`);
      } else {
        // Fallback to just name matching if no Instagram handle found
        // Remove special characters and extra spaces from venue name for safer Supabase query matching
        const cleanVenueName = venue_name.replace(/[&%#,]/g, '').trim().replace(/\s+/g, ' ');
        query = query.or(`venue_name.ilike.%${cleanVenueName}%,venue_name_original.ilike.%${cleanVenueName}%`);
      }
    }

    // Filter by genres - will apply in JS after fetching since music_genre_processed is JSONB
    let genreFilterToApply = null;
    if (genres) {
      genreFilterToApply = genres.split(',').map(g => g.trim());
    }

    // Apply vibes filter after getting initial data since array substring search is complex
    let vibeFilterToApply = null;
    if (vibes) {
      vibeFilterToApply = vibes.split(',').map(v => v.trim());
    }

    // Filter by offers if specified (using string matching for pipe-separated values)
    if (offers) {
      const offerList = offers.split(',').map(o => o.trim());
      const offerConditions = offerList.map(offer => `special_offers.ilike.%${offer}%`).join(',');
      query = query.or(offerConditions);
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

    // Apply vibes filter in JavaScript since Supabase array substring search is complex
    let filteredData = data;
    if (vibeFilterToApply && vibeFilterToApply.length > 0) {
      filteredData = data?.filter((record: EventRecord) => {
        if (!record.event_vibe || !Array.isArray(record.event_vibe)) return false;

        // Check if any of the requested vibes matches any element in the event_vibe array
        return vibeFilterToApply.some((requestedVibe: string) =>
          record.event_vibe!.some((eventVibeElement: string) =>
            eventVibeElement && eventVibeElement.toLowerCase().includes(requestedVibe.toLowerCase())
          )
        );
      });
    }

    // Apply genre filter in JavaScript
    if (genreFilterToApply && genreFilterToApply.length > 0) {
      filteredData = filteredData?.filter((record: EventRecord) => {
        if (!record.music_genre_processed?.primaries) return false;
        return genreFilterToApply.some((requestedGenre: string) =>
          record.music_genre_processed!.primaries.includes(requestedGenre)
        );
      });
    }

    // Apply dates filter if specified
    if (dates && filteredData) {
      const dateList = dates.split(',').map(d => d.trim());
      filteredData = filteredData.filter((record: EventRecord) => {
        if (!record.event_date) return false;

        const eventDate = new Date(record.event_date);
        if (isNaN(eventDate.getTime())) return false;

        return dateList.some((selectedDate: string) => {
          try {
            // Handle both date formats: "17 Sept 25" and "17/September/2025"
            let selectedDateObj: Date;

            if (selectedDate.includes('/')) {
              // Old format: "17/September/2025"
              const [day, monthName, year] = selectedDate.split('/');
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
              if (monthIndex === -1) return false;
              selectedDateObj = new Date(parseInt(year), monthIndex, parseInt(day));
            } else {
              // New format: "17 Sept 25"
              const [day, monthPart, year] = selectedDate.split(' ');
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
              if (monthIndex === -1) return false;
              const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
              selectedDateObj = new Date(fullYear, monthIndex, parseInt(day));
            }
            if (isNaN(selectedDateObj.getTime())) return false;

            // Compare dates (ignoring time) - use UTC to avoid timezone issues
            const eventDateOnly = new Date(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
            const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());

            return eventDateOnly.getTime() === selectedDateOnly.getTime();
          } catch {
            return false;
          }
        });
      });
    }

    // Transform to expected frontend format
    const transformedData = filteredData?.map(record => ({
      id: record.id,
      created_at: record.event_created_at,
      event_date: record.event_date,
      event_time: record.event_time,
      venue_name: record.venue_name,
      artist: Array.isArray(record.artists) ? record.artists.join(', ') : record.artists,
      music_genre: record.music_genre_processed?.primaries?.join(', ') || '',
      event_vibe: Array.isArray(record.event_vibe) ? record.event_vibe.join(', ') : record.event_vibe,
      event_name: record.event_name,
      ticket_price: record.ticket_price,
      special_offers: Array.isArray(record.special_offers) ? record.special_offers.join(', ') : record.special_offers,
      website_social: Array.isArray(record.website_social) ? record.website_social.join(', ') : record.website_social,
      confidence_score: record.confidence_score,
      analysis_notes: record.analysis_notes,
      instagram_id: record.instagram_id
    })) || [];

    // Deduplicate events based on event_name + event_date + venue_name
    // This prevents the same event from appearing multiple times due to OR query matching multiple rows
    const eventMap = new Map();
    transformedData.forEach(event => {
      const eventKey = `${event.event_name || event.artist}_${event.event_date}_${event.venue_name}`.toLowerCase();
      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, event);
      }
    });
    const deduplicatedData = Array.from(eventMap.values());

    console.log(`📊 Deduplication: ${transformedData.length} events → ${deduplicatedData.length} unique events`);

    return NextResponse.json({
      success: true,
      data: deduplicatedData,
      message: `Retrieved ${deduplicatedData.length} events from final_1`
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