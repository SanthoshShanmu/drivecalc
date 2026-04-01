"use client";

import React from 'react';
import styles from './StopList.module.css';
import { LocationSuggestion } from '@/types/locations';
import { useLanguage } from '@/context/LanguageContext';

interface StopListProps {
  stops: LocationSuggestion[];
  setStops: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>;
}

export default function StopList({ stops, setStops }: StopListProps) {
  const { t } = useLanguage();

  const addStop = () => {
    setStops([...stops, { name: '', lat: 0, lon: 0 }]);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, name: string) => {
    const newStops = [...stops];
    newStops[index] = { name, lat: 0, lon: 0 };
    setStops(newStops);
  };

  return (
    <div className={styles.stopsContainer}>
      <h3>{t('stops.title')}</h3>

      {stops.map((stop, index) => (
        <div key={index} className={styles.stopItem}>
          <div className={styles.stopNumber}>{index + 1}</div>
          <div className={styles.autocompleteContainer}>
            <input
              type="text"
              value={stop.name}
              placeholder={t('stops.searchPlaceholder')}
              onChange={(e) => updateStop(index, e.target.value)}
              className={styles.stopInput}
            />
          </div>
          <button
            onClick={() => removeStop(index)}
            className={styles.removeStopButton}
            aria-label={t('stops.remove')}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        onClick={addStop}
        className={styles.addStopButton}
      >
        {t('stops.add')}
      </button>
    </div>
  );
}

