"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './Map.module.css';
import { LocationSuggestion } from '@/types/locations';
import { useLanguage } from '@/context/LanguageContext';

// Leaflet CSS must be imported here; this file is only rendered client-side
// because page.tsx loads it with dynamic({ ssr: false })
import 'leaflet/dist/leaflet.css';

interface MapProps {
  routeGeometry?: {
    coordinates: [number, number][];
    type: string;
  };
  origin?: { longitude: number; latitude: number };
  destination?: { longitude: number; latitude: number };
  stops?: LocationSuggestion[];
  tollStations?: Array<{
    name: string;
    fee: number;
    location: { lat: number; lon: number };
  }>;
}

type LeafletLib = typeof import('leaflet');

export default function Map({
  routeGeometry,
  origin,
  destination,
  stops = [],
  tollStations = []
}: MapProps) {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);
  const markersRef = useRef<import('leaflet').Layer[]>([]);
  const routeLayerRef = useRef<import('leaflet').Layer | null>(null);
  const LRef = useRef<LeafletLib | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialise the Leaflet map once on mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((mod) => {
      const L = mod.default;
      LRef.current = L;

      // Fix broken default icon paths in webpack/Next.js builds
      // Remove the internal _getIconUrl method before calling mergeOptions.
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [59.9139, 10.7522], // Oslo
        zoom: 6
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and route whenever props change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = LRef.current;
    if (!map || !L || !mapReady) return;

    // Remove previous markers and route layer
    markersRef.current.forEach(layer => map.removeLayer(layer));
    markersRef.current = [];
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    const bounds: [number, number][] = [];

    const makeIcon = (color: string) =>
      L.divIcon({
        className: '',
        html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

    if (origin) {
      const m = L.marker([origin.latitude, origin.longitude], {
        icon: makeIcon('#33A532'),
        title: t('map.start')
      }).addTo(map);
      markersRef.current.push(m);
      bounds.push([origin.latitude, origin.longitude]);
    }

    stops.forEach((stop, i) => {
      if (stop.lat && stop.lon) {
        const m = L.marker([stop.lat, stop.lon], {
          icon: makeIcon('#9C27B0'),
          title: `${t('map.stop')} ${i + 1}`
        })
          .bindPopup(`<b>${t('map.stop')} ${i + 1}</b><br/>${stop.name}`)
          .addTo(map);
        markersRef.current.push(m);
        bounds.push([stop.lat, stop.lon]);
      }
    });

    if (destination) {
      const m = L.marker([destination.latitude, destination.longitude], {
        icon: makeIcon('#E63946'),
        title: t('map.destination')
      }).addTo(map);
      markersRef.current.push(m);
      bounds.push([destination.latitude, destination.longitude]);
    }

    tollStations.forEach(station => {
      const m = L.marker([station.location.lat, station.location.lon], {
        icon: makeIcon('#ffc107'),
        title: station.name
      })
        .bindPopup(`<b>${station.name}</b><br/>${t('map.fee')}: ${station.fee.toFixed(2)} kr`)
        .addTo(map);
      markersRef.current.push(m);
      bounds.push([station.location.lat, station.location.lon]);
    });

    if (routeGeometry?.coordinates?.length) {
      const latlngs = routeGeometry.coordinates.map(
        ([lon, lat]) => [lat, lon] as [number, number]
      );
      const polyline = L.polyline(latlngs, {
        color: '#0070f3',
        weight: 5,
        opacity: 0.85
      }).addTo(map);
      routeLayerRef.current = polyline;
      latlngs.forEach(ll => bounds.push(ll));
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [origin, destination, stops, tollStations, routeGeometry, mapReady, t]);

  const hasMarkers =
    origin || destination || stops.length > 0 || tollStations.length > 0;

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />

      {hasMarkers && (
        <div className={styles.controls}>
          {origin && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.originMarker}`} />
              <span>{t('map.start')}</span>
            </div>
          )}
          {stops.length > 0 && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.stopMarker}`} />
              <span>{t('map.stop')} ({stops.length})</span>
            </div>
          )}
          {destination && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.destinationMarker}`} />
              <span>{t('map.destination')}</span>
            </div>
          )}
          {tollStations.length > 0 && (
            <div className={styles.legendItem}>
              <div className={`${styles.legendMarker} ${styles.tollMarker}`} />
              <span>{t('map.tollStation')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
