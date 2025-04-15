"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './RouteSelector.module.css';
import { LocationSuggestion } from '@/types/locations';
import { searchLocations, retrieveLocationDetails } from '@/lib/mapbox';
import { useLanguage } from '@/context/LanguageContext';

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
  const { t } = useLanguage();
  
  // Use the place_name property instead of name for display
  const [originInput, setOriginInput] = useState(origin?.place_name || '');
  const [destinationInput, setDestinationInput] = useState(destination?.place_name || '');
  
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  
  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);
  
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  
  const originClickRef = useRef(false);
  const destinationClickRef = useRef(false);

  // Update effect to compare with origin?.place_name
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (originInput && originInput !== origin?.place_name) {
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
  
  // Update effect to compare with destination?.place_name
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (destinationInput && destinationInput !== destination?.place_name) {
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

  // Update to handle string | undefined
  const handleOriginSelect = async (suggestion: LocationSuggestion | string | undefined) => {
    if (!suggestion) {
      // Handle undefined
      setOriginInput('');
      return;
    }
    
    if (typeof suggestion === 'string') {
      // Handle string
      setOriginInput(suggestion);
      // You might want to search for this string to get a LocationSuggestion
      return;
    }
    
    // Handle LocationSuggestion object
    setOriginInput(suggestion.place_name || suggestion.name);
    setIsLoadingOrigin(true);
    
    try {
      // Ensure we have coordinates before setting the origin
      if (suggestion.lat === null || suggestion.lon === null) {
        if (suggestion.id) {
          const details = await retrieveLocationDetails(suggestion.id);
          if (details) {
            setOrigin({
              ...suggestion,
              lat: details.lat,
              lon: details.lon
            });
          } else {
            throw new Error(`Kunne ikke hente detaljer for ${suggestion.name}`);
          }
        } else {
          throw new Error(`Mangler ID for ${suggestion.name}`);
        }
      } else {
        // Already has coordinates
        setOrigin(suggestion);
      }
    } catch (error) {
      console.error("Error retrieving location details:", error);
      setOrigin(suggestion);
    } finally {
      setIsLoadingOrigin(false);
      setOriginSuggestions([]);
      originClickRef.current = true;
      if (originRef.current) {
        originRef.current.blur();
      }
    }
  };
  
  // Update to handle string | undefined
  const handleDestinationSelect = async (suggestion: LocationSuggestion | string | undefined) => {
    if (!suggestion) {
      // Handle undefined
      setDestinationInput('');
      return;
    }
    
    if (typeof suggestion === 'string') {
      // Handle string
      setDestinationInput(suggestion);
      // You might want to search for this string to get a LocationSuggestion
      return;
    }
    
    // Handle LocationSuggestion object
    setDestinationInput(suggestion.place_name || suggestion.name);
    setIsLoadingDestination(true);
    
    try {
      // Ensure we have coordinates before setting the destination
      if (suggestion.lat === null || suggestion.lon === null) {
        if (suggestion.id) {
          const details = await retrieveLocationDetails(suggestion.id);
          if (details) {
            setDestination({
              ...suggestion,
              lat: details.lat,
              lon: details.lon
            });
          } else {
            throw new Error(`Kunne ikke hente detaljer for ${suggestion.name}`);
          }
        } else {
          throw new Error(`Mangler ID for ${suggestion.name}`);
        }
      } else {
        // Already has coordinates
        setDestination(suggestion);
      }
    } catch (error) {
      console.error("Error retrieving location details:", error);
      setDestination(suggestion);
    } finally {
      setIsLoadingDestination(false);
      setDestinationSuggestions([]);
      destinationClickRef.current = true;
      if (destinationRef.current) {
        destinationRef.current.blur();
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="origin">{t('route.from')}</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="origin"
            ref={originRef}
            type="text"
            className={styles.input}
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            placeholder={t('route.fromPlaceholder')}
            onFocus={() => {
              if (!originClickRef.current && originInput && originInput !== origin?.place_name) {
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
                  {suggestion.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="destination">{t('route.to')}</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="destination"
            ref={destinationRef}
            type="text"
            className={styles.input}
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            placeholder={t('route.toPlaceholder')}
            onFocus={() => {
              if (!destinationClickRef.current && destinationInput && destinationInput !== destination?.place_name) {
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
