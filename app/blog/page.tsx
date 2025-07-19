'use client'

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface BlogPost {
  id: number
  created_at: string
  text_content: string
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        console.log('Fetching blog posts...')
        
        // First, let's try to get all data without any filters
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
        
        console.log('Supabase response:', { data, error })
        
        if (error) {
          console.error('Error fetching blog posts:', error)
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
        } else {
          console.log('Blog posts fetched successfully:', data)
          console.log('Number of posts:', data?.length)
          console.log('First post content:', data?.[0]?.text_content)
          setBlogPosts(data || [])
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlogPosts()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Blog Posts</h1>
      
      {/* Debug info */}
      <div className="bg-yellow-100 p-4 mb-4 rounded">
        <p>Debug: {blogPosts.length} posts loaded</p>
        <p>Posts: {JSON.stringify(blogPosts)}</p>
      </div>
      
      {blogPosts.length > 0 ? (
        <div className="space-y-4">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Blog Post #{post.id}
                </h2>
                <span className="text-gray-600 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {post.text_content.length > 200 
                  ? `${post.text_content.substring(0, 200)}...` 
                  : post.text_content
                }
              </p>
              
              <Link 
                href={`/blog/${post.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No blog posts found</p>
        </div>
      )}
    </div>
  )
}