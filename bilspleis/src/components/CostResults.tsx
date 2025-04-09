import React from 'react';
import styles from './CostResults.module.css';

interface CostResultsProps {
  routeData: {
    distance: number;
    duration: number;
  };
  fuelType: string;
  fuelConsumption: number;
  fuelCost: number;
  tollData: {
    totalFee: number;
    stations: Array<{
      name: string;
      fee: number;
      location: {
        lat: number;
        lon: number;
      };
    }>;
  };
  totalCost: number;
}

export default function CostResults({
  routeData,
  fuelType,
  fuelConsumption,
  fuelCost,
  tollData,
  totalCost,
}: CostResultsProps) {
  // Get the appropriate units based on fuel type
  const getConsumptionUnit = () => {
    return fuelType === 'elbil' ? 'kWh' : 'liter';
  };

  const getFuelCostUnit = () => {
    return fuelType === 'elbil' ? 'kr/kWh' : 'kr/liter';
  };

  return (
    <div className={styles.resultsContainer}>
      <h2>Kostnadsberegning</h2>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Avstand</span>
          <span className={styles.value}>{(routeData.distance / 1000).toFixed(1)} km</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Estimert kjøretid</span>
          <span className={styles.value}>
            {(() => {
              const duration = routeData.duration; // in seconds
              if (duration >= 86400) { // 60 * 60 * 24
                return `${Math.round(duration / 86400)} dager`;
              } else if (duration >= 3600) {
                return `${Math.round(duration / 3600)} timer`;
              } else {
                return `${Math.round(duration / 60)} minutter`;
              }
            })()}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>Forbruk</span>
          <span className={styles.value}>{fuelConsumption.toFixed(1)} {getConsumptionUnit()}</span>
        </div>
      </div>
      
      <div className={styles.costs}>
        <div className={styles.costItem}>
          <div className={styles.costHeader}>
            <h3>Drivstoffkostnader</h3>
            <span className={styles.costAmount}>{fuelCost.toFixed(2)} kr</span>
          </div>
          <div className={styles.costDetails}>
            <div className={styles.costDetail}>
              <span>Forbruk:</span>
              <span>{fuelConsumption.toFixed(1)} {getConsumptionUnit()}</span>
            </div>
            <div className={styles.costDetail}>
              <span>Pris:</span>
              <span>{(fuelCost / fuelConsumption).toFixed(2)} {getFuelCostUnit()}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.costItem}>
          <div className={styles.costHeader}>
            <h3>Bomkostnader</h3>
            <span className={styles.costAmount}>{tollData.totalFee.toFixed(2)} kr</span>
          </div>
          <div className={styles.costDetails}>
            {/* Show list of toll stations */}
            {tollData.stations && tollData.stations.length > 0 ? (
              <>
                <div className={styles.tollStationHeader}>
                  <span>Bomstasjon</span>
                  <span>Avgift</span>
                </div>
                {tollData.stations.map((station, index) => (
                  <div key={index} className={styles.costDetail}>
                    <span>{station.name}</span>
                    <span>{station.fee.toFixed(2)} kr</span>
                  </div>
                ))}
              </>
            ) : (
              <div className={styles.costDetail}>
                <span>Ingen bomstasjoner på denne ruten</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`${styles.costItem} ${styles.totalCost}`}>
          <div className={styles.costHeader}>
            <h3>Totale kjørekostnader</h3>
            <span className={styles.costAmount}>{totalCost.toFixed(2)} kr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
