import React, { useState } from 'react';
import { createOrder } from '../../api/orders';
import './CreateOrderPage.css';

// Utility function for safe number formatting
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
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // Validate subtotal is an integer
      const subtotalValue = parseFloat(formData.subtotal);
      if (!Number.isInteger(subtotalValue)) {
        setResult({
          success: false,
          error: 'Subtotal must be an integer (whole number). Please remove decimal places.'
        });
        setLoading(false);
        return;
      }

      // Format timestamp as "YYYY-MM-DD HH:mm:ss"
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

      const payload = {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        subtotal: subtotalValue, // Backend expects int
        timestamp: timestamp // Format: "2026-02-25 10:30:00"
      };

      const order = await createOrder(payload);
      // Save data for display before clearing
      setResult({
        success: true, 
        order,
        savedData: { ...payload }
      });
      setFormData({ latitude: '', longitude: '', subtotal: '' });
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Unknown error';
      setResult({
        success: false,
        error: `${errorMsg}. Please enter valid coordinates`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      <h1>Create Order Manually</h1>
      <form onSubmit={handleSubmit} className="create-order-form">
        <div className="form-group">
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            placeholder="e.g.: 40.7128"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            placeholder="e.g.: -74.0060"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subtotal">Subtotal:</label>
          <input
            type="number"
            step="1"
            id="subtotal"
            name="subtotal"
            value={formData.subtotal}
            onChange={handleChange}
            placeholder="e.g.: 100"
            min="0"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </form>

      {result && (
        <div className={`create-result ${result.success ? 'success' : 'error'}`}>
          {result.success ? (
            <div>
              <p>✓ Order created successfully!</p>
              <div className="result-details">
                <p><strong>Coordinates:</strong> ({formatNumber(result.savedData.latitude, 4)}, {formatNumber(result.savedData.longitude, 4)})</p>
                <p><strong>Subtotal:</strong> ${result.savedData.subtotal}</p>
                <p className="message" style={{ marginTop: '1rem', color: '#666', fontStyle: 'italic' }}>
                  Order saved to database
                </p>
              </div>
            </div>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
