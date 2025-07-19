"use client"

import { Star, MapPin, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { FarmersMarket } from "@/lib/csv-utils"
import SimpleMarketImage from "./SimpleMarketImage"

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

interface FeaturedMarketsProps {
  markets: FarmersMarket[]
}

export default function FeaturedMarkets({ markets }: FeaturedMarketsProps) {

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Markets</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most popular farmers markets in your area, rated by our community
          </p>
        </div>

        <div className="masonry-grid">
          {markets.map((market, index) => (
            <Card key={market.id} className="market-card featured-market overflow-hidden hover:shadow-lg p-0">
              <div className="market-card-image-container">
                <div className="market-card-image-wrapper" data-aspect-ratio="dynamic">
                  <SimpleMarketImage
                    src={market.image_link || ""}
                    alt={market.market_name}
                    className="market-card-image w-full h-full object-cover"
                    showName={true}
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
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              View All Markets
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
} 