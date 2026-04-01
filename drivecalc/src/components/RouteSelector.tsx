"use client";

import { useState, useEffect } from 'react';
import styles from './RouteSelector.module.css';
import { LocationSuggestion } from '@/types/locations';
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

  useEffect(() => {
    setOriginInput(origin?.place_name || origin?.name || '');
  }, [origin]);

  useEffect(() => {
    setDestinationInput(destination?.place_name || destination?.name || '');
  }, [destination]);

  const handleOriginBlur = () => {
    if (originInput.trim()) {
      setOrigin({ name: originInput.trim(), lat: 0, lon: 0 });
    }
  };

  const handleDestinationBlur = () => {
    if (destinationInput.trim()) {
      setDestination({ name: destinationInput.trim(), lat: 0, lon: 0 });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label htmlFor="origin">{t('route.from')}</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="origin"
            type="text"
            className={styles.input}
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
            onBlur={handleOriginBlur}
            placeholder={t('route.fromPlaceholder')}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="destination">{t('route.to')}</label>
        <div className={styles.autocompleteContainer}>
          <input
            id="destination"
            type="text"
            className={styles.input}
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
            onBlur={handleDestinationBlur}
            placeholder={t('route.toPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}
