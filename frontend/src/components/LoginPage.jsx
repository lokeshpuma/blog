import './LoginPage.css';

function LoginPage({ onLogin, authMode, setAuthMode, authUsername, setAuthUsername, authPassword, setAuthPassword, authLoading, error }) {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-logo">Blog Platform</h1>
          <p className="login-subtitle">Share your thoughts with the world</p>
        </div>

        <div className="glass-panel glass-panel--form auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authMode === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => {
                setAuthMode('login');
              }}
            >
              Login
            </button>
            <button
              className={`auth-tab ${authMode === 'signup' ? 'auth-tab--active' : ''}`}
              onClick={() => {
                setAuthMode('signup');
              }}
            >
              Sign Up
            </button>
          </div>

          <h2 className="auth-title">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {authMode === 'login' 
              ? 'Login to access your blog dashboard' 
              : 'Join our community of writers'}
          </p>

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

          <form onSubmit={onLogin} className="auth-form">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                className="input-field"
                disabled={authLoading}
                autoFocus
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="input-field"
                disabled={authLoading}
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="gradient-button w-full"
            >
              {authLoading ? (
                <>
                  <span className="spinner-small" />
                  {authMode === 'login' ? 'Logging in...' : 'Signing up...'}
                </>
              ) : (
                authMode === 'login' ? 'Login' : 'Sign Up'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

