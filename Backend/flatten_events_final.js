// Flatten JSON structure to table format - FINAL VERSION
// Input: Array with objects containing output arrays of events
// Output: Flattened structure with one item per event

const items = $input.all();
const flattenedItems = [];

items.forEach(item => {
  // Handle the exact structure from your input: item.json.output array
  if (item.json && item.json.output && Array.isArray(item.json.output)) {
    console.log(`Processing ${item.json.output.length} events from json.output`);

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
  // Handle case where output is directly under item (not nested under json)
  else if (item.output && Array.isArray(item.output)) {
    console.log(`Processing ${item.output.length} events from direct output`);

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
  // Handle single event object directly under json
  else if (item.json && item.json.event_date) {
    console.log("Processing single event from json");

    flattenedItems.push({
      json: {
        event_date: item.json.event_date || '',
        event_time: item.json.event_time || '',
        venue_name: item.json.venue_name || '',
        city: item.json.city || '',
        country: item.json.country || '',
        artists: item.json.artists || '',
        music_genre: item.json.music_genre || '',
        event_vibe: item.json.event_vibe || '',
        event_name: item.json.event_name || '',
        ticket_price: item.json.ticket_price || '',
        special_offers: item.json.special_offers || '',
        website_social: item.json.website_social || '',
        confidence_score: item.json.confidence_score || 0,
        analysis_notes: item.json.analysis_notes || ''
      }
    });
  }
});

console.log(`Total flattened events: ${flattenedItems.length}`);
return flattenedItems;