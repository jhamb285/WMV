# Dubai Events Discovery Platform - Deployment Information

## Project Overview
Dubai Events Discovery Platform - An interactive map-based event discovery application for Dubai venues and nightlife.

---

## GitHub Repository

### Repository URL
**https://github.com/jhamb285/WMV**

### Branch
- **Main Branch**: `main` (production-ready code)

### Latest Commits
- Fixed TypeScript errors in VenueDetailsSidebar, VenueFloatingPanel, and category-utils
- Initial commit with all project files including dubai-events-v2 (latest version)

### Repository Structure
```
WMV/
├── dubai-events-v2/          # Latest working version (PRODUCTION)
├── dubai-events-v3/          # Previous version
├── dubai-events/             # Original version
├── Backend/                  # Backend scripts and workflows
├── Phase 1/                  # Planning documentation
└── [screenshots & assets]    # Test screenshots and visual assets
```

---

## Vercel Deployment

### Production URL
**https://wmv1.vercel.app**

### Deployment Details
- **Project Name**: dubai-events-v2
- **Project ID**: `prj_0F1PONYj75GmPIeXgyrm7P1y1rBT`
- **Organization**: jhamb285's Projects
- **Organization ID**: `team_AXzJM5P8hXEgqj96U0wEX12S`

### Alternative Vercel URLs
- https://dubai-events-v2.vercel.app
- https://dubai-events-v2-qvoz4clmz-jhamb285s-projects.vercel.app (latest deployment)

### Deployment Status
✅ **Successfully Deployed** - October 6, 2025

### Build Configuration
- **Framework**: Next.js 15.5.2
- **Node Version**: Default (via Vercel)
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`

---

## Environment Variables

### Required for Production (Configured in Vercel)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wmxokeidssynkjkjizqs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured in Vercel]

# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=[configured in Vercel]
NEXT_PUBLIC_MAP_ID=your_custom_map_style_id
```

### Local Development (.env.local)
See `.env.local` file in the project root for local development configuration.

---

## Deployment Process

### Automatic Deployments
- **Trigger**: Push to `main` branch
- **Provider**: Vercel GitHub Integration
- **Build Time**: ~54 seconds

### Manual Deployment
```bash
# Using Vercel CLI with token
npx vercel --prod --yes --token YOUR_VERCEL_TOKEN

# Or login and deploy
vercel login
vercel --prod
```

---

## Key Features Deployed

### Map-Based Discovery
- Interactive Google Maps integration
- Custom venue markers with clustering
- Real-time filtering and search

### Filter System
- Area-based filtering
- Music genre filtering (hierarchical)
- Event vibe filtering
- Date-based filtering
- Offers/promotions filtering

### Venue Details
- Venue information sidebar
- Event listings per venue
- Instagram integration
- Contact information

### Database
- **Backend**: Supabase
- **Database**: PostgreSQL
- **Tables**: venues, events, final_1 (event categories)

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Maps**: Google Maps JavaScript API
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes
- **Real-time**: Supabase client

---

## Monitoring & Logs

### View Deployment Logs
```bash
vercel logs wmv1.vercel.app --token YOUR_VERCEL_TOKEN
```

### Inspect Specific Deployment
```bash
vercel inspect DEPLOYMENT_URL --logs --token YOUR_VERCEL_TOKEN
```

---

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run build` locally
   - Verify environment variables in Vercel dashboard

2. **API Rate Limits**
   - Google Maps API: Check quota in Google Cloud Console
   - Supabase: Monitor usage in Supabase dashboard

3. **Environment Variables**
   - Ensure all `NEXT_PUBLIC_*` variables are set in Vercel
   - Redeploy after updating environment variables

---

## Quick Links

- **GitHub Repo**: https://github.com/jhamb285/WMV
- **Production Site**: https://wmv1.vercel.app
- **Vercel Dashboard**: https://vercel.com/jhamb285s-projects/dubai-events-v2
- **Supabase Dashboard**: https://supabase.com/dashboard/project/wmxokeidssynkjkjizqs

---

## Contact & Support

- **Repository Owner**: jhamb285
- **Deployment Date**: October 6, 2025
- **Last Updated**: October 6, 2025

---

*Generated with [Claude Code](https://claude.com/claude-code)*
