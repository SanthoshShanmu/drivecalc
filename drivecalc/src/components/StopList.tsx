"use client";

import React, { useState, useRef } from 'react';
import styles from './StopList.module.css';
import { LocationSuggestion } from '@/types/locations';
import { searchLocations } from '@/lib/geocoding';
import { useLanguage } from '@/context/LanguageContext';

interface StopListProps {
  stops: LocationSuggestion[];
  setStops: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>;
}

export default function StopList({ stops, setStops }: StopListProps) {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<Array<{ index: number; items: LocationSuggestion[] }>>([]);
  const [loading, setLoading] = useState<number[]>([]);
  const clickRefs = useRef<boolean[]>([]);

  if (clickRefs.current.length < stops.length) {
    clickRefs.current = Array(stops.length).fill(false);
  }

  const addStop = () => {
    setStops([...stops, { name: '', lat: 0, lon: 0 }]);
    clickRefs.current.push(false);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
    setSuggestions(suggestions.filter(s => s.index !== index));
    setLoading(loading.filter(i => i !== index));
    clickRefs.current = clickRefs.current.filter((_, i) => i !== index);
  };

  const updateStopName = (index: number, name: string) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], name };
    setStops(newStops);
  };

  const handleSearch = async (index: number, query: string) => {
    if (!query) {
      setSuggestions(suggestions.filter(s => s.index !== index));
      return;
    }
    setLoading([...loading, index]);
    try {
      const results = await searchLocations(query);
      const updated = suggestions.filter(s => s.index !== index);
      updated.push({ index, items: results });
      setSuggestions(updated);
    } catch (err) {
      console.error('Stop search error:', err);
    } finally {
      setLoading(loading.filter(i => i !== index));
    }
  };

  const handleStopSelect = (index: number, suggestion: LocationSuggestion) => {
    const newStops = [...stops];
    newStops[index] = suggestion;
    setStops(newStops);
    setSuggestions(suggestions.filter(s => s.index !== index));
    clickRefs.current[index] = true;
  };

  return (
    <div className={styles.stopsContainer}>
      <h3>{t('stops.title')}</h3>

      {stops.map((stop, index) => {
        const suggestionsForIndex = suggestions.find(s => s.index === index);
        return (
          <div key={index} className={styles.stopItem}>
            <div className={styles.stopNumber}>{index + 1}</div>
            <div className={styles.autocompleteContainer}>
              <input
                type="text"
                value={stop.name}
                placeholder={t('stops.searchPlaceholder')}
                className={styles.stopInput}
                onChange={(e) => {
                  updateStopName(index, e.target.value);
                  handleSearch(index, e.target.value);
                }}
                onFocus={() => {
                  if (!clickRefs.current[index] && stop.name) {
                    handleSearch(index, stop.name);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    if (!clickRefs.current[index]) {
                      setSuggestions(suggestions.filter(s => s.index !== index));
                    }
                    clickRefs.current[index] = false;
                  }, 200);
                }}
              />
              {loading.includes(index) && <div className={styles.spinner} />}
              {suggestionsForIndex && suggestionsForIndex.items.length > 0 && (
                <div className={styles.resultsContainer}>
                  {suggestionsForIndex.items.map((s, i) => (
                    <div
                      key={i}
                      className={styles.resultItem}
                      onMouseDown={() => {
                        clickRefs.current[index] = true;
                        handleStopSelect(index, s);
                      }}
                    >
                      {s.place_name || s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => removeStop(index)}
              className={styles.removeStopButton}
              aria-label={t('stops.remove')}
            >
              ✕
            </button>
          </div>
        );
      })}

      <button onClick={addStop} className={styles.addStopButton}>
        {t('stops.add')}
      </button>
    </div>
  );
}
