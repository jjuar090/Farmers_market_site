// Utility functions to work with farmers markets data
// This file contains client-side helper functions and type definitions

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

// Simple hardcoded data for testing
const MARKETS_DATA: FarmersMarket[] = [
  {
    id: "SantaRosaOriginalFarmersMarket-1",
    state_name: "California",
    state_abbreviation: "CA",
    county_name: "Sonoma",
    market_name: "Santa Rosa Original Farmers Market",
    market_description: "Year-round market at Luther Burbank Center for the Arts, offering fresh produce, baked goods, and local crafts.",
    market_address: "50 Mark West Springs Rd",
    market_city: "Santa Rosa",
    market_zipcode: "95403",
    market_latitude: "38.4839",
    market_longitude: "-122.7214",
    market_open_days: "Wednesday & Saturday",
    market_open_time: "08:30",
    market_close_time: "13:00",
    market_website: "https://thesantarosafarmersmarket.com",
    market_phone: "",
    market_email: "info@thesantarosafarmersmarket.com",
    image_link: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop"
  },
  {
    id: "SantaRosaCertifiedFarmersMarket-2",
    state_name: "California",
    state_abbreviation: "CA",
    county_name: "Sonoma",
    market_name: "Santa Rosa Certified Farmers' Market",
    market_description: "Seasonal market (March-Dec) at the Veterans Memorial Building, featuring local produce, flowers, and artisanal goods.",
    market_address: "1351e Ave",
    market_city: "Santa Rosa",
    market_zipcode: "95404",
    market_latitude: "38.4411",
    market_longitude: "-122.7145",
    market_open_days: "Saturday",
    market_open_time: "08:30",
    market_close_time: "13:00",
    market_website: "https://northbayfarmersmarkets.org/locations/santa-rosa/",
    market_phone: "707-9580",
    market_email: "info@northbayfarmersmarkets.org",
    image_link: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop"
  },
  {
    id: "SebastopolFarmersMarket-3",
    state_name: "California",
    state_abbreviation: "CA",
    county_name: "Sonoma",
    market_name: "Sebastopol Farmers Market",
    market_description: "A vibrant year-round market in Downtown Plaza offering fresh, locally grown produce, prepared foods, and live music.",
    market_address: "Downtown Plaza",
    market_city: "Sebastopol",
    market_zipcode: "95472",
    market_latitude: "38.4200",
    market_longitude: "-122.8252",
    market_open_days: "Sunday",
    market_open_time: "10:00",
    market_close_time: "13:30",
    market_website: "http://sebastopolfarmersmarket.org",
    market_phone: "",
    market_email: "info@sebastopolfarmersmarket.org",
    image_link: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop"
  },
  {
    id: "PetalumaEastSideFarmersMarket-4",
    state_name: "California",
    state_abbreviation: "CA",
    county_name: "Sonoma",
    market_name: "Petaluma East-Side Farmers Market",
    market_description: "Seasonal market (May-Nov) at Lucchesi Park featuring local produce, artisan foods, and family activities.",
    market_address: "320N McDowell Blvd",
    market_city: "Petaluma",
    market_zipcode: "94954",
    market_latitude: "38.2562",
    market_longitude: "-122.6150",
    market_open_days: "Saturday",
    market_open_time: "09:00",
    market_close_time: "13:00",
    market_website: "https://farmtrails.org/listing/petaluma-east-side-farmers-market",
    market_phone: "707-8896",
    market_email: "info@farmtrails.org",
    image_link: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop"
  },
  {
    id: "PetalumaWalnutParkFarmersMarket-5",
    state_name: "California",
    state_abbreviation: "CA",
    county_name: "Sonoma",
    market_name: "Petaluma Walnut Park Farmers Market",
    market_description: "Seasonal evening market (May-Sept) in Walnut Park with fresh produce, prepared foods, and live music.",
    market_address: "Walnut Park",
    market_city: "Petaluma",
    market_zipcode: "94952",
    market_latitude: "38.2366",
    market_longitude: "-122.6375",
    market_open_days: "Thursday",
    market_open_time: "16:30",
    market_close_time: "20:00",
    market_website: "https://northbayfarmersmarkets.org/locations/petaluma/",
    market_phone: "707-9580",
    market_email: "info@northbayfarmersmarkets.org",
    image_link: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=300&fit=crop"
  },
  {
    id: "HealdsburgFarmersMarket-6",
    state_name: "California",
    state_abbreviation: "CA",
    county_name: "Sonoma",
    market_name: "Healdsburg Farmers Market",
    market_description: "Community-focused market offering a wide selection of local farm products, operating year-round on Saturdays and seasonally on Tuesdays.",
    market_address: "West Plaza Park",
    market_city: "Healdsburg",
    market_zipcode: "95448",
    market_latitude: "38.6080",
    market_longitude: "-122.8687",
    market_open_days: "Saturday & Tuesday",
    market_open_time: "09:00",
    market_close_time: "12:30",
    market_website: "http://healdsburgfarmersmarket.org",
    market_phone: "707-1956",
    market_email: "info@healdsburgfarmersmarket.org",
    image_link: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop"
  }
];

// Function to get all markets from data
export async function getFarmersMarkets(): Promise<FarmersMarket[]> {
  return MARKETS_DATA;
}

// Function to get featured markets from data
export async function getFeaturedMarkets(count: number = 6): Promise<FarmersMarket[]> {
  return MARKETS_DATA.slice(0, count);
}

// Function to search markets from data
export async function searchMarkets(query: string): Promise<FarmersMarket[]> {
  const lowercaseQuery = query.toLowerCase();
  
  return MARKETS_DATA.filter(market => 
    market.market_name.toLowerCase().includes(lowercaseQuery) ||
    market.market_city.toLowerCase().includes(lowercaseQuery) ||
    market.county_name.toLowerCase().includes(lowercaseQuery) ||
    market.market_description.toLowerCase().includes(lowercaseQuery)
  );
} 