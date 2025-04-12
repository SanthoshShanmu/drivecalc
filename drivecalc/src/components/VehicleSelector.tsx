"use client";

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
      <h2>Velg kjøretøy</h2>
      
      <div className={styles.selectionGroup}>
        <label>Kjøretøytype:</label>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${vehicle === 'car' ? styles.active : ''}`}
            onClick={() => handleVehicleChange('car')}
          >
            <span className={styles.icon}>🚗</span>
            Personbil
          </button>
          <button
            className={`${styles.option} ${vehicle === 'truck' ? styles.active : ''}`}
            onClick={() => handleVehicleChange('truck')}
          >
            <span className={styles.icon}>🚚</span>
            Lastebil
          </button>
        </div>
      </div>
      
      <div className={styles.selectionGroup}>
        <label>Drivstofftype:</label>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${fuelType === 'bensin' ? styles.active : ''}`}
            onClick={() => setFuelType('bensin')}
            disabled={vehicle === 'truck'}
          >
            Bensin
          </button>
          <button
            className={`${styles.option} ${fuelType === 'diesel' ? styles.active : ''}`}
            onClick={() => setFuelType('diesel')}
          >
            Diesel
          </button>
          <button
            className={`${styles.option} ${fuelType === 'elbil' ? styles.active : ''}`}
            onClick={() => setFuelType('elbil')}
            disabled={vehicle === 'truck'}
          >
            Elbil
          </button>
          <button
            className={`${styles.option} ${fuelType === 'hybrid' ? styles.active : ''}`}
            onClick={() => setFuelType('hybrid')}
            disabled={vehicle === 'truck'}
          >
            Hybrid
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
            <span className={styles.checkboxText}>Tur-retur</span>
          </label>
        </div>
        
        <div className={styles.passengerCount}>
          <label htmlFor="passengerCount">Antall passasjerer:</label>
          <div className={styles.counterContainer}>
            <button 
              className={styles.counterButton}
              onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
              aria-label="Reduser antall passasjerer"
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
              aria-label="Øk antall passasjerer"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
