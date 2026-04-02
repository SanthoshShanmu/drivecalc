import axios from 'axios';
import { LocationSuggestion, RouteData } from '../types/locations';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OSRM_URL = 'https://router.project-osrm.org';

/** Shape of a single result returned by the Nominatim /search endpoint */
interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: Record<string, string>;
}

/**
 * Search for locations using the free Nominatim (OpenStreetMap) geocoding API.
 * No API key required.
 */
export async function searchLocations(query: string, country = 'no'): Promise<LocationSuggestion[]> {
  try {
    const response = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5,
        countrycodes: country,
        'accept-language': 'no'
      },
      headers: {
        // Nominatim requires a User-Agent header
        'User-Agent': 'DriveCalc/1.0 (https://drivecalc.no)'
      }
    });

    if (!Array.isArray(response.data)) return [];

    return (response.data as NominatimResult[]).map((item) => ({
      name: item.display_name.split(',')[0],
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      place_name: item.display_name,
      place_type: [item.type],
      id: item.place_id?.toString()
    }));
  } catch (error) {
    console.error('Error searching locations with Nominatim:', error);
    return [];
  }
}

/**
 * Calculate a driving route using the free OSRM routing API.
 * No API key required.
 */
export async function fetchRoute(
  origin: LocationSuggestion,
  destination: LocationSuggestion,
  stops: LocationSuggestion[] = []
): Promise<RouteData> {
  // Ensure all locations have coordinates
  const allPoints = [origin, ...stops, destination];
  const missing = allPoints.find(p => !p.lat || !p.lon);
  if (missing) {
    throw new Error(`Koordinater mangler for: ${missing.name}`);
  }

  // Build coordinates string: lon,lat;lon,lat;...
  const coordinates = allPoints
    .map(p => `${p.lon},${p.lat}`)
    .join(';');

  const response = await axios.get(
    `${OSRM_URL}/route/v1/driving/${coordinates}`,
    {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: false
      }
    }
  );

  if (
    !response.data.routes ||
    response.data.routes.length === 0
  ) {
    throw new Error('Ingen rute funnet mellom valgte lokasjoner');
  }

  const route = response.data.routes[0];

  return {
    distance: route.distance,   // metres
    duration: route.duration,   // seconds
    geometry: route.geometry,
    waypoints: allPoints.map(p => ({
      location: [p.lon, p.lat] as [number, number],
      name: p.name
    }))
  };
}
