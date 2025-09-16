// Venue Names API route - fetching distinct venue names from Supabase final_1 table
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('🔍 Fetching distinct venue names from Supabase final_1.venue_name_original...');
    
    // Fetch distinct venue names from Supabase final_1 table
    const { data: venueData, error: venueError } = await supabase
      .from('final_1')
      .select('venue_name_original')
      .not('venue_name_original', 'is', null)
      .not('venue_name_original', 'eq', '');
    
    if (venueError) {
      console.error('Supabase error:', venueError);
      return NextResponse.json({
        success: false,
        data: [],
        error: venueError.message
      }, { status: 500 });
    }

    // Extract unique venue names and sort them alphabetically
    const uniqueVenueNames = [...new Set(
      venueData?.map(record => record.venue_name_original)
        .filter(name => name && name.trim())
    )].sort();

    console.log('✅ Found distinct venue names from Supabase:', uniqueVenueNames.length, 'venues');

    return NextResponse.json({
      success: true,
      data: uniqueVenueNames,
      message: `Retrieved ${uniqueVenueNames.length} distinct venue names from Supabase final_1`
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