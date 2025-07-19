"use client"

import { useState, useEffect } from 'react'

export default function ApiTestPage() {
  const [apiData, setApiData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Test the featured markets endpoint
        const response = await fetch('/api/markets?featured=true&count=6')
        
        if (!response.ok)         throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setApiData(data)
        
        console.log('API Response:', data)
      } catch (err: any) {      setError(err.message)
        console.error(API Test Error:', err)
      } finally {
        setLoading(false)
      }
    }

    testApi()
  }, [])

  if (loading) {
    return <div className="p-8">Testing API...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2l font-bold mb-4">API Test - Error</h1>
        <div className="bg-red-50 border border-red-200 rounded">
          <h2 className="font-medium text-red-800">Error:</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2l font-bold mb-4">API Test Results</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-2">API Response:</h2>
          <div className="bg-gray-100 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-2">Summary:</h2>
          <div className="bg-blue-50 rounded">
            <p><strong>Number of markets returned:</strong> {apiData?.length || 0}</p>
            <p><strong>First market:</strong> {apiData?.[0]?.market_name || 'None'}</p>
            <p><strong>Has image_link:</strong> {apiData?.[0]?.image_link ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        {apiData && apiData.length > 0 && (
          <div>
            <h2 className="text-lg font-medium mb-2">First 3 Markets:</h2>
            <div className="space-y-2">
              {apiData.slice(0, 3).map((market: any, index: number) => (
                <div key={index} className="border p-3 rounded">
                  <h3 className="font-medium">{market.market_name}</h3>
                  <p className="text-sm text-gray-600">{market.market_city}, {market.state_abbreviation}</p>
                  <p className="text-xs text-gray-500">Age: {market.image_link ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 