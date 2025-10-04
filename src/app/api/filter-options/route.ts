// Filter Options API route - areas from Supabase with hierarchical genre/vibe structure
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface FilterRecord {
  venue_area?: string;
  event_vibe?: string[];
  event_date?: string;
  music_genre_processed?: {
    primaries: string[];
    secondariesByPrimary: Record<string, string[]>;
    colorFamilies: string[];
  };
  venue_category?: string;
  id?: number;
  venue_name?: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Dummy filter options data (vibes, dates, genres still dummy) - removed unused constant

export async function GET() {
  try {

    // TEMPORARY: Ignore all parameters for client-side filtering
    // TODO: Remove this once all old API calls are eliminated
    console.log('🔄 Fetching ALL filter options (ignoring parameters for client-side filtering)');

    // Force parameters to empty for client-side filtering
    const selectedAreas: string[] = [];
    const activeVibes: string[] = [];
    const activeDates: string[] = [];
    const activeGenres: string[] = [];

    // Get base data without any filters - only records with processed genres
    const { data, error } = await supabase
      .from('final_1')
      .select('venue_area, event_vibe, event_date, music_genre_processed, venue_category')
      .not('venue_area', 'is', null)
      .not('venue_area', 'eq', '')
      .not('music_genre_processed', 'is', null);

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
          if (!record.music_genre_processed?.primaries) return false;
          return activeGenres.some(selectedGenre =>
            record.music_genre_processed.primaries.includes(selectedGenre)
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

    // Extract hierarchical genres from music_genre_processed column
    const genreFilteredData = getFilteredDataExcluding('genres');

    // Build hierarchical structure from processed data
    const genreMap: Record<string, { color: string; subcategories: Set<string> }> = {};

    genreFilteredData?.forEach((record: FilterRecord) => {
      if (record.music_genre_processed?.primaries) {
        record.music_genre_processed.primaries.forEach(primary => {
          if (!genreMap[primary]) {
            // Get color from first record with this primary
            const color = record.music_genre_processed?.colorFamilies?.[0] || 'gray';
            genreMap[primary] = {
              color: color,
              subcategories: new Set()
            };
          }

          // Add secondaries for this primary
          const secondaries = record.music_genre_processed?.secondariesByPrimary?.[primary] || [];
          secondaries.forEach(sec => genreMap[primary].subcategories.add(sec));
        });
      }
    });

    // Convert to final format
    const hierarchicalGenres: Record<string, { color: string; subcategories: string[] }> = {};
    Object.entries(genreMap).forEach(([primary, data]) => {
      hierarchicalGenres[primary] = {
        color: data.color,
        subcategories: Array.from(data.subcategories).sort()
      };
    });

    // Get flat list for backward compatibility
    const allGenresFlat = Object.keys(hierarchicalGenres).sort();

    // Extract flat vibes from existing data and create hierarchical structure
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

    // Define vibe categorization keywords (dynamic categorization)
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

    // Build hierarchical vibes by categorizing each vibe tag
    const hierarchicalVibes: Record<string, { color: string; subcategories: string[] }> = {};

    Object.entries(vibeCategories).forEach(([primary, {keywords, color}]) => {
      const matchingVibes = flatVibes.filter(vibe =>
        keywords.some(keyword => vibe.toLowerCase().includes(keyword.toLowerCase()))
      );

      hierarchicalVibes[primary] = {
        color: color,
        subcategories: matchingVibes.sort()
      };
    });

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
    console.log('✅ Extracted hierarchical genres from music_genre_processed:', Object.keys(hierarchicalGenres));
    console.log('✅ Genre details:', hierarchicalGenres);
    console.log('✅ Created hierarchical vibes:', Object.keys(hierarchicalVibes));
    console.log('✅ Found dates from Supabase:', uniqueDates);

    return NextResponse.json({
      success: true,
      data: {
        areas: uniqueAreas,
        dates: uniqueDates,
        hierarchicalGenres: hierarchicalGenres,
        hierarchicalVibes: hierarchicalVibes,
        // Return flat genres for FilterBottomSheet backward compatibility
        genres: allGenresFlat,
        vibes: Object.keys(hierarchicalVibes)
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