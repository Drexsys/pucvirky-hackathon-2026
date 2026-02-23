import React, { useState } from 'react';
import { importOrdersCsv } from '../../api/orders';
import './ImportPage.css';

export default function ImportPage() {
  const [csvText, setCsvText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const data = await importOrdersCsv(csvText);
      setResult(data);
      setCsvText('');
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-page">
      <h1>Import Orders from CSV</h1>
      <form onSubmit={handleSubmit} className="import-form">
        <label htmlFor="csv-input">Paste CSV content:</label>
        <textarea
          id="csv-input"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder="customer,product,quantity&#10;John Doe,Widget A,10&#10;Jane Smith,Widget B,5"
          rows={10}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Importing...' : 'Import'}
        </button>
      </form>

      {result && (
        <div className={`import-result ${result.error ? 'error' : 'success'}`}>
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <div>
              <p>✓ Import successful!</p>
              <ul>
                <li>Imported: {result.importedCount}</li>
                <li>Skipped: {result.skippedCount}</li>
                <li>Total lines: {result.totalCount}</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

