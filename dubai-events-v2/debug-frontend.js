// Temporary debug script to check what useVenues is receiving
console.log("Testing venues API response...");

fetch('http://localhost:3000/api/venues?vibes=Elegant+Supper+Club+%7C+Cultural')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    console.log('data.success:', data.success);
    console.log('data.data:', data.data);
    console.log('Array.isArray(data.data):', Array.isArray(data.data));
    console.log('data.data.length:', data.data.length);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });