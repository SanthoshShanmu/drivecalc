import { NextResponse } from 'next/server';
import axios from 'axios';

// Correct API endpoint from documentation
const BOMPENGE_API_URL = 'https://dibkunnskapapi.azure-api.net/vCustomer/api/bomstasjoner/GetFeesByWaypoints';
const API_KEY = process.env.NEXT_PUBLIC_BOMPENGE_API_KEY;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { waypoints, vehicleType, isRoundTrip } = data;
    
    if (!waypoints || waypoints.length < 2) {
      return NextResponse.json({ error: 'Need at least origin and destination waypoints' }, { status: 400 });
    }
    
    // Format date and time for API
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    
    // Map vehicle type to API parameters
    let bilsize = 1; // Default to small vehicle
    let litenbiltype = 1; // Default to gasoline
    let storbiltype = 0; // Not a large vehicle
    
    if (vehicleType === 'ElectricVehicle') {
      litenbiltype = 5;
    } else if (vehicleType === 'DieselCar') {
      litenbiltype = 2;
    } else if (vehicleType === 'HybridVehicle') {
      litenbiltype = 3;
    } else if (vehicleType === 'HeavyVehicle') {
      bilsize = 2;
      storbiltype = 1;
      litenbiltype = 0;
    }
    
    // Format waypoints according to API
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const viaPoints = waypoints.slice(1, waypoints.length - 1);
    
    // Build request payload in correct format
    interface Waypoint {
      Latitude: string;
      Longitude: string;
    }

    interface TollRequestPayload {
      Fra: Waypoint;
      Til: Waypoint;
      Vialiste: Waypoint[];
      Dato_yyyymmdd: string;
      Tidspunkt_hhmm: string;
      Bilsize: number;
      Litenbiltype: number;
      Storbiltype: number;
      Billengdeunder: string;
      Retur: string;
      Tidsreferanser: string;
    }

    // Define interface for waypoint in the context of API request
    interface WaypointCoordinates {
      lat: number;
      lon: number;
    }

    const payload: TollRequestPayload = {
      Fra: {
      Latitude: origin.lat.toString(),
      Longitude: origin.lon.toString()
      },
      Til: {
      Latitude: destination.lat.toString(),
      Longitude: destination.lon.toString()
      },
      Vialiste: viaPoints.map((point: WaypointCoordinates) => ({
      Latitude: point.lat.toString(),
      Longitude: point.lon.toString()
      })),
      Dato_yyyymmdd: date,
      Tidspunkt_hhmm: time,
      Bilsize: bilsize,
      Litenbiltype: litenbiltype,
      Storbiltype: storbiltype,
      Billengdeunder: "5.9",
      Retur: isRoundTrip ? "1" : "0", // Set to 1 for round trip
      Tidsreferanser: "1"
    };
    
    console.log('Sending request to Bompenge API with payload:', JSON.stringify(payload));
    
    const response = await axios.post(
      BOMPENGE_API_URL,
      payload,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return NextResponse.json(response.data);
    
  } catch (error) {
    console.error('Error calculating toll fees:', error);
    
    // Extract isRoundTrip flag from request to use in mock data
    let isRoundTrip = false;
    try {
      const { isRoundTrip: roundTrip } = await request.json();
      isRoundTrip = roundTrip;
    } catch {
      // If we can't extract it, default to false
    }
    
    // For development, return mock data
    return NextResponse.json({
      Tur: [
        {
          Name: "Oslo - Gardermoen",
          DistanseNice: isRoundTrip ? "92 km" : "46 km",
          TidNice: isRoundTrip ? "86 min" : "43 min",
          KostnadNice: isRoundTrip ? "126,00 kr." : "63,00 kr.",
          RabattertNice: isRoundTrip ? "113,40 kr." : "56,70 kr.",
          Kostnad: isRoundTrip ? 126.0 : 63.0,
          Rabattert: isRoundTrip ? 113.4 : 56.7,
          AvgiftsPunkter: [
            {
              Navn: "Oslo Bomring",
              Latitude: "59.91",
              Longitude: "10.75",
              Avgifter: [
                {
                  Pris: isRoundTrip ? 90.0 : 45.0,
                  PrisRabbattert: isRoundTrip ? 81.0 : 40.5
                }
              ]
            },
            {
              Navn: "E6 Gardermoen",
              Latitude: "60.19",
              Longitude: "11.10",
              Avgifter: [
                {
                  Pris: isRoundTrip ? 36.0 : 18.0,
                  PrisRabbattert: isRoundTrip ? 32.4 : 16.2
                }
              ]
            }
          ]
        }
      ]
    });
  }
}
