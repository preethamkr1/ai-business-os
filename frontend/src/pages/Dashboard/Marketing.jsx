import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Marketing.css';
import { Megaphone, DollarSign, TrendingUp, Save } from 'lucide-react';

const Marketing = () => {
  const [platforms, setPlatforms] = useState([
    { platform: 'Meta (Instagram/Facebook)', ad_spend: 0, ad_revenue: 0, sales_increased: 0 },
    { platform: 'Google Ads', ad_spend: 0, ad_revenue: 0, sales_increased: 0 }
  ]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tenant_id = sessionStorage.getItem('tenant_id') || 'default';
      const res = await api.get(`/marketing-data/${tenant_id}`);
      if (res.platforms && res.platforms.length > 0) {
        setPlatforms(res.platforms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...platforms];
    updated[index][field] = Number(value) || 0;
    setPlatforms(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tenant_id = sessionStorage.getItem('tenant_id') || 'default';
      await api.post('/marketing-data/', { tenant_id, platforms });
      alert("Marketing Data Saved successfully! The 5 AI agents will now analyze this data in the background.");
    } catch (err) {
      console.error(err);
      alert("Error saving marketing data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="marketing-container">
      <div className="marketing-header">
        <h2>Marketing Performance Tracker</h2>
        <p>Input real-time ad spend and revenue data across your major platforms. This data will be piped directly into the orchestration engine, allowing all 5 Agents to adjust their insights based on your exact ROAS.</p>
      </div>

      <div className="marketing-grid">
        {platforms.map((plat, idx) => (
          <div className="marketing-card panel" key={plat.platform}>
            <div className="mc-header">
              <Megaphone size={24} className="mc-icon" />
              <h3>{plat.platform}</h3>
            </div>
            
            <div className="mc-body">
              <div className="mc-input-group">
                <label>
                  <DollarSign size={14} /> Total Ad Spend ($)
                </label>
                <input 
                  type="number" 
                  value={plat.ad_spend}
                  onChange={(e) => handleUpdate(idx, 'ad_spend', e.target.value)}
                />
              </div>

              <div className="mc-input-group">
                <label>
                  <DollarSign size={14} /> Attributed Ad Revenue ($)
                </label>
                <input 
                  type="number" 
                  value={plat.ad_revenue}
                  onChange={(e) => handleUpdate(idx, 'ad_revenue', e.target.value)}
                />
              </div>

              <div className="mc-input-group">
                <label>
                  <TrendingUp size={14} /> Number of Sales Increased
                </label>
                <input 
                  type="number" 
                  value={plat.sales_increased}
                  onChange={(e) => handleUpdate(idx, 'sales_increased', e.target.value)}
                />
              </div>
            </div>

            <div className="mc-footer">
              <div className="roas-badge">
                ROAS: {plat.ad_spend > 0 ? (plat.ad_revenue / plat.ad_spend).toFixed(2) : '0.00'}x
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="marketing-actions">
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save & Sync with AI Agents'}
        </button>
      </div>
    </div>
  );
};

export default Marketing;
