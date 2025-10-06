-- Dubai Event Discovery Platform - Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  venue_id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  unique_key TEXT UNIQUE NOT NULL,
  google_place_id TEXT,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Dubai',
  country TEXT NOT NULL DEFAULT 'UAE',
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  phone_number TEXT,
  website TEXT,
  category TEXT NOT NULL,
  cleaned_instagram TEXT,
  match_ai_instagram TEXT,
  final_instagram TEXT,
  last_scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create instagram_stories table
CREATE TABLE IF NOT EXISTS instagram_stories (
  story_id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  unique_key TEXT UNIQUE NOT NULL,
  venue_unique_key TEXT NOT NULL,
  story_date TIMESTAMPTZ NOT NULL,
  user_id TEXT,
  username TEXT,
  media_link TEXT,
  media_type TEXT,
  mentions TEXT[],
  timestamp TIMESTAMPTZ NOT NULL,
  
  -- AI Analysis Fields
  context TEXT,
  event_date TIMESTAMPTZ,
  event_time TEXT,
  venue_name TEXT,
  city TEXT NOT NULL DEFAULT 'Dubai',
  country TEXT NOT NULL DEFAULT 'UAE',
  artists TEXT[],
  music_genre TEXT[],
  event_vibe TEXT[],
  event_name TEXT,
  ticket_price DECIMAL(10, 2),
  special_offers TEXT[],
  website_social TEXT[],
  confidence_score DECIMAL(3, 2),
  analysis_notes TEXT,
  
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Foreign key constraint
  CONSTRAINT fk_venue FOREIGN KEY (venue_unique_key) REFERENCES venues(unique_key) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_area ON venues(area);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);
CREATE INDEX IF NOT EXISTS idx_venues_city ON venues(city);
CREATE INDEX IF NOT EXISTS idx_venues_lat_lng ON venues(lat, lng);
CREATE INDEX IF NOT EXISTS idx_venues_unique_key ON venues(unique_key);

CREATE INDEX IF NOT EXISTS idx_stories_venue ON instagram_stories(venue_unique_key);
CREATE INDEX IF NOT EXISTS idx_stories_date ON instagram_stories(story_date);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON instagram_stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_stories_city ON instagram_stories(city);
CREATE INDEX IF NOT EXISTS idx_stories_unique_key ON instagram_stories(unique_key);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON instagram_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_stories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public venues are viewable by everyone" ON venues
  FOR SELECT USING (true);

CREATE POLICY "Public stories are viewable by everyone" ON instagram_stories
  FOR SELECT USING (true);

-- Insert sample data (optional - you can remove this if you prefer to start with empty tables)
INSERT INTO venues (unique_key, name, area, address, lat, lng, phone_number, website, category) VALUES
('white_dubai', 'WHITE Dubai', 'Downtown Dubai', 'Meydan Racecourse, Al Nad Al Sheba', 25.1792, 55.2731, '+971 4 381 4555', 'https://whitedubai.com', 'nightclub'),
('zero_gravity', 'Zero Gravity', 'Dubai Marina', 'Dubai Marina Beach, The Walk', 25.0875, 55.1432, '+971 4 399 0009', 'https://0-gravity.ae', 'beach club'),
('atmosphere_burj', 'Atmosphere', 'Downtown Dubai', 'Burj Khalifa, Level 122', 25.1976, 55.2744, '+971 4 888 3828', 'https://atmosphereburjkhalifa.com', 'restaurant'),
('skybar_four_seasons', 'SkyBar', 'DIFC', 'Four Seasons Resort Dubai at Jumeirah Beach', 25.2110, 55.2820, '+971 4 270 7777', 'https://fourseasons.com/dubai', 'bar'),
('nobu_dubai', 'Nobu Dubai', 'Palm Jumeirah', 'Atlantis The Palm, West Crescent Road', 25.1304, 55.1174, '+971 4 426 2626', 'https://noburestaurants.com/dubai', 'restaurant'),
('cle_dubai', 'Clé Dubai', 'Business Bay', 'Four Seasons Resort Dubai at Jumeirah Beach', 25.1850, 55.2650, '+971 4 506 0600', 'https://cledubai.com', 'nightclub'),
('soho_garden', 'Soho Garden', 'Dubai Marina', 'Meydan Racecourse Grandstand', 25.0805, 55.1403, '+971 50 454 9996', 'https://sohogardendxb.com', 'nightclub'),
('la_mer_beach', 'La Mer Beach Club', 'La Mer', 'La Mer North, Jumeirah', 25.2354, 55.2707, '+971 4 584 8444', 'https://lamer.ae', 'beach club'),
('cavalli_lounge', 'Cavalli Lounge', 'Business Bay', 'Fairmont Dubai, Sheikh Zayed Road', 25.2188, 55.2737, '+971 4 332 5555', 'https://fairmont.com/dubai', 'bar'),
('pierchic_restaurant', 'Pierchic', 'Jumeirah', 'Al Qasr, Madinat Jumeirah', 25.2048, 55.1865, '+971 4 432 3232', 'https://jumeirah.com/pierchic', 'restaurant'),
('bulgari_resort', 'Bulgari Resort Dubai', 'Jumeirah Bay', 'Jumeirah Bay Island', 25.2276, 55.1642, '+971 4 777 5555', 'https://bulgarihotels.com/dubai', 'bar'),
('aint_saints', 'Ain''t Saints', 'Business Bay', 'H Hotel, Sheikh Zayed Road', 25.1923, 55.2631, '+971 4 501 8777', 'https://aintsaints.ae', 'bar')
ON CONFLICT (unique_key) DO NOTHING;

-- Sample Instagram story (you can remove this if not needed)
INSERT INTO instagram_stories (
  unique_key, 
  venue_unique_key, 
  story_date, 
  username, 
  media_type, 
  timestamp, 
  context, 
  event_vibe, 
  confidence_score, 
  expires_at
) VALUES (
  'sample_story_1',
  'white_dubai',
  NOW() - INTERVAL '2 hours',
  'sample_user',
  'video',
  NOW() - INTERVAL '2 hours',
  'Live DJ performance at WHITE Dubai with amazing crowd energy',
  ARRAY['Party/Energetic', 'Live Music'],
  0.95,
  NOW() + INTERVAL '22 hours'
) ON CONFLICT (unique_key) DO NOTHING;