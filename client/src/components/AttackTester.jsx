import { useState } from 'react';
import { runAttackTests } from '../api.js';

function AttackTester() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleRunTests() {
    setLoading(true);
    const data = await runAttackTests();
    setResult(data);
    setLoading(false);
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <h2>Attack Tester</h2>
        <button onClick={handleRunTests} className="primary-button">Run Attack Tests</button>
      </div>

      {loading && <p>Running attack tests...</p>}
      {result && (
        <div className="test-summary">
          <div>Total tests: {result.totalTests}</div>
          <div>Blocked: {result.blocked}</div>
          <div>Missed: {result.missed}</div>
        </div>
      )}

      {result && (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Expected</th>
                <th>Actual</th>
                <th>Detected Pattern</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((row, index) => (
                <tr key={index} className={row.pass ? 'pass-row' : 'fail-row'}>
                  <td>{row.test}</td>
                  <td>{row.expected}</td>
                  <td>{row.actual}</td>
                  <td>{row.detectedPattern || '-'}</td>
                  <td>{row.pass ? 'PASS' : 'FAIL'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AttackTester;
