'use client'

import { createClient } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function BlogPage({ params }: { params: { id: string } }) {
  const [blogPost, setBlogPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, created_at, text_content')
          .eq('id', params.id)
          .single()
        
        if (error) {
          console.error('Error fetching blog post:', error)
        } else {
          setBlogPost(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBlogPost()
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!blogPost) {
    return <div className="container mx-auto p-4">Blog post not found</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Blog Post #{blogPost.id}
          </h1>
          <p className="text-gray-600 text-sm">
            Published: {new Date(blogPost.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blogPost.text_content}
          </p>
        </div>
      </div>
    </div>
  )
}





