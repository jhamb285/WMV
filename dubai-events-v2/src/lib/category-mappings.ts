// Category Mappings - Database names to UI display names and colors

export interface CategoryConfig {
  display: string;  // Display name for UI
  color: string;    // Color name for styling
}

// Map database primary category names to UI display names and colors
export const PRIMARY_CATEGORY_MAP: Record<string, CategoryConfig> = {
  "Music Events": {
    display: "Music",
    color: "purple"
  },
  "Sports & Viewing": {
    display: "Sports & Viewing",
    color: "red"
  },
  "Food & Dining": {
    display: "Food & Drink",
    color: "yellow"
  },
  "Comedy & Entertainment": {
    display: "Comedy",
    color: "orange"
  },
  "Nightlife": {
    display: "Nightlife",
    color: "pink"
  }
};

// Secondary categories grouped by primary (as they exist in the database)
export const SECONDARY_CATEGORIES_MAP: Record<string, string[]> = {
  "Music Events": [
    "Electronic",
    "Hip-Hop/R&B",
    "Live Performance",
    "Arabic",
    "Mixed"
  ],
  "Sports & Viewing": [
    "Match Viewing"
  ],
  "Food & Dining": [
    "Tasting Event"
  ],
  "Comedy & Entertainment": [
    "Stand-up Comedy"
  ],
  "Nightlife": [
    "Nightclub",
    "Lounge/Bar",
    "Rooftop Venue"
  ]
};

// Hex color mapping for UI
export const COLOR_HEX_MAP: Record<string, string> = {
  purple: "#9333EA",
  red: "#EF4444",
  yellow: "#F59E0B",
  orange: "#F97316",
  pink: "#EC4899",
  indigo: "#6366F1",
  blue: "#3B82F6",
  green: "#10B981",
  teal: "#14B8A6",
  gray: "#6B7280"
};

// Get display name from database primary name
export function getDisplayName(dbPrimary: string): string {
  return PRIMARY_CATEGORY_MAP[dbPrimary]?.display || dbPrimary;
}

// Get color from database primary name
export function getCategoryColor(dbPrimary: string): string {
  return PRIMARY_CATEGORY_MAP[dbPrimary]?.color || "gray";
}

// Get hex color from color name
export function getHexColor(colorName: string): string {
  return COLOR_HEX_MAP[colorName] || COLOR_HEX_MAP.gray;
}

// Get all primary categories (database names)
export function getAllPrimaryCategories(): string[] {
  return Object.keys(PRIMARY_CATEGORY_MAP);
}

// Get secondary categories for a primary (database name)
export function getSecondaryCategories(dbPrimary: string): string[] {
  return SECONDARY_CATEGORIES_MAP[dbPrimary] || [];
}
