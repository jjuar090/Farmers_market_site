"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import SimpleMarketImage from '@/components/SimpleMarketImage'
import { getFarmersMarkets, FarmersMarket } from '@/lib/csv-utils'

export default function ImageTestPage() {
  const [markets, setMarkets] = useState<FarmersMarket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMarket, setSelectedMarket] = useState<FarmersMarket | null>(null)

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const data = await getFarmersMarkets()
        // Filter to only markets with image links
        const marketsWithImages = data.filter(market => market.image_link && market.image_link.trim() !== '')
        setMarkets(marketsWithImages.slice(0, 20)) // Get first 20 markets with images
      } catch (error) {
        console.error('Error loading markets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMarkets()
  }, [])

  const testImage = (market: FarmersMarket) => {
    setSelectedMarket(market)
  }

  if (loading) {
    return <div className="p-8">Loading markets...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Market Image Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Market to Test</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {markets.map((market) => (
              <Button 
                key={market.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => testImage(market)}
              >
                {market.market_name}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Image Test Results</h2>
          
          {selectedMarket ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Market Information:</h3>
                <p><strong>Name:</strong> {selectedMarket.market_name}</p>
                <p><strong>Image URL:</strong> <span className="text-sm break-all bg-gray-100 p-1 rounded">{selectedMarket.image_link}</span></p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">SimpleMarketImage Component (with debug):</h3>
                <div className="h-64 w-full border rounded-lg overflow-hidden">
                  <SimpleMarketImage
                    src={selectedMarket.image_link}
                    alt={selectedMarket.market_name}
                    className="w-full h-full object-contain"
                    debug={true}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Direct Image (No Proxy):</h3>
                <div className="h-64 w-full border rounded-lg overflow-hidden">
                  <img
                    src={selectedMarket.image_link}
                    alt={`${selectedMarket.market_name} (direct)`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const errorDiv = document.createElement('div')
                        errorDiv.className = 'flex items-center justify-center h-full bg-red-50 text-red-500'
                        errorDiv.textContent = 'Direct Image Error'
                        parent.appendChild(errorDiv)
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Proxy Image:</h3>
                <div className="h-64 w-full border rounded-lg overflow-hidden">
                  <img
                    src={`/api/image-proxy?url=${encodeURIComponent(selectedMarket.image_link)}`}
                    alt={`${selectedMarket.market_name} (proxy)`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        const errorDiv = document.createElement('div')
                        errorDiv.className = 'flex items-center justify-center h-full bg-red-50 text-red-500'
                        errorDiv.textContent = 'Proxy Image Error'
                        parent.appendChild(errorDiv)
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-lg bg-gray-50">
              <p className="text-gray-500">Select a market to test its image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 