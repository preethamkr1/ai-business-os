import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './Agents.css';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assuming GET /agents exists, if not we simulate it
    const fetchAgents = async () => {
      try {
        const tenant_id = sessionStorage.getItem('tenant_id');
        const result = await api.get(`/agents/${tenant_id}`);
        setAgents(result.agents || []);
      } catch (err) {
        setAgents([
          { name: 'Orion', status: 'Active', desc: 'Data Analytics Engine' },
          { name: 'Athena', status: 'Active', desc: 'Marketing Optimizer' },
          { name: 'Hermes', status: 'Active', desc: 'Ad Budget Allocation' },
          { name: 'Apollo', status: 'Active', desc: 'Growth Strategy' },
          { name: 'Argus', status: 'Active', desc: 'Risk Monitoring' },
          { name: 'CEO Copilot', status: 'Active', desc: 'Executive Assistant' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <div>Loading agents...</div>;

  return (
    <div className="agents-view">
      <div className="agents-header">
        <h2>Active Agents</h2>
        <p>Your AI workforce operating in the background.</p>
      </div>
      
      <div className="agents-grid">
        {agents.map((agent, i) => (
          <div key={i} className="agent-card">
            <div className="agent-card-header">
              <h3>{agent.name}</h3>
              <span className={`status-badge ${agent.status.toLowerCase()}`}>
                {agent.status}
              </span>
            </div>
            <p className="agent-desc">{agent.desc}</p>
            
            {agent.insights && (
              <div className="agent-insights">
                <h4>Agent Insights</h4>
                <div className="insights-content">
                  {agent.insights}
                </div>
              </div>
            )}
            
            <div className="agent-footer">
              <span className="mono">Last active: Just now</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
