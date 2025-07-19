"use client"

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [imageStatuses, setImageStatuses] = useState<{[key: string]: boolean}>({})
  
  const testUrls = [
    "https://thesantarosafarmersmarket.com/wp-content/uploads/2024/03/unnamed-768x1024.jpg",
    "https://thesantarosafarmersmarket.com/wp-content/uploads/2022/12/BakerEBooth.png",
    "https://images.squarespace-cdn.com/content/v1/623773002485e612217e05d3/c141ad87-1430-4da5-9cc0-48e2671a6606/IMG_1063-rotated.jpg?format=2500w",
    "https://s3-media0.fl.yelpcdn.com/bphoto/n1temhmFGuWE3hkabs8FYQ/o.jpg",
    "https://www.visitpetaluma.com/wp-content/uploads/2020/06/Walnut-Park-Farmers-Market.png"
  ]
  
  useEffect(() => {
    const checkImages = async () => {
      const results: {[key: string]: boolean} = {}
      
      for (const url of testUrls) {
        try {
          const img = new Image()
          const promise = new Promise<boolean>((resolve) => {
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
          })
          img.src = url
          results[url] = await promise
        } catch (error) {
          results[url] = false
        }
      }
      
      setImageStatuses(results)
    }
    
    checkImages()
  }, [])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image URL Test</h1>
      
      <div className="space-y-8">
        {testUrls.map((url, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h2 className="font-medium mb-2">Test {index + 1}</h2>
            <div className="text-sm mb-2 break-all bg-gray-100 p-2 rounded">{url}</div>
            
            <div className="flex items-center mb-4">
              <span className="mr-2">Status:</span>
              {imageStatuses[url] === undefined ? (
                <span className="text-gray-500">Checking...</span>
              ) : imageStatuses[url] ? (
                <span className="text-green-500">✓ Accessible</span>
              ) : (
                <span className="text-red-500">✗ Not accessible</span>
              )}
            </div>
            
            <div className="border rounded-lg overflow-hidden h-60 bg-gray-100">
              {imageStatuses[url] && (
                <img 
                  src={url} 
                  alt={`Test image ${index + 1}`} 
                  className="w-full h-full object-contain"
                />
              )}
              {imageStatuses[url] === false && (
                <div className="flex items-center justify-center h-full text-red-500">
                  Image failed to load
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Direct Image Tags</h2>
        {testUrls.map((url, index) => (
          <div key={`direct-${index}`} className="mb-4">
            <h3 className="font-medium mb-2">Direct Image {index + 1}</h3>
            <img 
              src={url} 
              alt={`Direct test image ${index + 1}`} 
              className="h-40 object-contain border rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  const errorDiv = document.createElement('div')
                  errorDiv.className = 'text-red-500 p-4 border rounded-lg'
                  errorDiv.textContent = 'Failed to load image directly'
                  parent.appendChild(errorDiv)
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 