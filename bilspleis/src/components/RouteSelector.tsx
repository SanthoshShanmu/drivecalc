"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './RouteSelector.module.css';
import { searchLocations } from '@/lib/mapbox';

type RouteSelectorProps = {
  origin: string;
  destination: string;
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
};

export default function RouteSelector({
  origin,
  destination,
  setOrigin,
  setDestination
}: RouteSelectorProps) {
  const [originInput, setOriginInput] = useState(origin);
  const [destinationInput, setDestinationInput] = useState(destination);
  
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  
  // Add refs to track if inputs are focused
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  
  // Add refs to track suggestion clicks
  const originClickRef = useRef(false);
  const destinationClickRef = useRef(false);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (originInput && originInput !== origin) {
        setIsLoadingOrigin(true);
        try {
          const suggestions = await searchLocations(originInput);
          setOriginSuggestions(suggestions);
        } catch (error) {
          console.error('Error searching origin:', error);
        } finally {
          setIsLoadingOrigin(false);
        }
      } else if (!originInput) {
        setOriginSuggestions([]);
      }
    }, 300);
    
    return () => clearTimeout(delaySearch);
  }, [originInput, origin]);
  
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (destinationInput && destinationInput !== destination) {
        setIsLoadingDestination(true);
        try {
          const suggestions = await searchLocations(destinationInput);
          setDestinationSuggestions(suggestions);
        } catch (error) {
          console.error('Error searching destination:', error);
        } finally {
          setIsLoadingDestination(false);
        }
      } else if (!destinationInput) {
        setDestinationSuggestions([]);
      }
    }, 300);
    
    return () => clearTimeout(delaySearch);
  }, [destinationInput, destination]);

  const handleOriginSelect = (placeName: string) => {
    setOriginInput(placeName);
    setOrigin(placeName);
    setOriginSuggestions([]); // Clear suggestions immediately
    originClickRef.current = true;
    if (originRef.current) {
      originRef.current.blur(); // Remove focus from input
    }
  };
  
  const handleDestinationSelect = (placeName: string) => {
    setDestinationInput(placeName);
    setDestination(placeName);
    setDestinationSuggestions([]); // Clear suggestions immediately
    destinationClickRef.current = true;
    if (destinationRef.current) {
      destinationRef.current.blur(); // Remove focus from input
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="origin">Fra:</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="origin"
            ref={originRef}
            type="text"
            className={styles.input}
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            placeholder="Skriv inn startsted"
            onFocus={() => {
              // Only show suggestions if not clicking an item
              if (!originClickRef.current && originInput && originInput !== origin) {
                searchLocations(originInput).then(setOriginSuggestions);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow click to register
              setTimeout(() => {
                if (!originClickRef.current) {
                  setOriginSuggestions([]);
                }
                originClickRef.current = false;
              }, 200);
            }}
          />
          {isLoadingOrigin && <div className={styles.spinner} />}
          
          {originSuggestions.length > 0 && (
            <div className={styles.resultsContainer}>
              {originSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.resultItem}
                  onMouseDown={() => {
                    // Use mouseDown instead of click to handle before blur
                    originClickRef.current = true;
                    handleOriginSelect(suggestion.place_name);
                  }}
                >
                  {suggestion.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="destination">Til:</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="destination"
            ref={destinationRef}
            type="text"
            className={styles.input}
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            placeholder="Skriv inn destinasjon"
            onFocus={() => {
              // Only show suggestions if not clicking an item
              if (!destinationClickRef.current && destinationInput && destinationInput !== destination) {
                searchLocations(destinationInput).then(setDestinationSuggestions);
              }
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow click to register
              setTimeout(() => {
                if (!destinationClickRef.current) {
                  setDestinationSuggestions([]);
                }
                destinationClickRef.current = false;
              }, 200);
            }}
          />
          {isLoadingDestination && <div className={styles.spinner} />}
          
          {destinationSuggestions.length > 0 && (
            <div className={styles.resultsContainer}>
              {destinationSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.resultItem}
                  onMouseDown={() => {
                    // Use mouseDown instead of click to handle before blur
                    destinationClickRef.current = true;
                    handleDestinationSelect(suggestion.place_name);
                  }}
                >
                  {suggestion.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
