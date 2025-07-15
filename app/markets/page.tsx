"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter, Star, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FarmersMarket } from "@/lib/csv-utils"

// Add this helper function at the top of the file
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ')    // Replace special chars with spaces
    .replace(/\s+/g, ' ')            // Normalize spaces
    .trim();
}

// Add this function to split search terms and handle exact phrases
function parseSearchTerms(searchInput: string): { phrases: string[], terms: string[] } {
  const phrases: string[] = [];
  let remainingText = searchInput;

  // Extract quoted phrases
  const phraseRegex = /"([^"]+)"/g;
  let match;
  while ((match = phraseRegex.exec(searchInput)) !== null) {
    phrases.push(normalizeText(match[1]));
    remainingText = remainingText.replace(match[0], '');
  }

  // Split remaining text into individual terms
  const terms = normalizeText(remainingText)
    .split(' ')
    .filter(term => term.length > 0);

  return { phrases, terms };
}

// Add this function to check if a market matches search criteria
function marketMatchesSearch(market: FarmersMarket, searchInput: string): { matches: boolean, matchDetails: string[] } {
  if (!searchInput.trim()) {
    return { matches: true, matchDetails: [] };
  }

  const { phrases, terms } = parseSearchTerms(searchInput);
  const matchDetails: string[] = [];

  // Fields to search in, with their display names
  const searchFields: [keyof FarmersMarket, string][] = [
    ['market_name', 'Name'],
    ['market_city', 'City'],
    ['county_name', 'County'],
    ['market_address', 'Address'],
    ['market_description', 'Description'],
    ['state_name', 'State']
  ];

  // Helper function to check a single field
  const checkField = (fieldValue: string | undefined, fieldName: string, searchTerm: string): boolean => {
    if (!fieldValue) return false;
    const normalizedField = normalizeText(fieldValue);
    
    // For phrases, require exact match
    if (phrases.includes(searchTerm)) {
      if (normalizedField.includes(searchTerm)) {
        matchDetails.push(`${fieldName} matches "${searchTerm}"`);
        return true;
      }
      return false;
    }

    // For individual terms, check word boundaries
    const wordBoundaryMatch = new RegExp(`\\b${searchTerm}`, 'i').test(fieldValue);
    if (wordBoundaryMatch) {
      matchDetails.push(`${fieldName} contains "${searchTerm}"`);
      return true;
    }

    // Check for close matches (e.g., "Santa" matches "Santa Rosa")
    if (normalizedField.includes(searchTerm)) {
      matchDetails.push(`${fieldName} partially matches "${searchTerm}"`);
      return true;
    }

    return false;
  };

  // Check all phrases (must match exactly)
  const allPhrasesMatch = phrases.length === 0 || phrases.every(phrase => 
    searchFields.some(([field, fieldName]) => 
      checkField(market[field]?.toString(), fieldName, phrase)
    )
  );

  if (!allPhrasesMatch) {
    return { matches: false, matchDetails: [] };
  }

  // Check all terms (at least one field must match each term)
  const allTermsMatch = terms.length === 0 || terms.every(term =>
    searchFields.some(([field, fieldName]) =>
      checkField(market[field]?.toString(), fieldName, term)
    )
  );

  return {
    matches: allTermsMatch,
    matchDetails: matchDetails
  };
}

