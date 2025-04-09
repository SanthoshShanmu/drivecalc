import axios from 'axios';

/**
 * Get current fuel prices from our API
 */
export async function scrapeFuelPrices() {
  try {
    // Call our API endpoint instead of scraping directly
    const response = await axios.get('/api/fuel-prices');
    return response.data;
  } catch (error) {
    console.error('Error fetching fuel prices:', error);
    
    // Return fallback prices if API call fails
    return {
      bensin: 20.80,
      diesel: 19.22,
      elbil: 4.99,
      hybrid: 12.48
    };
  }
}

/**
 * Get fuel price for specific fuel type
 */
// Interface for fuel prices
export interface FuelPrices {
  bensin: number;
  diesel: number;
  elbil: number;
  hybrid: number;
}

// Type definition for fuel types
export type FuelType = keyof FuelPrices;

/**
 * Get fuel price for specific fuel type
 */
export async function getFuelPrice(fuelType: FuelType): Promise<number> {
  const prices = await scrapeFuelPrices();
  return prices[fuelType] || 0;
}

/**
 * Calculate fuel consumption based on distance and vehicle type
 */
/**
 * Vehicle types supported by the fuel consumption calculator
 */
export type VehicleType = 'car' | 'truck';

/**
 * Consumption rates for different vehicle types and fuel types
 */
export interface ConsumptionRates {
  car: {
    [key in FuelType]: number;
  };
  truck: {
    [key in FuelType]: number;
  };
}

/**
 * Calculate fuel consumption based on distance and vehicle type
 */
export function calculateFuelConsumption(
  distance: number, 
  vehicle: VehicleType, 
  fuelType: FuelType
): number {
  // Distance in kilometers (convert from meters)
  const distanceKm = distance / 1000;
  
  // Average consumption rates per 100km
  const consumptionRates: ConsumptionRates = {
    car: {
      bensin: 7.5,  // 7.5 liters per 100km
      diesel: 6.0,  // 6.0 liters per 100km
      elbil: 18.0,  // 18 kWh per 100km
      hybrid: 5.0   // 5.0 liters per 100km
    },
    truck: {
      bensin: 0,    // Trucks typically don't use gasoline
      diesel: 30.0, // 30.0 liters per 100km
      elbil: 0,     // Electric trucks are rare
      hybrid: 0     // Hybrid trucks are rare
    }
  };
  
  const rate = consumptionRates[vehicle][fuelType] || 0;
  const consumption = (distanceKm / 100) * rate;
  
  return consumption;
}
