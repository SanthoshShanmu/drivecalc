export interface LocationSuggestion {
  name: string;
  lat: number;
  lon: number;
  // Optional fields that might be provided by external APIs
  place_name?: string;
  place_type?: string[];
  center?: [number, number];
  id?: string;
}

export interface RouteWaypoint {
  location: [number, number];
  name: string;
}

export interface RouteData {
  distance: number;  // in meters
  duration: number;  // in seconds
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  waypoints: RouteWaypoint[];
}