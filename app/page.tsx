"use client"

import { Search, MapPin, Users, Phone, Globe, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FarmersMarket } from "@/lib/csv-utils"
import FeaturedMarkets from "@/components/FeaturedMarkets"

export default function HomePage() {
  const [featuredMarkets, setFeaturedMarkets] = useState<FarmersMarket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedMarkets = async () => {
      try {
        // Use the CSV utils to get markets directly from CSV
        const { getFarmersMarkets } = await import('@/lib/csv-utils')
        const allMarkets = await getFarmersMarkets()
        // Get first 6 markets with images
        const marketsWithImages = allMarkets.filter(market => market.image_link && market.image_link.trim() !== '')
        setFeaturedMarkets(marketsWithImages.slice(0,6))
      } catch (error) {
        console.error('Error fetching featured markets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMarkets()
  }, [])

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
      {loading ? (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Markets</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the most popular farmers markets in your area, rated by our community
              </p>
            </div>
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">Loading featured markets...</div>
            </div>
          </div>
        </section>
      ) : (
        <FeaturedMarkets markets={featuredMarkets} />
      )}

      {/* Stats Section */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{loading ? "..." : featuredMarkets.length}</div>
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
