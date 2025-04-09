# Bilspleis - Norwegian Driving Cost Calculator

Bilspleis is a web application that helps you calculate driving costs in Norway. It provides accurate estimates for fuel consumption, toll expenses, and total travel costs between locations.

## Features

- Calculate route distance and duration between any two locations in Norway
- Display interactive maps with route visualization
- Calculate fuel costs based on vehicle type and fuel consumption
- Include toll costs in total travel expenses
- Support for different vehicle types and fuel options

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Mapbox GL](https://www.mapbox.com/) - Interactive maps
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [TailwindCSS 4](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- A Mapbox API key
- A Bompengekalkulator API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bilspleis.git
cd bilspleis
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Mapbox API key:
```
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter your origin and destination locations
2. Select your vehicle type and fuel type
3. View the calculated route on the map
4. See the detailed breakdown of costs including:
   - Fuel consumption and cost
   - Toll expenses
   - Total travel cost
   - Journey distance and time

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
bilspleis/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   │   ├── CostResults.tsx     # Cost calculation display
│   │   ├── Map.tsx             # Mapbox implementation
│   │   ├── RouteSelector.tsx   # Origin/destination selector
│   │   └── VehicleSelector.tsx # Vehicle/fuel type selector
│   └── lib/          # Utility functions
│       ├── fuel.ts    # Fuel calculation utilities
│       ├── mapbox.ts  # Mapbox integration
│       └── tolls.ts   # Toll calculation utilities
├── public/           # Static assets
└── ...configuration files
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.