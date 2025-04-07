# Bilspleis - Norwegian Trip Cost Calculator

Bilspleis is a web application that helps users calculate travel costs between locations in Norway. It provides estimates for fuel expenses and toll fees based on the selected route and vehicle type.

## Features

- **Route Calculation**: Get precise routes between any two locations in Norway using Mapbox
- **Vehicle Type Support**: Calculate costs for different vehicle types (car, electric, hybrid, diesel, truck)
- **Real-time Fuel Costs**: Uses current Norwegian fuel prices scraped from online sources
- **Toll Fee Calculation**: Estimates toll fees using the DIB Kunnskap Bompenge API
- **Interactive Map**: Visual representation of your route
- **Detailed Cost Breakdown**: View a breakdown of distance, duration, fuel costs, and toll fees

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a custom font from Vercel.

## Environment Variables

This project requires the following environment variables:

- `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox API token for map rendering and route calculations
- `DIB_API_KEY`: API key for the DIB Kunnskap Bompenge API (toll calculations)

Create a `.env.local` file in the root directory and add these variables.

## Technology Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Maps & Routing**: Mapbox GL JS
- **APIs**: Mapbox Directions API, DIB Kunnskap Bompenge API
- **Data Fetching**: Axios, Cheerio (for web scraping)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.