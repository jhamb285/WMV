# Database Setup Guide

## Overview
This guide will help you connect your Dubai Events Discovery Platform to Supabase database backend.

## Prerequisites
- A Supabase account (create one at [supabase.com](https://supabase.com))
- Your Supabase project credentials

## Step 1: Set Up Supabase Project

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click "New Project"
   - Choose your organization and enter project details
   - Wait for the project to be created

2. **Get your project credentials**
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon public` key

## Step 2: Configure Environment Variables

1. **Update your `.env.local` file**:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   
   # Google Maps Configuration  
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDOK9Sleqeolsv2mGlkHog-A9u6pchj4L8
   NEXT_PUBLIC_MAP_ID=your_custom_map_style_id
   
   # n8n Webhook URLs (optional - for automation)
   N8N_VENUE_WEBHOOK=https://your-n8n.com/webhook/venue-discovery
   N8N_STORY_WEBHOOK=https://your-n8n.com/webhook/story-analysis
   ```

2. **Replace the placeholder values** with your actual Supabase credentials

## Step 3: Set Up Database Schema

1. **Open Supabase SQL Editor**
   - In your Supabase dashboard, go to SQL Editor
   - Click "New query"

2. **Execute the schema setup**
   - Copy the entire content of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

This will create:
- `venues` table with all venue data
- `instagram_stories` table with story analysis data
- Proper indexes for performance
- Row Level Security policies
- Sample data to get you started

## Step 4: Verify Setup

1. **Check tables were created**
   - Go to Table Editor in Supabase
   - You should see `venues` and `instagram_stories` tables
   - The `venues` table should have 12 sample venues

2. **Test API endpoints**
   - Start your development server: `npm run dev`
   - Visit `http://localhost:3000/api/venues` to test venue API
   - Visit `http://localhost:3000/api/stories` to test stories API

## Step 5: Features Available

### Real-time Data
- Venues are fetched from Supabase instead of mock data
- Real-time subscriptions for live updates
- Efficient filtering by area, category, and search

### API Endpoints
- `GET /api/venues` - Get all venues with filtering
- `GET /api/venues/[id]` - Get single venue
- `GET /api/stories` - Get Instagram stories with filtering
- `POST /api/webhooks/n8n` - Trigger n8n workflows

### Data Management Hooks
- `useVenues(filters)` - Fetch and manage venue data
- `useVenueStories(venueKey)` - Get stories for specific venue
- `useStoryAnalysis()` - Trigger story analysis workflows

## Step 6: n8n Integration (Optional)

If you want to set up automated venue discovery and story analysis:

1. **Set up n8n workflows**
   - Create workflows for venue discovery and Instagram story analysis
   - Get webhook URLs from n8n

2. **Update environment variables**
   - Add your n8n webhook URLs to `.env.local`

3. **Trigger workflows**
   - Use the refresh button to trigger venue discovery
   - Select venues to trigger story analysis

## Troubleshooting

### Environment Variables Not Working
- Restart your development server after updating `.env.local`
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access

### Database Connection Issues
- Verify your Supabase credentials are correct
- Check that your Supabase project is active
- Ensure Row Level Security policies allow public read access

### API Endpoints Not Working
- Check browser network tab for error details
- Verify database schema was set up correctly
- Check server console for error messages

## Next Steps

1. **Customize the schema** - Add more fields to venues/stories as needed
2. **Set up authentication** - Add user accounts and personalized data
3. **Add more data sources** - Integrate with other APIs or scraping tools
4. **Implement caching** - Add Redis or similar for better performance

## Support

If you encounter issues:
1. Check the browser console and server logs
2. Verify all environment variables are set correctly
3. Ensure your Supabase project has the correct schema
4. Test API endpoints individually to isolate issues

The app now uses real database data instead of mock data, with proper error handling and loading states!