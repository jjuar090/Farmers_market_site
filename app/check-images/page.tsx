"use client"

import { useEffect, useState } from 'react'
import SimpleMarketImage from '@/components/SimpleMarketImage'
import { FarmersMarket } from '@/lib/csv-utils'

export default function CheckImagesPage() {
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
      <h1 className="text-2xl font-bold mb-4">Market Images Check</h1>
      
      <div className="space-y-8">
        {markets.slice(0, 10).map((market, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="text-lg font-bold">{market.market_name}</h2>
            <p className="text-sm text-gray-500 mb-2">{market.market_city}, {market.state_name}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Image URL Info:</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>image_link:</strong> <span className="break-all bg-gray-100 p-1 rounded">{market.image_link || 'None'}</span></div>
                  <div><strong>image_url:</strong> <span className="break-all bg-gray-100 p-1 rounded">{(market as any).image_url || 'None'}</span></div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Direct Image Test:</h3>
                  {market.image_link ? (
                    <div className="mt-2">
                      <p className="text-xs mb-1">Direct URL:</p>
                      <img 
                        src={market.image_link.startsWith('http') ? market.image_link : `https://${market.image_link}`}
                        alt={`Direct ${market.market_name}`}
                        className="h-40 object-contain border rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            const errorDiv = document.createElement('div')
                            errorDiv.className = 'text-red-500 p-4 border rounded-lg'
                            errorDiv.textContent = 'Failed to load directly'
                            parent.appendChild(errorDiv)
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-red-500">No image_link available</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">SimpleMarketImage Component:</h3>
                <div className="h-60 border rounded-lg overflow-hidden">
                  <SimpleMarketImage 
                    src={market.image_link || ""}
                    alt={market.market_name}
                    className="w-full h-full object-cover"
                    debug={true}
                  />
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Proxy Test:</h3>
                  {market.image_link ? (
                    <div className="mt-2">
                      <p className="text-xs mb-1">Via proxy:</p>
                      <img 
                        src={`/api/image-proxy?url=${encodeURIComponent(market.image_link.startsWith('http') ? market.image_link : `https://${market.image_link}`)}`}
                        alt={`Proxy ${market.market_name}`}
                        className="h-40 object-contain border rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            const errorDiv = document.createElement('div')
                            errorDiv.className = 'text-red-500 p-4 border rounded-lg'
                            errorDiv.textContent = 'Failed to load via proxy'
                            parent.appendChild(errorDiv)
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-red-500">No image_link available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 