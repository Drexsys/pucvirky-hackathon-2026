import React, { useState } from 'react';
import { createOrder, calculateTax } from '../../api/orders';
import './CreateOrderPage.css';

// Утилітна функція для безпечного форматування чисел
const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.' + '0'.repeat(decimals);

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    console.warn(`formatNumber: Invalid number value:`, value);
    return '0.' + '0'.repeat(decimals);
  }

  return num.toFixed(decimals);
};

export default function CreateOrderPage() {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    subtotal: ''
  });
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    // Preview tax calculation if all fields filled
    if (newData.latitude && newData.longitude && newData.subtotal) {
      previewTax(parseFloat(newData.latitude), parseFloat(newData.longitude), parseFloat(newData.subtotal));
    } else {
      setPreview(null);
    }
  };

  const previewTax = async (latitude, longitude, subtotal) => {
    try {
      const taxData = await calculateTax(latitude, longitude, subtotal);
      setPreview(taxData);
    } catch (err) {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Форматування timestamp у формат "YYYY-MM-DD HH:mm:ss"
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

      const payload = {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        subtotal: Math.round(parseFloat(formData.subtotal)), // Backend очікує int
        timestamp: timestamp // Формат: "2026-02-25 10:30:00"
      };

      const order = await createOrder(payload);
      // Зберігаємо дані для відображення перед очищенням
      setResult({ 
        success: true, 
        order,
        savedData: { ...payload }
      });
      setFormData({ latitude: '', longitude: '', subtotal: '' });
      setPreview(null);
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Невідома помилка';
      setResult({
        success: false,
        error: `${errorMsg}. Переконайтеся, що бекенд запущений на порті 8000.`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      <h1>Створити замовлення вручну</h1>
      <form onSubmit={handleSubmit} className="create-order-form">
        <div className="form-group">
          <label htmlFor="latitude">Широта (Latitude):</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="наприклад: 40.7128"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Довгота (Longitude):</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="наприклад: -74.0060"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtotal">Сума без податків (Subtotal):</label>
          <input
            type="number"
            step="0.01"
            id="subtotal"
            name="subtotal"
            value={formData.subtotal}
            onChange={handleChange}
            placeholder="наприклад: 100.00"
            min="0"
            required
          />
        </div>

        {preview && (
          <div className="tax-preview">
            <h4>Попередній розрахунок:</h4>
            <div className="preview-row">
              <span>Subtotal:</span>
              <span className="amount">${formatNumber(preview.subtotal, 2)}</span>
            </div>
            <div className="preview-row highlight">
              <span>Загальна ставка:</span>
              <span className="rate">{formatNumber(parseFloat(preview.composite_tax_rate || 0) * 100, 3)}%</span>
            </div>
            {preview.breakdown && (
              <>
                <div className="breakdown-title">Деталізація:</div>
                {preview.breakdown.state_rate !== undefined && preview.breakdown.state_rate !== null && (
                  <div className="breakdown-row">
                    <span>State:</span>
                    <span>{formatNumber(parseFloat(preview.breakdown.state_rate || 0) * 100, 3)}%</span>
                  </div>
                )}
                {preview.breakdown.county_rate !== undefined && preview.breakdown.county_rate !== null && (
                  <div className="breakdown-row">
                    <span>County:</span>
                    <span>{formatNumber(parseFloat(preview.breakdown.county_rate || 0) * 100, 3)}%</span>
                  </div>
                )}
                {preview.breakdown.city_rate !== undefined && preview.breakdown.city_rate !== null && (
                  <div className="breakdown-row">
                    <span>City:</span>
                    <span>{formatNumber(parseFloat(preview.breakdown.city_rate || 0) * 100, 3)}%</span>
                  </div>
                )}
                {preview.breakdown.special_rates && preview.breakdown.special_rates.length > 0 && (
                  <div className="special-rates">
                    <div className="breakdown-title">Спеціальні ставки:</div>
                    {preview.breakdown.special_rates.map((rate, idx) => (
                      <div key={idx} className="breakdown-row">
                        <span>{rate.name}:</span>
                        <span>{formatNumber(parseFloat(rate.value || 0) * 100, 3)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="preview-row total">
              <span>Податок:</span>
              <span className="tax-amount">${formatNumber(preview.tax_amount, 2)}</span>
            </div>
            <div className="preview-row total">
              <span>Загалом:</span>
              <span className="total-amount">${formatNumber(preview.total_amount, 2)}</span>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading || !preview}>
          {loading ? 'Створення...' : 'Створити замовлення'}
        </button>
      </form>

      {result && (
        <div className={`create-result ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <div>
              <p>✓ Замовлення успішно створено!</p>
              <div className="result-details">
                <p><strong>Координати:</strong> ({formatNumber(result.savedData.latitude, 4)}, {formatNumber(result.savedData.longitude, 4)})</p>
                <p><strong>Subtotal:</strong> ${result.savedData.subtotal}</p>
                <p className="message" style={{ marginTop: '1rem', color: '#666', fontStyle: 'italic' }}>
                  Замовлення збережено в базі даних
                </p>
              </div>
            </div>
          ) : (
            <p>Помилка: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

