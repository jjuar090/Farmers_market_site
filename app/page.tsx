import { Search, MapPin, Clock, Star, Users, Phone, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { getFeaturedMarkets, FarmersMarket } from "@/lib/csv-utils"








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

// Function to get the featured markets data from CSV
const getData = async() => {
  // Get the first 6 markets from the CSV as featured markets
  const featuredMarkets = getFeaturedMarkets(6);
  return featuredMarkets;
}


export default async function HomePage() {
  // Get the featured markets data from CSV
  const featuredMarkets = getFeaturedMarkets(6);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-xl font-bold text-green-600">FarmFinder</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-foreground hover:text-green-600">
                Home
              </Link>
              <Link href="/markets" className="text-muted-foreground hover:text-green-600">
                Markets
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-green-600">
                Blog
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-green-600">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="outline">Sign In</Button>
              <Button className="bg-green-600 hover:bg-green-700">List Your Market</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Fresh, Local
            <span className="text-green-600 block">Farmers Markets</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the best farmers markets in your area. Support local farmers, find fresh produce, and connect with
            your community.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-lg shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search markets, vendors, or products..."
                  className="pl-10 border-0 focus-visible:ring-0"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="Enter your location..." className="pl-10 border-0 focus-visible:ring-0" />
              </div>
              <Button className="bg-green-600 hover:bg-green-700 px-8">Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Markets</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most popular farmers markets in your area, rated by our community
            </p>
          </div>

          <div className="masonry-grid">
            {featuredMarkets.map((market, index) => (
              <Card key={market.id} className="market-card overflow-hidden hover:shadow-lg p-0">
                <div className="market-card-image-container">
                  <div className="market-card-image-wrapper">
                    <Image
                      src={market.image_url || "/placeholder.svg"}
                      alt={market.market_name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="market-card-image"
                      priority={index < 3}
                      quality={95}
                      loading={index < 6 ? "eager" : "lazy"}
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

          <div className="text-center mt-12">
            <Link href="/markets">
              <Button variant="outline" size="lg">
                View All Markets
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{featuredMarkets.length}</div>
              <div className="text-gray-600">Farmers Markets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Local Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">25K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-gray-600">Reviews & Ratings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FM</span>
                </div>
                <span className="text-xl font-bold">FarmFinder</span>
              </div>
              <p className="text-gray-400">
                Connecting communities with fresh, local produce and supporting local farmers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/markets" className="hover:text-white">
                    Find Markets
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className="hover:text-white">
                    Browse Vendors
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-white">
                    Write Reviews
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Vendors</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/list-market" className="hover:text-white">
                    List Your Market
                  </Link>
                </li>
                <li>
                  <Link href="/vendor-signup" className="hover:text-white">
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FarmFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
