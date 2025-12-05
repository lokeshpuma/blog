import { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import BlogPage from './components/BlogPage';
import './App.css';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api/auth';

function App() {
  // Authentication state - load from localStorage
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user from localStorage and verify token on mount
  useEffect(() => {
    if (token) {
      // If user exists in localStorage but not in state, restore it
      if (!user) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (err) {
            console.error('Failed to parse user from localStorage:', err);
          }
        }
      }
      // Verify token is still valid
      verifyToken();
    }
  }, []);

  // Verify token
  const verifyToken = async () => {
    try {
      const res = await fetch(`${AUTH_API_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Token invalid, clear it
        logout();
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      logout();
    }
  };

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) {
      setError('Username and password are required');
      return;
    }

    if (authUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (authPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setAuthLoading(true);
      setError('');
      const res = await fetch(`${AUTH_API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: authUsername.trim().toLowerCase(),
          password: authPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Save token and user
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthUsername('');
      setAuthPassword('');
      setAuthMode('login');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while signing up');
    } finally {
      setAuthLoading(false);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authPassword.trim()) {
      setError('Username and password are required');
      return;
    }

    try {
      setAuthLoading(true);
      setError('');
      const res = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: authUsername.trim().toLowerCase(),
          password: authPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuthUsername('');
      setAuthPassword('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while logging in');
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthUsername('');
    setAuthPassword('');
    setError('');
  };

  // Handle auth form submission
  const handleAuthSubmit = (e) => {
    if (authMode === 'login') {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  // Show login page if not authenticated, blog page if authenticated
  if (!token || !user) {
    return (
      <LoginPage
        onLogin={handleAuthSubmit}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authUsername={authUsername}
        setAuthUsername={setAuthUsername}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authLoading={authLoading}
        error={error}
      />
    );
  }

  return (
    <BlogPage
      token={token}
      user={user}
      onLogout={logout}
    />
  );
}

export default App;
