import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      login(data);
      navigate('/startup');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-brand">Growth OS</h1>
          <p className="auth-subtitle">Welcome back to the console</p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div className="error-msg" style={{ color: 'var(--color-danger)', fontSize: '0.9rem' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" id="email" 
              placeholder="you@company.com" 
              value={email} onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" id="password" 
              placeholder="••••••••" 
              value={password} onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/register" className="auth-link">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
