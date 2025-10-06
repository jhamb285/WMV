// Flatten JSON structure to table format
// Input: JSON with nested output array containing events
// Output: Flattened array with each event as separate item

const items = $input.all();
const flattenedItems = [];

items.forEach(item => {
  // Check if item has output array directly (not nested under json)
  if (item.json && item.json.output && Array.isArray(item.json.output)) {
    // Create a separate item for each event in the output array
    item.json.output.forEach(event => {
      flattenedItems.push({
        json: {
          event_date: event.event_date || '',
          event_time: event.event_time || '',
          venue_name: event.venue_name || '',
          city: event.city || '',
          country: event.country || '',
          artists: event.artists || '',
          music_genre: event.music_genre || '',
          event_vibe: event.event_vibe || '',
          event_name: event.event_name || '',
          ticket_price: event.ticket_price || '',
          special_offers: event.special_offers || '',
          website_social: event.website_social || '',
          confidence_score: event.confidence_score || 0,
          analysis_notes: event.analysis_notes || ''
        }
      });
    });
  }
  // Handle case where output might be directly under item (not under json)
  else if (item.output && Array.isArray(item.output)) {
    item.output.forEach(event => {
      flattenedItems.push({
        json: {
          event_date: event.event_date || '',
          event_time: event.event_time || '',
          venue_name: event.venue_name || '',
          city: event.city || '',
          country: event.country || '',
          artists: event.artists || '',
          music_genre: event.music_genre || '',
          event_vibe: event.event_vibe || '',
          event_name: event.event_name || '',
          ticket_price: event.ticket_price || '',
          special_offers: event.special_offers || '',
          website_social: event.website_social || '',
          confidence_score: event.confidence_score || 0,
          analysis_notes: event.analysis_notes || ''
        }
      });
    });
  }
});

return flattenedItems;