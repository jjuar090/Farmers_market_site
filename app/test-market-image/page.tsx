"use client"

import SimpleMarketImage from '@/components/SimpleMarketImage'

export default function TestMarketImagePage() {
  // Test URLs
  const testUrls = [
    "https://thesantarosafarmersmarket.com/wp-content/uploads/2024/03/unnamed-768x1024.jpg",
    "https://images.squarespace-cdn.com/content/v1/623773002485e612217e05d3/c141ad87-1430-4da5-9cc0-48e2671a6606/IMG_1063-rotated.jpg?format=2500w",
    "https://s3-media0.fl.yelpcdn.com/bphoto/n1temhmFGuWE3hkabs8FYQ/o.jpg",
    "https://www.visitpetaluma.com/wp-content/uploads/2020/06/Walnut-Park-Farmers-Market.png",
    "thesantarosafarmersmarket.com/wp-content/uploads/2022/12/BakerEBooth.png" // URL without http prefix
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Market Image Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testUrls.map((url, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <h2 className="font-medium">Test Image {index + 1}</h2>
            <div className="text-sm bg-gray-100 p-2 rounded mb-4 break-all">
              {url}
            </div>
            
            <div className="h-64 border rounded overflow-hidden">
              <SimpleMarketImage
                src={url}
                alt={`Test image ${index + 1}`}
                className="w-full h-full object-contain"
                debug={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 