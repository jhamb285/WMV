// Category Utility Functions

import type { Event, EventCategory } from '@/types';
import { PRIMARY_CATEGORY_MAP, getAllPrimaryCategories } from './category-mappings';

/**
 * Get event categories from an event object
 */
export function getEventCategories(event: Event | null | undefined): EventCategory[] {
  if (!event) return [];
  return event.event_categories || [];
}

/**
 * Calculate category counts from a list of events
 * Returns a map of database primary category names to their counts
 */
export function calculateCategoryCounts(events: Event[]): Record<string, number> {
  const counts: Record<string, number> = {};

  // Initialize all known categories to 0
  getAllPrimaryCategories().forEach(cat => {
    counts[cat] = 0;
  });

  // Count events (note: multi-category events count for each category)
  events.forEach(event => {
    const categories = getEventCategories(event);
    categories.forEach(cat => {
      if (cat.primary) {
        counts[cat.primary] = (counts[cat.primary] || 0) + 1;
      }
    });
  });

  return counts;
}

/**
 * Check if an event matches a specific primary category
 */
export function eventMatchesPrimary(event: Event, primaryCategory: string): boolean {
  const categories = getEventCategories(event);
  return categories.some(cat => cat.primary === primaryCategory);
}

/**
 * Check if an event matches a specific secondary category within a primary
 */
export function eventMatchesSecondary(
  event: Event,
  primaryCategory: string,
  secondaryCategory: string
): boolean {
  const categories = getEventCategories(event);
  return categories.some(
    cat => cat.primary === primaryCategory && cat.secondary === secondaryCategory
  );
}

/**
 * Get unique secondary categories that exist in a list of events for a given primary
 */
export function getUniqueSecondariesForPrimary(
  events: Event[],
  primaryCategory: string
): string[] {
  const secondaries = new Set<string>();

  events.forEach(event => {
    const categories = getEventCategories(event);
    categories.forEach(cat => {
      if (cat.primary === primaryCategory && cat.secondary) {
        secondaries.add(cat.secondary);
      }
    });
  });

  return Array.from(secondaries).sort();
}

/**
 * Check if an event has any event categories
 */
export function hasEventCategories(event: Event): boolean {
  return getEventCategories(event).length > 0;
}

/**
 * Get all unique primary categories from a list of events
 */
export function getUniquePrimariesFromEvents(events: Event[]): string[] {
  const primaries = new Set<string>();

  events.forEach(event => {
    const categories = getEventCategories(event);
    categories.forEach(cat => {
      if (cat.primary) {
        primaries.add(cat.primary);
      }
    });
  });

  return Array.from(primaries).sort();
}

/**
 * Get display-friendly category info for an event
 */
export function getEventCategoryDisplay(event: Event): {
  primaries: string[];
  secondaries: string[];
} {
  const categories = getEventCategories(event);

  return {
    primaries: Array.from(new Set(categories.map(c => c.primary))),
    secondaries: Array.from(new Set(categories.map(c => c.secondary).filter(Boolean)))
  };
}

/**
 * Check if event has a specific attribute
 */
export function eventHasAttribute(
  event: Event,
  attributeType: 'venue' | 'energy' | 'status' | 'timing',
  attributeValue: string
): boolean {
  if (!event.attributes) return false;
  const values = event.attributes[attributeType] || [];
  return values.includes(attributeValue);
}

/**
 * Get unique attribute values from events
 */
export function getUniqueAttributeValues(
  events: Event[],
  attributeType: 'venue' | 'energy' | 'status' | 'timing'
): string[] {
  const values = new Set<string>();

  events.forEach(event => {
    if (event.attributes) {
      const attrValues = event.attributes[attributeType] || [];
      attrValues.forEach(val => values.add(val));
    }
  });

  return Array.from(values).sort();
}
