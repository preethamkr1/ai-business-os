import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, DollarSign, Target, Heart, Search, Calendar, Bell, ShieldAlert, Zap, BookOpen, Send, User, Bot, Megaphone } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { api } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [marketingData, setMarketingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { type: 'bot', text: 'Hello! I am your AI Copilot. Upload your data or connect your marketing platforms to start getting insights.', time: 'Just now' }
  ]);

  const handleKPIClick = (label, value) => {
    navigate('/copilot', { state: { autoQuery: `Why is the ${label} at ${value}?` } });
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const tenant_id = sessionStorage.getItem('tenant_id') || 'default';
        const result = await api.get(`/dashboard/${tenant_id}`);
        setData(result);
        
        const mktResult = await api.get(`/marketing-data/${tenant_id}`);
        if (mktResult && mktResult.platforms) {
          setMarketingData(mktResult.platforms);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleChat = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    navigate('/copilot', { state: { autoQuery: chatMsg } });
  };

  const kpis = data || {};

  const miniChartData = Array.from({ length: 15 }, () => ({ val: 0 }));
  
  // Data driven campaigns and charts based on marketingData
  let campaigns = [];
  let mainChartData = [];
  
  if (marketingData.length > 0) {
    campaigns = marketingData.map(p => ({
      name: p.platform,
      spend: `₹${p.ad_spend.toLocaleString()}`,
      ctr: 'N/A',
      roas: p.ad_spend > 0 ? (p.ad_revenue / p.ad_spend).toFixed(2) : '0.0',
      status: (p.ad_revenue / p.ad_spend) > 3 ? 'Scaling' : (p.ad_revenue / p.ad_spend) > 1.5 ? 'Good' : 'Stop'
    }));
    
    mainChartData = marketingData.map(p => ({
      name: p.platform.substring(0, 8),
      spend: p.ad_spend,
      roas: p.ad_spend > 0 ? parseFloat((p.ad_revenue / p.ad_spend).toFixed(2)) : 0
    }));
  } else {
    // Fallback if no marketing data is saved yet
    campaigns = [
      { name: 'No Data Yet', spend: '₹0', ctr: '0%', roas: '0.0', status: 'Stop' }
    ];
    mainChartData = [
      { name: 'Meta', spend: 0, roas: 0 },
      { name: 'Google', spend: 0, roas: 0 }
    ];
  }

  const revenueOpp = marketingData.reduce((acc, curr) => acc + (curr.ad_revenue || 0), 0);
  const revenueOppFormatted = revenueOpp > 100000 
    ? `₹ ${(revenueOpp/100000).toFixed(2)}L` 
    : revenueOpp > 0 ? `₹ ${revenueOpp.toLocaleString()}` : '₹ 0';

  let userName = 'User';
  try {
    const token = sessionStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.email) {
        userName = payload.email.split('@')[0];
      }
    }
  } catch(e) {}

  return (
    <div className="dash-root">
      <div className="dash-topbar">
        <div className="dash-title">
          <h2>Overview Dashboard</h2>
          <p>Welcome back, {userName} 👋</p>
        </div>
        <div className="dash-controls">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search anything..." />
          </div>
          <div className="date-picker">
            <Calendar size={16} />
            <span>May 1 – May 31, 2026</span>
          </div>
          <div className="noti-bell">
            <Bell size={20} />
            <span className="noti-dot"></span>
          </div>
          <div className="user-profile">
            <div className="avatar"><User size={20} /></div>
            <div className="user-info">
              <span className="name">{userName}</span>
              <span className="role">CEO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-kpi-row primary-row">
        {[
          { label: 'Business Health Score', icon: <Heart size={16} color="#B573F8"/>, val: kpis.business_health_score || 0, max: '/100', trend: kpis.business_health_score ? '↑ 12%' : '0%', color: '#B573F8' },
          { label: 'Growth Score', icon: <TrendingUp size={16} color="#4C7DFF"/>, val: kpis.growth_score || 0, max: '/100', trend: kpis.growth_score ? '↑ 8%' : '0%', color: '#4C7DFF' },
          { label: 'Revenue Opportunity', icon: <DollarSign size={16} color="#F5A623"/>, val: revenueOppFormatted, max: '', trend: revenueOpp > 0 ? '↑ 15%' : '0%', color: '#F5A623' },
          { label: 'Lead Score', icon: <Target size={16} color="#B573F8"/>, val: kpis.lead_score || 0, max: '/100', trend: kpis.lead_score ? '↑ 10%' : '0%', color: '#B573F8' },
          { label: 'Customer Health', icon: <User size={16} color="#2ECC8F"/>, val: kpis.customer_health_score || 0, max: '/100', trend: kpis.customer_health_score ? '↑ 9%' : '0%', color: '#2ECC8F' }
        ].map((k, i) => (
          <div className="kpi-box clickable" key={i} onClick={() => handleKPIClick(k.label, k.val)}>
            <div className="kbox-header">
              {k.icon} <span>{k.label}</span>
            </div>
            <div className="kbox-val">
              {k.val}<span className="kbox-max">{k.max}</span>
            </div>
            <div className="kbox-trend" style={{ color: '#2ECC8F' }}>
              {k.trend} <span style={{ color: 'var(--color-text-muted)' }}></span>
            </div>
            <div className="kbox-chart">
              <ResponsiveContainer width="100%" height={30}>
                <LineChart data={miniChartData}>
                  <Line type="monotone" dataKey="val" stroke={k.color} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-kpi-row secondary-row">
        <div className="kpi-box clickable" onClick={() => handleKPIClick('Market Readiness', kpis.market_readiness_score || 0)}>
          <div className="kbox-header">
            <Activity size={16} color="#B573F8"/> <span>Market Readiness</span>
          </div>
          <div className="kbox-val">{kpis.market_readiness_score || 0}<span className="kbox-max">/100</span></div>
          <div className="kbox-trend" style={{ color: '#B573F8' }}>{kpis.market_readiness_score ? '↑ 6%' : '0%'} <span style={{ color: 'var(--color-text-muted)' }}></span></div>
          <div className="kbox-chart">
            <ResponsiveContainer width="100%" height={30}>
              <LineChart data={miniChartData}><Line type="monotone" dataKey="val" stroke="#B573F8" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="kpi-box clickable" onClick={() => handleKPIClick('AI Recommendations', kpis.recommendations ? kpis.recommendations.length : 0)}>
          <div className="kbox-header">
            <Zap size={16} color="#4C7DFF"/> <span>AI Recommendations</span>
          </div>
          <div className="kbox-val">{kpis.recommendations ? kpis.recommendations.length : 0}</div>
          <div className="kbox-badges">
            <span className="badge-new">New</span>
            <span className="badge-link">View all →</span>
          </div>
          <div className="kbox-chart">
            <ResponsiveContainer width="100%" height={30}>
              <LineChart data={miniChartData}><Line type="monotone" dataKey="val" stroke="#4C7DFF" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="kpi-box clickable" onClick={() => handleKPIClick('Risk Alerts', kpis.risk_score || 0)}>
          <div className="kbox-header">
            <ShieldAlert size={16} color="#FF4C4C"/> <span>Risk Alerts</span>
          </div>
          <div className="kbox-val">{kpis.risk_score || 0}</div>
          <div className="kbox-badges">
            <span className="badge-danger">High Priority</span>
            <span className="badge-link text-danger">View all →</span>
          </div>
          <div className="kbox-chart">
            <ResponsiveContainer width="100%" height={30}>
              <LineChart data={miniChartData}><Line type="monotone" dataKey="val" stroke="#FF4C4C" strokeWidth={2} dot={false} /></LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="kpi-box exec-summary-box">
          <div className="kbox-header">
            <BookOpen size={16} color="#B573F8"/> <span>Executive Summary</span>
          </div>
          <p className="exec-text">
            {kpis.executive_summary || "Ad spend is delivering 18% higher ROAS. Scale 3 campaigns, reduce spend on 2 underperforming ad sets. 12 high-quality leads awaiting follow-up."}
          </p>
          <span className="badge-link" style={{ marginTop: 'auto', color: '#B573F8' }}>View Full Report →</span>
        </div>
      </div>

      <div className="dash-main-row">
        <div className="panel chart-panel">
          <div className="panel-header">
            <h3>Spend vs ROAS</h3>
            <div className="legend">
              <span className="leg-item"><span className="dot blue"></span> Spend (₹)</span>
              <span className="leg-item"><span className="dot green"></span> ROAS</span>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={mainChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#22262C" vertical={false} />
                <XAxis dataKey="name" stroke="#9BA1A6" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" stroke="#9BA1A6" axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}K`} />
                <YAxis yAxisId="right" orientation="right" stroke="#9BA1A6" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#14171C', borderColor: '#22262C' }} />
                <Bar yAxisId="left" dataKey="spend" fill="#4C7DFF" barSize={12} radius={[4,4,0,0]} />
                <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#2ECC8F" strokeWidth={2} dot={{ r: 4, fill: '#2ECC8F' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel table-panel">
          <div className="panel-header">
            <h3>Top Campaigns</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Spend (₹)</th>
                  <th>CTR</th>
                  <th>ROAS</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.spend}</td>
                    <td>{c.ctr}</td>
                    <td>{c.roas}</td>
                    <td><span className={`status-tag ${c.status.toLowerCase()}`}>{c.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="dash-bottom-row">
        <div className="panel rec-panel">
          <div className="panel-header">
            <h3><Megaphone size={16}/> Recent Recommendations</h3>
          </div>
          <ul className="rec-list">
            {kpis.recommendations && kpis.recommendations.length > 0 ? (
              kpis.recommendations.map((rec, i) => (
                <li key={i}><span>• {rec}</span></li>
              ))
            ) : (
              <li><span className="text-muted">No recommendations generated yet. Connect your data platforms first.</span></li>
            )}
          </ul>
          <div className="panel-footer"><span className="badge-link">View all recommendations →</span></div>
        </div>

        <div className="panel alert-panel">
          <div className="panel-header">
            <h3><ShieldAlert size={16} className="text-warning"/> Latest Alerts</h3>
          </div>
          <ul className="rec-list">
            {kpis.alerts && kpis.alerts.length > 0 ? (
              kpis.alerts.map((alert, i) => (
                <li key={i}><span className="text-warning">⚠ {alert}</span></li>
              ))
            ) : (
              <li><span className="text-muted">No risk alerts detected. Everything looks good.</span></li>
            )}
          </ul>
          <div className="panel-footer"><span className="badge-link text-warning">View all alerts →</span></div>
        </div>

        <div className="panel copilot-mini-panel">
          <div className="panel-header">
            <h3><Bot size={16} color="#4C7DFF"/> AI Copilot</h3>
          </div>
          <div className="mini-chat-history">
            {chatHistory.map((m, i) => (
              <div key={i} className={`mini-msg ${m.type}`}>
                <div className="mini-bubble">{m.text}</div>
                <div className="mini-time">{m.time}</div>
              </div>
            ))}
          </div>
          <form className="mini-chat-input" onSubmit={handleChat}>
            <input type="text" placeholder="Ask anything..." value={chatMsg} onChange={e => setChatMsg(e.target.value)} />
            <button type="submit"><Send size={16}/></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