// Function to format time from HH:MM:SS to readable format
function formatTime(timeString: string): string {
  if (!timeString) return '';
  // Remove seconds and convert to 12-hour format
  const time = timeString.substring(0, 5);
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Function to fetch markets data from CSV
const fetchMarketsData = async (): Promise<FarmersMarket[]> => {
  try {
    const response = await fetch('/api/markets');
    if (!response.ok) {
      throw new Error('Failed to fetch markets data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching markets data:', error);
    return [];
  }
};

export default function MarketsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [allMarkets, setAllMarkets] = useState<FarmersMarket[]>([])
  const [filteredMarkets, setFilteredMarkets] = useState<FarmersMarket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<{ market: FarmersMarket, matchDetails: string[] }[]>([]);

  // Fetch markets data on component mount
  useEffect(() => {
    const loadMarkets = async () => {
      setLoading(true);
      try {
        const markets = await fetchMarketsData();
        setAllMarkets(markets);
        setFilteredMarkets(markets);
      } catch (error) {
        console.error('Error loading markets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarkets();
  }, []);

  // Filter markets based on search term, location, and categories
  useEffect(() => {
    let filtered = [...allMarkets];
    let searchResults: { market: FarmersMarket, matchDetails: string[] }[] = [];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(market => {
        const { matches, matchDetails } = marketMatchesSearch(market, searchTerm);
        if (matches) {
          searchResults.push({ market, matchDetails });
        }
        return matches;
      });
    } else {
      searchResults = filtered.map(market => ({ market, matchDetails: [] }));
    }

    // Filter by location
    if (location) {
      const locationLower = normalizeText(location);
      filtered = filtered.filter(market =>
        market.market_city.toLowerCase().includes(locationLower) ||
        market.market_address.toLowerCase().includes(locationLower) ||
        market.county_name.toLowerCase().includes(locationLower) ||
        market.state_name.toLowerCase().includes(locationLower)
      );
      searchResults = searchResults.filter(result => filtered.includes(result.market));
    }

    // Filter by selected categories (counties)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(market =>
        selectedCategories.includes(market.county_name)
      );
      searchResults = searchResults.filter(result => filtered.includes(result.market));
    }

    // Sort markets
    searchResults.sort((a, b) => {
      const marketA = a.market;
      const marketB = b.market;
      switch (sortBy) {
        case 'name':
          return marketA.market_name.localeCompare(marketB.market_name);
        case 'city':
          return marketA.market_city.localeCompare(marketB.market_city);
        case 'county':
          return marketA.county_name.localeCompare(marketB.county_name);
        case 'state':
          return marketA.state_name.localeCompare(marketB.state_name);
        default:
          return 0;
      }
    });

    setFilteredMarkets(filtered);
    setSearchResults(searchResults);
  }, [allMarkets, searchTerm, location, selectedCategories, sortBy]);

  // Get unique counties from the markets data for filtering
  const categories = Array.from(new Set(allMarkets.map(market => market.county_name))).filter(Boolean)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-xl font-bold text-green-600">FarmFinder</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-green-600">
                Home
              </Link>
              <Link href="/markets" className="text-foreground hover:text-green-600">
                Markets
              </Link>
              <div onClick={() => router.push("/markets")}>
                Markets
              </div>
              <Link href="/blog" className="text-muted-foreground hover:text-green-600">
                Blog
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-green-600">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search Markets</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Market name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="location" 
                      placeholder="Enter your location..." 
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <Label className="text-base font-medium">Market Type</Label>
                  <div className="mt-3 space-y-3">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={category} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div>
                  <Label className="text-base font-medium">Minimum Rating</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4.5">4.5+ stars</SelectItem>
                      <SelectItem value="4.0">4.0+ stars</SelectItem>
                      <SelectItem value="3.5">3.5+ stars</SelectItem>
                      <SelectItem value="3.0">3.0+ stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Farmers Markets</h1>
                <p className="text-gray-600">{filteredMarkets.length} markets found</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <Label htmlFor="sort" className="text-sm">
                  Sort by:
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="county">County</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Markets Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Loading markets...</div>
              </div>
            ) : (
              <>
                {searchTerm && searchResults.length > 0 && (
                  <div className="mb-4 text-sm text-gray-600">
                    Showing matches for "{searchTerm}"
                  </div>
                )}
                <div className="masonry-grid">
                  {searchResults.map(({ market, matchDetails }, index) => (
                    <Card key={market.id} className="market-card overflow-hidden hover:shadow-lg p-0">
                      <div className="market-card-image-container">
                        <div className="market-card-image-wrapper">
                          <Image
                            src={market.image_url || "/placeholder.svg"}
                            alt={market.market_name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="market-card-image"
                            priority={index < 4}
                            quality={95}
                            loading={index < 8 ? "eager" : "lazy"}
                          />
                        </div>
                        <div className="market-card-city-badge">{market.market_city}</div>
                        <div className="market-card-rating">
                          <Star className="fill-current" />
                          <span>4.5</span>
                        </div>
                        
                        {/* Immersive overlay that appears on hover */}
                        <div className="market-card-overlay">
                          <h3 className="market-card-title">{market.market_name}</h3>
                          <div className="market-card-location">
                            <MapPin />
                            <span className="truncate">
                              {market.market_address}, {market.market_city}, {market.state_abbreviation}
                            </span>
                          </div>
                          <div className="market-card-hours">
                            <Clock />
                            <span>{market.market_open_days} {formatTime(market.market_open_time)} - {formatTime(market.market_close_time)}</span>
                          </div>
                          <p className="market-card-description-text">{market.market_description}</p>
                          
                          {searchTerm && matchDetails.length > 0 && (
                            <div className="market-card-overlay-badges mb-3">
                              {matchDetails.map((detail, idx) => (
                                <span key={idx} className="market-card-overlay-badge">
                                  {detail.replace(/matches |contains |partially matches /g, '').replace(/"/g, '')}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="market-card-overlay-badges">
                            <span className="market-card-overlay-badge">{market.county_name}</span>
                            <span className="market-card-overlay-badge">{market.state_name}</span>
                          </div>
                          <div className="market-card-action">
                            <Link href={`/market/${market.id}`}>
                              <div className="market-card-action-button">View Details</div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Markets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
