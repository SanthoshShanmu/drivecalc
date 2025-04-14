"use client";

import { useLanguage } from '@/context/LanguageContext';
import styles from './VehicleSelector.module.css';

type VehicleSelectorProps = {
  vehicle: string;
  fuelType: string;
  setVehicle: (vehicle: string) => void;
  setFuelType: (fuelType: string) => void;
  isRoundTrip: boolean;
  setIsRoundTrip: (isRoundTrip: boolean) => void;
  passengerCount: number;
  setPassengerCount: (count: number) => void;
};

export default function VehicleSelector({
  vehicle,
  fuelType,
  setVehicle,
  setFuelType,
  isRoundTrip,
  setIsRoundTrip,
  passengerCount,
  setPassengerCount
}: VehicleSelectorProps) {
  const { t } = useLanguage();
  
  // Create a handler for vehicle type changes that ensures compatible fuel types
  const handleVehicleChange = (newVehicle: string) => {
    setVehicle(newVehicle);
    
    // If selecting truck, automatically set fuel type to diesel
    // since it's the only compatible option
    if (newVehicle === 'truck') {
      setFuelType('diesel');
    }
  };
  
  return (
    <div className={styles.container}>
      <h2>{t('vehicle.title')}</h2>
      
      <div className={styles.selectionGroup}>
        <label>{t('vehicle.type')}</label>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${vehicle === 'car' ? styles.active : ''}`}
            onClick={() => handleVehicleChange('car')}
          >
            <span className={styles.icon}>🚗</span>
            {t('vehicle.car')}
          </button>
          <button
            className={`${styles.option} ${vehicle === 'truck' ? styles.active : ''}`}
            onClick={() => handleVehicleChange('truck')}
          >
            <span className={styles.icon}>🚚</span>
            {t('vehicle.truck')}
          </button>
        </div>
      </div>
      
      <div className={styles.selectionGroup}>
        <label>{t('vehicle.fuelType')}</label>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${fuelType === 'bensin' ? styles.active : ''}`}
            onClick={() => setFuelType('bensin')}
            disabled={vehicle === 'truck'}
          >
            {t('vehicle.petrol')}
          </button>
          <button
            className={`${styles.option} ${fuelType === 'diesel' ? styles.active : ''}`}
            onClick={() => setFuelType('diesel')}
          >
            {t('vehicle.diesel')}
          </button>
          <button
            className={`${styles.option} ${fuelType === 'elbil' ? styles.active : ''}`}
            onClick={() => setFuelType('elbil')}
            disabled={vehicle === 'truck'}
          >
            {t('vehicle.electric')}
          </button>
          <button
            className={`${styles.option} ${fuelType === 'hybrid' ? styles.active : ''}`}
            onClick={() => setFuelType('hybrid')}
            disabled={vehicle === 'truck'}
          >
            {t('vehicle.hybrid')}
          </button>
        </div>
      </div>
      
      <div className={styles.optionsRow}>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isRoundTrip}
              onChange={(e) => setIsRoundTrip(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>{t('vehicle.roundTrip')}</span>
          </label>
        </div>
        
        <div className={styles.passengerCount}>
          <label htmlFor="passengerCount">{t('vehicle.passengers')}</label>
          <div className={styles.counterContainer}>
            <button 
              className={styles.counterButton}
              onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
              aria-label="-"
            >
              -
            </button>
            <input
              id="passengerCount"
              type="number"
              min="1"
              max="9"
              value={passengerCount}
              onChange={(e) => setPassengerCount(Math.max(1, Math.min(9, parseInt(e.target.value) || 1)))}
              className={styles.counterInput}
            />
            <button 
              className={styles.counterButton}
              onClick={() => setPassengerCount(Math.min(9, passengerCount + 1))}
              aria-label="+"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
