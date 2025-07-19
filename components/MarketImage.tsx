"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Leaf } from 'lucide-react'

// Base64 encoded simple green placeholder SVG
const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgNDAwIDMwMCI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmMGY5ZjAiLz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RjZmNlNyIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM4NmVmYWMiLz48cGF0aCBkPSJNMjAwLDE4MCBRMjMwLDE0MCAyNjAsMTgwIEwyMDAsMjQwIEwxNDAsMTgwIFExNzAsMTQwIDIwMCwxODAgWiIgZmlsbD0iIzRhZGU4MCIvPjx0ZXh0IHg9IjIwMCIgeT0iMjcwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMxNjY1MzQiPkZhcm1lcnMgTWFya2V0PC90ZXh0Pjwvc3ZnPg=="

interface MarketImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  onLoad?: (e: any) => void
}

export default function MarketImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = false,
  sizes = '100vw',
  quality = 75,
  onLoad
}: MarketImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src || PLACEHOLDER_IMAGE)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Reset states when src changes
    setImageSrc(src || PLACEHOLDER_IMAGE)
    setIsLoading(true)
    setError(false)
  }, [src])

  // Function to fix image URLs
  const fixImageUrl = (url: string): string => {
    if (!url) return PLACEHOLDER_IMAGE
    
    // Remove quotes if present
    url = url.replace(/^["']|["']$/g, '')
    
    // If URL doesn't start with http, add https://
    if (!url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/')) {
      return `https://${url}`
    }
    
    return url
  }

  // Handle image load error
  const handleError = () => {
    console.error(`Image failed to load: ${src}`)
    setError(true)
    setImageSrc(PLACEHOLDER_IMAGE)
  }

  // Handle image load success
  const handleLoad = (e: any) => {
    setIsLoading(false)
    if (onLoad) onLoad(e)
  }

  // Always use proxy for all external images
  const isExternalImage = () => {
    // If it's a data URL or local path, it's not external
    if (!src || src === PLACEHOLDER_IMAGE || src.startsWith('data:') || src.startsWith('/')) {
      return false;
    }
    
    // For all other URLs, treat as external and use the proxy
    return true;
  }

  // Function to get proxied URL for external images
  const getProxiedUrl = (url: string): string => {
    if (!url) {
      console.log('Empty URL, using placeholder');
      return PLACEHOLDER_IMAGE;
    }
    
    // If it's a data URL or placeholder, return as is
    if (url.startsWith('data:') || url === PLACEHOLDER_IMAGE) {
      return url;
    }
    
    // Fix URL format first
    const fixedUrl = fixImageUrl(url);
    console.log(`Processing URL: ${url} -> ${fixedUrl}`);
    
    // Use our proxy for external URLs
    const proxiedUrl = `/api/image-proxy?url=${encodeURIComponent(fixedUrl)}`;
    console.log(`Using proxied URL: ${proxiedUrl}`);
    return proxiedUrl;
  }
  
  // If external image, use direct img tag with proxy
  if (isExternalImage()) {
    return (
      <div className={`relative ${className} ${fill ? 'w-full h-full' : ''}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse bg-gray-200 w-full h-full"></div>
          </div>
        )}
        {error ? (
          <div className="flex items-center justify-center w-full h-full bg-green-50">
            <Leaf className="w-12 h-12 text-green-500" />
          </div>
        ) : (
          <img
            src={getProxiedUrl(imageSrc)}
            alt={alt}
            className={`${className} ${fill ? 'object-cover w-full h-full' : ''}`}
            onError={handleError}
            onLoad={handleLoad}
            loading={priority ? 'eager' : 'lazy'}
          />
        )}
      </div>
    )
  }

  // For configured domains, use Next.js Image component
  return (
    <div className={`relative ${className} ${fill ? 'w-full h-full' : ''}`}>
      {error ? (
        <div className="flex items-center justify-center w-full h-full bg-green-50">
          <Leaf className="w-12 h-12 text-green-500" />
        </div>
      ) : (
        <Image
          src={fixImageUrl(imageSrc)}
          alt={alt}
          className={className}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  )
} 