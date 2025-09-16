# Dubai Event Discovery Mobile Web App

A **mobile-first web application** for discovering nightlife events and venues in Dubai. Built with Next.js 15, Google Maps API, and optimized exclusively for mobile web experiences with intuitive touch interactions and bottom-sheet filters.

![Dubai Event Discovery Platform](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Mobile First](https://img.shields.io/badge/Mobile%20First-PWA%20Ready-green?style=for-the-badge&logo=android)

## ✨ Mobile-First Features

- 📱 **Mobile Web App** designed exclusively for mobile browsers
- 🗺️ **Full-Screen Interactive Maps** with touch-optimized controls
- 📍 **Individual Venue Markers** (no clustering) for clear mobile visibility
- 🎛️ **Bottom Filter Bar** with upward-expanding panels
- 👆 **Touch-Optimized UI** with large tap targets
- ⚡ **Fast Loading** optimized for mobile networks
- 🎨 **Dark Theme** perfect for nightlife browsing

## 📱 Mobile-Optimized Design

### Filter System
- **Bottom-positioned filter buttons** for easy thumb access
- **Expandable panels** that slide up from bottom
- **Large touch targets** (minimum 44px)
- **Gesture-friendly interactions**

### Map Interface  
- **Full-screen map view** without desktop clutter
- **Individual markers** instead of clusters for clear mobile viewing
- **Touch-friendly zoom and pan** controls
- **Mobile-optimized info panels**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Maps API key with Maps JavaScript API enabled
- Mobile device or Chrome DevTools mobile simulation

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd dubai-events
npm install
```

2. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

3. **Add your Google Maps API key**
Edit `.env.local` and replace the placeholder:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

4. **Start development server**
```bash
npm run dev
```

5. **Test on mobile**
Open [http://localhost:3000](http://localhost:3000) on your mobile device or use Chrome DevTools mobile simulation!

## 📱 Mobile Web App Architecture

### UI Components Optimized for Mobile
- **BottomFilterButtons**: Touch-friendly filter system
- **MapContainer**: Full-screen mobile map interface  
- **VenueDetailsSidebar**: Mobile-optimized venue information
- **Individual Markers**: Clear visibility without clustering

### Mobile-First Responsive Design
- **Single breakpoint approach**: Mobile-only design
- **Touch-first interactions**: Optimized for finger navigation
- **Portrait orientation focus**: Designed for mobile screens
- **PWA-ready**: Progressive Web App capabilities

## 🛠️ Mobile Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript  
- **Styling**: TailwindCSS v4 (mobile-first utilities)
- **Maps**: Google Maps JavaScript API (mobile-optimized)
- **Animations**: Framer Motion (touch-responsive)
- **State**: React Hooks + Context
- **UI Pattern**: Bottom sheets and mobile navigation

## 📁 Mobile Project Structure

```
dubai-events/
├── src/
│   ├── app/                 # Next.js 15 app directory  
│   ├── components/          # Mobile-optimized components
│   │   ├── filters/         # Bottom filter system
│   │   ├── map/            # Mobile map components
│   │   └── ui/             # Mobile UI components
│   ├── lib/                # Mobile utilities
│   └── types/              # Mobile-first interfaces
├── public/                 # PWA assets
└── docs/                   # Mobile app documentation
```

## 🔧 Mobile Configuration

### Google Maps Mobile Setup

1. **Mobile-optimized API configuration**
   ```typescript
   // Mobile-focused libraries only
   libraries: ['places', 'geometry']
   gestureHandling: 'greedy' // Mobile-friendly
   ```

2. **Mobile Map Options**
   - Touch-friendly zoom controls
   - Individual markers (no clustering)
   - Full-screen map interface
   - Mobile-optimized info windows

### Mobile Environment Variables

```bash
# Google Maps Configuration  
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Mobile PWA Settings
NEXT_PUBLIC_APP_NAME=Dubai Events Mobile
NEXT_PUBLIC_APP_SHORT_NAME=DubaiEvents
```

## 📱 Mobile User Experience

### Navigation Pattern
1. **Full-screen map** as primary interface
2. **Bottom filter bar** for easy thumb access  
3. **Expandable panels** slide up from bottom
4. **Venue details** in mobile-optimized sidebar
5. **Touch gestures** for all interactions

### Filter Categories (Mobile-Optimized)
- 📍 **Area Filter**: Dubai districts and neighborhoods
- ✨ **Vibes Filter**: Nightlife categories and moods  
- 🎁 **Offers Filter**: Deals and promotions
- 🤖 **AI Chat**: Smart venue recommendations

## 🚧 Mobile Development

### Available Scripts

```bash
npm run dev          # Mobile development server
npm run build        # Mobile-optimized production build
npm run start        # Start mobile production server  
npm run lint         # Code quality checks
```

### Mobile Testing

```bash
# Chrome DevTools mobile simulation
# iPhone/Android device testing
# Mobile network throttling
# Touch interaction testing
```

## 📝 Mobile Roadmap

- [x] Mobile-first UI design
- [x] Bottom filter system  
- [x] Touch-optimized interactions
- [ ] PWA implementation
- [ ] Offline map caching
- [ ] Push notifications
- [ ] Location-based recommendations
- [ ] Mobile app store deployment

## 🤝 Contributing

When contributing, ensure all changes are:
1. **Mobile-first designed**
2. **Touch-interaction optimized**  
3. **Performance conscious** for mobile networks
4. **Tested on actual mobile devices**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Mobile Support

If you need help:
1. Test on actual mobile devices, not just desktop browsers
2. Ensure Google Maps API key supports mobile domains
3. Check mobile network performance
4. Verify touch interactions work properly
5. Test in mobile Safari and Chrome

---

Built with 📱 for mobile-first Dubai nightlife discovery