import axios from 'axios';
import { LocationSuggestion, RouteData } from '../types/locations';

const MAPBOX_API_URL = 'https://api.mapbox.com';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Generate a session token for Search Box API
function getSessionToken() {
  return crypto.randomUUID ? crypto.randomUUID() : 'no-uuid-support';
}

// Save session token to ensure we use the same one for suggest and retrieve operations
const SESSION_TOKEN = getSessionToken();

export async function searchLocations(query: string, country = 'no') {
  try {
    if (!ACCESS_TOKEN) {
      console.error('No Mapbox token available in environment variables.');
      return [];
    }

    console.log(`Searching for: "${query}" with token beginning: ${ACCESS_TOKEN.substring(0, 8)}...`);
    
    const response = await axios.get(
      `${MAPBOX_API_URL}/search/searchbox/v1/suggest`,
      {
        params: {
          q: query,
          access_token: ACCESS_TOKEN,
          session_token: SESSION_TOKEN,
          limit: 5,
          country,
          language: 'no'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data && response.data.suggestions) {
      console.log(`Found ${response.data.suggestions.length} results`);
      
      // Convert to LocationSuggestion format with enhanced display names
      return response.data.suggestions.map((suggestion: any) => {
        // Get the name, address parts, and type
        const name = suggestion.name;
        const featureType = suggestion.feature_type || 'place';
        const fullAddress = suggestion.full_address || suggestion.place_formatted || '';
        
        // Format display name based on feature type
        let placeName;
        if (featureType === 'poi' && fullAddress) {
          // For POIs, use format "POI Name - Address" to highlight the POI
          const addressPart = fullAddress.replace(name, '').replace(/^,\s*/, ''); 
          placeName = `${name} - ${addressPart}`;
        } else if (featureType === 'address') {
          // For addresses, use the full address
          placeName = fullAddress || name;
        } else {
          // For other types, use the full address if available, otherwise just the name
          placeName = fullAddress || name;
        }
        
        return {
          name: name,
          lat: suggestion.coordinates ? suggestion.coordinates.latitude : null,
          lon: suggestion.coordinates ? suggestion.coordinates.longitude : null,
          place_name: placeName,
          place_type: [featureType],
          id: suggestion.mapbox_id
        };
      });
    }
    
    console.warn('No suggestions found in response');
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

// Retrieve full details for a location using its mapbox_id
export async function retrieveLocationDetails(mapboxId: string): Promise<LocationSuggestion | null> {
  try {
    if (!ACCESS_TOKEN) {
      console.error('No Mapbox token available in environment variables.');
      return null;
    }
    
    console.log(`Retrieving details for location ID: ${mapboxId}`);
    
    const response = await axios.get(
      `${MAPBOX_API_URL}/search/searchbox/v1/retrieve/${mapboxId}`,
      {
        params: {
          access_token: ACCESS_TOKEN,
          session_token: SESSION_TOKEN
        }
      }
    );
    
    if (response.data && response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      const properties = feature.properties;
      
      // Extract coordinates from the feature
      const [lon, lat] = feature.geometry.coordinates;
      
      // Format display name based on feature type
      const name = properties.name;
      const featureType = properties.feature_type || 'place';
      const fullAddress = properties.full_address || properties.place_formatted || '';
      
      let placeName;
      if (featureType === 'poi' && fullAddress) {
        // For POIs, use format "POI Name - Address" to highlight the POI
        const addressPart = fullAddress.replace(name, '').replace(/^,\s*/, '');
        placeName = `${name} - ${addressPart}`;
      } else {
        // For other types, use the full address if available, otherwise just the name
        placeName = fullAddress || name;
      }
      
      return {
        name: name,
        lat: lat,
        lon: lon,
        place_name: placeName,
        place_type: [featureType],
        id: properties.mapbox_id
      };
    }
    
    console.warn('No location details found in response');
    return null;
  } catch (error) {
    console.error('Error retrieving location details:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return null;
  }
}

// Get coordinates for a LocationSuggestion, retrieving details if needed
export async function ensureCoordinates(location: LocationSuggestion): Promise<[number, number]> {
  // If we already have coordinates, use them
  if (location.lat !== null && location.lon !== null) {
    return [location.lon, location.lat];
  }
  
  // Otherwise, retrieve full details using mapbox_id
  if (location.id) {
    console.log(`Location ${location.name} is missing coordinates, retrieving details...`);
    const details = await retrieveLocationDetails(location.id);
    if (details && details.lat !== null && details.lon !== null) {
      // Update the original location object with coordinates
      location.lat = details.lat;
      location.lon = details.lon;
      return [details.lon, details.lat];
    }
  }
  
  throw new Error(`Kunne ikke hente koordinater for: ${location.name}`);
}

// Get coordinates for a place name
export async function getCoordinates(placeName: string): Promise<[number, number]> {
  try {
    const results = await searchLocations(placeName);
    if (results.length === 0) {
      throw new Error(`Kunne ikke finne koordinater for: ${placeName}`);
    }
    
    // Ensure we have coordinates for the first result
    return await ensureCoordinates(results[0]);
  } catch (error) {
    console.error('Error getting coordinates:', error);
    throw error;
  }
}

// Updated to support multi-stop functionality
export async function fetchRouteFromMapbox(
  origin: LocationSuggestion | string,
  destination: LocationSuggestion | string,
  stops: LocationSuggestion[] = []
): Promise<RouteData> {
  try {
    // First validate that we have a token
    if (!ACCESS_TOKEN) {
      console.error('No Mapbox access token found. Please check your .env.local file');
      throw new Error('Manglende API-nøkkel for ruteberegning');
    }

    // Handle the case where origin/destination are strings (backward compatibility)
    let originCoords: [number, number];
    let destCoords: [number, number];
    
    if (typeof origin === 'string') {
      originCoords = await getCoordinates(origin);
    } else {
      // Ensure we have coordinates for the origin object
      originCoords = await ensureCoordinates(origin);
    }
    
    if (typeof destination === 'string') {
      destCoords = await getCoordinates(destination);
    } else {
      // Ensure we have coordinates for the destination object
      destCoords = await ensureCoordinates(destination);
    }
    
    // Construct coordinates string (format: lon,lat)
    let coordinatesString = `${originCoords[0]},${originCoords[1]}`;
    
    // Add stops as via points, ensuring we have coordinates
    for (const stop of stops) {
      const stopCoords = await ensureCoordinates(stop);
      coordinatesString += `;${stopCoords[0]},${stopCoords[1]}`;
    }
    
    // Add destination
    coordinatesString += `;${destCoords[0]},${destCoords[1]}`;
    
    console.log('Using coordinatesString:', coordinatesString);
    
    // Build the URL
    const url = `${MAPBOX_API_URL}/directions/v5/mapbox/driving/${coordinatesString}`;
    
    // Make the request with detailed error handling
    const response = await axios.get(url, {
      params: {
        access_token: ACCESS_TOKEN,
        geometries: 'geojson',
        overview: 'full',
        steps: true,
        annotations: 'distance'
      }
    });
    
    if (!response.data.routes || response.data.routes.length === 0) {
      console.error('No routes found in response:', response.data);
      throw new Error('Ingen rute funnet mellom valgte lokasjoner');
    }
    
    // Extract route data
    const route = response.data.routes[0];
    
    // Create waypoints for result
    const originWaypoint = typeof origin === 'string' 
      ? { name: origin, lat: originCoords[1], lon: originCoords[0] }
      : origin;
      
    const destWaypoint = typeof destination === 'string'
      ? { name: destination, lat: destCoords[1], lon: destCoords[0] }
      : destination;
    
    // Extract waypoints including stops for toll calculation
    const waypoints = [originWaypoint];
    stops.forEach(stop => waypoints.push(stop));
    waypoints.push(destWaypoint);
    
    return {
      distance: route.distance, // in meters
      duration: route.duration, // in seconds
      geometry: route.geometry,
      waypoints: waypoints.map(wp => ({
        location: [wp.lon, wp.lat],
        name: wp.name
      }))
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      throw new Error(`Kunne ikke beregne rute: ${error.response?.status || ''} ${error.response?.statusText || 'Ukjent feil'}`);
    }
    throw new Error('Kunne ikke beregne rute mellom lokasjonene');
  }
}
