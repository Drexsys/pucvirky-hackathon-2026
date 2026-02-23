import React, { useState } from 'react';
import { createOrder } from '../../api/orders';
import './CreateOrderPage.css';

export default function CreateOrderPage() {
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    quantity: 1
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const order = await createOrder(formData);
      setResult({ success: true, order });
      setFormData({ customer: '', product: '', quantity: 1 });
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-order-page">
      <h1>Create New Order</h1>
      <form onSubmit={handleSubmit} className="create-order-form">
        <div className="form-group">
          <label htmlFor="customer">Customer Name:</label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product">Product:</label>
          <input
            type="text"
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
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
              <p>Order ID: {result.order.id}</p>
            </div>
          ) : (
            <p>Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

