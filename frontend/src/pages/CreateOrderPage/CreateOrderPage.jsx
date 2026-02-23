import React, { useState } from 'react';
import { createOrder, calculateTax } from '../../api/orders';
import './CreateOrderPage.css';

export default function CreateOrderPage() {
  const [formData, setFormData] = useState({
    lat: '',
    lon: '',
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
    if (newData.lat && newData.lon && newData.subtotal) {
      previewTax(parseFloat(newData.lat), parseFloat(newData.lon), parseFloat(newData.subtotal));
    } else {
      setPreview(null);
    }
  };

  const previewTax = async (lat, lon, subtotal) => {
    try {
      const taxData = await calculateTax(lat, lon, subtotal);
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
      const payload = {
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        subtotal: parseFloat(formData.subtotal)
      };

      const order = await createOrder(payload);
      setResult({ success: true, order });
      setFormData({ lat: '', lon: '', subtotal: '' });
      setPreview(null);
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      <h1>Створити замовлення вручну</h1>
      <form onSubmit={handleSubmit} className="create-order-form">
        <div className="form-group">
          <label htmlFor="lat">Широта (Latitude):</label>
          <input
            type="number"
            step="any"
            id="lat"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="наприклад: 40.7128"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lon">Довгота (Longitude):</label>
          <input
            type="number"
            step="any"
            id="lon"
            name="lon"
            value={formData.lon}
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
              <span className="amount">${preview.subtotal?.toFixed(2)}</span>
            </div>
            <div className="preview-row highlight">
              <span>Загальна ставка:</span>
              <span className="rate">{(preview.composite_tax_rate * 100).toFixed(3)}%</span>
            </div>
            {preview.breakdown && (
              <>
                <div className="breakdown-title">Деталізація:</div>
                {preview.breakdown.state_rate && (
                  <div className="breakdown-row">
                    <span>State:</span>
                    <span>{(preview.breakdown.state_rate * 100).toFixed(3)}%</span>
                  </div>
                )}
                {preview.breakdown.county_rate && (
                  <div className="breakdown-row">
                    <span>County:</span>
                    <span>{(preview.breakdown.county_rate * 100).toFixed(3)}%</span>
                  </div>
                )}
                {preview.breakdown.city_rate && (
                  <div className="breakdown-row">
                    <span>City:</span>
                    <span>{(preview.breakdown.city_rate * 100).toFixed(3)}%</span>
                  </div>
                )}
                {preview.breakdown.special_rates && preview.breakdown.special_rates.length > 0 && (
                  <div className="special-rates">
                    <div className="breakdown-title">Спеціальні ставки:</div>
                    {preview.breakdown.special_rates.map((rate, idx) => (
                      <div key={idx} className="breakdown-row">
                        <span>{rate.name}:</span>
                        <span>{(rate.value * 100).toFixed(3)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="preview-row total">
              <span>Податок:</span>
              <span className="tax-amount">${preview.tax_amount?.toFixed(2)}</span>
            </div>
            <div className="preview-row total">
              <span>Загалом:</span>
              <span className="total-amount">${preview.total_amount?.toFixed(2)}</span>
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
                <p><strong>ID:</strong> {result.order.id}</p>
                <p><strong>Координати:</strong> ({result.order.lat?.toFixed(4)}, {result.order.lon?.toFixed(4)})</p>
                <p><strong>Subtotal:</strong> ${result.order.subtotal?.toFixed(2)}</p>
                <p><strong>Загальна ставка:</strong> {(result.order.composite_tax_rate * 100).toFixed(3)}%</p>
                <p><strong>Податок:</strong> ${result.order.tax_amount?.toFixed(2)}</p>
                <p><strong>Загальна сума:</strong> ${result.order.total_amount?.toFixed(2)}</p>
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

