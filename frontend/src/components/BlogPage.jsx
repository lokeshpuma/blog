import { useEffect, useMemo, useState } from 'react';
import '../App.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blogs`;

function BlogPage({ token, user, onLogout }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Fetch all blogs from backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(API_URL, {
        headers,
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch blogs: ${res.status}`);
      }
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while fetching blogs');
    } finally {
      setLoading(false);
    }
  };

  const countWords = (text = '') => text.trim().split(/\s+/).filter(Boolean).length;

  const metrics = useMemo(() => {
    if (!blogs.length) {
      return {
        totalPosts: 0,
        totalWords: 0,
        avgLength: 0,
      };
    }

    const totalWords = blogs.reduce((acc, blog) => acc + countWords(blog.content), 0);
    return {
      totalPosts: blogs.length,
      totalWords,
      avgLength: Math.round(totalWords / blogs.length),
    };
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    let list = [...blogs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (blog) =>
          blog.title.toLowerCase().includes(q) || blog.content.toLowerCase().includes(q)
      );
    }

    if (activeFilter === 'quick') {
      list = list.filter((blog) => countWords(blog.content) <= 120);
    }

    if (activeFilter === 'deep') {
      list = list.filter((blog) => countWords(blog.content) > 200);
    }

    return list;
  }, [activeFilter, blogs, searchQuery]);

  const highlightBlog = filteredBlogs[0] || blogs[0];

  const filterOptions = [
    { label: 'All posts', value: 'all' },
    { label: 'Quick reads', value: 'quick' },
    { label: 'Deep dives', value: 'deep' },
  ];

  const scrollToCreate = () => {
    document.getElementById('create-blog-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || `Failed to create blog: ${res.status}`);
      }

      setTitle('');
      setContent('');
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while creating blog');
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEdit = (blog) => {
    setEditingId(blog._id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  };

  // Save edited blog
  const handleEditBlog = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || `Failed to update blog: ${res.status}`);
      }

      cancelEdit();
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while updating blog');
    } finally {
      setLoading(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || `Failed to delete blog: ${res.status}`);
      }

      await fetchBlogs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while deleting blog');
    } finally {
      setLoading(false);
    }
  };

  // Check if user owns the blog
  const isOwnBlog = (blog) => {
    return token && user && blog.author && (
      blog.author._id === user.id || 
      blog.author === user.id ||
      (typeof blog.author === 'object' && blog.author._id === user.id)
    );
  };

  return (
    <div className="app-shell">
      <div className="app-container">
        {/* User Header */}
        <div className="auth-header">
          <div className="user-info">
            <span className="user-greeting">Welcome, <strong>{user.username}</strong></span>
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="hero-layout">
          <div className="glass-panel glass-panel--form hero-card">
            <p className="hero-pill">Creator Studio</p>
            <h1 className="hero-title">Shape bold ideas into beautiful reads.</h1>
            <p className="hero-subtitle">
              Draft quick thoughts, polish longer essays, and keep your writing pipeline tidy
              with instant editing tools and gorgeous presentation.
            </p>
            <div className="hero-actions">
              <button onClick={scrollToCreate} className="gradient-button">
                Start Writing
              </button>
              <button
                className="neutral-outline-button"
                onClick={() => document.getElementById('blog-list')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Posts
              </button>
            </div>
            <div className="hero-meta">
              <div>
                <p className="hero-meta-label">Writers online</p>
                <p className="hero-meta-value">24</p>
              </div>
              <div>
                <p className="hero-meta-label">Avg. publish time</p>
                <p className="hero-meta-value">3m</p>
              </div>
            </div>
          </div>
          <div className="hero-highlight glass-panel">
            <p className="hero-highlight-label">Currently trending</p>
            {highlightBlog ? (
              <>
                <h3 className="hero-highlight-title">{highlightBlog.title}</h3>
                <p className="hero-highlight-excerpt">
                  {highlightBlog.content.slice(0, 220)}
                  {highlightBlog.content.length > 220 ? '…' : ''}
                </p>
                <div className="hero-highlight-meta">
                  <span>{countWords(highlightBlog.content)} words</span>
                  {highlightBlog.author && (
                    <span>By {typeof highlightBlog.author === 'object' ? highlightBlog.author.username : 'Unknown'}</span>
                  )}
                </div>
              </>
            ) : (
              <div className="hero-highlight-empty">
                <p>No posts yet</p>
                <p className="hero-highlight-helper">Create your first idea to spotlight it here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metric-row">
          <div className="metric-card">
            <p>Total posts</p>
            <h4>{metrics.totalPosts}</h4>
            <span>Across every category</span>
          </div>
          <div className="metric-card">
            <p>Words published</p>
            <h4>{metrics.totalWords.toLocaleString()}</h4>
            <span>Collective storytelling</span>
          </div>
          <div className="metric-card">
            <p>Average length</p>
            <h4>{metrics.avgLength || 0} words</h4>
            <span>Perfect for mindful reading</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <div className="error-alert-inner">
              <svg className="error-alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="error-alert-text">{error}</span>
            </div>
          </div>
        )}

        {/* Create Section */}
        <section id="create-blog-form" className="section-block">
          <div className="glass-panel glass-panel--form">
            <h2 className="section-heading">
              <span>Create New Blog</span>
            </h2>
            <form onSubmit={handleCreateBlog} className="blog-form">
              <div>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  disabled={loading}
                />
              </div>
              <div>
                <textarea
                  placeholder="Share your thoughts..."
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="input-field textarea-field"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="gradient-button w-full"
              >
                {loading ? (
                  <>
                    <span className="spinner-small" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="icon-small" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Add Blog
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Blogs List Section */}
        <section id="blog-list">
          <div className="section-block">
            <div className="section-header">
              <h2 className="section-heading">
                <span>All Blogs</span>
                <span className="section-pill">{filteredBlogs.length}</span>
              </h2>
              <div className="search-box">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35m0-6.3a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or keywords..."
                />
              </div>
            </div>
            <div className="filter-chips">
              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  className={`filter-chip ${activeFilter === filter.value ? 'filter-chip--active' : ''}`}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {loading && blogs.length === 0 && (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p className="loading-text">Loading blogs...</p>
            </div>
          )}

          {!loading && filteredBlogs.length === 0 && (
            <div className="blog-empty">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="blog-empty-title">No blogs yet</h3>
              <p className="blog-empty-text">Get started by creating your first blog post above</p>
              <button
                onClick={() => document.getElementById('create-blog-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="primary-cta"
              >
                Create First Blog
              </button>
            </div>
          )}

          <div className="blog-grid">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className={`blog-card ${editingId === blog._id ? 'blog-card--editing' : ''}`}
              >
                {editingId === blog._id ? (
                  <div className="blog-card-content">
                    <form onSubmit={handleEditBlog} className="blog-edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-field"
                        autoFocus
                      />
                      <textarea
                        rows={4}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="input-field textarea-field"
                      />
                      <div className="blog-edit-actions">
                        <button
                          type="submit"
                          disabled={loading}
                          className="edit-button"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="neutral-outline-button"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <>
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">{blog.title}</h3>
                      <p className="blog-card-excerpt">{blog.content}</p>
                      {blog.author && (
                        <p className="blog-author">
                          By <strong>{typeof blog.author === 'object' ? blog.author.username : 'Unknown'}</strong>
                        </p>
                      )}
                    </div>
                    {isOwnBlog(blog) && (
                      <div className="blog-card-actions">
                        <button
                          onClick={() => startEdit(blog)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="danger-outline-button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default BlogPage;

