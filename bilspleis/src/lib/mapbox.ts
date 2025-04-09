import axios from 'axios';

const MAPBOX_API_URL = 'https://api.mapbox.com';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Update searchLocations to use the constant
export async function searchLocations(query: string, country = 'norway') {
  try {
    if (!ACCESS_TOKEN) {
      console.error('No Mapbox token available in environment variables.');
      return [];
    }

    console.log(`Searching for: "${query}" with token beginning: ${ACCESS_TOKEN.substring(0, 8)}...`);
    
    const response = await axios.get(
      `${MAPBOX_API_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token: ACCESS_TOKEN,
          limit: 5
        }
      }
    );
    
    if (response.data && response.data.features) {
      console.log(`Found ${response.data.features.length} results`);
      return response.data.features;
    }
    
    console.warn('No features found in response');
    return [];
  } catch (error) {
    console.error('Error in searchLocations:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return [];
  }
}

/**
 * Get coordinates for a place name
 */
export async function getCoordinates(placeName: string) {
  try {
    const results = await searchLocations(placeName);
    if (results.length === 0) {
      throw new Error(`Kunne ikke finne koordinater for: ${placeName}`);
    }
    
    return results[0].geometry.coordinates;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}

/**
 * Fetch route information between two points
 */
export async function fetchRouteFromMapbox(origin: string, destination: string) {
  try {
    // First validate that we have a token
    if (!ACCESS_TOKEN) {
      console.error('No Mapbox access token found. Please check your .env.local file');
      throw new Error('Manglende API-nøkkel for ruteberegning');
    }

    // Get coordinates for origin and destination
    console.log('Getting coordinates for:', origin, 'to', destination);
    const originCoords = await getCoordinates(origin);
    const destCoords = await getCoordinates(destination);
    
    if (!originCoords || !destCoords) {
      throw new Error('Kunne ikke finne koordinater for angitte lokasjoner');
    }
    
    // Validate coordinates format - must be [longitude, latitude]
    if (originCoords.length < 2 || destCoords.length < 2) {
      throw new Error('Ugyldige koordinater returnert fra geocoding');
    }
    
    console.log('Origin coordinates:', originCoords);
    console.log('Destination coordinates:', destCoords);
    
    // Ensure coordinates are numbers and in the right order (longitude first)
    const originString = `${parseFloat(originCoords[0])},${parseFloat(originCoords[1])}`;
    const destString = `${parseFloat(destCoords[0])},${parseFloat(destCoords[1])}`;
    
    // Build the URL carefully
    const url = `${MAPBOX_API_URL}/directions/v5/mapbox/driving/${originString};${destString}`;
    console.log('Request URL (without params):', url);
    
    // Make the request with detailed error handling
    const response = await axios.get(url, {
      params: {
        access_token: ACCESS_TOKEN,
        geometries: 'geojson',
        overview: 'full'
      }
    });
    
    if (!response.data.routes || response.data.routes.length === 0) {
      console.error('No routes found in response:', response.data);
      throw new Error('Ingen rute funnet mellom valgte lokasjoner');
    }
    
    // Successfully retrieved route
    const route = response.data.routes[0];
    console.log('Route found:', route.distance, 'meters,', route.duration, 'seconds');
    
    // Extract waypoints for toll calculations
    const waypoints = extractWaypoints(route.geometry);
    
    return {
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
      waypoints
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      
      if (error.response?.status === 422) {
        console.error('422 Error - Unprocessable Entity. Common causes:');
        console.error('1. Invalid coordinates');
        console.error('2. API token restrictions');
        console.error('3. No route exists between these points');
        
        try {
          console.log('Debug - Origin search result:', await searchLocations(origin));
          console.log('Debug - Destination search result:', await searchLocations(destination));
        } catch (e) {
          console.error('Failed to debug coordinates:', e);
        }
      }
      
      throw new Error(`Kunne ikke beregne rute: ${error.response?.status || ''} ${error.response?.statusText || 'Ukjent feil'}`);
    }
    throw new Error('Kunne ikke beregne rute mellom lokasjonene');
  }
}

/**
 * Extract waypoints from route geometry at regular intervals
 * This helps in getting toll stations along the route
 */
function extractWaypoints(geometry: { coordinates: any; }) {
  const coordinates = geometry.coordinates;
  const waypoints = [];
  
  // Extract waypoints at approximately every 5km
  const totalPoints = coordinates.length;
  const interval = Math.max(1, Math.floor(totalPoints / 20));
  
  for (let i = 0; i < totalPoints; i += interval) {
    waypoints.push({
      location: coordinates[i],
      name: `Waypoint ${waypoints.length + 1}`
    });
  }
  
  // Always include the last point
  if (!waypoints.includes(coordinates[totalPoints - 1])) {
    waypoints.push({
      location: coordinates[totalPoints - 1],
      name: 'Destination'
    });
  }
  
  return waypoints;
}
