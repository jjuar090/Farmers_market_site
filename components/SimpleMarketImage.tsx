"use client"

import { useState, useEffect } from 'react'
import { Leaf } from 'lucide-react'

interface SimpleMarketImageProps {
  src: string
  alt: string
  className?: string
  debug?: boolean
  showName?: boolean
}

export default function SimpleMarketImage({ 
  src, 
  alt, 
  className = '', 
  debug = false,
  showName = false
}: SimpleMarketImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Fix the URL if needed
  const fixUrl = (url: string): string => {
    if (!url) return '';
    
    // Remove quotes if present
    url = url.replace(/^["']|["']$/g, '');
    
    // If it's a data URL or local path, return as is
    if (url.startsWith('data:') || url.startsWith('/')) {
      return url;
    }
    
    // If URL doesn't start with http, add https://
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    
    // ALWAYS use the proxy for external URLs to avoid CORS issues
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }

  const handleError = () => {
    const errorMsg = `Image failed to load: ${src}`;
    console.error(errorMsg);
    setError(true);
    setLoading(false);
    if (debug) {
      setDebugInfo(errorMsg);
    }
  }

  const handleLoad = () => {
    setLoading(false);
    if (debug) {
      setDebugInfo(`Successfully loaded: ${src}`);
    }
  }

  // Use a default image if no src is provided
  const defaultImage = "/placeholder.svg";
  
  // Log image details on mount for debugging
  useEffect(() => {
    if (debug) {
      const originalUrl = src || '';
      const fixedUrl = fixUrl(originalUrl);
      setDebugInfo(`Original URL: ${originalUrl}\nFixed URL: ${fixedUrl}`);
    }
  }, [src, debug]);
  
  if (!src) {
    return (
      <div className={`relative flex items-center justify-center bg-green-50 ${className}`}>
        <img 
          src={defaultImage}
          alt={alt || "Farmers Market"}
          className={className}
          onError={handleError}
        />
        {debug && <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">No source URL provided</div>}
        {showName && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-green-50 bg-opacity-90 text-center">
            <h3 className="text-sm font-medium text-green-800">{alt}</h3>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        </div>
      )}
      
      {error ? (
        <div className={`relative flex items-center justify-center bg-green-50 ${className}`}>
          <img 
            src="/placeholder.svg"
            alt={alt || "Farmers Market"}
            className={className}
          />
          {debug && <div className="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-70 text-white text-xs p-1 overflow-hidden">Error: {debugInfo}</div>}
          {showName && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-green-50 bg-opacity-90 text-center">
              <h3 className="text-sm font-medium text-green-800">{alt}</h3>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full">
          <img
            src={fixUrl(src)}
            alt={alt}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
            loading="lazy"
          />
          {debug && debugInfo && !error && (
            <div className="absolute bottom-0 left-0 right-0 bg-green-500 bg-opacity-70 text-white text-xs p-1 overflow-hidden">
              {debugInfo}
            </div>
          )}
          {showName && !debug && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-green-50 bg-opacity-90 text-center">
              <h3 className="text-sm font-medium text-green-800">{alt}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 