"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import AdBanner with SSR disabled to prevent hydration issues
const AdBanner = dynamic(() => import('@/components/AdBanner'), { 
  ssr: false,
  loading: () => <div className="ad-placeholder"></div>
});

// Keep the rest of the imports as they were
import { fetchRouteFromMapbox } from '@/lib/mapbox';
import RouteSelector from '@/components/RouteSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CostResults from '@/components/CostResults';
import Map from '@/components/Map';
// Remove the original AdBanner import
import styles from './page.module.css';
import { calculateTollFees } from '@/lib/tolls';
import { calculateFuelConsumption, getFuelPrice, FuelType, VehicleType } from '@/lib/fuel';
import { useAnalytics } from '@/lib/analytics';
import StopList from '@/components/StopList';
import { LocationSuggestion } from '@/types/locations';

export default function Home() {
  // Add state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [origin, setOrigin] = useState<LocationSuggestion | null>(null);
  const [destination, setDestination] = useState<LocationSuggestion | null>(null);
  const [stops, setStops] = useState<LocationSuggestion[]>([]);
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [fuelType, setFuelType] = useState<FuelType>('bensin');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  
  // Add a formChanged state to track if any input has changed
  const [formChanged, setFormChanged] = useState(false);
  
  // Modify the handlers to track changes without auto-calculating
  function handleRoundTripChange(value: boolean) {
    setIsRoundTrip(value);
    setFormChanged(true); // Mark that the form has changed
  }

  function handleVehicleChange(vehicle: string) {
    setVehicle(vehicle as VehicleType);
    setFormChanged(true);
  }

  function handleFuelTypeChange(fuelType: string) {
    setFuelType(fuelType as FuelType);
    setFormChanged(true);
  }

  function handlePassengerCountChange(count: number) {
    setPassengerCount(count);
    setFormChanged(true);
  }

  // Also update origin/destination/stops handlers to set formChanged to true
  function handleSetOrigin(location: LocationSuggestion) {
    setOrigin(location);
    setFormChanged(true);
  }

  function handleSetDestination(location: LocationSuggestion) {
    setDestination(location);
    setFormChanged(true);
  }

  function handleSetStops(stopsOrUpdater: LocationSuggestion[] | ((prev: LocationSuggestion[]) => LocationSuggestion[])) {
    // Use setStops to handle both direct values and functional updates
    setStops(stopsOrUpdater);
    setFormChanged(true);
  }
  
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
  
  // Update the calculateCosts function to ensure round trip is calculated correctly
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
      
      // Calculate tolls with isRoundTrip flag
      const tolls = await calculateTollFees(
        routeDetails.waypoints,
        vehicle,
        fuelType,
        isRoundTrip
      );
      
      // Get fuel prices
      const fuelPrice = await getFuelPrice(fuelType);
      
      // Calculate distance and duration with round trip factor
      let distance = routeDetails.distance;
      let duration = routeDetails.duration;
      
      // Apply round trip multiplier
      if (isRoundTrip) {
        distance *= 2;
        duration *= 2;
      }
      
      // Calculate fuel consumption based on adjusted distance
      const fuelConsumption = calculateFuelConsumption(
        distance, 
        vehicle, 
        fuelType
      );
      
      // Calculate total costs
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
      setFormChanged(false); // Reset form changed flag after calculation
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
              setOrigin={handleSetOrigin}
              setDestination={handleSetDestination}
            />
            
            {/* Add the StopList component here */}
            <StopList 
              stops={stops} 
              setStops={handleSetStops} 
            />
            
            <VehicleSelector
              vehicle={vehicle}
              fuelType={fuelType}
              setVehicle={handleVehicleChange}
              setFuelType={handleFuelTypeChange}
              isRoundTrip={isRoundTrip}
              setIsRoundTrip={handleRoundTripChange}  // Use the new handler
              passengerCount={passengerCount}
              setPassengerCount={handlePassengerCountChange}
            />
            
            <button 
              onClick={calculateCosts}
              disabled={isCalculating || !origin || !destination || !formChanged}
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
        
        {/* Only render ads on client-side */}
        {isClient && !results && (
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
          passengerCount={passengerCount}
          tollData={{ 
            totalFee: results.tollData?.totalFee || 0, 
            stations: results.tollData?.stations || [] 
          }}
          stops={stops}
        />}
        
        {/* Only render ads on client-side */}
        {isClient && results && (
          <AdBanner
            adClient="ca-pub-7726641596892047"
            adSlot="0987654321"
            adFormat="rectangle"
            className={styles.resultsAd}
          />
        )}
        
        {/* SEO-friendly content */}
        <section className={styles.infoSection}>
          <h2>Beregn kjørekostnader i Norge</h2>
          <p>
            DriveCalc gir deg nøyaktige kostnadsberegninger for bilturer i Norge. 
            Vår kalkulator inkluderer <strong>oppdaterte drivstoffpriser</strong>, 
            <strong> bompengesatser</strong> og <strong>kjøretøyspesifikt drivstofforbruk</strong>.
          </p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>Nøyaktige beregninger</h3>
              <p>Få detaljerte kostnadsberegninger basert på din spesifikke rute, biltype og drivstoff.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Bompenger inkludert</h3>
              <p>Alle bomstasjoner langs ruten beregnes automatisk med korrekte priser for din biltype.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Del kostnadene</h3>
              <p>Enkelt å fordele kjørekostnadene mellom flere passasjerer for samkjøring og turer.</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Reiseruter i hele Norge</h3>
              <p>Fra Oslo til Bergen, Stavanger til Tromsø, eller hvor som helst i Norge - vi beregner alle kostnader.</p>
            </div>
          </div>
          
          <h2>Populære ruter i Norge</h2>
          <div className={styles.popularRoutes}>
            <ul>
              <li><strong>Oslo - Bergen:</strong> En av Norges mest kjørte strekninger</li>
              <li><strong>Oslo - Trondheim:</strong> Beregn kostnader for turen langs E6</li>
              <li><strong>Stavanger - Kristiansand:</strong> Kystveien med alle bomstasjoner</li>
              <li><strong>Tromsø - Bodø:</strong> Lang kjøretur i Nord-Norge</li>
              <li><strong>Oslo - Lillehammer:</strong> Populær helgetur med oppdaterte bompriser</li>
            </ul>
          </div>
          
          <h2>Om kjørekostnader i Norge</h2>
          <p>
            Norge har et omfattende nettverk av bomstasjoner og noen av Europas høyeste drivstoffpriser. 
            Å beregne de faktiske kostnadene for en bilreise kan være komplisert med bomavgifter 
            som varierer basert på kjøretøytype, tidspunkt og om du har brikke.
          </p>
          <p>
            DriveCalc er utviklet for å gi deg de mest nøyaktige beregningene for alle typer reiser 
            i Norge, enten du kjører elbil, hybrid, bensin eller diesel.
          </p>
        </section>
      </div>
    </main>
  );
}
