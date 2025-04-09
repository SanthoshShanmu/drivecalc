"use client";

import styles from './VehicleSelector.module.css';

type VehicleSelectorProps = {
  vehicle: string;
  fuelType: string;
  setVehicle: (vehicle: string) => void;
  setFuelType: (fuelType: string) => void;
};

export default function VehicleSelector({
  vehicle,
  fuelType,
  setVehicle,
  setFuelType
}: VehicleSelectorProps) {
  return (
    <div className={styles.container}>
      <h2>Velg kjøretøy</h2>
      
      <div className={styles.selectionGroup}>
        <label>Kjøretøytype:</label>
        <div className={styles.options}>
          <button
            className={`${styles.option} ${vehicle === 'car' ? styles.active : ''}`}
            onClick={() => setVehicle('car')}
          >
            <span className={styles.icon}>🚗</span>
            Personbil
          </button>
          <button
            className={`${styles.option} ${vehicle === 'truck' ? styles.active : ''}`}
            onClick={() => setVehicle('truck')}
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
    </div>
  );
}
