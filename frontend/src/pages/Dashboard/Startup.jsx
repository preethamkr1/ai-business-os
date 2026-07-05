import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './Startup.css';

const Startup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    business_stage: '',
    monthly_revenue: '',
    marketing_spend: '',
    employees: '',
    target_market: '',
    business_goal: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tenant_id = sessionStorage.getItem('tenant_id');
      await api.post('/business/', { ...formData, tenant_id });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="startup-container">
      <div className="startup-card panel">
        <div className="startup-header">
          <h2>Startup Mode</h2>
          <p>Let AI agents analyze your business profile to generate a growth strategy.</p>
        </div>
        
        <form className="startup-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" name="company_name" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Industry</label>
              <input type="text" name="industry" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Business Stage</label>
              <input type="text" name="business_stage" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Target Market</label>
              <input type="text" name="target_market" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Monthly Revenue</label>
              <input type="number" name="monthly_revenue" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Marketing Spend</label>
              <input type="number" name="marketing_spend" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Employees</label>
              <input type="number" name="employees" onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Business Goal</label>
            <textarea name="business_goal" onChange={handleChange} required rows={3}></textarea>
          </div>

          <button type="submit" className="auth-btn analyze-btn" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Business'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Startup;
