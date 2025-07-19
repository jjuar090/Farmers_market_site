"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ProxyTestPage() {
  const [imageUrl, setImageUrl] = useState('')
  const [proxyUrl, setProxyUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [headers, setHeaders] = useState<Record<string, string>>({})

  const testProxy = async () => {
    if (!imageUrl) return
    
    setLoading(true)
    setError(null)
    setHeaders({})
    
    try {
      const encodedUrl = encodeURIComponent(imageUrl)
      const proxyUrlWithParam = `/api/image-proxy?url=${encodedUrl}`
      setProxyUrl(proxyUrlWithParam)
      
      // Test the proxy with a fetch request to get headers
      const response = await fetch(proxyUrlWithParam, { method: 'HEAD' })
      
      // Extract headers
      const headerObj: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headerObj[key] = value
      })
      
      setHeaders(headerObj)
      
      if (!response.ok) {
        const errorText = await response.text()
        setError(`Error: ${response.status} ${response.statusText} - ${errorText}`)
      }
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Proxy Test</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter an image URL to test:</label>
          <div className="flex space-x-2">
            <Input 
              type="text" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button 
              onClick={testProxy}
              disabled={loading || !imageUrl}
            >
              {loading ? 'Testing...' : 'Test Proxy'}
            </Button>
          </div>
        </div>
        
        {proxyUrl && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Proxy URL:</h2>
              <div className="bg-gray-100 p-2 rounded text-sm break-all">
                {proxyUrl}
              </div>
            </div>
            
            {error ? (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <h3 className="font-medium text-red-700 mb-2">Error:</h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-lg font-medium mb-2">Image Preview:</h2>
                  <div className="border rounded-lg overflow-hidden h-64 bg-gray-50 flex items-center justify-center">
                    {loading ? (
                      <div className="animate-pulse">Loading...</div>
                    ) : (
                      <img 
                        src={proxyUrl} 
                        alt="Proxied image"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          setError(`Failed to load image: ${(e.target as HTMLImageElement).src}`)
                        }}
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-2">Response Headers:</h2>
                  <div className="bg-gray-100 p-2 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {Object.entries(headers).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value}
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 