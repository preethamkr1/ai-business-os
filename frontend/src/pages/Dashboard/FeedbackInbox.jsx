import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './FeedbackInbox.css';
import { MessageSquare, AlertCircle, ShieldAlert, CheckCircle, Activity, User } from 'lucide-react';

const FeedbackInbox = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ customer_name: '', feedback_text: '', source: 'App' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tenant_id = sessionStorage.getItem('tenant_id');
      const res = await api.get(`/feedback/${tenant_id}`);
      setFeedbacks(res.feedback || []);
      if (res.feedback && res.feedback.length > 0) {
        setSelected(res.feedback[0]);
      }
    } catch (err) {
      console.error("Failed to fetch feedback", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.feedback_text) return;
    setSubmitting(true);
    try {
      const tenant_id = sessionStorage.getItem('tenant_id');
      await api.post('/feedback/', { ...newFeedback, tenant_id });
      setIsModalOpen(false);
      setNewFeedback({ customer_name: '', feedback_text: '', source: 'App' });
      await fetchData();
    } catch (err) {
      console.error("Failed to submit feedback", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'success';
    if (sentiment === 'Negative') return 'danger';
    return 'warning';
  };

  return (
    <div className="feedback-container">
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Simulate Incoming Feedback</h3>
            <form onSubmit={handleSubmitFeedback}>
              <div className="form-group">
                <label>Customer Name</label>
                <input type="text" value={newFeedback.customer_name} onChange={e => setNewFeedback({...newFeedback, customer_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Source</label>
                <select value={newFeedback.source} onChange={e => setNewFeedback({...newFeedback, source: e.target.value})}>
                  <option value="App">App</option>
                  <option value="Website">Website</option>
                  <option value="Email">Email</option>
                  <option value="Survey">Survey</option>
                </select>
              </div>
              <div className="form-group">
                <label>Feedback Message</label>
                <textarea rows="4" value={newFeedback.feedback_text} onChange={e => setNewFeedback({...newFeedback, feedback_text: e.target.value})} required></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={submitting}>{submitting ? 'Analyzing via AI...' : 'Submit Feedback'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="feedback-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Customer Support & Feedback</h2>
          <p>Closed-Loop AI Customer Recovery System: Listen → Understand → Assign → Supervise → Rectify → Resolve → Learn</p>
        </div>
        <button className="btn-simulate" onClick={() => setIsModalOpen(true)}>+ Simulate Feedback</button>
      </div>

      <div className="feedback-kpis">
        <div className="fkpi-card">
          <MessageSquare className="fkpi-icon" />
          <div className="fkpi-info">
            <span className="fkpi-label">Total Feedback</span>
            <span className="fkpi-val">{feedbacks.length}</span>
          </div>
        </div>
        <div className="fkpi-card warning">
          <AlertCircle className="fkpi-icon text-warning" />
          <div className="fkpi-info">
            <span className="fkpi-label">Negative Feedback</span>
            <span className="fkpi-val">{feedbacks.filter(f => f.analysis?.sentiment === 'Negative').length}</span>
          </div>
        </div>
        <div className="fkpi-card danger">
          <ShieldAlert className="fkpi-icon text-danger" />
          <div className="fkpi-info">
            <span className="fkpi-label">CEO Escalations</span>
            <span className="fkpi-val">{feedbacks.filter(f => f.analysis?.ceo_intervention).length}</span>
          </div>
        </div>
        <div className="fkpi-card success">
          <CheckCircle className="fkpi-icon text-success" />
          <div className="fkpi-info">
            <span className="fkpi-label">Resolved</span>
            <span className="fkpi-val">0</span>
          </div>
        </div>
      </div>

      <div className="feedback-content">
        <div className="feedback-list panel">
          <h3>Unified Inbox</h3>
          {loading ? (
            <p className="loading-text">Loading inbox...</p>
          ) : (
            <div className="f-list">
              {feedbacks.map((item, i) => (
                <div 
                  key={i} 
                  className={`f-item ${selected?._id === item._id ? 'selected' : ''}`}
                  onClick={() => setSelected(item)}
                >
                  <div className="f-item-header">
                    <span className="f-author"><User size={14}/> {item.customer_name}</span>
                    <span className={`f-sentiment ${getSentimentColor(item.analysis?.sentiment)}`}>
                      {item.analysis?.sentiment || 'Unknown'}
                    </span>
                  </div>
                  <p className="f-preview">{item.feedback_text.substring(0, 60)}...</p>
                  <div className="f-item-footer">
                    <span className="f-source">{item.source}</span>
                    <span className="f-time">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {feedbacks.length === 0 && <p className="empty-text">No feedback received yet.</p>}
            </div>
          )}
        </div>

        <div className="feedback-details">
          {selected ? (
            <>
              <div className="panel detail-panel">
                <div className="detail-header">
                  <h3>Message Details</h3>
                  <span className="status-badge active">{selected.status}</span>
                </div>
                <div className="message-box">
                  <p><strong>From:</strong> {selected.customer_name} ({selected.source})</p>
                  <p><strong>Date:</strong> {new Date(selected.timestamp).toLocaleString()}</p>
                  <div className="message-body">
                    {selected.feedback_text}
                  </div>
                </div>
              </div>

              <div className="panel ai-analysis-panel">
                <h3>AI Analysis</h3>
                <div className="analysis-grid">
                  <div className="a-item">
                    <span className="a-label">Category</span>
                    <span className="a-val">{selected.analysis?.category}</span>
                  </div>
                  <div className="a-item">
                    <span className="a-label">Priority</span>
                    <span className={`a-val priority-${selected.analysis?.priority?.toLowerCase()}`}>{selected.analysis?.priority}</span>
                  </div>
                  <div className="a-item">
                    <span className="a-label">Assigned Agent</span>
                    <span className="a-val">{selected.analysis?.assigned_agent}</span>
                  </div>
                  <div className="a-item">
                    <span className="a-label">CEO Intervention</span>
                    <span className={`a-val ${selected.analysis?.ceo_intervention ? 'text-danger' : 'text-success'}`}>
                      {selected.analysis?.ceo_intervention ? 'Required' : 'Not Required'}
                    </span>
                  </div>
                </div>
                <div className="corrective-action">
                  <h4>Recommended Corrective Action</h4>
                  <p>{selected.analysis?.corrective_action}</p>
                </div>
                
                {selected.analysis?.ceo_intervention && (
                  <div className="ceo-panel">
                    <h4>CEO Orchestrator Required</h4>
                    <p>This issue requires executive approval before the {selected.analysis?.assigned_agent} can execute the resolution.</p>
                    <div className="ceo-actions">
                      <button className="btn-approve">Approve Action</button>
                      <button className="btn-escalate">Request Investigation</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="panel empty-detail">
              <Activity size={48} className="text-muted" />
              <p>Select a feedback message to view AI analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackInbox;
