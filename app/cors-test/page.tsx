"use client"

import { useState, useEffect } from 'react'

export default function CorsTestPage() {
  const [testResults, setTestResults] = useState<{[key: string]: boolean}>({})
  const [loading, setLoading] = useState(true)
  
  const testUrls = [
    "https://thesantarosafarmersmarket.com/wp-content/uploads/2024/03/unnamed-768x1024.jpg",
    "https://thesantarosafarmersmarket.com/wp-content/uploads/2022/12/BakerEBooth.png",
    "https://images.squarespace-cdn.com/content/v1/623773002485e612217e05d3/c141ad87-1430-4da5-9cc0-48e2671a6606/IMG_1063-rotated.jpg?format=2500w",
    "https://s3-media0.fl.yelpcdn.com/bphoto/n1temhmFGuWE3hkabs8FYQ/o.jpg",
    "https://www.visitpetaluma.com/wp-content/uploads/2020/06/Walnut-Park-Farmers-Market.png"
  ]
  
  useEffect(() => {
    const testCors = async () => {
      const results: {[key: string]: boolean} = {}
      
      // Test direct image loading
      for (const url of testUrls) {
        try {
          const img = new Image()
          const promise = new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
          })
          img.src = url
          results[`direct_${url}`] = await promise
        } catch (error) {
          results[`direct_${url}`] = false
        }
      }
      
      // Test proxied image loading
      for (const url of testUrls) {
        try {
          const img = new Image()
          const promise = new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
          })
          img.src = `/api/image-proxy?url=${encodeURIComponent(url)}`
          results[`proxy_${url}`] = await promise
        } catch (error) {
          results[`proxy_${url}`] = false
        }
      }
      
      setTestResults(results)
      setLoading(false)
    }
    
    testCors()
  }, [])
  
  if (loading) {
    return <div className="p-8">Testing CORS solutions...</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">CORS Test Results</h1>
      
      <div className="space-y-8">
        {testUrls.map((url, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="font-medium mb-2">Test URL {index + 1}</h2>
            <div className="text-sm mb-2 break-all bg-gray-100 p-2 rounded">{url}</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Direct Loading:</h3>
                <div className="flex items-center mb-4">
                  {testResults[`direct_${url}`] ? (
                    <span className="text-green-500">✓ Works directly</span>
                  ) : (
                    <span className="text-red-500">✗ CORS blocked</span>
                  )}
                </div>
                
                <div className="h-40 border rounded-lg overflow-hidden">
                  {testResults[`direct_${url}`] ? (
                    <img 
                      src={url} 
                      alt={`Direct test ${index}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-red-50 text-red-500">
                      CORS Error
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Through Proxy:</h3>
                <div className="flex items-center mb-4">
                  {testResults[`proxy_${url}`] ? (
                    <span className="text-green-500">✓ Works via proxy</span>
                  ) : (
                    <span className="text-red-500">✗ Proxy failed</span>
                  )}
                </div>
                
                <div className="h-40 border rounded-lg overflow-hidden">
                  <img 
                    src={`/api/image-proxy?url=${encodeURIComponent(url)}`}
                    alt={`Proxy test ${index}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'flex items-center justify-center h-full bg-red-50 text-red-500';
                        errorDiv.textContent = 'Proxy Error';
                        parent.appendChild(errorDiv);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 