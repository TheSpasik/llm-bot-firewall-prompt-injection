import { useEffect, useState } from 'react';
import { getOllamaStatus } from '../api.js';

function OllamaStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStatus() {
    setLoading(true);
    const data = await getOllamaStatus();
    setStatus(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Ollama Status</h2>
        <button onClick={fetchStatus} className="secondary-button">Refresh</button>
      </div>

      {loading && <p>Checking Ollama availability...</p>}
      {status && (
        <div className="status-card">
          <div><strong>Available:</strong> {status.available ? 'Yes' : 'No'}</div>
          <div><strong>Model:</strong> {status.model}</div>
          <div><strong>Host:</strong> {status.host}</div>
          {status.error && <div className="warning-box">Error: {status.error}</div>}
          {status.warning && <div className="note-box">{status.warning}</div>}
        </div>
      )}
    </section>
  );
}

export default OllamaStatus;
