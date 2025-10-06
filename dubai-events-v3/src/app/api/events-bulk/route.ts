// Bulk Events API route - Fetch events for multiple venues at once (Google Maps style)
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { venue_names, limit = 10, genres, vibes, offers, dates } = body;

    if (!venue_names || !Array.isArray(venue_names) || venue_names.length === 0) {
      return NextResponse.json({
        success: false,
        data: {},
        error: 'venue_names array is required'
      }, { status: 400 });
    }

    console.log(`🚀 BULK FETCH - Loading events for ${venue_names.length} venues:`, venue_names);

    // Build base query
    let query = supabase
      .from('final_1')
      .select('*')
      .not('event_id', 'is', null)
      .order('event_date', { ascending: false }) // Show newest dates first
      .limit(limit * venue_names.length); // Increase limit for multiple venues

    // Use multiple OR filters for venue names (safer approach)
    const venueConditions: string[] = [];
    venue_names.forEach(venue_name => {
      venueConditions.push(`venue_name.ilike.%${venue_name}%`);
      venueConditions.push(`venue_name_original.ilike.%${venue_name}%`);
    });

    if (venueConditions.length > 0) {
      query = query.or(venueConditions.join(','));
    }

    // Apply genre filter in JavaScript after fetching (since music_genre_processed is JSONB)
    let genreFilterToApply = null;
    if (genres) {
      genreFilterToApply = Array.isArray(genres) ? genres : genres.split(',').map(g => g.trim());
    }

    let vibeFilterToApply = null;
    if (vibes) {
      vibeFilterToApply = Array.isArray(vibes) ? vibes : vibes.split(',').map(v => v.trim());
    }

    if (offers) {
      const offerList = Array.isArray(offers) ? offers : offers.split(',').map(o => o.trim());
      const offerConditions = offerList.map(offer => `special_offers.ilike.%${offer}%`).join(',');
      query = query.or(offerConditions);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase bulk fetch error:', error);
      return NextResponse.json({
        success: false,
        data: {},
        error: error.message
      }, { status: 500 });
    }

    // Apply genre filter in JavaScript using music_genre_processed primaries
    let filteredData = data;
    if (genreFilterToApply && genreFilterToApply.length > 0) {
      filteredData = data?.filter((record: EventRecord) => {
        if (!record.music_genre_processed?.primaries) return false;
        return genreFilterToApply.some((requestedGenre: string) =>
          record.music_genre_processed!.primaries.includes(requestedGenre)
        );
      });
    }

    // Apply vibes filter in JavaScript
    if (vibeFilterToApply && vibeFilterToApply.length > 0) {
      filteredData = filteredData?.filter((record: EventRecord) => {
        if (!record.event_vibe || !Array.isArray(record.event_vibe)) return false;
        return vibeFilterToApply.some((requestedVibe: string) =>
          record.event_vibe!.some((eventVibeElement: string) =>
            eventVibeElement && eventVibeElement.toLowerCase().includes(requestedVibe.toLowerCase())
          )
        );
      });
    }

    // Apply dates filter
    if (dates && filteredData) {
      const dateList = Array.isArray(dates) ? dates : dates.split(',').map(d => d.trim());
      filteredData = filteredData.filter((record: EventRecord) => {
        if (!record.event_date) return false;

        const eventDate = new Date(record.event_date);
        if (isNaN(eventDate.getTime())) return false;

        return dateList.some((selectedDate: string) => {
          try {
            let selectedDateObj: Date;

            if (selectedDate.includes('/')) {
              const [day, monthName, year] = selectedDate.split('/');
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
              if (monthIndex === -1) return false;
              selectedDateObj = new Date(parseInt(year), monthIndex, parseInt(day));
            } else {
              const [day, monthPart, year] = selectedDate.split(' ');
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
              if (monthIndex === -1) return false;
              const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
              selectedDateObj = new Date(fullYear, monthIndex, parseInt(day));
            }

            const eventDateOnly = new Date(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate());
            const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());

            return eventDateOnly.getTime() === selectedDateOnly.getTime();
          } catch {
            return false;
          }
        });
      });
    }

    // Transform data and group by venue
    const transformedData = filteredData?.map(record => ({
      id: record.event_id,
      created_at: record.event_created_at,
      event_date: record.event_date,
      event_time: record.event_time,
      venue_name: record.venue_name,
      artist: Array.isArray(record.artists) ? record.artists.join(', ') : record.artists,
      music_genre: Array.isArray(record.music_genre) ? record.music_genre.join(', ') : record.music_genre,
      event_vibe: Array.isArray(record.event_vibe) ? record.event_vibe.join(', ') : record.event_vibe,
      event_name: record.event_name,
      ticket_price: record.ticket_price,
      special_offers: Array.isArray(record.special_offers) ? record.special_offers.join(', ') : record.special_offers,
      website_social: Array.isArray(record.website_social) ? record.website_social.join(', ') : record.website_social,
      confidence_score: record.confidence_score,
      analysis_notes: record.analysis_notes,
      instagram_id: record.instagram_id
    })) || [];

    // Group events by venue name
    const eventsByVenue: Record<string, unknown[]> = {};

    venue_names.forEach(venue_name => {
      eventsByVenue[venue_name] = transformedData.filter(event =>
        event.venue_name && (
          event.venue_name.toLowerCase().includes(venue_name.toLowerCase()) ||
          venue_name.toLowerCase().includes(event.venue_name.toLowerCase())
        )
      );
    });

    const totalEvents = Object.values(eventsByVenue).reduce((sum, events) => sum + events.length, 0);

    console.log(`✅ BULK FETCH COMPLETE - Retrieved ${totalEvents} events across ${venue_names.length} venues`);
    console.log(`📊 Events per venue:`, Object.entries(eventsByVenue).map(([venue, events]) =>
      `${venue}: ${events.length}`).join(', '));

    return NextResponse.json({
      success: true,
      data: eventsByVenue,
      message: `Retrieved ${totalEvents} events for ${venue_names.length} venues`,
      stats: {
        total_events: totalEvents,
        venues_requested: venue_names.length,
        venues_with_events: Object.keys(eventsByVenue).filter(venue => eventsByVenue[venue].length > 0).length
      }
    });

  } catch (error) {
    console.error('Bulk Events API Error:', error);

    return NextResponse.json({
      success: false,
      data: {},
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}