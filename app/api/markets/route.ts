import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the structure of a farmers market based on the CSV columns
export interface FarmersMarket {
  id: string;
  state_name: string;
  state_abbreviation: string;
  county_name: string;
  market_name: string;
  market_description: string;
  market_address: string;
  market_city: string;
  market_zipcode: string;
  market_latitude: string;
  market_longitude: string;
  market_open_days: string;
  market_open_time: string;
  market_close_time: string;
  market_website: string;
  market_phone: string;
  market_email: string;
  image_link: string;
}

// Function to read and parse the CSV file
function getFarmersMarkets(): FarmersMarket[] {
  try {
    // Read the CSV file from the app directory
    const csvPath = path.join(process.cwd(), 'app', 'merged_farmers_markets_with_links.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Split the content into lines
    const lines = csvContent.trim().split('\n');
    
    // Get the header row (first line) and split it into column names
    const headers = lines[0].split(',');
    
    // Process each data row (skip the header row)
    const markets: FarmersMarket[] = lines.slice(1).map((line, index) => {
      // Split the line by commas, but handle quoted values properly
      const values = parseCSVLine(line);
      
      // Create an object with the data
      const market: any = {};
      headers.forEach((header, i) => {
        market[header] = values[i] || '';
      });
      
      // Generate a unique ID for each market
      market.id = `${market.market_name.replace(/[^a-zA-Z0-9]/g, '')}-${index + 1}`;
      
      return market as FarmersMarket;
    });
    
    return markets;
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return [];
  }
}

// Helper function to parse CSV lines that may contain quoted values with commas
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last value
  values.push(current.trim());
  
  return values;
}

// Function to get a subset of markets (for featured markets)
function getFeaturedMarkets(count: number = 6): FarmersMarket[] {
  const allMarkets = getFarmersMarkets();
  return allMarkets.slice(0, count);
}

// Function to search markets by name or location
function searchMarkets(query: string): FarmersMarket[] {
  const allMarkets = getFarmersMarkets();
  const lowercaseQuery = query.toLowerCase();
  
  return allMarkets.filter(market => 
    market.market_name.toLowerCase().includes(lowercaseQuery) ||
    market.market_city.toLowerCase().includes(lowercaseQuery) ||
    market.county_name.toLowerCase().includes(lowercaseQuery) ||
    market.market_description.toLowerCase().includes(lowercaseQuery)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const featured = searchParams.get('featured');
  const count = searchParams.get('count');

  try {
    let markets: FarmersMarket[];

    if (featured === 'true') {
      const featuredCount = count ? parseInt(count) : 6;
      markets = getFeaturedMarkets(featuredCount);
    } else if (query) {
      markets = searchMarkets(query);
    } else {
      markets = getFarmersMarkets();
    }

    return NextResponse.json(markets);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
} 