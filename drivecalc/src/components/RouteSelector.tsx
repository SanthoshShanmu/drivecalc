"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './RouteSelector.module.css';
import { LocationSuggestion } from '@/types/locations';
import { searchLocations } from '@/lib/geocoding';
import { useLanguage } from '@/context/LanguageContext';

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

  const [originInput, setOriginInput] = useState(origin?.place_name || origin?.name || '');
  const [destinationInput, setDestinationInput] = useState(destination?.place_name || destination?.name || '');

  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);

  const [isLoadingOrigin, setIsLoadingOrigin] = useState(false);
  const [isLoadingDestination, setIsLoadingDestination] = useState(false);

  const originClickRef = useRef(false);
  const destinationClickRef = useRef(false);
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOriginInput(origin?.place_name || origin?.name || '');
  }, [origin]);

  useEffect(() => {
    setDestinationInput(destination?.place_name || destination?.name || '');
  }, [destination]);

  // Debounced origin search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (originInput && originInput !== (origin?.place_name || origin?.name)) {
        setIsLoadingOrigin(true);
        try {
          const results = await searchLocations(originInput);
          setOriginSuggestions(results);
        } catch (err) {
          console.error('Origin search error:', err);
        } finally {
          setIsLoadingOrigin(false);
        }
      } else if (!originInput) {
        setOriginSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [originInput, origin]);

  // Debounced destination search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destinationInput && destinationInput !== (destination?.place_name || destination?.name)) {
        setIsLoadingDestination(true);
        try {
          const results = await searchLocations(destinationInput);
          setDestinationSuggestions(results);
        } catch (err) {
          console.error('Destination search error:', err);
        } finally {
          setIsLoadingDestination(false);
        }
      } else if (!destinationInput) {
        setDestinationSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [destinationInput, destination]);

  const handleOriginSelect = (suggestion: LocationSuggestion) => {
    setOrigin(suggestion);
    setOriginInput(suggestion.place_name || suggestion.name);
    setOriginSuggestions([]);
    originClickRef.current = true;
    originRef.current?.blur();
  };

  const handleDestinationSelect = (suggestion: LocationSuggestion) => {
    setDestination(suggestion);
    setDestinationInput(suggestion.place_name || suggestion.name);
    setDestinationSuggestions([]);
    destinationClickRef.current = true;
    destinationRef.current?.blur();
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
              if (!originClickRef.current && originInput) {
                searchLocations(originInput).then(setOriginSuggestions);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                if (!originClickRef.current) setOriginSuggestions([]);
                originClickRef.current = false;
              }, 200);
            }}
          />
          {isLoadingOrigin && <div className={styles.spinner} />}
          {originSuggestions.length > 0 && (
            <div className={styles.resultsContainer}>
              {originSuggestions.map((s, i) => (
                <div
                  key={i}
                  className={styles.resultItem}
                  onMouseDown={() => {
                    originClickRef.current = true;
                    handleOriginSelect(s);
                  }}
                >
                  {s.place_name}
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
              if (!destinationClickRef.current && destinationInput) {
                searchLocations(destinationInput).then(setDestinationSuggestions);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                if (!destinationClickRef.current) setDestinationSuggestions([]);
                destinationClickRef.current = false;
              }, 200);
            }}
          />
          {isLoadingDestination && <div className={styles.spinner} />}
          {destinationSuggestions.length > 0 && (
            <div className={styles.resultsContainer}>
              {destinationSuggestions.map((s, i) => (
                <div
                  key={i}
                  className={styles.resultItem}
                  onMouseDown={() => {
                    destinationClickRef.current = true;
                    handleDestinationSelect(s);
                  }}
                >
                  {s.place_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
