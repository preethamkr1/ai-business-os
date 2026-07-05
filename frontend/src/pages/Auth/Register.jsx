import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [company_name, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/auth/register', { company_name, email, password });
      login(data);
      navigate('/startup');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-brand">Growth OS</h1>
          <p className="auth-subtitle">Create a new workspace</p>
        </div>
        
        <form className="auth-form" onSubmit={handleRegister}>
          {error && <div className="error-msg" style={{ color: 'var(--color-danger)', fontSize: '0.9rem' }}>{error}</div>}
          <div className="form-group">
            <label htmlFor="company">Company Name</label>
            <input 
              type="text" id="company" 
              placeholder="Acme Corp" 
              value={company_name} onChange={e => setCompanyName(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Work Email</label>
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
