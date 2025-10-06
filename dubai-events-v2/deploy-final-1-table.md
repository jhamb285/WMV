# Deploy final_1 Table

## Overview
This document provides instructions for creating the `final_1` table in your Supabase database. The table combines data from both `event` and `venue` tables using a LEFT JOIN structure.

## Table Structure

### Primary Purpose
The `final_1` table is designed to hold denormalized data equivalent to:
```sql
SELECT * FROM event LEFT JOIN venue ON event.instagram_id = venue.final_instagram
```

### Key Features
- **Auto-incrementing primary key**: `id` (SERIAL)
- **All event table columns**: Including event_date, venue_name, music_genre, event_vibe, etc.
- **All venue table columns**: Prefixed with `venue_` to avoid naming conflicts
- **Performance indexes**: On commonly queried columns
- **Row Level Security**: Enabled with public read access
- **Automatic timestamps**: With trigger for updated_at

## Deployment Steps

### Step 1: Access Supabase SQL Editor
1. Log into your Supabase dashboard
2. Navigate to "SQL Editor"
3. Click "New query"

### Step 2: Execute the SQL
Copy and paste the entire content from `create-final-1-table.sql` and execute it.

### Step 3: Verify Creation
After execution, you should see:
- ✅ `final_1` table created
- ✅ 10 indexes created for performance
- ✅ RLS policy created
- ✅ Updated_at trigger created

## Table Schema Details

### Event Columns (from left side of JOIN)
```sql
event_id TEXT
instagram_id TEXT                    -- JOIN key
event_date TIMESTAMPTZ
event_time TEXT
event_name TEXT
venue_name TEXT
city TEXT DEFAULT 'Dubai'
country TEXT DEFAULT 'UAE'
artists TEXT[]
music_genre TEXT[]
event_vibe TEXT[]
ticket_price DECIMAL(10, 2)
special_offers TEXT[]
website_social TEXT[]
context TEXT
confidence_score DECIMAL(3, 2)
analysis_notes TEXT
event_created_at TIMESTAMPTZ
event_updated_at TIMESTAMPTZ
```

### Venue Columns (from right side of JOIN, prefixed with venue_)
```sql
venue_venue_id TEXT
venue_unique_key TEXT
venue_google_place_id TEXT
venue_name_original TEXT             -- Renamed to avoid conflict
venue_area TEXT
venue_address TEXT
venue_city TEXT DEFAULT 'Dubai'
venue_country TEXT DEFAULT 'UAE'
venue_lat DECIMAL(10, 8)
venue_lng DECIMAL(11, 8)
venue_phone_number TEXT
venue_website TEXT
venue_category TEXT
venue_cleaned_instagram TEXT
venue_match_ai_instagram TEXT
venue_final_instagram TEXT           -- JOIN key
venue_last_scraped_at TIMESTAMPTZ
venue_created_at TIMESTAMPTZ
venue_updated_at TIMESTAMPTZ
```

## Performance Indexes

The following indexes are created for optimal query performance:

### Primary Indexes
- `idx_final_1_event_date` - For date-based filtering
- `idx_final_1_venue_name` - For venue name searches
- `idx_final_1_instagram_id` - For JOIN operations
- `idx_final_1_venue_final_instagram` - For JOIN operations

### Geographic Indexes
- `idx_final_1_city` - For city filtering
- `idx_final_1_venue_area` - For area filtering
- `idx_final_1_venue_category` - For category filtering

### Array Indexes (GIN)
- `idx_final_1_music_genre` - For genre filtering
- `idx_final_1_event_vibe` - For vibe filtering
- `idx_final_1_special_offers` - For offers filtering

## Data Population

After creating the table, you can populate it with:

```sql
INSERT INTO final_1 (
  -- Event columns
  event_id, instagram_id, event_date, event_time, event_name, venue_name,
  city, country, artists, music_genre, event_vibe, ticket_price, 
  special_offers, website_social, context, confidence_score, analysis_notes,
  
  -- Venue columns  
  venue_venue_id, venue_unique_key, venue_google_place_id, venue_name_original,
  venue_area, venue_address, venue_city, venue_country, venue_lat, venue_lng,
  venue_phone_number, venue_website, venue_category, venue_cleaned_instagram,
  venue_match_ai_instagram, venue_final_instagram, venue_last_scraped_at,
  venue_created_at, venue_updated_at
)
SELECT 
  -- Event columns
  e.event_id, e.instagram_id, e.event_date, e.event_time, e.event_name, e.venue_name,
  e.city, e.country, e.artists, e.music_genre, e.event_vibe, e.ticket_price,
  e.special_offers, e.website_social, e.context, e.confidence_score, e.analysis_notes,
  
  -- Venue columns
  v.venue_id, v.unique_key, v.google_place_id, v.name,
  v.area, v.address, v.city, v.country, v.lat, v.lng,
  v.phone_number, v.website, v.category, v.cleaned_instagram,
  v.match_ai_instagram, v.final_instagram, v.last_scraped_at,
  v.created_at, v.updated_at
FROM event e
LEFT JOIN venue v ON e.instagram_id = v.final_instagram;
```

## Usage Notes

### API Integration
Update your API routes to query from `final_1` instead of performing JOINs:

```typescript
// Instead of complex JOINs, simply query final_1
const { data, error } = await supabase
  .from('final_1')
  .select('*')
  .order('event_date', { ascending: true });
```

### Maintenance
- The table includes automatic `updated_at` triggers
- Consider periodic refresh from source tables if data changes frequently
- Monitor index usage and add/remove indexes as query patterns evolve

## Security
- Row Level Security (RLS) is enabled
- Public read access is granted via policy
- No write access policies created (add as needed)

## Troubleshooting

### Common Issues
1. **Column conflicts**: Venue columns are prefixed with `venue_` to avoid conflicts
2. **Missing source tables**: Ensure `event` and `venue` tables exist before population
3. **JOIN key mismatches**: Verify `event.instagram_id` matches `venue.final_instagram` format

### Verification Queries
```sql
-- Check table creation
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'final_1' 
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'final_1';

-- Check row count after population
SELECT COUNT(*) FROM final_1;
```