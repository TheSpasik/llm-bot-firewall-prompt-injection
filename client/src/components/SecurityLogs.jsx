import { useEffect, useState } from 'react';
import { getLogs, clearLogs } from '../api.js';

function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    setLoading(true);
    const data = await getLogs();
    setLogs(data);
    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Security Logs</h2>
        <div className="button-row">
          <button onClick={loadLogs} className="secondary-button">Refresh</button>
          <button onClick={async () => { await clearLogs(); loadLogs(); }} className="secondary-button">Clear logs</button>
        </div>
      </div>

      {loading && <p>Loading logs...</p>}
      {!loading && logs.length === 0 && <p>No security logs are recorded yet.</p>}

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Classification</th>
              <th>Message</th>
              <th>Reason</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>{entry.classification}</td>
                <td>{entry.userMessage}</td>
                <td>{entry.reason}</td>
                <td>{entry.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SecurityLogs;
