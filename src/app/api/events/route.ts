// Events API route - now using final_1 table
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
      .order('event_date', { ascending: true })
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

        // Match by venue name OR Instagram handle for better venue-event linking
        query = query.or(`venue_name.ilike.%${venue_name}%, venue_name_original.ilike.%${venue_name}%, instagram_id.eq.${instagramHandle}`);
      } else {
        // Fallback to just name matching if no Instagram handle found
        query = query.or(`venue_name.ilike.%${venue_name}%, venue_name_original.ilike.%${venue_name}%`);
      }
    }

    // Filter by genres if specified (now using array contains)
    if (genres) {
      const genreList = genres.split(',').map(g => g.trim());
      const genreConditions = genreList.map(genre => `music_genre.cs.{${genre}}`).join(',');
      query = query.or(genreConditions);
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
      filteredData = data?.filter(record => {
        if (!record.event_vibe || !Array.isArray(record.event_vibe)) return false;

        // Check if any of the requested vibes matches any element in the event_vibe array
        return vibeFilterToApply.some(requestedVibe =>
          record.event_vibe.some((eventVibeElement: any) =>
            eventVibeElement && eventVibeElement.toLowerCase().includes(requestedVibe.toLowerCase())
          )
        );
      });
    }

    // Apply dates filter if specified
    if (dates && filteredData) {
      const dateList = dates.split(',').map(d => d.trim());
      filteredData = filteredData.filter(record => {
        if (!record.event_date) return false;

        const eventDate = new Date(record.event_date);
        if (isNaN(eventDate.getTime())) return false;

        return dateList.some(selectedDate => {
          try {
            // Parse the selected date format (DD/Month/YYYY from filter-options API)
            const [day, monthName, year] = selectedDate.split('/');
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December'];
            const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());

            if (monthIndex === -1) return false;

            const selectedDateObj = new Date(parseInt(year), monthIndex, parseInt(day));
            if (isNaN(selectedDateObj.getTime())) return false;

            // Compare dates (ignoring time)
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
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

    return NextResponse.json({
      success: true,
      data: transformedData,
      message: `Retrieved ${transformedData.length} events from final_1`
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