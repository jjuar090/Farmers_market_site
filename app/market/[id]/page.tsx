'use client'

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Leaf, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  Heart, 
  Camera, 
  Star, 
  Truck, 
  Phone, 
  Calendar, 
  Share2, 
  Bookmark 
} from 'lucide-react'
import { useEffect, useState } from "react"
import { getFarmersMarkets, FarmersMarket } from "@/lib/csv-utils"
import { notFound } from "next/navigation"

// Function to generate an ID from market name for URL matching
function generateMarketId(name: string, index: number): string {
  return `${name.replace(/[^a-zA-Z0-9]/g, '')}-${index + 1}`;
}

export default function MarketDetailPage({ params }: { params: { id: string } }) {
  const [market, setMarket] = useState<FarmersMarket | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get all markets from CSV
    const allMarkets = getFarmersMarkets();
    
    // Find the market with the matching ID
    const foundMarket = allMarkets.find((m, index) => {
      const marketId = generateMarketId(m.market_name, index);
      return marketId === params.id;
    });
    
    if (foundMarket) {
      setMarket(foundMarket);
    }
    
    setLoading(false);
  }, [params.id])

  if (loading) return <div className="flex justify-center items-center min-h-screen"><p>Loading market details...</p></div>
  if (!market) return <div className="flex justify-center items-center min-h-screen"><p>Market not found</p></div>

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-emerald-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-medium">{market.county_name} Farmers Market</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
              {market.market_name.split(' ').slice(0, -1).join(' ')}
              <br />
              <span className="text-yellow-300">{market.market_name.split(' ').slice(-1)[0]}</span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-white/90 mb-8">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{market.market_address}, {market.market_city}, {market.state_abbreviation} {market.market_zipcode}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-yellow-500 text-yellow-900 px-4 py-2 text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                {market.market_open_days}
              </Badge>
              <Badge className="bg-green-700 text-white px-4 py-2 text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                Local Market
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Market Gallery */}
            <Card className="overflow-hidden border-2 border-green-200 shadow-lg">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-4 p-6">
                  <div className="space-y-4">
                    {market.image_url ? (
                      <Image
                        src={market.image_url}
                        alt={`${market.market_name} view`}
                        width={800}
                        height={600}
                        className="rounded-lg object-cover w-full h-48"
                        quality={95}
                        priority
                      />
                    ) : (
                      <div className="rounded-lg bg-green-100 w-full h-48 flex items-center justify-center">
                        <Leaf className="w-12 h-12 text-green-500" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-amber-100 h-[120px] flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="rounded-lg bg-emerald-100 h-[120px] flex items-center justify-center">
                        <Truck className="w-8 h-8 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-green-100 w-full h-32 flex items-center justify-center">
                      <Users className="w-8 h-8 text-green-500" />
                    </div>
                    <div className="rounded-lg bg-yellow-100 w-full h-32 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Camera className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Share Your Visit</span>
                      </div>
                      <p className="text-sm text-green-700">#{market.market_name.replace(/\s+/g, '')} #FreshLocal</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-orange-800">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span>{"The Heart of Local Food"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {market.market_description || 
                    `Step into a world where the aroma of fresh herbs mingles with the laughter of families, 
                    where every tomato tells a story and every conversation builds community. ${market.market_name} 
                    is more than just a market—it's been the beating heart of the local food movement.`
                  }
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {`From the first strawberries of spring to the last pumpkins of fall, our vendors bring you 
                  the very best of ${market.state_name}'s agricultural bounty. Visit us at ${market.market_address}, 
                  ${market.market_city} during our market hours: ${market.market_open_days}.`}
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  <span className="text-sm text-gray-600">Loved by the community</span>
                </div>
              </CardContent>
            </Card>

            {/* Market Specialties */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-green-800">
                  <Leaf className="w-6 h-6" />
                  <span>What Makes Us Special</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Certified Organic</h3>
                        <p className="text-sm text-gray-600">All vendors meet strict organic certification standards</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800">Farm to Table</h3>
                        <p className="text-sm text-gray-600">Produce picked fresh within 24 hours of market day</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-800">Community Focused</h3>
                        <p className="text-sm text-gray-600">Supporting local families and sustainable farming practices</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800">Seasonal Variety</h3>
                        <p className="text-sm text-gray-600">{"Ever-changing selection following nature's calendar"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Highlights */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-amber-800">
                  <Calendar className="w-6 h-6" />
                  <span>{"What's Fresh This Season"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                    <div className="text-2xl mb-2">🍅</div>
                    <h4 className="font-semibold text-amber-800">Tomatoes</h4>
                    <p className="text-xs text-amber-600">Peak Season</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                    <div className="text-2xl mb-2">🥬</div>
                    <h4 className="font-semibold text-amber-800">Leafy Greens</h4>
                    <p className="text-xs text-amber-600">Fresh Daily</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                    <div className="text-2xl mb-2">🌽</div>
                    <h4 className="font-semibold text-amber-800">Sweet Corn</h4>
                    <p className="text-xs text-amber-600">Limited Time</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-amber-200">
                    <div className="text-2xl mb-2">🌻</div>
                    <h4 className="font-semibold text-amber-800">Sunflowers</h4>
                    <p className="text-xs text-amber-600">Beautiful Blooms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Market Hours */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Clock className="w-5 h-5" />
                  <span>Market Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-green-200">
                    <span className="font-medium text-green-800">{market.market_open_days || "Market Day"}</span>
                    <span className="text-green-700">
                      {market.market_open_time && market.market_close_time 
                        ? `${formatTime(market.market_open_time)} - ${formatTime(market.market_close_time)}` 
                        : "Hours vary"}
                    </span>
                  </div>
                  <div className="text-center p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                    <Calendar className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                    <p className="text-sm text-yellow-800 font-medium">Open Year Round</p>
                    <p className="text-xs text-yellow-700">Check for updates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Phone className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {market.market_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-800">{market.market_phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-blue-800 font-medium">{market.market_address}</p>
                    <p className="text-blue-700 text-sm">{market.market_city}, {market.state_abbreviation} {market.market_zipcode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Information */}
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800">Market Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-purple-700">County</span>
                  <p className="text-purple-800">{market.county_name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-purple-700">State</span>
                  <p className="text-purple-800">{market.state_name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
                <Share2 className="w-4 h-4 mr-2" />
                Share This Market
              </Button>
              <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3">
                <Bookmark className="w-4 h-4 mr-2" />
                Save to Favorites
              </Button>
            </div>

            {/* Community Highlight */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-orange-800 mb-2">Community Love</h3>
                  <p className="text-sm text-orange-700 mb-3">
                    {"More than just shopping - it's where neighbors become friends and meals become memories."}
                  </p>
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    Write a Review
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card className="border-2 border-emerald-200 bg-emerald-50">
              <CardHeader>
                <CardTitle className="text-emerald-800 text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-emerald-100 rounded-lg h-48 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-emerald-700">
                    {market.market_address}, {market.market_city}, {market.state_abbreviation} {market.market_zipcode}
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Experience the Magic of Fresh, Local Food
          </h2>
          <p className="text-green-100 mb-6 text-lg">
            Join us {market.market_open_days || "weekly"} for a celebration of community, sustainability, and incredible flavors.
          </p>
          <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold px-8 py-3">
            Plan Your Visit
          </Button>
        </div>
      </div>
    </div>
  )
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
