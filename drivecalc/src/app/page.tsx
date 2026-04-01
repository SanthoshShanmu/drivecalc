"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AdBanner = dynamic(() => import('@/components/AdBanner'), { 
  ssr: false,
  loading: () => <div className="ad-placeholder"></div>
});

import RouteSelector from '@/components/RouteSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CostResults from '@/components/CostResults';
import styles from './page.module.css';
import { calculateFuelConsumption, getFuelPrice, FuelType, VehicleType } from '@/lib/fuel';
import { useAnalytics } from '@/lib/analytics';
import StopList from '@/components/StopList';
import { LocationSuggestion } from '@/types/locations';

export default function Home() {
  const { t } = useLanguage();

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
  const [distanceKm, setDistanceKm] = useState<number | ''>('');
  const [formChanged, setFormChanged] = useState(false);
  
  function handleRoundTripChange(value: boolean) {
    setIsRoundTrip(value);
    setFormChanged(true);
  }

  function handleVehicleChange(v: string) {
    setVehicle(v as VehicleType);
    setFormChanged(true);
  }

  function handleFuelTypeChange(ft: string) {
    setFuelType(ft as FuelType);
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

  function handleDistanceChange(value: string) {
    const parsed = parseFloat(value);
    setDistanceKm(isNaN(parsed) || parsed < 0 ? '' : parsed);
    setFormChanged(true);
  }
  
  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  
  const [results, setResults] = useState<{
    distance: number;
    duration: number;
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

    if (distanceKm === '' || distanceKm <= 0) {
      alert('Vennligst skriv inn distansen i kilometer');
      return;
    }
    
    setIsCalculating(true);
    
    try {
      trackEvent('calculate_route', {
        origin,
        destination,
        stop_count: stops.length,
        vehicle_type: vehicle,
        fuel_type: fuelType,
        round_trip: isRoundTrip
      });
      
      // Convert km to meters; estimate duration at average 80 km/h
      const distanceMeters = distanceKm * 1000;
      const durationSeconds = (distanceKm / 80) * 3600;

      setRouteData({ distance: distanceMeters, duration: durationSeconds });
      
      const fuelPrice = await getFuelPrice(fuelType);
      
      let distance = distanceMeters;
      let duration = durationSeconds;
      
      if (isRoundTrip) {
        distance *= 2;
        duration *= 2;
      }
      
      const fuelConsumption = calculateFuelConsumption(distance, vehicle, fuelType);
      const fuelCost = fuelConsumption * fuelPrice;

      setResults({
        distance,
        duration,
        fuelCost,
        tollCost: 0,
        totalCost: fuelCost,
        fuelConsumption,
        fuelPrice,
        isRoundTrip,
        passengerCount,
        tollData: {
          totalFee: 0,
          stations: []
        }
      });
      
      trackEvent('calculation_complete', {
        distance,
        duration,
        total_cost: fuelCost
      });
      
    } catch (error) {
      console.error('Feil ved beregning av kostnader:', error);
      alert('Det oppstod en feil ved beregning av kostnader. Vennligst prøv igjen.');
      
      trackEvent('calculation_error', {
        error: (error as Error).message
      });
    } finally {
      setIsCalculating(false);
      setFormChanged(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('main.title')}</h1>
        
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

          <div className={styles.distanceInputGroup}>
            <label htmlFor="distance">{t('route.distance')}</label>
            <input
              id="distance"
              type="number"
              min="0"
              step="1"
              className={styles.distanceInput}
              value={distanceKm}
              onChange={(e) => handleDistanceChange(e.target.value)}
              placeholder={t('route.distancePlaceholder')}
            />
          </div>
          
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
            disabled={isCalculating || !origin || !destination || distanceKm === '' || distanceKm <= 0 || !formChanged}
            className={styles.calculateButton}
          >
            {isCalculating ? t('main.calculating') : t('main.calculate')}
          </button>
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

        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>{t('main.about.title')}</h2>
          <div className={styles.infoContent}>
            <p>{t('main.about.paragraph1')}</p>
            <p>{t('main.about.paragraph2')}</p>
            <p>{t('main.about.paragraph3')}</p>
          </div>
        </div>

        {isClient && (
          <AdBanner 
            adClient="ca-pub-7726641596892047"
            adFormat="rectangle"
            className={styles.resultsAd}
          />
        )}
        
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

        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>{t('main.about.title')}</h2>
          
          <div className={styles.infoContent}>
            <p>{t('main.about.paragraph1')}</p>
            <p>{t('main.about.paragraph2')}</p>
            <p>{t('main.about.paragraph3')}</p>
            
            <div className={styles.infoColumns}>
              <div className={styles.infoColumn}>
                <h3>{t('main.tolls.title')}</h3>
                <p>{t('main.tolls.text')}</p>
                
                <h4>{t('main.popularTollRoutes.title')}</h4>
                <ul className={styles.infoList}>
                  <li>{t('main.popularTollRoutes.osloTrondheim')}</li>
                  <li>{t('main.popularTollRoutes.osloBergen')}</li>
                  <li>{t('main.popularTollRoutes.kristiansandStavanger')}</li>
                </ul>
              </div>
              
              <div className={styles.infoColumn}>
                <h3>{t('main.fuelCosts.title')}</h3>
                <p>{t('main.fuelCosts.text')}</p>
                
                <div className={styles.fuelPriceTable}>
                  <div className={styles.fuelPriceHeader}>
                    <span>{t('main.fuelTable.type')}</span>
                    <span>{t('main.fuelTable.averagePrice')}</span>
                  </div>
                  <div className={styles.fuelPriceRow}>
                    <span>{t('main.fuelTable.petrol')}</span>
                    <span>22,50 kr/l</span>
                  </div>
                  <div className={styles.fuelPriceRow}>
                    <span>{t('main.fuelTable.diesel')}</span>
                    <span>21,30 kr/l</span>
                  </div>
                  <div className={styles.fuelPriceRow}>
                    <span>{t('main.fuelTable.electricity')}</span>
                    <span>1,80 kr/kWh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.roadGuidesSection}>
          <h2 className={styles.roadGuidesTitle}>{t('main.roadGuides.title')}</h2>
          
          <div className={styles.roadGuideCards}>
            <div className={styles.roadGuideCard}>
              <h3>{t('main.roadGuides.scenic.title')}</h3>
              <p>{t('main.roadGuides.scenic.description')}</p>
              <ul>
                <li>Atlanterhavsvegen (Atlantic Ocean Road)</li>
                <li>Trollstigen (The Troll&#39;s Path)</li>
                <li>Geiranger - Trollstigen National Tourist Route</li>
                <li>Hardangervidda National Tourist Route</li>
              </ul>
            </div>
            
            <div className={styles.roadGuideCard}>
              <h3>{t('main.roadGuides.winter.title')}</h3>
              <p>{t('main.roadGuides.winter.description')}</p>
              <ul>
                <li>{t('main.roadGuides.winter.tires')}</li>
                <li>{t('main.roadGuides.winter.chains')}</li>
                <li>{t('main.roadGuides.winter.closures')}</li>
                <li>{t('main.roadGuides.winter.emergency')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
