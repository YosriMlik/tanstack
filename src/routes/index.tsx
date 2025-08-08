import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import '../App.css'
export const Route = createFileRoute('/')({
  component: App,
})

type Post = {
  id: number
  title: string
  content: string
  timestamp: string
}

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('https://workers-bun-hono-drizzle.ymlik24.workers.dev')
      .then(res => res.json())
      .then(data => {
        // If data is an object with numeric keys, convert to array
        const postsArray = Array.isArray(data) ? data : Object.values(data)
        setPosts(postsArray)
      })
      .catch(err => setError(`Failed to fetch posts: ${err.message}`))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://workers-bun-hono-drizzle.ymlik24.workers.dev/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      if (!res.ok) throw new Error('Failed to add post')
      const data = await res.json();
      const newPost = Array.isArray(data) ? data[0] : data;
      setPosts(prev => [newPost, ...prev])
      console.log(posts);
      setTitle('')
      setContent('')
    } catch (err) {
      setError('Failed to add post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>


        
        <form onSubmit={handleSubmit} style={{ marginBottom: 0 }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>Add Post</button>
        </form>
        
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            margin: '16px 0'
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: '4px solid #61dafb',
              borderTop: '4px solid #222',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: 0 }}>
            {[...posts]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(post => (
                <li
                  key={`${post.id}-${post.timestamp}`}
                  style={{
                    marginBottom: 10,
                    padding: 16,
                    border: '1px solid #444',
                    borderRadius: 8,
                    background: '#222',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <h5 style={{ margin: '0 0 6px 0', color: '#61dafb' }}>{post.title}</h5>
                  <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>{post.content}</p>
                  <div style={{ fontSize: 10, color: '#aaa' }}>
                    <span>Posted at: {post.timestamp}</span>
                  </div>
                </li>
              ))}
          </ul>
        )}
    </div>
  )
}
