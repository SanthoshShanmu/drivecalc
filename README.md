# DriveCalc - Norwegian Driving Cost Calculator

DriveCalc is a web application that helps you calculate driving costs in Norway. It provides accurate estimates for fuel consumption and total travel costs between locations.

## Features

- Calculate route distance and duration between any two locations in Norway
- Add multiple stops along your route for complex journeys
- Display interactive maps with route visualization, including stops and toll stations
- Calculate fuel costs based on vehicle type and fuel consumption
- Include toll costs in total travel expenses
- Support for different vehicle types (car, truck) and fuel options (petrol, diesel, electric, hybrid)
- Round-trip calculation option
- Split costs among multiple passengers
- **Multilingual support (Norwegian and English)**
- Dark mode support
- Mobile-responsive design
- Tips for saving fuel and reducing travel costs
- Comprehensive FAQ section

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Leaflet](https://leafletjs.com/) + [react-leaflet](https://react-leaflet.js.org/) - Free interactive maps using OpenStreetMap tiles
- [Nominatim](https://nominatim.org/) - Free geocoding and location search (OpenStreetMap)
- [OSRM](https://project-osrm.org/) - Free open-source routing (distance & duration)
- [Axios](https://axios-http.com/) - HTTP client for API requests
- [TailwindCSS 4](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Cheerio](https://cheerio.js.org/) - HTML parsing for fuel price data

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- No API keys required — all map, geocoding and routing services are free and open-source

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

3. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Type your origin and destination — autocomplete suggestions are powered by OpenStreetMap (free)
2. Optionally add stops along the route
3. Select your vehicle type and fuel type
4. Click **Calculate** to get the route distance and duration from the free OSRM routing engine
5. See the detailed breakdown of costs including:
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
│   ├── app/                   # Next.js app router pages
│   │   ├── api/               # API routes for fuel prices and toll fees
│   │   ├── en/                # English version pages
│   │   │   ├── page.tsx       # English main calculator page
│   │   │   ├── faq/           # English FAQ page
│   │   │   └── tips/          # English fuel saving tips page
│   │   ├── faq/               # Norwegian FAQ page
│   │   ├── tips/              # Norwegian fuel saving tips page
│   │   ├── globals.css        # Global styles with theme variables
│   │   ├── layout.tsx         # Root layout with theme detection
│   │   ├── page.tsx           # Main calculator page (Norwegian)
│   │   ├── page.module.css    # Styles for main page
│   │   ├── robots.ts          # SEO robots configuration
│   │   └── sitemap.ts         # Dynamic sitemap generation
│   ├── components/            # React components
│   │   ├── AdBanner.tsx       # Advertisement banner component
│   │   ├── CostResults.tsx    # Cost calculation display
│   │   ├── Footer.tsx         # Site footer with language-aware links
│   │   ├── Header.tsx         # Site header with navigation and language
│   │   ├── LanguageSwitcher.tsx # Language context initializer
│   │   ├── LanguageToggle.tsx # Language toggle UI component
│   │   ├── LanguageToggleClient.tsx # Client-side language toggle
│   │   ├── RouteSelector.tsx  # Origin/destination selector
│   │   ├── StopList.tsx       # Intermediate stops manager
│   │   ├── ThemeToggle.tsx    # Dark/light mode toggle
│   │   └── VehicleSelector.tsx # Vehicle/fuel/passengers selector
│   ├── context/               # React context providers
│   │   └── LanguageContext.tsx # Language state and translations
│   ├── lib/                   # Utility functions
│   │   ├── analytics.ts       # Google Analytics integration
│   │   ├── fuel.ts            # Fuel calculation utilities
│   │   ├── geocoding.ts       # Free geocoding (Nominatim) + routing (OSRM)
│   │   └── tolls.ts           # Toll calculation utilities
│   └── types/                 # TypeScript type definitions
│       └── locations.ts       # Types for locations and routes
├── public/                    # Static assets
└── ...configuration files
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.