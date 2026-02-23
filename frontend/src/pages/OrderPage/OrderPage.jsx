import React, { useEffect, useState } from 'react';
import { getOrders } from '../../api/orders';
import './OrderPage.css';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filters
  const [filters, setFilters] = useState({
    minSubtotal: '',
    maxSubtotal: '',
    minTax: '',
    maxTax: '',
    sortBy: 'id',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    if (filters.minSubtotal && order.subtotal < parseFloat(filters.minSubtotal)) return false;
    if (filters.maxSubtotal && order.subtotal > parseFloat(filters.maxSubtotal)) return false;
    if (filters.minTax && order.tax_amount < parseFloat(filters.minTax)) return false;
    if (filters.maxTax && order.tax_amount > parseFloat(filters.maxTax)) return false;
    return true;
  });

  // Sort logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
    if (filters.sortBy === 'id') return (a.id - b.id) * multiplier;
    if (filters.sortBy === 'subtotal') return (a.subtotal - b.subtotal) * multiplier;
    if (filters.sortBy === 'tax') return (a.tax_amount - b.tax_amount) * multiplier;
    if (filters.sortBy === 'total') return (a.total_amount - b.total_amount) * multiplier;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const resetFilters = () => {
    setFilters({
      minSubtotal: '',
      maxSubtotal: '',
      minTax: '',
      maxTax: '',
      sortBy: 'id',
      sortOrder: 'desc'
    });
    setCurrentPage(1);
  };

  if (loading) return <div className="order-page"><div className="loading">Завантаження замовлень...</div></div>;
  if (error) return <div className="order-page"><div className="error">Помилка: {error}</div></div>;

  return (
    <div className="order-page">
      <h1>Список замовлень</h1>

      {/* Filters */}
      <div className="filters-section">
        <h3>Фільтри</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Мін. Subtotal:</label>
            <input
              type="number"
              name="minSubtotal"
              step="0.01"
              value={filters.minSubtotal}
              onChange={handleFilterChange}
              placeholder="0.00"
            />
          </div>
          <div className="filter-group">
            <label>Макс. Subtotal:</label>
            <input
              type="number"
              name="maxSubtotal"
              step="0.01"
              value={filters.maxSubtotal}
              onChange={handleFilterChange}
              placeholder="9999.99"
            />
          </div>
          <div className="filter-group">
            <label>Мін. Податок:</label>
            <input
              type="number"
              name="minTax"
              step="0.01"
              value={filters.minTax}
              onChange={handleFilterChange}
              placeholder="0.00"
            />
          </div>
          <div className="filter-group">
            <label>Макс. Податок:</label>
            <input
              type="number"
              name="maxTax"
              step="0.01"
              value={filters.maxTax}
              onChange={handleFilterChange}
              placeholder="999.99"
            />
          </div>
          <div className="filter-group">
            <label>Сортувати за:</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="id">ID</option>
              <option value="subtotal">Subtotal</option>
              <option value="tax">Податок</option>
              <option value="total">Загалом</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Порядок:</label>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
              <option value="desc">Спадання</option>
              <option value="asc">Зростання</option>
            </select>
          </div>
        </div>
        <button onClick={resetFilters} className="reset-btn">Скинути фільтри</button>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <span>Показано: <strong>{currentOrders.length}</strong> з <strong>{sortedOrders.length}</strong></span>
        <span>Всього замовлень: <strong>{orders.length}</strong></span>
      </div>

      {/* Table */}
      {currentOrders.length === 0 ? (
        <p className="no-data">Немає замовлень для відображення</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Широта</th>
                  <th>Довгота</th>
                  <th>Subtotal</th>
                  <th>State %</th>
                  <th>County %</th>
                  <th>City %</th>
                  <th>Загальна %</th>
                  <th>Податок ($)</th>
                  <th>Загалом</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.lat?.toFixed(4) || 'N/A'}</td>
                    <td>{order.lon?.toFixed(4) || 'N/A'}</td>
                    <td className="amount">${order.subtotal?.toFixed(2) || '0.00'}</td>
                    <td className="tax-rate">{order.breakdown?.state_rate ? (order.breakdown.state_rate * 100).toFixed(3) : '0'}%</td>
                    <td className="tax-rate">{order.breakdown?.county_rate ? (order.breakdown.county_rate * 100).toFixed(3) : '0'}%</td>
                    <td className="tax-rate">{order.breakdown?.city_rate ? (order.breakdown.city_rate * 100).toFixed(3) : '0'}%</td>
                    <td className="tax-rate composite">{(order.composite_tax_rate * 100).toFixed(3) || '0'}%</td>
                    <td className="amount tax">${order.tax_amount?.toFixed(2) || '0.00'}</td>
                    <td className="amount total">${order.total_amount?.toFixed(2) || '0.00'}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleString('uk-UA') : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Попередня
              </button>
              <span className="page-info">
                Сторінка {currentPage} з {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Наступна →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

