// Filter Options API route - areas from Supabase, other filters using dummy data
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface FilterRecord {
  venue_area?: string;
  event_vibe?: string[];
  event_date?: string;
  music_genre?: string[];
  venue_category?: string;
  id?: number;
  venue_name?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Dummy filter options data (vibes, dates, genres still dummy) - removed unused constant

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // TEMPORARY: Ignore all parameters for client-side filtering
    // TODO: Remove this once all old API calls are eliminated
    console.log('🔄 Fetching ALL filter options (ignoring parameters for client-side filtering)');

    // Force parameters to empty for client-side filtering
    const selectedAreas: string[] = [];
    const activeVibes: string[] = [];
    const activeDates: string[] = [];
    const activeGenres: string[] = [];

    // Get base data without any filters - fallback to old columns
    const { data, error } = await supabase
      .from('final_1')
      .select('venue_area, event_vibe, event_date, music_genre, venue_category')
      .not('venue_area', 'is', null)
      .not('venue_area', 'eq', '');

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: true,
        data: { areas: [], vibes: [], dates: [], genres: [] },
        message: `Retrieved 0 areas/vibes/dates/genres (Supabase error)`
      });
    }

    // Helper function to apply filters excluding a specific filter type
    const getFilteredDataExcluding = (excludeFilterType: string) => {
      let filteredData = data || [];

      // Apply area filter if selected (unless we're excluding area)
      if (excludeFilterType !== 'areas' && selectedAreas.length > 0) {
        filteredData = filteredData.filter(record => {
          if (!record.venue_area) return false;
          return selectedAreas.some(area => {
            if (area === 'JBR') {
              return record.venue_area.toLowerCase().includes('jumeirah beach residence') ||
                     record.venue_area.toLowerCase().includes('jbr');
            }
            return record.venue_area.toLowerCase().includes(area.toLowerCase());
          });
        });
      }

      // Apply vibes filter if selected (unless we're excluding vibes)
      if (excludeFilterType !== 'vibes' && activeVibes.length > 0) {
        filteredData = filteredData.filter(record => {
          if (!record.event_vibe || !Array.isArray(record.event_vibe)) return false;
          return activeVibes.some(selectedVibe =>
            record.event_vibe.some((vibeString: string) =>
              vibeString && vibeString.toLowerCase().includes(selectedVibe.toLowerCase())
            )
          );
        });
      }

      // Apply date filter if selected (unless we're excluding dates)
      if (excludeFilterType !== 'dates' && activeDates.length > 0) {
        filteredData = filteredData.filter(record => {
          if (!record.event_date) return false;
          const venueDate = record.event_date.toString();
          return activeDates.some(selectedDate => {
            try {
              const venueDateObj = new Date(venueDate);
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
                if (monthIndex === -1) return false;
                selectedDateObj = new Date(parseInt(year), monthIndex, parseInt(day));
              } else {
                // New format: "17 Sept 25"
                const [day, monthPart, year] = selectedDateStr.split(' ');
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                  'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
                const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
                if (monthIndex === -1) return false;
                const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
                selectedDateObj = new Date(fullYear, monthIndex, parseInt(day));
              }
              if (!isNaN(venueDateObj.getTime()) && !isNaN(selectedDateObj.getTime())) {
                const venueDateOnly = new Date(venueDateObj.getUTCFullYear(), venueDateObj.getUTCMonth(), venueDateObj.getUTCDate());
                const selectedDateOnly = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), selectedDateObj.getDate());
                return venueDateOnly.getTime() === selectedDateOnly.getTime();
              }
            } catch {
              return false;
            }
            return false;
          });
        });
      }

      // Apply genre filter if selected (unless we're excluding genres)
      if (excludeFilterType !== 'genres' && activeGenres.length > 0) {
        filteredData = filteredData.filter(record => {
          if (!record.music_genre || !Array.isArray(record.music_genre)) return false;
          return activeGenres.some(selectedGenre =>
            record.music_genre.some((genreString: string) =>
              genreString && genreString.trim().toLowerCase() === selectedGenre.trim().toLowerCase()
            )
          );
        });
      }

      return filteredData;
    };

    // Extract unique options for each filter type, excluding that filter from the filtering logic

    // Areas: exclude area filter, apply others
    const areaFilteredData = getFilteredDataExcluding('areas');
    const uniqueAreas = [...new Set(
      areaFilteredData?.map(record => record.venue_area).filter(area => area && area.trim())
    )].sort();

    // Use simulated hierarchical structure for now (can be replaced with processed JSON later)
    const hierarchicalGenres = {
      "Electronic": {
        color: "purple",
        subcategories: ["Techno", "Deep House", "Melodic House", "Tech House", "Progressive"]
      },
      "Hip-Hop": {
        color: "blue",
        subcategories: ["Rap", "R&B", "Urban"]
      },
      "Live Music": {
        color: "green",
        subcategories: ["Jazz", "Rock", "Acoustic", "Band"]
      },
      "Mixed": {
        color: "gray",
        subcategories: ["Various", "Multi-Genre"]
      }
    };

    // Extract flat vibes from existing data to simulate hierarchical structure
    const vibeFilteredData = getFilteredDataExcluding('vibes');
    const flatVibes = [...new Set(
      vibeFilteredData?.flatMap((record: FilterRecord) =>
        Array.isArray(record.event_vibe)
          ? record.event_vibe
              .filter((vibe: string) => vibe && vibe.trim())
              .flatMap(vibe => vibe.split('|').map((tag: string) => tag.trim()).filter((tag: string) => tag))
          : []
      )
    )];

    const hierarchicalVibes = {
      "Energy": {
        color: "orange",
        subcategories: flatVibes.filter(vibe =>
          vibe.toLowerCase().includes('high energy') ||
          vibe.toLowerCase().includes('nightclub') ||
          vibe.toLowerCase().includes('packed')
        ).slice(0, 5)
      },
      "Atmosphere": {
        color: "teal",
        subcategories: flatVibes.filter(vibe =>
          vibe.toLowerCase().includes('open-air') ||
          vibe.toLowerCase().includes('rooftop') ||
          vibe.toLowerCase().includes('lounge') ||
          vibe.toLowerCase().includes('intimate')
        ).slice(0, 5)
      },
      "Event Type": {
        color: "pink",
        subcategories: flatVibes.filter(vibe =>
          vibe.toLowerCase().includes('brunch') ||
          vibe.toLowerCase().includes('vip') ||
          vibe.toLowerCase().includes('beach')
        ).slice(0, 5)
      },
      "Music Style": {
        color: "indigo",
        subcategories: flatVibes.filter(vibe =>
          vibe.toLowerCase().includes('techno') ||
          vibe.toLowerCase().includes('house') ||
          vibe.toLowerCase().includes('hip-hop') ||
          vibe.toLowerCase().includes('live')
        ).slice(0, 5)
      }
    };

    // Get all unique dates from database (historical and future)
    const dateFilteredData = getFilteredDataExcluding('dates');
    const uniqueDates = [...new Set(
      dateFilteredData?.map((record: FilterRecord) => {
        if (!record.event_date) return null;

        try {
          const eventDate = new Date(record.event_date);
          if (isNaN(eventDate.getTime())) return null;

          // Format as "17 Sept 25"
          const day = eventDate.getUTCDate();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                             'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[eventDate.getUTCMonth()];
          const year = eventDate.getUTCFullYear().toString().slice(-2); // Last 2 digits
          return `${day} ${month} ${year}`;
        } catch {
          return null;
        }
      }).filter(date => date !== null)
    )].sort((a, b) => {
      // Sort dates chronologically
      try {
        const parseDate = (dateStr: string) => {
          const [day, monthPart, year] = dateStr.split(' ');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                             'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
          const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
          const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
          return new Date(fullYear, monthIndex, parseInt(day));
        };

        const dateA = parseDate(a);
        const dateB = parseDate(b);
        return dateA.getTime() - dateB.getTime();
      } catch {
        return 0;
      }
    });

    console.log('✅ Found areas from Supabase:', uniqueAreas);
    console.log('✅ Created hierarchical genres:', Object.keys(hierarchicalGenres));
    console.log('✅ Created hierarchical vibes:', Object.keys(hierarchicalVibes));
    console.log('✅ Found dates from Supabase:', uniqueDates);

    return NextResponse.json({
      success: true,
      data: {
        areas: uniqueAreas,
        dates: uniqueDates,
        hierarchicalGenres: hierarchicalGenres,
        hierarchicalVibes: hierarchicalVibes,
        // Legacy format for backward compatibility
        vibes: Object.keys(hierarchicalVibes),
        genres: Object.keys(hierarchicalGenres)
      },
      message: `Retrieved ${uniqueAreas.length} areas, ${Object.keys(hierarchicalGenres).length} genre categories, ${Object.keys(hierarchicalVibes).length} vibe categories, ${uniqueDates.length} dates`
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      success: false,
      data: { areas: [], vibes: [], dates: [], genres: [] },
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}