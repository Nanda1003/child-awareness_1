import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Counselor') {
        navigate('/counselor-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login successful! Redirecting...');
        login(data.user); // Use the context to login
      } else {
        setMessage(data.msg || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo">EduKids</div>
        <button
          className="btn btn-signup-nav"
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </button>
      </header>

      <main className="login-content">
        <div className="card login-card">
          <div className="login-card-header">
            <h1>Welcome Back!</h1>
            <p>Please log in to continue your adventure.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {message && (
              <p
                className={`message ${
                  message.includes('successful') ? 'success-message' : 'error-message'
                }`}
              >
                {message}
              </p>
            )}

            <button type="submit" className="btn btn-login-main">
              Login
            </button>

            <div className="signup-link">
              <p>
                Don't have an account?{' '}
                <RouterLink to="/signup" className="link">
                  Sign Up
                </RouterLink>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
