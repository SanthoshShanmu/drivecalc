"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './RouteSelector.module.css';
import { searchLocations } from '@/lib/mapbox';

type LocationResult = {
  id: string;
  place_name: string;
  [key: string]: any;
};

type RouteSelectorProps = {
  origin: string;
  destination: string;
  setOrigin: (value: string) => void;
  setDestination: (value: string) => void;
};

export default function RouteSelector({ 
  origin, 
  destination, 
  setOrigin,
  setDestination
}: RouteSelectorProps): React.ReactElement { 
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [originResults, setOriginResults] = useState<LocationResult[]>([]);
  const [destinationResults, setDestinationResults] = useState<LocationResult[]>([]);
  const destinationResultsRef = useRef<HTMLDivElement>(null);
  const originResultsRef = useRef<HTMLDivElement>(null);
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  
  useEffect(() => {
    const searchOrigin = async () => {
      if (originQuery.length < 2) {
        setOriginResults([]);
        return;
      }
      
      setIsLoadingOrigin(true);
      try {
        const results = await searchLocations(originQuery, 'norway');
        setOriginResults(results);
      } catch (error) {
        console.error('Feil ved søk etter startpunkt:', error);
      } finally {
        setIsLoadingOrigin(false);
      }
    };
    
    const timer = setTimeout(searchOrigin, 300);
    return () => clearTimeout(timer);
  }, [originQuery]);
  
  useEffect(() => {
    const searchDestination = async () => {
      if (destinationQuery.length < 2) {
        setDestinationResults([]);
        return;
      }
      
      setIsLoadingDestination(true);
      try {
        const results = await searchLocations(destinationQuery, 'norway');
        setDestinationResults(results);
      } catch (error) {
        console.error('Feil ved søk etter destinasjon:', error);
      } finally {
        setIsLoadingDestination(false);
      }
    };
    
    const timer = setTimeout(searchDestination, 300);
    return () => clearTimeout(timer);
  }, [destinationQuery]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (originResultsRef.current && 
          !originResultsRef.current.contains(event.target as Node)) {
        setOriginResults([]);
      }
      
      if (destinationResultsRef.current && 
          !destinationResultsRef.current.contains(event.target as Node)) {
        setDestinationResults([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={styles.container}>
      <h2>Velg rute</h2>
      
      <div className={styles.inputGroup}>
        <label htmlFor="origin">Startpunkt:</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="origin"
            type="text"
            value={originQuery}
            onChange={(e) => setOriginQuery(e.target.value)}
            placeholder="Skriv startpunkt..."
            className={styles.input}
          />
          
          {isLoadingOrigin && <div className={styles.spinner} />}
          
          {originResults.length > 0 && (
            <div className={styles.resultsContainer} ref={originResultsRef}>
              {originResults.map((result) => (
                <div 
                  key={result.id}
                  className={styles.resultItem}
                  onClick={() => {
                    setOrigin(result.place_name);
                    setOriginQuery(result.place_name);
                    setOriginResults([]);
                  }}
                >
                  {result.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="destination">Destinasjon:</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="destination"
            type="text"
            value={destinationQuery}
            onChange={(e) => setDestinationQuery(e.target.value)}
            placeholder="Skriv destinasjon..."
            className={styles.input}
          />
          
          {isLoadingDestination && <div className={styles.spinner} />}
          
          {destinationResults.length > 0 && (
            <div className={styles.resultsContainer} ref={destinationResultsRef}>
              {destinationResults.map((result) => (
                <div 
                  key={result.id}
                  className={styles.resultItem}
                  onClick={() => {
                    setDestination(result.place_name);
                    setDestinationQuery(result.place_name);
                    setDestinationResults([]);
                  }}
                >
                  {result.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
