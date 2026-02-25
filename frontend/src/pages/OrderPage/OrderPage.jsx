import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getOrders } from '../../api/orders';
import OrdersTable from '../../components/orders/OrdersTable';
import './OrderPage.css';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Pagination (backend-driven)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Debounced backend filter values
  const [debouncedBackendFilters, setDebouncedBackendFilters] = useState({
    minSubtotal: '',
    maxSubtotal: '',
    dateFrom: '',
    dateTo: '',
    jurisdictions: '',
  });
  const debounceTimer = useRef(null);

  // Filters — only backend-supported
  const [filters, setFilters] = useState({
    minSubtotal: '',
    maxSubtotal: '',
    dateFrom: '',
    dateTo: '',
    jurisdictions: '',
  });
  const [showFilters, setShowFilters] = useState(true);

  // Debounce: оновлюємо debouncedBackendFilters через 500ms після останньої зміни
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedBackendFilters({
        minSubtotal: filters.minSubtotal,
        maxSubtotal: filters.maxSubtotal,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        jurisdictions: filters.jurisdictions,
      });
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [filters.minSubtotal, filters.maxSubtotal, filters.dateFrom, filters.dateTo, filters.jurisdictions]);

  const loadOrders = useCallback(async () => {
    setRefreshing(true);
    try {
      const params = {
        page: currentPage - 1,
        pageSize: itemsPerPage
      };

      if (debouncedBackendFilters.minSubtotal) params.fromSubtotal = Math.floor(parseFloat(debouncedBackendFilters.minSubtotal));
      if (debouncedBackendFilters.maxSubtotal) params.toSubtotal = Math.floor(parseFloat(debouncedBackendFilters.maxSubtotal));
      if (debouncedBackendFilters.dateFrom) params.fromTime = debouncedBackendFilters.dateFrom + ' 00:00:00';
      if (debouncedBackendFilters.dateTo) params.toTime = debouncedBackendFilters.dateTo + ' 23:59:59';
      if (debouncedBackendFilters.jurisdictions) params.jurisdictions = debouncedBackendFilters.jurisdictions;

      const result = await getOrders(params);
      setOrders(Array.isArray(result) ? result : (result.orders ?? []));
      setTotalPages(result.totalPages ?? 1);
      setTotalElements(result.totalElements ?? 0);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setRefreshing(false);
      setInitialLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedBackendFilters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      minSubtotal: '',
      maxSubtotal: '',
      dateFrom: '',
      dateTo: '',
      jurisdictions: '',
    });
    setCurrentPage(1);
  };

  // Підрахунок активних фільтрів
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  // Тільки перше завантаження показує повний екран загрузки
  if (initialLoading) return <div className="order-page"><div className="loading">Завантаження замовлень...</div></div>;

  return (
    <div className="order-page">
      <h1>Список замовлень</h1>

      {error && <div className="error-inline">⚠️ Помилка: {error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>
            🔍 Фільтри
            {activeFiltersCount > 0 && (
              <span className="active-filters-badge">{activeFiltersCount}</span>
            )}
          </h3>
          <div className="filters-actions">
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters} className="reset-btn">
                ✖ Скинути всі
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="toggle-filters-btn"
            >
              {showFilters ? '▲ Згорнути' : '▼ Розгорнути'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-content">
            {/* Фільтри по Subtotal */}
            <div className="filter-section">
              <h4>💰 Subtotal</h4>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Мін. Subtotal ($):</label>
                  <input
                    type="number"
                    name="minSubtotal"
                    step="1"
                    value={filters.minSubtotal}
                    onChange={handleFilterChange}
                    placeholder="0"
                  />
                </div>
                <div className="filter-group">
                  <label>Макс. Subtotal ($):</label>
                  <input
                    type="number"
                    name="maxSubtotal"
                    step="1"
                    value={filters.maxSubtotal}
                    onChange={handleFilterChange}
                    placeholder="9999"
                  />
                </div>
              </div>
            </div>

            {/* Фільтр по даті */}
            <div className="filter-section">
              <h4>📅 Період</h4>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Дата від:</label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="filter-group">
                  <label>Дата до:</label>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>

            {/* Фільтр по юрисдикції */}
            <div className="filter-section">
              <h4>🏛️ Юрисдикція</h4>
              <div className="filter-group full-width">
                <label>Юрисдикція (точний збіг):</label>
                <input
                  type="text"
                  name="jurisdictions"
                  value={filters.jurisdictions}
                  onChange={handleFilterChange}
                  placeholder="Наприклад: NEW YORK KINGS NEW YORK CITY"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <span>Показано: <strong>{orders.length}</strong> з <strong>{totalElements}</strong></span>
        <span>Сторінка {currentPage} з {totalPages || 1}</span>
        {refreshing && <span className="refreshing-indicator">⏳ Оновлення...</span>}
      </div>

      {/* Orders Table */}
      <div className={`orders-table-container${refreshing ? ' refreshing' : ''}`}>
        <OrdersTable
          orders={orders}
          loading={false}
          error={null}
        />
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
    </div>
  );
}

