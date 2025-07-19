"use client"

import { useEffect, useState } from 'react'
import SimpleMarketImage from '@/components/SimpleMarketImage'
import { FarmersMarket } from '@/lib/csv-utils'

export default function SimpleTestPage() {
  const [markets, setMarkets] = useState<FarmersMarket[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch('/api/markets')
        if (!response.ok) {
          throw new Error('Failed to fetch markets')
        }
        const data = await response.json()
        setMarkets(data)
      } catch (error) {
        console.error('Error fetching markets:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMarkets()
  }, [])
  
  if (loading) {
    return <div className="p-8">Loading markets data...</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Market Images Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markets.slice(0, 6).map((market, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-60 relative">
              <SimpleMarketImage
                src={market.image_link || ""}
                alt={market.market_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg">{market.market_name}</h2>
              <p className="text-sm text-gray-500">{market.market_city}, {market.state_name}</p>
              <div className="mt-2 text-xs bg-gray-100 p-2 rounded break-all">
                <strong>Image URL:</strong> {market.image_link || 'None'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 