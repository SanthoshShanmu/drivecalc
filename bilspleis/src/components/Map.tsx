"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './Map.module.css';
import { LocationSuggestion } from '@/types/locations';

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  routeGeometry?: any;
  origin?: { longitude: number; latitude: number };
  destination?: { longitude: number; latitude: number };
  stops?: LocationSuggestion[]; // Add stops to props interface
  tollStations?: Array<{
    name: string;
    fee: number;
    location: { lat: number; lon: number };
  }>;
}

export default function Map({ 
  routeGeometry, 
  origin, 
  destination, 
  stops = [], // Add stops with default empty array
  tollStations = [] 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // First, initialize the map without any route or markers
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: darkMode 
        ? 'mapbox://styles/mapbox/dark-v10' 
        : 'mapbox://styles/mapbox/streets-v11',
      center: [10.7522, 59.9139], // Default to Oslo
      zoom: 6 // Start with a wider view of Norway
    });
    
    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    // Set map as loaded when it's ready
    map.current.on('load', () => {
      console.log('Map loaded');
      setMapLoaded(true);
    });
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [darkMode]);
  
  // Change map style when dark mode changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.setStyle(darkMode 
        ? 'mapbox://styles/mapbox/dark-v10' 
        : 'mapbox://styles/mapbox/streets-v11'
      );
    }
  }, [darkMode, mapLoaded]);
  
  // Now create a separate effect to handle marker updates
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
    
    // Initialize bounds if we have at least one location
    let hasBounds = false;
    const bounds = new mapboxgl.LngLatBounds();
    
    // Add origin marker if exists
    if (origin) {
      new mapboxgl.Marker({ color: '#33A532' })
        .setLngLat([origin.longitude, origin.latitude])
        .addTo(map.current);
        
      bounds.extend([origin.longitude, origin.latitude]);
      hasBounds = true;
    }
    
    // Add stop markers if they exist
    if (stops && stops.length > 0) {
      stops.forEach((stop, index) => {
        if (stop.lat && stop.lon) {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>Mellomstopp ${index + 1}</h3><p>${stop.name}</p>`);
            
          new mapboxgl.Marker({ color: '#9C27B0' }) // Purple for stops
            .setLngLat([stop.lon, stop.lat])
            .setPopup(popup)
            .addTo(map.current!);
            
          bounds.extend([stop.lon, stop.lat]);
          hasBounds = true;
        }
      });
    }
    
    // Add destination marker if exists
    if (destination) {
      new mapboxgl.Marker({ color: '#E63946' })
        .setLngLat([destination.longitude, destination.latitude])
        .addTo(map.current);
        
      bounds.extend([destination.longitude, destination.latitude]);
      hasBounds = true;
    }
    
    // Add toll station markers if they exist
    if (tollStations && tollStations.length > 0) {
      tollStations.forEach(station => {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${station.name}</h3><p>Avgift: ${station.fee.toFixed(2)} kr</p>`);
          
        new mapboxgl.Marker({ color: '#ffc107' })
          .setLngLat([station.location.lon, station.location.lat])
          .setPopup(popup)
          .addTo(map.current!);
          
        bounds.extend([station.location.lon, station.location.lat]);
        hasBounds = true;
      });
    }
    
    // Fit bounds only if we have markers
    if (hasBounds) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
    
    // Add route if available
    if (routeGeometry) {
      addRouteToMap();
    }
    
  }, [origin, destination, stops, tollStations, mapLoaded, routeGeometry]);
  
  // Update the showMarkersOnly function
  const showMarkersOnly = () => {
    // This function is no longer needed as markers are handled by the useEffect
    // But we'll keep it for possible future use
    console.log('Showing markers only');
  };

  const addRouteToMap = () => {
    console.log('Adding route to map');
    
    // Check if route source already exists
    if (map.current?.getSource('route')) {
      console.log('Updating existing route');
      const source = map.current.getSource('route') as mapboxgl.GeoJSONSource;
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: routeGeometry
      });
    } else {
      console.log('Creating new route source and layer');
      // Add new source and layer
      map.current?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeGeometry
        }
      });
      
      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': darkMode ? '#3291ff' : '#0070f3',
          'line-width': 6
        }
      });
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
      
      {/* Legend - only show when at least one marker exists */}
      {(origin || destination || (stops && stops.length > 0) || (tollStations && tollStations.length > 0)) && (
        <div className={styles.controls}>
          {origin && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.originMarker}`}></div>
              <span>Start</span>
            </div>
          )}
          {stops && stops.length > 0 && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.stopMarker}`}></div>
              <span>Mellomstopp ({stops.length})</span>
            </div>
          )}
          {destination && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.destinationMarker}`}></div>
              <span>Mål</span>
            </div>
          )}
          {tollStations && tollStations.length > 0 && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.tollMarker}`}></div>
              <span>Bomstasjon</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
