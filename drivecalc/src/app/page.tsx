"use client";

import { useState } from 'react';
import { fetchRouteFromMapbox } from '@/lib/mapbox';
import RouteSelector from '@/components/RouteSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CostResults from '@/components/CostResults';
import Map from '@/components/Map';
import AdBanner from '@/components/AdBanner';
import styles from './page.module.css';
import { calculateTollFees } from '@/lib/tolls';
import { calculateFuelConsumption, getFuelPrice, FuelType, VehicleType } from '@/lib/fuel';
import { useAnalytics } from '@/lib/analytics';
import StopList from '@/components/StopList';
import { LocationSuggestion } from '@/types/locations';

export default function Home() {
  const [origin, setOrigin] = useState<LocationSuggestion | null>(null);
  const [destination, setDestination] = useState<LocationSuggestion | null>(null);
  const [stops, setStops] = useState<LocationSuggestion[]>([]);
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [fuelType, setFuelType] = useState<FuelType>('bensin');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  
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
    isRoundTrip: boolean;
    passengerCount: number;
    tollData?: {
      stations: any[];
      totalFee?: number;
    };
  } | null>(null);
  
  const [isCalculating, setIsCalculating] = useState(false);
  
  const { trackEvent } = useAnalytics();
  
  const calculateCosts = async () => {
    if (!origin || !destination) {
      alert('Vennligst velg start- og sluttdestinasjon');
      return;
    }
    
    setIsCalculating(true);
    
    try {
      // Track event when calculation starts
      trackEvent('calculate_route', {
        origin,
        destination,
        stop_count: stops.length,
        vehicle_type: vehicle,
        fuel_type: fuelType,
        round_trip: isRoundTrip
      });
      
      // Pass stops to the route calculation function
      const routeDetails = await fetchRouteFromMapbox(origin, destination, stops);
      setRouteData(routeDetails);
      
      // Update toll calculation to include stops
      const tolls = await calculateTollFees(
        routeDetails.waypoints,
        vehicle,
        fuelType,
        isRoundTrip
      );
      
      // 3. Get fuel prices
      const fuelPrice = await getFuelPrice(fuelType);
      
      // 4. Calculate fuel consumption based on distance and vehicle type
      let distance = routeDetails.distance;
      let duration = routeDetails.duration;
      
      // If round trip, double the distance and duration
      if (isRoundTrip) {
        distance *= 2;
        duration *= 2;
      }
      
      const fuelConsumption = calculateFuelConsumption(
        distance, 
        vehicle, 
        fuelType
      );
      
      // 5. Calculate total costs
      const fuelCost = fuelConsumption * fuelPrice;
      const tollCost = tolls.totalFee || 0;
      
      setResults({
        distance: distance,
        duration: duration,
        fuelCost,
        tollCost,
        totalCost: fuelCost + tollCost,
        fuelConsumption,
        fuelPrice,
        isRoundTrip,
        passengerCount,
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
      
      // Track successful calculation
      trackEvent('calculation_complete', {
        distance: distance,
        duration: duration,
        total_cost: fuelCost + tollCost
      });
      
    } catch (error) {
      console.error('Feil ved beregning av kostnader:', error);
      alert('Det oppstod en feil ved beregning av kostnader. Vennligst prøv igjen.');
      
      // Track error
      trackEvent('calculation_error', {
        error: (error as Error).message
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>DriveCalc - Beregn kjørekostnader i Norge</h1>
        
        <div className={styles.grid}>
          <div className={styles.formContainer}>
            <RouteSelector 
              origin={origin} 
              destination={destination}
              setOrigin={setOrigin}
              setDestination={setDestination}
            />
            
            {/* Add the StopList component here */}
            <StopList 
              stops={stops} 
              setStops={setStops} 
            />
            
            <VehicleSelector
              vehicle={vehicle}
              fuelType={fuelType}
              setVehicle={handleVehicleChange}
              setFuelType={handleFuelTypeChange}
              isRoundTrip={isRoundTrip}
              setIsRoundTrip={setIsRoundTrip}
              passengerCount={passengerCount}
              setPassengerCount={setPassengerCount}
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
            {/* Show map at all times */}
            <Map 
              routeGeometry={routeData?.geometry}
              origin={origin ? {
                longitude: origin.lon,
                latitude: origin.lat
              } : undefined}
              destination={destination ? {
                longitude: destination.lon,
                latitude: destination.lat
              } : undefined}
              stops={stops}
              tollStations={results?.tollData?.stations}
            />
          </div>
        </div>
        
        {!results && (
          <AdBanner
            adClient="ca-pub-7726641596892047"
            adSlot="1234567890"
            adFormat="auto"
            className={styles.topAd}
          />
        )}
        
        {results && routeData && <CostResults 
          {...results} 
          routeData={{
            distance: results.distance,
            duration: results.duration,
          }}
          fuelType={fuelType} 
          isRoundTrip={isRoundTrip}
          passengerCount={passengerCount}
          tollData={{ 
            totalFee: results.tollData?.totalFee || 0, 
            stations: results.tollData?.stations || [] 
          }}
          stops={stops}
        />}
        
        {results && (
          <AdBanner
            adClient="ca-pub-7726641596892047"
            adSlot="0987654321"
            adFormat="rectangle"
            className={styles.resultsAd}
          />
        )}
        
        {/* SEO-friendly content */}
        <section className={styles.infoSection}>
          <h2>Om DriveCalc</h2>
          <p>
            DriveCalc er en tjeneste som hjelper deg beregne de reelle kostnadene for 
            bilturer i Norge. Vi inkluderer drivstoff-forbruk basert på kjøretøytype og 
            nøyaktige bompengesatser for å gi deg det komplette bildet av hva reisen din koster.
          </p>
          <p>
            Perfekt for både privatpersoner som vil dele kostnader mellom venner, 
            og for bedrifter som trenger nøyaktig dokumentasjon av reiseutgifter.
          </p>
        </section>
      </div>
    </main>
  );
}
