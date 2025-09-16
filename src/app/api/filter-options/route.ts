// Filter Options API route - areas from Supabase, other filters using dummy data
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Dummy filter options data (vibes, dates, genres still dummy) - removed unused constant

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse current filter state to provide contextual options
    const selectedAreas = searchParams.get('areas')?.split(',').filter(a => a && a !== 'All Dubai') || [];
    const activeVibes = searchParams.get('vibes')?.split(',').filter(v => v) || [];
    const activeDates = searchParams.get('dates')?.split(',').filter(d => d) || [];
    const activeGenres = searchParams.get('genres')?.split(',').filter(g => g) || [];

    console.log('🔍 Fetching DYNAMIC filter options based on current filters:', {
      selectedAreas, activeVibes, activeDates, activeGenres
    });

    // Get base data without any filters
    const { data, error } = await supabase
      .from('final_1')
      .select('venue_area, event_vibe, event_date, music_genre')
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
              const [day, monthPart, year] = selectedDateStr.split('/');
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'];
              const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthPart.toLowerCase());
              if (monthIndex === -1) return false;
              const selectedDateObj = new Date(parseInt(year), monthIndex, parseInt(day));
              if (!isNaN(venueDateObj.getTime()) && !isNaN(selectedDateObj.getTime())) {
                const venueDateOnly = new Date(venueDateObj.getFullYear(), venueDateObj.getMonth(), venueDateObj.getDate());
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

    // Vibes: exclude vibe filter, apply others
    const vibeFilteredData = getFilteredDataExcluding('vibes');
    const uniqueVibes = [...new Set(
      vibeFilteredData?.flatMap(record =>
        Array.isArray(record.event_vibe)
          ? record.event_vibe
              .filter(vibe => vibe && vibe.trim())
              .flatMap(vibe => vibe.split('|').map((tag: string) => tag.trim()).filter((tag: string) => tag))
          : []
      )
    )].sort();

    // Dates: exclude date filter, apply others
    const dateFilteredData = getFilteredDataExcluding('dates');
    const dateObjects = dateFilteredData?.map(record => record.event_date)
      .filter(date => date && date.toString().trim())
      .map(date => {
        try {
          const dateObj = new Date(date);
          if (!isNaN(dateObj.getTime())) {
            return dateObj;
          }
        } catch {
          // If date parsing fails, skip this date
        }
        return null;
      })
      .filter(date => date !== null) || [];

    // Sort dates chronologically (earliest to latest) and format
    const uniqueDates = [...new Set(
      dateObjects
        .sort((a, b) => a.getTime() - b.getTime()) // Sort chronologically
        .map(dateObj => {
          // Format as DD/Month/YYYY
          const day = dateObj.getDate().toString().padStart(2, '0');
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          const month = monthNames[dateObj.getMonth()];
          const year = dateObj.getFullYear();
          return `${day}/${month}/${year}`;
        })
    )];

    // Genres: exclude genre filter, apply others
    const genreFilteredData = getFilteredDataExcluding('genres');
    const uniqueGenres = [...new Set(
      genreFilteredData?.flatMap(record =>
        Array.isArray(record.music_genre)
          ? record.music_genre
              .filter(genre => genre && genre.trim())
              .flatMap(genre => genre.split('|').map(tag => tag.trim()).filter(tag => tag))
          : []
      )
    )].sort();

    console.log('✅ Found areas from Supabase:', uniqueAreas);
    console.log('✅ Found vibes from Supabase:', uniqueVibes);
    console.log('✅ Found dates from Supabase:', uniqueDates);
    console.log('✅ Found genres from Supabase:', uniqueGenres);

    return NextResponse.json({
      success: true,
      data: {
        areas: uniqueAreas,
        vibes: uniqueVibes,
        dates: uniqueDates,
        genres: uniqueGenres
      },
      message: `Retrieved ${uniqueAreas.length} areas (Supabase), ${uniqueVibes.length} vibes (Supabase), ${uniqueDates.length} dates (Supabase), ${uniqueGenres.length} genres (Supabase)`
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