import { NextRequest, NextResponse } from 'next/server';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }
  
  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);
    
    // Add https:// if missing
    const fullUrl = decodedUrl.startsWith('http') ? decodedUrl : `https://${decodedUrl}`;
    
    console.log(`Proxying request to: ${fullUrl}`);
    
    // Fetch the image with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    let response;
    try {
      response = await fetch(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Referer': 'https://www.google.com/',
        },
        signal: controller.signal,
        cache: 'no-store',
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Error fetching image: ${response.status} ${response.statusText} for URL: ${fullUrl}`);
        return new NextResponse(`Failed to fetch image: ${response.status} ${response.statusText}`, { 
          status: response.status,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'X-Error-Type': 'HTTP_ERROR',
            'X-Error-URL': fullUrl,
            'X-Error-Status': response.status.toString(),
          }
        });
      }
      
      // Check if the response is actually an image
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        console.error(`Response is not an image: ${contentType} for URL: ${fullUrl}`);
        return new NextResponse(`Response is not an image: ${contentType}`, { 
          status: 400,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'X-Error-Type': 'NOT_IMAGE',
            'X-Error-URL': fullUrl,
            'X-Error-Content-Type': contentType || 'unknown',
          }
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error(`Request timed out for URL: ${fullUrl}`);
        return new NextResponse('Request timed out', { 
          status: 504,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'X-Error-Type': 'TIMEOUT',
            'X-Error-URL': fullUrl,
          }
        });
      }
      
      console.error(`Network error for URL: ${fullUrl}`, error);
      return new NextResponse(`Network error: ${error.message}`, { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'X-Error-Type': 'NETWORK_ERROR',
          'X-Error-URL': fullUrl,
          'X-Error-Message': error.message,
        }
      });
    }
    
    // Get the image data
    const imageData = await response.arrayBuffer();
    
    // Get content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Return the image with appropriate headers
    return new NextResponse(imageData, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'X-Proxy-Status': 'success',
        'X-Original-URL': fullUrl,
      },
    });
  } catch (error) {
    console.error('Error in image proxy:', error);
    return new NextResponse(`Error proxying image: ${error.message}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'X-Error-Type': 'PROXY_ERROR',
        'X-Error-Message': error.message,
      }
    });
  }
} 