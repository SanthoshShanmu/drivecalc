"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './RouteSelector.module.css';
import { LocationSuggestion } from '@/types/locations';
import { searchLocations } from '@/lib/mapbox';

// Update props to use LocationSuggestion objects
type RouteSelectorProps = {
  origin: LocationSuggestion | null;
  destination: LocationSuggestion | null;
  setOrigin: (origin: LocationSuggestion) => void;
  setDestination: (destination: LocationSuggestion) => void;
};

export default function RouteSelector({
  origin,
  destination,
  setOrigin,
  setDestination
}: RouteSelectorProps) {
  // Use the name property from LocationSuggestion in the input fields
  const [originInput, setOriginInput] = useState(origin?.name || '');
  const [destinationInput, setDestinationInput] = useState(destination?.name || '');
  
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  
  const originClickRef = useRef(false);
  const destinationClickRef = useRef(false);

  // Update effect to compare with origin?.name
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (originInput && originInput !== origin?.name) {
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
  
  // Update effect to compare with destination?.name
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (destinationInput && destinationInput !== destination?.name) {
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

  // Update handlers to pass LocationSuggestion objects
  const handleOriginSelect = (suggestion: LocationSuggestion) => {
    setOriginInput(suggestion.name);
    setOrigin(suggestion);
    setOriginSuggestions([]);
    originClickRef.current = true;
    if (originRef.current) {
      originRef.current.blur();
    }
  };
  
  const handleDestinationSelect = (suggestion: LocationSuggestion) => {
    setDestinationInput(suggestion.name);
    setDestination(suggestion);
    setDestinationSuggestions([]);
    destinationClickRef.current = true;
    if (destinationRef.current) {
      destinationRef.current.blur();
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
              if (!originClickRef.current && originInput && originInput !== origin?.name) {
                searchLocations(originInput).then(setOriginSuggestions);
              }
            }}
            onBlur={() => {
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
                    originClickRef.current = true;
                    handleOriginSelect(suggestion);
                  }}
                >
                  {suggestion.name}
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
              if (!destinationClickRef.current && destinationInput && destinationInput !== destination?.name) {
                searchLocations(destinationInput).then(setDestinationSuggestions);
              }
            }}
            onBlur={() => {
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
                    destinationClickRef.current = true;
                    handleDestinationSelect(suggestion);
                  }}
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
