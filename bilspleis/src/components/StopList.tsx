import React, { useState, useRef } from 'react';
import styles from './StopList.module.css';
import { LocationSuggestion } from '@/types/locations';
import { searchLocations } from '@/lib/mapbox';

interface StopListProps {
  stops: LocationSuggestion[];
  setStops: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>;
}

export default function StopList({ stops, setStops }: StopListProps) {
  const [suggestions, setSuggestions] = useState<Array<{index: number, suggestions: LocationSuggestion[]}>>([]);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const clickRefs = useRef<boolean[]>([]);
  
  const addStop = () => {
    setStops([...stops, { name: '', lat: 0, lon: 0 }]);
    
    // Initialize click ref for the new stop
    if (clickRefs.current.length < stops.length + 1) {
      clickRefs.current.push(false);
    }
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
    
    // Update suggestions array
    setSuggestions(suggestions.filter(s => s.index !== index));
    setIsLoading(isLoading.filter(i => i !== index));
    
    // Update click refs
    clickRefs.current = clickRefs.current.filter((_, i) => i !== index);
  };

  const updateStop = (index: number, stop: LocationSuggestion) => {
    const newStops = [...stops];
    newStops[index] = stop;
    setStops(newStops);
  };
  
  const handleSearch = async (index: number, query: string) => {
    if (!query) {
      // Remove suggestions for this index
      setSuggestions(suggestions.filter(s => s.index !== index));
      return;
    }
    
    setIsLoading([...isLoading, index]);
    
    try {
      const results = await searchLocations(query);
      
      // Update suggestions for this index
      const newSuggestions = suggestions.filter(s => s.index !== index);
      newSuggestions.push({ index, suggestions: results });
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error searching for locations:', error);
    } finally {
      setIsLoading(isLoading.filter(i => i !== index));
    }
  };
  
  const handleStopSelect = (index: number, suggestion: LocationSuggestion) => {
    updateStop(index, suggestion);
    
    // Clear suggestions for this index
    setSuggestions(suggestions.filter(s => s.index !== index));
    clickRefs.current[index] = true;
  };

  // Initialize click refs if needed
  if (clickRefs.current.length < stops.length) {
    clickRefs.current = Array(stops.length).fill(false);
  }

  return (
    <div className={styles.stopsContainer}>
      <h3>Mellomstopp</h3>
      
      {stops.map((stop, index) => (
        <div key={index} className={styles.stopItem}>
          <div className={styles.stopNumber}>{index + 1}</div>
          <div className={styles.autocompleteContainer}>
            <input
              type="text"
              value={stop.name}
              placeholder="Søk etter sted..."
              onChange={(e) => {
                updateStop(index, { ...stop, name: e.target.value });
                handleSearch(index, e.target.value);
              }}
              className={styles.stopInput}
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
            
            {isLoading.includes(index) && <div className={styles.spinner} />}
            
            {(() => {
              const suggestionsForIndex = suggestions.find(s => s.index === index);
              return suggestionsForIndex && suggestionsForIndex.suggestions.length > 0 ? (
                <div className={styles.resultsContainer}>
                  {suggestionsForIndex.suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className={styles.resultItem}
                      onMouseDown={() => {
                        clickRefs.current[index] = true;
                        handleStopSelect(index, suggestion);
                      }}
                    >
                      {suggestion.name}
                    </div>
                  ))}
                </div>
              ) : null;
            })()}
          </div>
          <button 
            onClick={() => removeStop(index)}
            className={styles.removeStopButton}
            aria-label="Fjern stopp"
          >
            ✕
          </button>
        </div>
      ))}
      
      <button 
        onClick={addStop}
        className={styles.addStopButton}
      >
        + Legg til mellomstopp
      </button>
    </div>
  );
}
