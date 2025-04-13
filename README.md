# DriveCalc - Norwegian Driving Cost Calculator

DriveCalc is a web application that helps you calculate driving costs in Norway. It provides accurate estimates for fuel consumption, toll expenses, and total travel costs between locations.

## Features

- Calculate route distance and duration between any two locations in Norway
- Add multiple stops along your route for complex journeys
- Display interactive maps with route visualization, including stops and toll stations
- Calculate fuel costs based on vehicle type and fuel consumption
- Include toll costs in total travel expenses
- Support for different vehicle types (car, truck) and fuel options (petrol, diesel, electric, hybrid)
- Round-trip calculation option
- Split costs among multiple passengers
- Dark mode support
- Mobile-responsive design
- Tips for saving fuel and reducing travel costs
- Comprehensive FAQ section

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Mapbox GL](https://www.mapbox.com/) - Interactive maps
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [TailwindCSS 4](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Cheerio](https://cheerio.js.org/) - HTML parsing for fuel price data

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- A Mapbox API key
- A Bompengekalkulator API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SanthoshShanmu/drivecalc.git
cd drivecalc
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Mapbox API key and BompengeAPI key:
```
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key
NEXT_PUBLIC_BOMPENGE_API_KEY=your_bompenge_api_key
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
drivecalc/
├── src/
│   ├── app/          # Next.js app router pages
│   │   ├── api/      # API routes for fuel prices and toll fees
│   │   ├── faq/      # FAQ page
│   │   ├── tips/     # Fuel saving tips page
│   │   ├── globals.css  # Global styles with theme variables
│   │   ├── page.tsx  # Main calculator page
│   │   └── layout.tsx # Root layout with theme detection
│   ├── components/   # React components
│   │   ├── AdBanner.tsx       # Advertisement banner component
│   │   ├── CostResults.tsx    # Cost calculation display
│   │   ├── Map.tsx            # Mapbox implementation with route display
│   │   ├── RouteSelector.tsx  # Origin/destination selector
│   │   ├── StopList.tsx       # Intermediate stops manager
│   │   ├── ThemeToggle.tsx    # Dark/light mode toggle
│   │   └── VehicleSelector.tsx # Vehicle/fuel/passengers selector
│   ├── lib/          # Utility functions
│   │   ├── analytics.ts # Google Analytics integration
│   │   ├── fuel.ts      # Fuel calculation utilities
│   │   ├── mapbox.ts    # Mapbox integration
│   │   └── tolls.ts     # Toll calculation utilities
│   └── types/        # TypeScript type definitions
│       └── locations.ts # Types for locations and routes
├── public/           # Static assets
└── ...configuration files
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.