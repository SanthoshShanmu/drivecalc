"use client";

import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const AdBanner = dynamic(() => import('@/components/AdBanner'), {
  ssr: false,
  loading: () => <div className="ad-placeholder"></div>
});

// Load map without SSR (Leaflet requires the browser window)
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="map-placeholder" style={{ height: '400px', background: 'var(--secondary-background)', borderRadius: '8px' }} />
});

import RouteSelector from '@/components/RouteSelector';
import VehicleSelector from '@/components/VehicleSelector';
import CostResults from '@/components/CostResults';
import styles from './page.module.css';
import { calculateTollFees } from '@/lib/tolls';
import { calculateFuelConsumption, getFuelPrice, FuelType, VehicleType } from '@/lib/fuel';
import { useAnalytics } from '@/lib/analytics';
import StopList from '@/components/StopList';
import { LocationSuggestion } from '@/types/locations';
import { fetchRoute } from '@/lib/geocoding';

export default function Home() {
  const { t } = useLanguage();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const [origin, setOrigin] = useState<LocationSuggestion | null>(null);
  const [destination, setDestination] = useState<LocationSuggestion | null>(null);
  const [stops, setStops] = useState<LocationSuggestion[]>([]);
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [fuelType, setFuelType] = useState<FuelType>('bensin');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [formChanged, setFormChanged] = useState(false);

  function handleRoundTripChange(value: boolean) { setIsRoundTrip(value); setFormChanged(true); }
  function handleVehicleChange(v: string) { setVehicle(v as VehicleType); setFormChanged(true); }
  function handleFuelTypeChange(ft: string) { setFuelType(ft as FuelType); setFormChanged(true); }
  function handlePassengerCountChange(count: number) { setPassengerCount(count); setFormChanged(true); }
  function handleSetOrigin(loc: LocationSuggestion) { setOrigin(loc); setFormChanged(true); }
  function handleSetDestination(loc: LocationSuggestion) { setDestination(loc); setFormChanged(true); }
  function handleSetStops(su: LocationSuggestion[] | ((p: LocationSuggestion[]) => LocationSuggestion[])) {
    setStops(su); setFormChanged(true);
  }

  const [routeData, setRouteData] = useState<{
    distance: number;
    duration: number;
    geometry: any;
    waypoints: { location: [number, number]; name: string }[];
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
    tollData?: { stations: any[]; totalFee?: number };
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
      trackEvent('calculate_route', {
        origin,
        destination,
        stop_count: stops.length,
        vehicle_type: vehicle,
        fuel_type: fuelType,
        round_trip: isRoundTrip
      });

      // Fetch route using free OSRM API
      const routeDetails = await fetchRoute(origin, destination, stops);
      setRouteData(routeDetails);

      // Calculate toll fees using waypoints
      const tolls = await calculateTollFees(
        routeDetails.waypoints,
        vehicle,
        fuelType,
        isRoundTrip
      );

      const fuelPrice = await getFuelPrice(fuelType);

      let distance = routeDetails.distance;
      let duration = routeDetails.duration;

      if (isRoundTrip) {
        distance *= 2;
        duration *= 2;
      }

      const fuelConsumption = calculateFuelConsumption(distance, vehicle, fuelType);
      const fuelCost = fuelConsumption * fuelPrice;
      const tollCost = tolls.totalFee || 0;

      setResults({
        distance,
        duration,
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

      trackEvent('calculation_complete', {
        distance,
        duration,
        total_cost: fuelCost + tollCost
      });

    } catch (error) {
      console.error('Feil ved beregning av kostnader:', error);
      alert('Det oppstod en feil ved beregning av kostnader. Vennligst prøv igjen.');
      trackEvent('calculation_error', { error: (error as Error).message });
    } finally {
      setIsCalculating(false);
      setFormChanged(false);
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

            <StopList stops={stops} setStops={handleSetStops} />

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
              origin={origin ? { longitude: origin.lon, latitude: origin.lat } : undefined}
              destination={destination ? { longitude: destination.lon, latitude: destination.lat } : undefined}
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

        {results && routeData && (
          <CostResults
            {...results}
            routeData={{ distance: results.distance, duration: results.duration }}
            fuelType={fuelType}
            passengerCount={passengerCount}
            tollData={{
              totalFee: results.tollData?.totalFee || 0,
              stations: results.tollData?.stations || []
            }}
            stops={stops}
          />
        )}

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
          <p>{t('main.seo.paragraph1')}</p>

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
          <p>{t('main.whyUs.text')}</p>

          <h2>{t('main.fuelCosts.title')}</h2>
          <p>{t('main.fuelCosts.text')}</p>

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
          <p>{t('main.about.paragraph1')}</p>
          <p>{t('main.about.paragraph2')}</p>
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
