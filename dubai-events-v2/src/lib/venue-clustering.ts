import type { Venue, VenueCluster, LatLng } from '@/types';

const CLUSTER_CONFIG = {
  gridSize: 50,
  maxZoom: 15,
  minimumClusterSize: 2
};

export class VenueClusterer {
  private gridSize: number;
  private maxZoom: number;
  private minimumClusterSize: number;

  constructor() {
    this.gridSize = CLUSTER_CONFIG.gridSize;
    this.maxZoom = CLUSTER_CONFIG.maxZoom;
    this.minimumClusterSize = CLUSTER_CONFIG.minimumClusterSize;
  }

  public clusterVenues(
    venues: Venue[], 
    map: google.maps.Map
  ): VenueCluster[] {
    const zoom = map.getZoom();
    
    if (!zoom || zoom > this.maxZoom) {
      return venues.map(venue => this.createSingleVenueCluster(venue));
    }

    const clusters: VenueCluster[] = [];
    const processedVenues = new Set<string>();
    
    venues.forEach(venue => {
      if (processedVenues.has(String(venue.venue_id))) return;

      const nearbyVenues = this.findNearbyVenues(
        venue, 
        venues, 
        map, 
        processedVenues
      );

      if (nearbyVenues.length >= this.minimumClusterSize) {
        clusters.push(this.createCluster(nearbyVenues));
        nearbyVenues.forEach(v => processedVenues.add(String(v.venue_id)));
      } else {
        clusters.push(this.createSingleVenueCluster(venue));
        processedVenues.add(String(venue.venue_id));
      }
    });

    return clusters;
  }

  private findNearbyVenues(
    centerVenue: Venue,
    allVenues: Venue[],
    map: google.maps.Map,
    processed: Set<string>
  ): Venue[] {
    const nearby: Venue[] = [centerVenue];
    const centerPixel = this.latLngToPixel(centerVenue, map);

    allVenues.forEach(venue => {
      if (venue.venue_id === centerVenue.venue_id || processed.has(String(venue.venue_id))) {
        return;
      }

      const venuePixel = this.latLngToPixel(venue, map);
      const distance = this.calculatePixelDistance(centerPixel, venuePixel);

      if (distance <= this.gridSize) {
        nearby.push(venue);
      }
    });

    return nearby;
  }

  private latLngToPixel(venue: Venue, map: google.maps.Map): google.maps.Point {
    const projection = map.getProjection();
    if (!projection || typeof google === 'undefined' || !google.maps) {
      return new google.maps.Point(0, 0);
    }

    const worldPoint = projection.fromLatLngToPoint(
      new google.maps.LatLng(venue.lat, venue.lng)
    );

    if (!worldPoint) {
      return new google.maps.Point(0, 0);
    }

    const scale = Math.pow(2, map.getZoom() || 12);
    return new google.maps.Point(
      Math.floor(worldPoint.x * scale),
      Math.floor(worldPoint.y * scale)
    );
  }

  private calculatePixelDistance(
    point1: google.maps.Point, 
    point2: google.maps.Point
  ): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private createCluster(venues: Venue[]): VenueCluster {
    const center = this.calculateClusterCenter(venues);
    const bounds = this.calculateClusterBounds(venues);
    
    return {
      id: `cluster_${venues.map(v => v.venue_id).join('_')}`,
      center,
      venues,
      bounds,
      count: venues.length
    };
  }

  private createSingleVenueCluster(venue: Venue): VenueCluster {
    const center: LatLng = { lat: venue.lat, lng: venue.lng };
    
    // Create a simple bounds object for single venue
    let bounds: google.maps.LatLngBounds;
    if (typeof google !== 'undefined' && google.maps) {
      bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(venue.lat, venue.lng),
        new google.maps.LatLng(venue.lat, venue.lng)
      );
    } else {
      // Fallback for server-side rendering
      bounds = {} as google.maps.LatLngBounds;
    }

    return {
      id: `single_${venue.venue_id}`,
      center,
      venues: [venue],
      bounds,
      count: 1
    };
  }

  private calculateClusterCenter(venues: Venue[]): LatLng {
    let totalLat = 0;
    let totalLng = 0;

    venues.forEach(venue => {
      totalLat += venue.lat;
      totalLng += venue.lng;
    });

    return {
      lat: totalLat / venues.length,
      lng: totalLng / venues.length
    };
  }

  private calculateClusterBounds(venues: Venue[]): google.maps.LatLngBounds {
    if (typeof google !== 'undefined' && google.maps) {
      const bounds = new google.maps.LatLngBounds();
      venues.forEach(venue => {
        bounds.extend(new google.maps.LatLng(venue.lat, venue.lng));
      });
      return bounds;
    }
    // Fallback for server-side rendering
    return {} as google.maps.LatLngBounds;
  }

  public getClusterIcon(cluster: VenueCluster, hasActiveStories: boolean): {
    size: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    label: string;
    hasActivity: boolean;
  } {
    const count = cluster.count;
    const dominantCategory = this.getDominantCategory(cluster.venues);
    
    let size: string;
    let backgroundColor: string;
    let borderColor: string;

    if (count < 10) {
      size = 'w-10 h-10 text-sm';
    } else if (count < 25) {
      size = 'w-12 h-12 text-base';
    } else {
      size = 'w-14 h-14 text-lg';
    }

    switch (dominantCategory) {
      case 'nightclub':
        backgroundColor = 'bg-venue-nightclub';
        borderColor = 'border-venue-nightclub/30';
        break;
      case 'restaurant':
        backgroundColor = 'bg-venue-restaurant';
        borderColor = 'border-venue-restaurant/30';
        break;
      case 'bar':
      case 'lounge':
        backgroundColor = 'bg-venue-bar';
        borderColor = 'border-venue-bar/30';
        break;
      case 'beach club':
        backgroundColor = 'bg-venue-beach';
        borderColor = 'border-venue-beach/30';
        break;
      default:
        backgroundColor = 'bg-primary';
        borderColor = 'border-primary/30';
    }

    return {
      size,
      backgroundColor,
      borderColor,
      textColor: 'text-white',
      label: count.toString(),
      hasActivity: hasActiveStories
    };
  }

  private getDominantCategory(venues: Venue[]): string {
    const categoryCount: Record<string, number> = {};
    
    venues.forEach(venue => {
      const category = venue.category.toLowerCase();
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'default';
  }
}

export const venueClusterer = new VenueClusterer();