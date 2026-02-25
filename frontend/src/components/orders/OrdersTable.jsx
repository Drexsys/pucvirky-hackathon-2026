import React, { useState } from 'react';
import './OrdersTable.css';

export default function OrdersTable({ orders = [], loading = false, error = null }) {
  const [expandedId, setExpandedId] = useState(null);

  if (loading) return <div className="orders-table-loading">Завантаження замовлень...</div>;
  if (error) return <div className="orders-table-error">Помилка: {error}</div>;
  if (!orders || orders.length === 0) return <div className="orders-table-empty">Немає замовлень</div>;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th className="expand-col">▼</th>
            <th>ID</th>
            <th>Координати</th>
            <th>Subtotal</th>
            <th>Загальна ставка</th>
            <th>Податок ($)</th>
            <th>Загалом</th>
            <th>Юрисдикція</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <React.Fragment key={order.id}>
              <tr className="order-row" onClick={() => toggleExpand(order.id)}>
                <td className="expand-col">
                  <button
                    className={`expand-btn ${expandedId === order.id ? 'expanded' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(order.id);
                    }}
                  >
                    ▶
                  </button>
                </td>
                <td className="id">{order.id}</td>
                <td className="coordinates">
                  {order.latitude !== null && order.latitude !== undefined ? parseFloat(order.latitude).toFixed(4) : 'N/A'}, {order.longitude !== null && order.longitude !== undefined ? parseFloat(order.longitude).toFixed(4) : 'N/A'}
                </td>
                <td className="amount">${order.subtotal !== null && order.subtotal !== undefined ? parseFloat(order.subtotal).toFixed(2) : '0.00'}</td>
                <td className="rate composite">
                  {order.composite_tax_rate !== null && order.composite_tax_rate !== undefined ? (parseFloat(order.composite_tax_rate) * 100).toFixed(3) : '0.000'}%
                </td>
                <td className="amount tax">${order.tax_amount !== null && order.tax_amount !== undefined ? parseFloat(order.tax_amount).toFixed(2) : '0.00'}</td>
                <td className="amount total">${order.total_amount !== null && order.total_amount !== undefined ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</td>
                <td className="jurisdictions" title={order.jurisdictions || ''}>{order.jurisdictions || 'N/A'}</td>
                <td className="date">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString('uk-UA') : 'N/A'}
                </td>
              </tr>

              {expandedId === order.id && (
                <tr className="breakdown-row">
                  <td colSpan="9">
                    <div className="breakdown-content">
                      <div className="breakdown-section">
                        <h4>Деталізація податків</h4>

                        <div className="breakdown-grid">
                          <div className="breakdown-item">
                            <span className="label">State Rate:</span>
                            <span className="value">
                              {order.breakdown?.state_rate !== null && order.breakdown?.state_rate !== undefined ? (parseFloat(order.breakdown.state_rate) * 100).toFixed(3) : '0.000'}%
                            </span>
                          </div>

                          <div className="breakdown-item">
                            <span className="label">County Rate:</span>
                            <span className="value">
                              {order.breakdown?.county_rate !== null && order.breakdown?.county_rate !== undefined ? (parseFloat(order.breakdown.county_rate) * 100).toFixed(3) : '0.000'}%
                            </span>
                          </div>

                          <div className="breakdown-item">
                            <span className="label">City Rate:</span>
                            <span className="value">
                              {order.breakdown?.city_rate !== null && order.breakdown?.city_rate !== undefined ? (parseFloat(order.breakdown.city_rate) * 100).toFixed(3) : '0.000'}%
                            </span>
                          </div>

                          <div className="breakdown-item total-rate">
                            <span className="label">Total Rate:</span>
                            <span className="value">
                              {order.composite_tax_rate !== null && order.composite_tax_rate !== undefined ? (parseFloat(order.composite_tax_rate) * 100).toFixed(3) : '0.000'}%
                            </span>
                          </div>
                        </div>

                        {order.breakdown?.special_rates && order.breakdown.special_rates.length > 0 && (
                          <div className="special-rates">
                            <h5>Спеціальні ставки:</h5>
                            <div className="special-rates-list">
                              {order.breakdown.special_rates.map((rate, idx) => (
                                <div key={idx} className="special-rate-item">
                                  <span className="name">{rate.name}:</span>
                                  <span className="value">{rate.value !== null && rate.value !== undefined ? (parseFloat(rate.value) * 100).toFixed(3) : '0.000'}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="breakdown-summary">
                          <div className="summary-row">
                            <span className="label">Subtotal:</span>
                            <span className="value">${order.subtotal !== null && order.subtotal !== undefined ? parseFloat(order.subtotal).toFixed(2) : '0.00'}</span>
                          </div>
                          <div className="summary-row tax">
                            <span className="label">Податок:</span>
                            <span className="value">${order.tax_amount !== null && order.tax_amount !== undefined ? parseFloat(order.tax_amount).toFixed(2) : '0.00'}</span>
                          </div>
                          <div className="summary-row total">
                            <span className="label">Загалом:</span>
                            <span className="value">${order.total_amount !== null && order.total_amount !== undefined ? parseFloat(order.total_amount).toFixed(2) : '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

