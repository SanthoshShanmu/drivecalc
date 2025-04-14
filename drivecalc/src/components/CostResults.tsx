"use client";

import React from 'react';
import styles from './CostResults.module.css';
import { useLanguage } from '@/context/LanguageContext';

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
  isRoundTrip: boolean;
  passengerCount: number;
  stops: Array<{
    name: string;
    lat: number;
    lon: number;
  }>;
}

export default function CostResults({
  routeData,
  fuelType,
  fuelConsumption,
  fuelCost,
  tollData,
  totalCost,
  isRoundTrip,
  passengerCount,
  stops,
}: CostResultsProps) {
  const { t } = useLanguage();
  
  // Get the appropriate units based on fuel type
  const getConsumptionUnit = () => {
    return fuelType === 'elbil' ? 'kWh' : 'liter';
  };

  const getFuelCostUnit = () => {
    return fuelType === 'elbil' ? 'kr/kWh' : 'kr/liter';
  };

  // Calculate cost per passenger
  const costPerPassenger = totalCost / passengerCount;

  // Format time
  const formatTime = (duration: number) => {
    if (duration >= 86400) { // 60 * 60 * 24
      return `${Math.round(duration / 86400)} ${t('time.days')}`;
    } else if (duration >= 3600) {
      return `${Math.round(duration / 3600)} ${t('time.hours')}`;
    } else {
      return `${Math.round(duration / 60)} ${t('time.minutes')}`;
    }
  };

  return (
    <div className={styles.resultsContainer}>
      <h2>
        {t('results.title')}
        {isRoundTrip && <span className={styles.roundTripBadge}>{t('results.roundTrip')}</span>}
      </h2>
      
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.label}>{t('results.distance')}</span>
          <span className={styles.value}>{(routeData.distance / 1000).toFixed(1)} km</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>{t('results.time')}</span>
          <span className={styles.value}>
            {formatTime(routeData.duration)}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.label}>{t('results.consumption')}</span>
          <span className={styles.value}>{fuelConsumption.toFixed(1)} {getConsumptionUnit()}</span>
        </div>
      </div>
      
      <div className={styles.costs}>
        <div className={styles.costItem}>
          <div className={styles.costHeader}>
            <h3>{t('results.fuelCosts')}</h3>
            <span className={styles.costAmount}>{fuelCost.toFixed(2)} kr</span>
          </div>
          <div className={styles.costDetails}>
            <div className={styles.costDetail}>
              <span>{t('results.consumption.word')}</span>
              <span>{fuelConsumption.toFixed(1)} {getConsumptionUnit()}</span>
            </div>
            <div className={styles.costDetail}>
              <span>{t('results.price')}</span>
              <span>{(fuelCost / fuelConsumption).toFixed(2)} {getFuelCostUnit()}</span>
            </div>
            {isRoundTrip && (
              <div className={styles.costDetail}>
                <span>{t('results.calculatedFor')}</span>
                <span>{t('results.roundTrip')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.costItem}>
          <div className={styles.costHeader}>
            <h3>{t('results.tollCosts')}</h3>
            <span className={styles.costAmount}>{tollData.totalFee.toFixed(2)} kr</span>
          </div>
          <div className={styles.costDetails}>
            {/* Show list of toll stations */}
            {tollData.stations && tollData.stations.length > 0 ? (
              <>
                <div className={styles.tollStationHeader}>
                  <span>{t('results.tollStation')}</span>
                  <span>{t('results.fee')}</span>
                </div>
                {tollData.stations.map((station, index) => (
                  <div key={index} className={styles.costDetail}>
                    <span>{station.name}</span>
                    <span>{station.fee.toFixed(2)} kr</span>
                  </div>
                ))}
                {isRoundTrip && (
                  <div className={styles.costDetail + ' ' + styles.roundTripInfo}>
                    <span>{t('results.pricesIncludeReturn')}</span>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.costDetail}>
                <span>{t('results.noTolls')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={`${styles.costItem} ${styles.totalCost}`}>
          <div className={styles.costHeader}>
            <h3>{t('results.totalCosts')}</h3>
            <span className={styles.costAmount}>{totalCost.toFixed(2)} kr</span>
          </div>
          <div className={styles.costDetails}>
            {isRoundTrip && (
              <div className={styles.costDetail}>
                <span>{t('results.calculatedFor')} {t('results.roundTrip').toLowerCase()}</span>
              </div>
            )}
            {passengerCount > 1 && (
              <div className={styles.costSplit}>
                <div className={styles.costSplitHeader}>
                  <span className={styles.splitBadge}>{passengerCount} {t('results.persons')}</span>
                  <span>{t('results.costPerPerson')}</span>
                  <span className={styles.splitAmount}>{costPerPassenger.toFixed(2)} kr</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add stops information if any */}
      {stops.length > 0 && (
        <div className={styles.stopsInfo}>
          <h3>{t('results.stopovers')}</h3>
          <div className={styles.stopsList}>
            {stops.map((stop, index) => (
              <div key={index} className={styles.stopItem}>
                <span className={styles.stopNumber}>{index + 1}</span>
                <span className={styles.stopName}>{stop.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
