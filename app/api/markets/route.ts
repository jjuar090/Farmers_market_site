import { NextResponse } from 'next/server';
import { getFarmersMarkets } from '@/lib/csv-utils';

// API route to get all farmers markets from CSV
export async function GET() {
  try {
    // Get all markets from the CSV file
    const markets = getFarmersMarkets();
    
    // Return the markets data as JSON
    return NextResponse.json(markets);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets data' },
      { status: 500 }
    );
  }
} 