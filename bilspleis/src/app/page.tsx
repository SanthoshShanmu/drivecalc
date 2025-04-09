"use client";

import { useState } from 'react';
import { fetchRouteFromMapbox } from '@/lib/mapbox';
import RouteSelector from '@/components/RouteSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CostResults from '@/components/CostResults';
import Map from '@/components/Map';
import styles from './page.module.css';
import { calculateTollFees } from '@/lib/tolls';
import { calculateFuelConsumption, getFuelPrice, FuelType, VehicleType } from '@/lib/fuel';

export default function Home() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [fuelType, setFuelType] = useState<FuelType>('bensin');
  
  // Create wrapper functions to satisfy type requirements
  const handleVehicleChange = (vehicle: string) => setVehicle(vehicle as VehicleType);
  const handleFuelTypeChange = (fuelType: string) => setFuelType(fuelType as FuelType);
  const [routeData, setRouteData] = useState<{
    distance: any;
    duration: any;
    geometry: any;
    waypoints: { location: any; name: string; }[];
  } | null>(null);
  const [results, setResults] = useState<{
    distance: any;
    duration: any;
    fuelCost: number;
    tollCost: number;
    totalCost: number;
    fuelConsumption: number;
    fuelPrice: number;
    tollData?: {
      stations: any[];
      totalFee?: number;
    };
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const calculateCosts = async () => {
    if (!origin || !destination) {
      alert('Vennligst velg start- og sluttdestinasjon');
      return;
    }
    
    setIsCalculating(true);
    
    try {
      // Use the imported function here
      const routeDetails = await fetchRouteFromMapbox(origin, destination);
      setRouteData(routeDetails);
      
      // 2. Calculate toll fees using Bompenge API
      const tolls = await calculateTollFees(routeDetails.waypoints);
      
      // 3. Get fuel prices
      const fuelPrice = await getFuelPrice(fuelType);
      
      // 4. Calculate fuel consumption based on distance and vehicle type
      const fuelConsumption = calculateFuelConsumption(
        routeDetails.distance, 
        vehicle, 
        fuelType
      );
      
      // 5. Calculate total costs
      const fuelCost = fuelConsumption * fuelPrice;
      const tollCost = tolls.totalFee || 0;
      
      setResults({
        distance: routeDetails.distance,
        duration: routeDetails.duration,
        fuelCost,
        tollCost,
        totalCost: fuelCost + tollCost,
        fuelConsumption,
        fuelPrice,
        tollData: {
          totalFee: tolls.totalFee || 0,
          stations: (tolls.stations || []).map(station => ({
            name: station.name || '',
            fee: station.fee || 0,
            location: {
              lat: station.location?.lat || 0,
              lon: station.location?.lon || 0
            }
          }))
        }
      });
    } catch (error) {
      console.error('Feil ved beregning av kostnader:', error);
      alert('Det oppstod en feil ved beregning av kostnader. Vennligst prøv igjen.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Bilspleis - Beregn kjørekostnader i Norge</h1>
        
        <div className={styles.grid}>
          <div className={styles.formContainer}>
            <RouteSelector 
              origin={origin} 
              destination={destination}
              setOrigin={setOrigin}
              setDestination={setDestination}
            />
            <VehicleSelector
              vehicle={vehicle}
              fuelType={fuelType}
              setVehicle={handleVehicleChange}
              setFuelType={handleFuelTypeChange}
            />
            
            <button 
              onClick={calculateCosts}
              disabled={isCalculating || !origin || !destination}
              className={styles.calculateButton}
            >
              {isCalculating ? 'Beregner...' : 'Beregn kostnader'}
            </button>
          </div>
          
          <div className={styles.mapContainer}>
            <Map 
              routeGeometry={routeData?.geometry}
              origin={origin ? { longitude: routeData?.geometry.coordinates[0][0], latitude: routeData?.geometry.coordinates[0][1] } : undefined}
              destination={destination ? { longitude: routeData?.geometry.coordinates[routeData?.geometry.coordinates.length - 1][0], latitude: routeData?.geometry.coordinates[routeData?.geometry.coordinates.length - 1][1] } : undefined}
              tollStations={results?.tollData?.stations}
            />
          </div>
        </div>
        
        {results && routeData && <CostResults 
          {...results} 
          routeData={routeData} 
          fuelType={fuelType} 
          tollData={{ 
            totalFee: results.tollData?.totalFee || 0, 
            stations: results.tollData?.stations || [] 
          }}
        />}
      </div>
    </main>
  );
}
