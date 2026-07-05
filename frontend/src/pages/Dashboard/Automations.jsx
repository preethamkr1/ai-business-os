import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import './Automations.css';

const Automations = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);
    setCsvData(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenant_id', sessionStorage.getItem('tenant_id'));

    try {
      const response = await api.postFormData('/upload/csv', formData);
      setCsvData(response);
      setStatus('success');
      setFile(null);
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="growth-mode">
      <div className="growth-header">
        <h2>Growth Mode</h2>
        <p>Upload your latest CSV data to trigger AI analysis and dashboard updates.</p>
      </div>

      <div className="upload-container panel">
        <div className="upload-box">
          <UploadCloud size={48} className="upload-icon" />
          <h3>Upload CSV Data</h3>
          <p className="upload-desc">Sales, Marketing, or CRM exports supported.</p>
          
          <input 
            type="file" 
            id="csv-upload" 
            accept=".csv" 
            onChange={handleFileChange} 
            className="file-input"
          />
          <label htmlFor="csv-upload" className="file-label">
            {file ? file.name : 'Select CSV File'}
          </label>

          <button 
            className="auth-btn upload-btn" 
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? 'Processing...' : 'Upload CSV'}
          </button>

          {status === 'success' && csvData && (
            <div className="csv-insights">
              <div className="status-msg success">
                <CheckCircle size={16} />
                Successfully analyzed {csvData.filename}!
              </div>
              <div className="insights-card">
                <p><strong>Rows:</strong> {csvData.rows}</p>
                <p><strong>Columns detected:</strong> {csvData.columns.join(', ')}</p>
                <div className="preview-table">
                  <p><strong>Data Preview (first 2 rows):</strong></p>
                  <pre>{JSON.stringify(csvData.preview.slice(0, 2), null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="status-msg error">
              <AlertCircle size={16} />
              Failed to upload CSV. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Automations;
