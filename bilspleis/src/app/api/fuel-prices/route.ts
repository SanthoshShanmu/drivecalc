import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    // Server-side request to scrape fuel prices
    const response = await axios.get('https://www.fuelfinder.dk/no/listprices.php');
    const $ = cheerio.load(response.data);
    
    // Default values in case we can't scrape
    const prices = {
      bensin: 20.80,  // Default from Shell shown in the HTML
      diesel: 19.22,  // Default from Shell shown in the HTML
      elbil: 4.99,    // Default from Circle K EL normal
      hybrid: 12.0    // Calculated value
    };
    
    // Parse the table to extract prices
    $('table.tableStyle tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      
      // Check for company name in first column (inside the span)
      const company = $(cells.eq(0)).find('span').text().trim();
      
      // Get the prices for the different fuel types (using data-title attribute to be sure)
      const bensinPrice = $(cells.filter('[data-title="Blyfri 95"]')).text().trim();
      const dieselPrice = $(cells.filter('[data-title="Diesel"]')).text().trim();
      const elPrice = $(cells.filter('[data-title="EL normal"]')).text().trim();
      
      // Parse prices, ignoring empty or zero-width space characters
      if (bensinPrice && bensinPrice !== '​' && !isNaN(parseFloat(bensinPrice))) {
        prices.bensin = parseFloat(bensinPrice);
      }
      
      if (dieselPrice && dieselPrice !== '​' && !isNaN(parseFloat(dieselPrice))) {
        prices.diesel = parseFloat(dieselPrice);
      }
      
      if (elPrice && elPrice !== '​' && !isNaN(parseFloat(elPrice))) {
        prices.elbil = parseFloat(elPrice);
      }
      
      console.log(`Found prices for ${company}: Bensin=${bensinPrice}, Diesel=${dieselPrice}, EL=${elPrice}`);
    });
    
    // Calculate hybrid price (60% of gasoline price)
    prices.hybrid = prices.bensin * 0.6;
    
    console.log('Final prices:', prices);
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error scraping fuel prices:', error);
    
    // Return fallback prices if scraping fails
    return NextResponse.json({
      bensin: 20.80,
      diesel: 19.22,
      elbil: 4.99,
      hybrid: 12.48  // 60% of bensin price
    });
  }
}
