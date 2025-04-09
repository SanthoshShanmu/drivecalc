"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './Map.module.css';

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  routeGeometry?: any;
  origin?: { longitude: number; latitude: number };
  destination?: { longitude: number; latitude: number };
  tollStations?: Array<{
    name: string;
    fee: number;
    location: { lat: number; lon: number };
  }>;
}

export default function Map({ routeGeometry, origin, destination, tollStations = [] }: MapProps) {
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
  
  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: darkMode 
        ? 'mapbox://styles/mapbox/dark-v10' 
        : 'mapbox://styles/mapbox/streets-v11',
      center: [10.7522, 59.9139], // Default to Oslo
      zoom: 10
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
  
  // Add route when geometry, origin, destination are available and map is loaded
  useEffect(() => {
    if (!map.current || !routeGeometry || !origin || !destination) return;

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

    // If map is already loaded, add the route immediately
    if (mapLoaded) {
      addRouteToMap();
    } else {
      // If map is still loading, wait for the load event
      map.current.once('load', addRouteToMap);
    }

    // Clear existing markers
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
    
    // Add origin marker
    new mapboxgl.Marker({ color: '#33A532' })
      .setLngLat([origin.longitude, origin.latitude])
      .addTo(map.current);
    
    // Add destination marker
    new mapboxgl.Marker({ color: '#E63946' })
      .setLngLat([destination.longitude, destination.latitude])
      .addTo(map.current);
    
    // Add toll station markers
    const bounds = new mapboxgl.LngLatBounds();
    
    tollStations.forEach(station => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${station.name}</h3><p>Avgift: ${station.fee.toFixed(2)} kr</p>`);
        
      new mapboxgl.Marker({ color: '#ffc107' })
        .setLngLat([station.location.lon, station.location.lat])
        .setPopup(popup)
        .addTo(map.current!);
        
      bounds.extend([station.location.lon, station.location.lat]);
    });
    
    // Extend bounds to include origin and destination
    bounds.extend([origin.longitude, origin.latitude]);
    bounds.extend([destination.longitude, destination.latitude]);
    
    // Fit bounds with padding
    map.current.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  }, [routeGeometry, origin, destination, tollStations, mapLoaded, darkMode]);
  
  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainer} className={styles.map} />
      
      {/* Legend */}
      <div className={styles.controls}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendMarker} ${styles.originMarker}`}></div>
          <span>Start</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendMarker} ${styles.destinationMarker}`}></div>
          <span>Mål</span>
        </div>
        {tollStations && tollStations.length > 0 && (
          <div className={styles.legendItem}>
            <div className={`${styles.legendMarker} ${styles.tollMarker}`}></div>
            <span>Bomstasjon</span>
          </div>
        )}
      </div>
    </div>
  );
}
