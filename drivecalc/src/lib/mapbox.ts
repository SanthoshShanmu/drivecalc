import axios from 'axios';
import { LocationSuggestion, RouteData } from '../types/locations';

const MAPBOX_API_URL = 'https://api.mapbox.com';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Search locations by query term
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
      // Convert to LocationSuggestion format
      return response.data.features.map((feature: any) => ({
        name: feature.place_name,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        place_name: feature.place_name,
        place_type: feature.place_type,
        id: feature.id
      }));
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

// Get coordinates for a place name
export async function getCoordinates(placeName: string): Promise<[number, number]> {
  try {
    const results = await searchLocations(placeName);
    if (results.length === 0) {
      throw new Error(`Kunne ikke finne koordinater for: ${placeName}`);
    }
    
    return [results[0].lon, results[0].lat];
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
      originCoords = [origin.lon, origin.lat];
    }
    
    if (typeof destination === 'string') {
      destCoords = await getCoordinates(destination);
    } else {
      destCoords = [destination.lon, destination.lat];
    }
    
    // Construct coordinates string (format: lon,lat)
    let coordinatesString = `${originCoords[0]},${originCoords[1]}`;
    
    // Add stops as via points
    stops.forEach(stop => {
      if (stop.lat && stop.lon) {
        coordinatesString += `;${stop.lon},${stop.lat}`;
      }
    });
    
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
