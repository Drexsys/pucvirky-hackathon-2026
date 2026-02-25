import React, { useState } from 'react';
import { importOrdersCsv } from '../../api/orders';
import './ImportPage.css';

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await importOrdersCsv(file);
      setResult(data);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="import-page">
      <h1>Імпорт замовлень з CSV</h1>
      <form onSubmit={handleSubmit} className="import-form">
        <div className="file-input-wrapper">
          <label htmlFor="csv-file" className="file-label">
            📁 Оберіть CSV файл
          </label>
          <input
            type="file"
            id="csv-file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            required
          />
          {file && <span className="file-name">Обрано: {file.name}</span>}
        </div>

        <button type="submit" disabled={loading || !file}>
          {loading ? 'Імпортування...' : 'Імпортувати'}
        </button>
      </form>

      {result && (
        <div className={`import-result ${result.error ? 'error' : 'success'}`}>
          {result.error ? (
            <p>❌ Помилка: {result.error}</p>
          ) : (
            <div>
              <p className="result-title">✓ Імпорт завершено!</p>
              <div className="result-stats">
                <div className="stat-item">
                  <span className="stat-value">{result.importedCount}</span>
                  <span className="stat-label">Імпортовано</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{result.skippedCount}</span>
                  <span className="stat-label">Пропущено</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{result.totalCount}</span>
                  <span className="stat-label">Всього рядків</span>
                </div>
              </div>
              {result.skippedCount > 0 && (
                <p className="warning-text">
                  ⚠️ Деякі рядки пропущено через помилки форматування
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

