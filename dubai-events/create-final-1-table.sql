-- Create final_1 table combining event and venue data
-- This table structure is based on the LEFT JOIN: event LEFT JOIN venue ON event.instagram_id = venue.final_instagram

CREATE TABLE IF NOT EXISTS final_1 (
  -- Primary key
  id SERIAL PRIMARY KEY,
  
  -- Event table columns (based on events API route analysis)
  event_id TEXT,
  instagram_id TEXT,
  event_date TIMESTAMPTZ,
  event_time TEXT,
  event_name TEXT,
  venue_name TEXT,
  city TEXT DEFAULT 'Dubai',
  country TEXT DEFAULT 'UAE',
  artists TEXT[],
  music_genre TEXT[],
  event_vibe TEXT[],
  ticket_price DECIMAL(10, 2),
  special_offers TEXT[],
  website_social TEXT[],
  context TEXT,
  confidence_score DECIMAL(3, 2),
  analysis_notes TEXT,
  event_created_at TIMESTAMPTZ DEFAULT NOW(),
  event_updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Venue table columns (prefixed with venue_ to avoid conflicts)
  venue_venue_id TEXT,
  venue_unique_key TEXT,
  venue_google_place_id TEXT,
  venue_name_original TEXT, -- renamed to avoid conflict with event.venue_name
  venue_area TEXT,
  venue_address TEXT,
  venue_city TEXT DEFAULT 'Dubai',
  venue_country TEXT DEFAULT 'UAE',
  venue_lat DECIMAL(10, 8),
  venue_lng DECIMAL(11, 8),
  venue_phone_number TEXT,
  venue_website TEXT,
  venue_category TEXT,
  venue_cleaned_instagram TEXT,
  venue_match_ai_instagram TEXT,
  venue_final_instagram TEXT,
  venue_last_scraped_at TIMESTAMPTZ,
  venue_created_at TIMESTAMPTZ,
  venue_updated_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_final_1_event_date ON final_1(event_date);
CREATE INDEX IF NOT EXISTS idx_final_1_venue_name ON final_1(venue_name);
CREATE INDEX IF NOT EXISTS idx_final_1_instagram_id ON final_1(instagram_id);
CREATE INDEX IF NOT EXISTS idx_final_1_venue_final_instagram ON final_1(venue_final_instagram);
CREATE INDEX IF NOT EXISTS idx_final_1_city ON final_1(city);
CREATE INDEX IF NOT EXISTS idx_final_1_venue_area ON final_1(venue_area);
CREATE INDEX IF NOT EXISTS idx_final_1_venue_category ON final_1(venue_category);
CREATE INDEX IF NOT EXISTS idx_final_1_music_genre ON final_1 USING GIN(music_genre);
CREATE INDEX IF NOT EXISTS idx_final_1_event_vibe ON final_1 USING GIN(event_vibe);
CREATE INDEX IF NOT EXISTS idx_final_1_special_offers ON final_1 USING GIN(special_offers);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_final_1_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.event_updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_final_1_updated_at BEFORE UPDATE ON final_1
  FOR EACH ROW EXECUTE FUNCTION update_final_1_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE final_1 ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public final_1 are viewable by everyone" ON final_1
  FOR SELECT USING (true);

-- Add comments for documentation
COMMENT ON TABLE final_1 IS 'Denormalized table combining event and venue data via LEFT JOIN on event.instagram_id = venue.final_instagram';
COMMENT ON COLUMN final_1.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN final_1.instagram_id IS 'Instagram ID from event table - used for joining';
COMMENT ON COLUMN final_1.venue_final_instagram IS 'Final Instagram from venue table - used for joining';
COMMENT ON COLUMN final_1.venue_name_original IS 'Original venue name from venue table (to avoid conflict with event.venue_name)';