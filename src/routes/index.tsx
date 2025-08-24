import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

type Post = {
  id: number;
  title: string;
  content: string;
  timestamp: string;
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://workers-bun-hono-drizzle.ymlik24.workers.dev")
      .then((res) => res.json())
      .then((data) => {
        // If data is an object with numeric keys, convert to array
        const postsArray = Array.isArray(data) ? data : Object.values(data);
        setPosts(postsArray);
      })
      .catch((err) => setError(`Failed to fetch posts: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://workers-bun-hono-drizzle.ymlik24.workers.dev/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        }
      );
      if (!res.ok) throw new Error("Failed to add post");
      const data = await res.json();
      const newPost = Array.isArray(data) ? data[0] : data;
      setPosts((prev) => [newPost, ...prev]);
      console.log(posts);
      setTitle("");
      setContent("");
    } catch (err) {
      setError("Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="App-main">       
        <div className="App-content">
          <div className="content-wrapper">
            <header className="app-header">
              <h1 className="app-title">My Blog</h1>
              <p className="app-subtitle">Share your thoughts with the world</p>
            </header>

            <form onSubmit={handleSubmit} className="post-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input title-input"
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Share your story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="form-input content-input"
                  rows={3}
                />
              </div>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? "Posting..." : "Share Post"}
              </button>
            </form>

            {loading && (
              <div className="loading-container">
                <div className="spinner" />
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {!loading && !error && (
              <div className="posts-container">
                <h2 className="posts-title">Recent Posts</h2>
                <div className="posts-grid">
                  {[...posts]
                    .sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    )
                    .map((post) => (
                      <article
                        key={`${post.id}-${post.timestamp}`}
                        className="post-card"
                      >
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-content">{post.content}</p>
                        <div className="post-meta">
                          <time className="post-timestamp">
                            {new Date(post.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}