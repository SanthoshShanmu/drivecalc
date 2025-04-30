"use client";

// Import the useLanguage hook at the top
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Rest of the imports remain the same
const AdBanner = dynamic(() => import('@/components/AdBanner'), { 
  ssr: false,
  loading: () => <div className="ad-placeholder"></div>
});

// Keep the other imports
import { fetchRouteFromMapbox } from '@/lib/mapbox';
import RouteSelector from '@/components/RouteSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CostResults from '@/components/CostResults';
import Map from '@/components/Map';
import styles from './page.module.css';
import { calculateTollFees } from '@/lib/tolls';
import { calculateFuelConsumption, getFuelPrice, FuelType, VehicleType } from '@/lib/fuel';
import { useAnalytics } from '@/lib/analytics';
import StopList from '@/components/StopList';
import { LocationSuggestion } from '@/types/locations';

export default function Home() {
  // Get translation function
  const { t } = useLanguage();

  // Add state to track client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add this state and effect
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Set a timer to ensure content is rendered before ads
    const timer = setTimeout(() => {
      setContentReady(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Rest of your state variables remain the same
  const [origin, setOrigin] = useState<LocationSuggestion | null>(null);
  const [destination, setDestination] = useState<LocationSuggestion | null>(null);
  // Rest of your code unchanged
  const [stops, setStops] = useState<LocationSuggestion[]>([]);
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [fuelType, setFuelType] = useState<FuelType>('bensin');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [formChanged, setFormChanged] = useState(false);
  
  // Keep all the handlers unchanged
  function handleRoundTripChange(value: boolean) {
    setIsRoundTrip(value);
    setFormChanged(true);
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

  function handleSetOrigin(location: LocationSuggestion) {
    setOrigin(location);
    setFormChanged(true);
  }

  function handleSetDestination(location: LocationSuggestion) {
    setDestination(location);
    setFormChanged(true);
  }

  function handleSetStops(stopsOrUpdater: LocationSuggestion[] | ((prev: LocationSuggestion[]) => LocationSuggestion[])) {
    setStops(stopsOrUpdater);
    setFormChanged(true);
  }
  
  // Keep the other state variables
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
        <h1 className={styles.title}>{t('main.title')}</h1>
        
        <div className={styles.grid}>
          <div className={styles.formContainer}>
            <RouteSelector 
              origin={origin} 
              destination={destination}
              setOrigin={handleSetOrigin}
              setDestination={handleSetDestination}
            />
            
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
              setIsRoundTrip={handleRoundTripChange}
              passengerCount={passengerCount}
              setPassengerCount={handlePassengerCountChange}
            />
            
            <button 
              onClick={calculateCosts}
              disabled={isCalculating || !origin || !destination || !formChanged}
              className={styles.calculateButton}
            >
              {isCalculating ? t('main.calculating') : t('main.calculate')}
            </button>
          </div>
          
          <div className={styles.mapContainer}>
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
        
        <section className={styles.contentSection}>
          <h2>{t('main.howItWorks.title')}</h2>
          <p className={styles.contentText}>{t('main.howItWorks.description')}</p>
          
          <h3>{t('main.routeExample.title')}</h3>
          <p className={styles.contentText}>{t('main.routeExample.description')}</p>
        </section>
        
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
        
        {isClient && results && (
          <AdBanner
            adClient="ca-pub-7726641596892047"
            adSlot="0987654321"
            adFormat="rectangle"
            className={styles.resultsAd}
          />
        )}
        
        {contentReady && (
          <AdBanner 
            adClient="ca-pub-7726641596892047"
            adSlot="1234567890" // ← Replace this with your ACTUAL ad slot ID from AdSense
            adFormat="rectangle"
            className={styles.mainAd}
          />
        )}
        
        {/* SEO-friendly content - updated with translations */}
        <section className={styles.infoSection}>
          <h2>{t('main.seo.heading1')}</h2>
          <p>
            {t('main.seo.paragraph1')}
          </p>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3>{t('main.feature1.title')}</h3>
              <p>{t('main.feature1.text')}</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>{t('main.feature2.title')}</h3>
              <p>{t('main.feature2.text')}</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>{t('main.feature3.title')}</h3>
              <p>{t('main.feature3.text')}</p>
            </div>
            
            <div className={styles.featureCard}>
              <h3>{t('main.feature4.title')}</h3>
              <p>{t('main.feature4.text')}</p>
            </div>
          </div>
          
          <h2>{t('main.whyUs.title')}</h2>
          <p>
            {t('main.whyUs.text')}
          </p>
          
          <h2>{t('main.fuelCosts.title')}</h2>
          <p>
            {t('main.fuelCosts.text')}
          </p>
          
          <h2>{t('main.routes.title')}</h2>
          <div className={styles.popularRoutes}>
            <ul>
              <li><strong>Oslo - Bergen:</strong> {t('main.routes.oslo-bergen')}</li>
              <li><strong>Oslo - Trondheim:</strong> {t('main.routes.oslo-trondheim')}</li>
              <li><strong>Stavanger - Kristiansand:</strong> {t('main.routes.stavanger-kristiansand')}</li>
              <li><strong>Tromsø - Bodø:</strong> {t('main.routes.tromso-bodo')}</li>
              <li><strong>Oslo - Lillehammer:</strong> {t('main.routes.oslo-lillehammer')}</li>
            </ul>
          </div>
          
          <h2>{t('main.about.title')}</h2>
          <p>
            {t('main.about.paragraph1')}
          </p>
          <p>
            {t('main.about.paragraph2')}
          </p>
        </section>
      </div>
    </main>
  );
}
